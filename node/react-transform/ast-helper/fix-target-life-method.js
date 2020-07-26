const { rcLifeClsMethods, constructor, render } = require("./keys");
const scopeRename = require("./scope-rename");
const renameLifeParam = require("./rename-life-param");

/**
 * fix 声明周期内 state的冲突，变量的冲突
 * @param {*} all
 * @param {*} state
 */
function fixTargetLifeMethod(all, state, method) {
  const { [method]: hasMethod } = state;
  // 有目标方法
  if (hasMethod === true) {
    const tarMethodPath = all.find(path => {
      const keyPath = path.get("key");
      return (
        path.node.static === false &&
        path.node.computed === false &&
        path.isClassMethod() &&
        keyPath.isIdentifier() &&
        keyPath.node.name === method
      );
    });
    if (tarMethodPath === undefined) {
      return;
    }
    // 部分生命周期方法，形参需要统一命名
    renameLifeParam(tarMethodPath);
    // 方法内局部变量冲突解决
    const {
      srcIds: { [method]: ids },
    } = state;
    // 形参
    const params = tarMethodPath
      .get("params")
      .map(path => {
        return path.isIdentifier() ? path.node.name : undefined;
      })
      .filter(param => param !== undefined);
    // 形参 不作 冲突 重命名
    const withNoParams = ids.filter(id => !params.includes(id));
    scopeRename(withNoParams, tarMethodPath);
  }
}

function main(all, state) {
  const methodList = rcLifeClsMethods.filter(method => {
    // 已单独处理
    return method !== render && method !== constructor;
  });
  methodList.forEach(method => fixTargetLifeMethod(all, state, method));
}

module.exports = main;
