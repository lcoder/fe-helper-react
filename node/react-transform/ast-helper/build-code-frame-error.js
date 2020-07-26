const generator = require("@babel/generator").default;
/**
 * 模拟path.buildCodeFrameError
 */

function buildCodeFrameError(node, msg) {
  const code = generator(node, {}).code;
  return `${code}\n ^^^^ ${msg}`;
}

module.exports = buildCodeFrameError;
