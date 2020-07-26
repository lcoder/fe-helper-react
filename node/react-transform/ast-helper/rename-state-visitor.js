const t = require("@babel/types");
const u = require("./util");
const { TargetClassFlag } = require("./keys");

// export default 作用范围内修复 state名，注意this作用域问题
const RenameStateVisitor = {
  // 修复 this.setState()
  CallExpression(path, state) {
    const { stateRenameMap } = state;
    const needsRenames = Object.keys(stateRenameMap);
    if (
      path.get("callee").isMemberExpression() &&
      path.get("callee.object").isThisExpression() &&
      path.get("callee.property").isIdentifier({ name: "setState" }) &&
      path.get("arguments").length > 0 &&
      path.get("arguments.0").isObjectExpression()
    ) {
      const thisPath = path.get("callee.object");
      const isValid = u.thisScopeValid(thisPath, TargetClassFlag);
      if (isValid === false) {
        return;
      }
      const newStatePath = path.get("arguments.0");
      newStatePath.node.properties.forEach(node => {
        if (t.isObjectProperty(node) && t.isIdentifier(node.key)) {
          const key = node.key.name;
          const isConflict = needsRenames.includes(key);
          if (isConflict) {
            const newKey = stateRenameMap[key];
            node.key.name = newKey;
          }
        }
      });
    }
  },
  // 修复 this.state.xx
  MemberExpression(path, state) {
    const { stateRenameMap } = state;
    const propertyPath = path.get("property");

    const thisPath = path.get("object");
    const isValid = u.thisScopeValid(thisPath, TargetClassFlag);
    if (isValid === false) {
      return;
    }
    // 修复 this.state.xxx
    if (
      propertyPath.isIdentifier() &&
      path.get("object").isMemberExpression() &&
      path.get("object.object").isThisExpression() &&
      path.get("object.property").isIdentifier({ name: "state" })
    ) {
      const needsRenames = Object.keys(stateRenameMap);
      const key = propertyPath.node.name;
      const isConflict = needsRenames.includes(key);
      if (isConflict) {
        const newKey = stateRenameMap[key];
        propertyPath.node.name = newKey;
      }
    }
  },
  // 解构模式
  // 修复 { value , value: xxx } = this.state
  ObjectPattern(path, state) {
    const { parentPath } = path;
    const isVar = parentPath.isVariableDeclarator();
    const isAssign = parentPath.isAssignmentExpression();
    const valid =
      (isVar || isAssign) && u.isThisState(parentPath.get(isVar ? "init" : "right"));
    if (valid) {
      const thisPath = isVar
        ? parentPath.get("init.object")
        : parentPath.get("right.object");
      const valid = u.thisScopeValid(thisPath, TargetClassFlag);
      if (valid) {
        const { stateRenameMap } = state;
        const needsRenames = Object.keys(state.stateRenameMap);
        const propPath = path.get("properties");
        for (let path of propPath) {
          const keyPath = path.get("key");
          const { name: currentName } = keyPath.node;
          const isConflict = needsRenames.includes(currentName);
          if (isConflict) {
            const newName = stateRenameMap[currentName];
            // 注意：不可用scope.rename，因为结构使用的是模式而不是作用域
            keyPath.node.name = newName;
          }
        }
      }
    }
  },
};

exports.RenameStateVisitor = RenameStateVisitor;
