const scopeRename = require("./scope-rename");
const buildCodeFrameError = require("./build-code-frame-error");
/**
 * fix render里面的冲突
 * @param {ClassMethod} path
 * @param {*} state
 */
function targetRenderFix(path, state) {
  const {
    srcIds: { render: srcRenderIds = [] },
  } = state;
  // 修复命名冲突
  scopeRename(srcRenderIds, path);
  // 简单检测return语句
  const renderBodyPath = path.get("body.body");
  const returnPath = renderBodyPath.find(path => path.isReturnStatement());
  if (returnPath) {
    const argPath = returnPath.get("argument");
    state.renderReturnNode = argPath.node;
    state.renderBodyNodes = renderBodyPath
      .map(path => {
        return path.node === returnPath.node ? undefined : path.node;
      })
      .filter(path => path !== undefined);
  } else {
    throw new Error(buildCodeFrameError(path.node, "未找到return语句"));
  }
}

module.exports = targetRenderFix;
