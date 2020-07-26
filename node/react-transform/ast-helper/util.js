const t = require("@babel/types");
const { NodePath } = require("@babel/traverse");
const { rcLifeClsMethods } = require("./keys");

// 获取ObjectExpression对象的所有key
exports.getObjExpKeys = path => {
  const ifPath = path instanceof NodePath;
  const node = ifPath ? path.node : path;
  if (t.isObjectExpression(node)) {
    const { properties } = node;
    const keys = properties
      // 不支持计算属性
      .filter(prop => prop.computed === false)
      .map(prop => prop.key)
      .filter(keyNode => t.isIdentifier(keyNode))
      .map(keyNode => keyNode.name);
    return keys;
  } else {
    return [];
  }
};

// 是否是生命周期方法
exports.isLifecycleMethod = path => {
  if (path === undefined || path === null) {
    return false;
  }
  return (
    path.node.static === false &&
    path.node.computed === false &&
    path.isClassMethod() &&
    path.get("key").isIdentifier() &&
    rcLifeClsMethods.includes(path.get("key").node.name)
  );
};

// 是否是this.state成员表达式
exports.isThisState = path => {
  if (path === undefined || path === null || !(path instanceof NodePath)) {
    return false;
  }
  return (
    path.isMemberExpression() &&
    path.get("object").isThisExpression() &&
    path.get("property").isIdentifier({ name: "state" })
  );
};

// 是否是this.state赋值语句
exports.isThisStateAssign = path => {
  if (path === undefined || path === null || !(path instanceof NodePath)) {
    return false;
  }
  return (
    path.isExpressionStatement() &&
    path.get("expression").isAssignmentExpression() &&
    path.get("expression.left").isMemberExpression() &&
    exports.isThisState(path.get("expression.left"))
  );
};

// this作用域是否正确
exports.thisScopeValid = (thisPath, flag) => {
  if (thisPath === undefined || thisPath === null) {
    return false;
  }
  const { scope } = thisPath;
  if (scope) {
    const { block } = scope;
    if (block && block[flag] === true) {
      return true;
    } else {
      // 仅判断函数作用域
      if (t.isClassDeclaration(block) || t.isFunctionDeclaration(block)) {
        return false;
      } else {
        return exports.thisScopeValid(scope.parent.path, flag);
      }
    }
  } else {
    return false;
  }
};

// 判断是否是super调用语句
exports.isSuperExpState = path => {
  if (path === undefined || path === null) {
    return false;
  }
  const node = path instanceof NodePath ? path.node : path;
  return (
    t.isExpressionStatement(node) &&
    t.isCallExpression(node.expression) &&
    t.isSuper(node.expression.callee)
  );
};

// 创造this.state=右值 语句
exports.createThisStateAssignExp = rVal => {
  return t.expressionStatement(
    t.assignmentExpression(
      "=",
      t.memberExpression(t.thisExpression(), t.identifier("state")),
      rVal
    )
  );
};

// super() 语句构造
exports.createSuperCallState = (params = []) => {
  return t.expressionStatement(t.callExpression(t.super(), params));
};

// 获取super语句，没有，则创建
exports.getSuperPath = path => {
  if (
    path === undefined ||
    path === null ||
    !(path instanceof NodePath) ||
    !path.isClassMethod({ kind: "constructor" })
  ) {
    return undefined;
  }
  let superPath = path.get("body.body").find(path => exports.isSuperExpState(path));
  if (superPath === undefined) {
    path.get("body").unshiftContainer("body", exports.createSuperCallState());
    superPath = path.get("body.body").find(path => exports.isSuperExpState(path));
  }
  return superPath;
};

// 生成构造函数
exports.createConstruct = (blocks = []) => {
  return t.classMethod(
    "constructor", // kind
    t.identifier("constructor"), // key
    [], // params
    t.blockStatement(blocks), // body
    false, // computed
    false // static
  );
};
