const { propTypes, defaultProps } = require("./keys");
const u = require("./util");

function collectClsPropMethod(all) {
  const result = {
    rcProperty: [],
    rcMethod: [],
    staticProps: [],
    propTypes: [],
    defaultProps: [],
  };
  for (let path of all) {
    const isClsProp = path.isClassProperty();
    const isClsMed = path.isClassMethod();
    const { static: ifStatic } = path.node;
    // 收集 propTypes、defaultProps的key
    if (ifStatic) {
      const keyName = path.get("key").node.name;
      const rcStatic = keyName === propTypes || keyName === defaultProps;
      if (isClsProp && rcStatic) {
        const objExpPath = path.get("value");
        const isObjExp = objExpPath.isObjectExpression();
        if (isObjExp) {
          let keys = u.getObjExpKeys(objExpPath);
          result[keyName] = keys; // 不用concat，默认有且只有一个
        }
      }
      result.staticProps.push(keyName);
    } else if (isClsProp) {
      const { name } = path.get("key").node;
      if (ifStatic === false && path.node.computed === false && name === "state") {
        // 忽略state实例属性
        continue;
      }
      result.rcProperty.push(name);
    } else if (isClsMed) {
      const { name } = path.get("key").node;
      if (name !== "constructor" && name !== "render") {
        result.rcMethod.push(name);
      }
    }
  }
  return result;
}

module.exports = collectClsPropMethod;
