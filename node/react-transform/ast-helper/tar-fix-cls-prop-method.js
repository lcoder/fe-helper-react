const u = require("./util");
const { TargetClassFlag, rcLifeClsMethods } = require("./keys");
const g = require("@babel/generator").default;
const generateUid = require("./uuid");

// 实例方法和公开方法改名
const renameClassProperty = (path, state) => {
  const { preservedRcMedProp, selfRcMedProp } = state;
  const keyPath = path.get("key");
  const currentName = keyPath.node.name;
  // 跳过生命周期方法
  if (rcLifeClsMethods.includes(currentName)) {
    return;
  }
  const preserved = selfRcMedProp
    .filter(id => id !== currentName) // 排除自身
    .concat(preservedRcMedProp);
  const isConflict = preserved.includes(currentName);
  if (isConflict) {
    const newName = generateUid(currentName, preserved);
    keyPath.node.name = newName;
    state.medPropRenameMap[currentName] = newName;
  }
};

const visitor = {
  // this.xxxMethod 重命名
  MemberExpression(path, state) {
    const { medPropRenameMap } = state;
    const propertyPath = path.get("property");

    const thisPath = path.get("object");
    const isValid = u.thisScopeValid(thisPath, TargetClassFlag);
    if (isValid === false) {
      return;
    }
    const isMedOrPropConflict =
      thisPath.isThisExpression() &&
      propertyPath.isIdentifier() &&
      medPropRenameMap[propertyPath.node.name] !== undefined;

    if (isMedOrPropConflict) {
      const newName = medPropRenameMap[propertyPath.node.name];
      propertyPath.node.name = newName;
    }
  },
};

/**
 * 修复冲突的方法名，包括实例方法，和公共方法
 */
function fixClsPropAndMethod(path, state) {
  const allMethods = path.get("body.body").filter(path => {
    return path.node.static === true
      ? false
      : path.isClassProperty() || path.isClassMethod();
  });
  // 方法重命名
  allMethods.forEach(path => renameClassProperty(path, state));
  // 引用的地方重命名
  path.traverse(visitor, state);
}

module.exports = fixClsPropAndMethod;
