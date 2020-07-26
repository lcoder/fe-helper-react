const { NodePath } = require("@babel/traverse");
const u = require("./util");

/**
 * 收集构造函数的 函数体，区分this.state上面的语句和下面的语句
 * @param {NodePath} path
 * @param {state} state
 */
function getTarCnstrctNodes(path, state) {
  if (
    path === undefined ||
    path === null ||
    !(path instanceof NodePath) ||
    !path.isClassMethod({ kind: "constructor" })
  ) {
    return;
  }
  const body = path.get("body.body");
  let stateUpNodes = [],
    stateDownNodes = [];
  let flag = false;
  for (let p of body) {
    const isThisStateAssign = u.isThisStateAssign(p);
    // 忽略this.state赋值语句
    if (isThisStateAssign) {
      flag = true;
      continue;
    }
    const { node } = p;
    if (flag) {
      stateDownNodes.push(node);
    } else {
      stateUpNodes.push(node);
    }
  }
  state.cnstrctNode.row = path.node;
  state.cnstrctNode.params = path.get("params").map(path => path.node);
  state.cnstrctNode.stateUp = stateUpNodes;
  state.cnstrctNode.stateDown = stateDownNodes;
}

module.exports = getTarCnstrctNodes;
