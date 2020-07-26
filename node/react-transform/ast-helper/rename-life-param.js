const {
  didUpdate,
  shouldUpdate,
  snapshotBeforeUpdate,
  willUpdate,
  willReceiveProps,
  constructor: construct,
  rcLifeClsMethods,
} = require("./keys");

/**
 * 重命名 生命周期 形参
 * @param {ClassMethod} path
 */
function renameLifeParam(path) {
  const keyPath = path.get("key");
  const isValid =
    path.isClassMethod() &&
    path.node.static === false &&
    keyPath.isIdentifier() &&
    rcLifeClsMethods.includes(keyPath.node.name);
  // console.log(keyPath.node.name)
  if (isValid === false) {
    return;
  }
  const { name: method } = keyPath.node;
  const isContruct = method == construct;
  const isReceiveProps = method === willReceiveProps;
  const isDidUpdate = method === didUpdate;
  const isWillUpdate = method === willUpdate;
  const isShouldUpdate = method === shouldUpdate;
  const isSnapUpdate = method === snapshotBeforeUpdate;
  const needRenameParam =
    isContruct ||
    isReceiveProps ||
    isDidUpdate ||
    isWillUpdate ||
    isShouldUpdate ||
    isSnapUpdate;
  if (needRenameParam === false) {
    return;
  }
  const renameParams = isContruct
    ? ["props", "context"]
    : isReceiveProps
    ? ["nextProps", "nextContext"]
    : isDidUpdate
    ? ["prevProps", "prevState", "snapshot"]
    : isWillUpdate
    ? ["nextProps", "nextState", "nextContext"]
    : isShouldUpdate
    ? ["nextProps", "nextState", "nextContext"]
    : isSnapUpdate
    ? ["prevProps", "prevState"]
    : [];
  const params = path.get("params");
  for (let i = 0; i < params.length; i++) {
    const paramPath = params[i];
    if (paramPath.isIdentifier()) {
      const paramName = paramPath.node.name;
      const targetName = renameParams[i];
      const hasDiff = paramName !== targetName;
      if (hasDiff && targetName) {
        const hasBind = paramPath.scope.hasOwnBinding(targetName);
        // 重命名前，检测是否已经存在targetName，有则先解决新名冲突问题
        if (hasBind) {
          paramPath.scope.rename(targetName);
        }
        paramPath.scope.rename(paramName, targetName);
      }
    }
  }
}

module.exports = renameLifeParam;
