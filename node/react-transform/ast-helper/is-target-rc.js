const { FEHELPERRCKEY } = require("./keys");

/**
 * 判断当前class是否是 需要转换的组件
 * @param {ClassDeclarationNodePath} path
 */
function isTargetRc(path, state) {
  // 如果不是class类
  if (!path.isClassDeclaration()) {
    return false;
  }
  // 1.检测 标记 如果 class 被标记了 // fe-helper
  const body = path.get("body.body");
  const hasFeHelperKey =
    body.find(path => {
      if (path.node.leadingComments) {
        const leadingComments = path.get("leadingComments");
        for (let { node } of leadingComments) {
          const valid = node.type === "CommentLine" || node.type === "CommentBlock";
          if (valid) {
            const { value } = node;
            const isTarget = FEHELPERRCKEY.test(value);
            if (isTarget) {
              return true;
            }
          }
        }
      } else {
        return false;
      }
    }) !== undefined;
  if (hasFeHelperKey) {
    return true;
  }
  // 2.当前class是默认导出
  if (path.parentPath && path.parentPath.isExportDefaultDeclaration()) {
    return true;
  }
  // 3.如果当前类赋值给变量  变量之后默认导出
  const idPath = path.get("id");
  if (idPath && idPath.isIdentifier()) {
    const {
      scope: { bindings },
    } = idPath;
    const binding = bindings[idPath.node.name];
    if (binding && binding.referenced) {
      const { referencePaths } = binding;
      for (let path of referencePaths) {
        if (path.parentPath.isExportDefaultDeclaration()) {
          return true;
        }
      }
    }
  }
  return false;
}

module.exports = isTargetRc;
