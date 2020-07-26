const { rcLifeClsMethods, render, constructor } = require("./keys");

function copyTargetLifeMethod(all, state) {
  for (let path of all) {
    const valid =
      path.node.static === false &&
      path.node.computed === false &&
      path.isClassMethod() &&
      path.get("key").isIdentifier() &&
      rcLifeClsMethods.includes(path.get("key").node.name);
    if (valid) {
      const keyPath = path.get("key");
      const method = keyPath.node.name;
      // 跳过单独处理的方法
      const next = method === render || method === constructor;
      if (next) {
        continue;
      }
      Object.assign(state.lifeMethods, { [method]: path.node });
    }
  }
}

module.exports = copyTargetLifeMethod;
