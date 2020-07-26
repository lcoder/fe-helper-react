const renameLifeParam = require("./rename-life-param");
const g = require("@babel/generator").default;

const stateVisitor = {
  // 收集 state
  AssignmentExpression(path, state) {
    if (
      path.get("left").isMemberExpression() &&
      path.get("left.object").isThisExpression() &&
      path.get("left.property").isIdentifier({ name: "state" }) &&
      path.get("right").isObjectExpression()
    ) {
      const pathRight = path.get("right");
      const stateArr = pathRight
        .get("properties")
        .map(path => {
          if (path.isObjectProperty() && path.get("key").isIdentifier()) {
            return path.get("key").node.name;
          } else {
            return undefined;
          }
        })
        .filter(id => id !== undefined);
      // 以constructor中的state优先级最高；如果跟state field冲突
      state.ids.states = stateArr;
    }
  },
};
/**
 * 解析constructor构造函数
 * 1. 重命名形参为props
 * 2. 收集作用域范围内的变量
 * 3. 收集 this.state 对象的key值
 * @param {ClassMethodNodePath} path
 * @param {*} state
 */
function analysisConstruct(path, state) {
  if (path === undefined || !path.isClassMethod({ kind: "constructor" })) {
    return;
  }
  // 构造函数形参重命名
  renameLifeParam(path);
  // 解析state
  path.traverse(stateVisitor, state);
}

module.exports = analysisConstruct;
