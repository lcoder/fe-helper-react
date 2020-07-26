const { propTypes, defaultProps } = require("./keys");

/**
 * target组件 静态属性 冲突解决
 * 原则，冲突的属性，删除冲突；不冲突的属性，保存
 * 此方法不纯，会修改target的ast结构
 * @param {Array[ClassMethod|ClassProperty]} all
 * @param {Object[preserved..]} state
 */
function diffStaticProps(all, state) {
  const { preservedPropTypes, preservedStaticProps, preservedDefaultProps } = state;
  const staticRcs = all.filter(path => path.node.static === true);
  const staticNodes = [];
  for (let path of staticRcs) {
    const keyPath = path.get("key");
    const { name } = keyPath.node;
    const isPropTypes = name === propTypes;
    const isDeftProps = name === defaultProps;
    // 检测属性冲突
    if (isPropTypes || isDeftProps) {
      const isClsProp = path.isClassProperty();
      if (isClsProp) {
        const isValueObjExp = path.get("value").isObjectExpression();
        if (isValueObjExp) {
          const objPropPaths = path.get("value.properties");
          const preservedKeys = isPropTypes
            ? preservedPropTypes
            : preservedDefaultProps;
          for (let objPropPath of objPropPaths) {
            const keyPath = objPropPath.get("key");
            const isConflict =
              keyPath.isIdentifier() && preservedKeys.includes(keyPath.node.name); // 不支持计算属性检测
            if (isConflict) {
              // 属性冲突，则删除冲突属性
              objPropPath.remove();
            }
          }
          if (path.get("value.properties").length > 0) {
            // 保存
            staticNodes.push(path.node);
          }
        } else {
          // 若不是对象，跳过
          continue;
        }
      } else {
        // 若是静态方法，跳过
        continue;
      }
    } else {
      const ifPreserved = preservedStaticProps.includes(name);
      // 冲突，跳过
      if (ifPreserved) {
        continue;
      } else {
        // 保存
        staticNodes.push(path.node);
      }
    }
  }
  return staticNodes;
}

module.exports = diffStaticProps;
