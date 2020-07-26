const analysisConstruct = require("./analysis-construct");
const u = require("./util");

/**
 * 收集state，包括state实例属性和构造函数的this.state
 */
function srcStateCollect(bodies, state) {
  // 收集state field
  const pathState = bodies.find(path => {
    return (
      path.isClassProperty() &&
      path.node.static === false &&
      path.get("key").isIdentifier({ name: "state" }) &&
      path.get("value").isObjectExpression()
    );
  });
  if (pathState) {
    state.stateField = true;
    state.ids.states = u.getObjExpKeys(pathState.get("value"));
  } else {
    state.stateField = false;
  }

  // 收集构造函数内的 state声明，重命名形参为props
  const pathConstructor = bodies.find(path => {
    return path.node.static === false && path.isClassMethod({ kind: "constructor" });
  });
  analysisConstruct(pathConstructor, state);
}

module.exports = srcStateCollect;
