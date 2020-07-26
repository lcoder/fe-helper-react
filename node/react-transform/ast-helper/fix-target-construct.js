const scopeRename = require("./scope-rename");
const renameLifeParam = require("./rename-life-param");
const g = require("@babel/generator").default;
const tarMutStateKeys = require("./tar-mutstate-keys");
const getTarCnstrctNodes = require("./tar-cnstrct-nodes");

const ConstructParams = ["props", "context"];

const FixStateConflictor = {
  AssignmentExpression(path, state) {
    if (
      path.get("left").isMemberExpression() &&
      path.get("left.object").isThisExpression() &&
      path.get("left.property").isIdentifier({ name: "state" }) &&
      path.get("right").isObjectExpression()
    ) {
      const pathStateObje = path.get("right");
      tarMutStateKeys(pathStateObje, state);
      state.tarStateObjNode = pathStateObje.node;
    }
  },
};

/**
 * state冲突名解决，区分两种情况
 * 1. state定义在实例属性中
 * 2. state定义在构造函数中，跟state在实例属性冲突时，则以构造函数中定义的state为准
 * @param {*} allMethods
 * @param {*} state
 */
function fixTargetConstruct(allMethods, state) {
  // 1. state实例属性
  const pathState = allMethods.find(path => {
    return (
      path.isClassProperty() &&
      path.node.static === false &&
      path.get("key").isIdentifier({ name: "state" }) &&
      path.get("value").isObjectExpression()
    );
  });
  state.stateField = pathState !== undefined;
  if (pathState) {
    const pathObj = pathState.get("value");
    tarMutStateKeys(pathObj, state);
    state.tarStateObjNode = pathObj.node;
  }
  const pathConstructor = allMethods.find(path =>
    path.isClassMethod({ kind: "constructor" })
  );
  // 2. 构造函数state
  state.constructor = pathConstructor !== undefined;
  if (state.constructor) {
    // 重命名构造函数形参
    renameLifeParam(pathConstructor);
    // rename target的constructor和src产生冲突的变量
    const {
      srcIds: { constructor: srcConstructIds },
    } = state;
    scopeRename(
      srcConstructIds,
      pathConstructor,
      id => !ConstructParams.includes(id)
    );
    // constructor 中state冲突解决
    pathConstructor.traverse(FixStateConflictor, state);
    // 提取constructor中的内容
    getTarCnstrctNodes(pathConstructor, state);
  }
}

module.exports = fixTargetConstruct;
