const generateUid = require("./uuid");
const { NodePath } = require("@babel/traverse");
const u = require("./util");

function mutStateKeys(pathObj, state) {
  const ifPath = pathObj instanceof NodePath;
  const notAPath = !ifPath;
  if (
    pathObj === undefined ||
    pathObj === null ||
    notAPath ||
    !pathObj.isObjectExpression()
  ) {
    return;
  }
  const {
    srcIds: { states: srcStates },
    stateRenameMap,
  } = state;
  const currentKeys = u.getObjExpKeys(pathObj);
  const preserved = currentKeys.concat(srcStates);

  pathObj.get("properties").forEach(path => {
    const isValid =
      path.isObjectProperty() &&
      path.node.computed === false &&
      path.get("key").isIdentifier() &&
      srcStates.includes(path.get("key").node.name); // 与source的state冲突
    if (isValid) {
      const keyPath = path.get("key");
      const { name: curKey } = keyPath.node;
      const hasGenerated = stateRenameMap[curKey] !== undefined;
      if (hasGenerated) {
        keyPath.node.name = stateRenameMap[curKey];
      } else {
        const uuid = generateUid(curKey, preserved);
        keyPath.node.name = uuid;
        stateRenameMap[curKey] = uuid;
      }
    }
  });
}

module.exports = mutStateKeys;
