const { rcLifeClsMethods } = require("./keys");

/**
 * 收集方法内的变量绑定
 * @param {Array<ClassMethod>} declarationBodyPath
 * @param {*} state
 */
function analysisMethodVariables(declarationBodyPath, state) {
  for (let method of rcLifeClsMethods) {
    const targetPath = declarationBodyPath.find(path => {
      return (
        path.isClassMethod() &&
        path.node.static === false &&
        path.get("key").isIdentifier() &&
        path.get("key").node.name === method
      );
    });
    if (targetPath) {
      state[method] = true;
      const {
        scope: { bindings },
      } = targetPath;
      const ids = Object.keys(bindings);
      state.ids[method] = ids;
    } else {
      state[method] = false;
      state.ids[method] = [];
    }
  }
}

module.exports = analysisMethodVariables;
