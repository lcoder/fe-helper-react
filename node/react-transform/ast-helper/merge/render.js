const g = require("@babel/generator").default;
const { regJSXReturn } = require("../keys");
const t = require("@babel/types");
const bcfe = require("../build-code-frame-error");

const visitor = {
  ReturnStatement(path, returnPaths) {
    returnPaths.push(path);
  },
};

function mergeRender(path, state) {
  const { targetRenderReturnNode, targetRenderBodyNodes } = state;
  if (targetRenderReturnNode === null) {
    return;
  }
  if (targetRenderBodyNodes.length > 0) {
    const bodyPath = path.get("body");
    bodyPath.unshiftContainer("body", targetRenderBodyNodes);
  }
  const returnPaths = [];
  path.traverse(visitor, returnPaths);
  const size = returnPaths.length;
  if (size > 0) {
    // 是否有标记点
    let targetReturn = returnPaths.find((path, index) => {
      // console.log( path )
      const commentPaths = path.get("leadingComments");
      if (commentPaths && commentPaths.length > 0) {
        for (let cpath of commentPaths) {
          const comment = cpath.node.value;
          const isTarget = regJSXReturn.test(comment);
          if (isTarget) {
            return true;
          }
        }
      }
    });
    // 没有标记点，默认最后一个return语句
    if (targetReturn === undefined) {
      targetReturn = returnPaths[size - 1];
    }
    const argPath = targetReturn.get("argument");
    const isSingleExp =
      argPath.isNullLiteral() ||
      argPath.isNumericLiteral() ||
      argPath.isStringLiteral() ||
      argPath.isTemplateLiteral() ||
      argPath.isBinaryExpression() ||
      argPath.isConditionalExpression() ||
      argPath.isCallExpression() ||
      argPath.isLogicalExpression();
    const selfCloseEle =
      argPath.isJSXElement() && argPath.node.closingElement === null;
    const needWrapper = selfCloseEle || isSingleExp;
    if (needWrapper) {
      const tmpNode = isSingleExp
        ? t.jsxExpressionContainer(argPath.node)
        : argPath.node;
      const wrapperNode = t.jsxFragment(
        t.jsxOpeningFragment(),
        t.jsxClosingFragment(),
        [tmpNode, targetRenderReturnNode]
      );
      targetReturn.node.argument = wrapperNode;
    } else {
      const { children } = targetReturn.node.argument;
      if (children) {
        children.push(targetRenderReturnNode);
      } else {
        throw new Error(bcfe(targetReturn.node, "该节点没有无子元素"));
      }
    }
    // console.log( g( path.node ).code )
  }
}

module.exports = mergeRender;
