const t = require("@babel/types");
const { propTypes, defaultProps } = require("../keys");

/**
 * 合并静态属性
 * @param {*} bodyPaths
 * @param {*} staticNodes
 */
function mergeStatic(clsBodyPath, staticNodes) {
  const bodyPaths = clsBodyPath.get("body");
  let firstStaticMember = bodyPaths.find(path => path.node.static === true);
  if (firstStaticMember) {
    for (let node of staticNodes) {
      const {
        key: { name },
        value,
      } = node;
      const isPropTypes = name === propTypes;
      const isDeftProps = name === defaultProps;
      // 属性合并
      if (isPropTypes || isDeftProps) {
        const { properties } = value;
        const targetPath = bodyPaths.find(
          path =>
            path.node.static === true &&
            path.get("key").isIdentifier() &&
            path.get("key").node.name === name &&
            path.get("value").isObjectExpression()
        );
        if (targetPath) {
          targetPath.get("value").pushContainer("properties", [...properties]);
        } else {
          firstStaticMember.insertAfter(node);
        }
      } else {
        firstStaticMember.insertAfter(node);
      }
    }
  } else {
    clsBodyPath.unshiftContainer("body", staticNodes);
  }
}

module.exports = mergeStatic;
