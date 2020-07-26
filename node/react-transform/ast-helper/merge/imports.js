const t = require("@babel/types");
const g = require("@babel/generator").default;

// 标记有命名导入的
const symbol = Symbol.for("has-import-specifier");

/**
 * 合并imports
 * @param {NodePath} path
 * @param {*} state
 */
function mergeImports(path, state) {
  const { targetImportBindings = [] } = state;
  const clonedTarImpDecNodes = targetImportBindings
    .filter(node => t.isImportDeclaration(node))
    .map(t.cloneNode);
  const firstNotImportPath = path
    .get("body")
    .find(path => !path.isImportDeclaration());
  const impDeclarations = path.get("body").filter(path => {
    return path.isImportDeclaration();
  });
  const mergeInLineImpSpe = [];
  for (let impPath of impDeclarations) {
    const moduleSrc = impPath.get("source").node.value;
    const sameSourceNodes = clonedTarImpDecNodes
      .map(node => {
        return node.source.value === moduleSrc ? node : undefined;
      })
      .filter(node => node !== undefined);
    for (let targetImpDec of sameSourceNodes) {
      const { specifiers } = targetImpDec;
      const clonedNodes = specifiers
        .map(node => {
          const isImpSpec = t.isImportSpecifier(node);
          if (isImpSpec) {
            // 标记，被合并的import
            targetImpDec[symbol] = true;
            mergeInLineImpSpe.push(node);
          }
          return isImpSpec ? node : undefined;
        })
        .filter(node => node !== undefined);
      impPath.pushContainer("specifiers", clonedNodes);
    }
  }
  if (firstNotImportPath) {
    // 过滤已经被合并过的
    for (let i = 0; i < clonedTarImpDecNodes.length; i++) {
      let impSpec = clonedTarImpDecNodes[i];
      impSpec.specifiers = impSpec.specifiers
        .map(node => {
          const merged = mergeInLineImpSpe.includes(node);
          return merged ? undefined : node;
        })
        .filter(node => node !== undefined);
      // 之前有导入，但被合并了,删除本次import
      if (impSpec.specifiers.length === 0 && impSpec[symbol]) {
        delete impSpec[symbol];
        clonedTarImpDecNodes[i] = undefined;
      }
    }
    firstNotImportPath.insertBefore(
      clonedTarImpDecNodes.filter(node => node !== undefined)
    );
  }
  // console.log( g( path.node ).code )
}

module.exports = mergeImports;
