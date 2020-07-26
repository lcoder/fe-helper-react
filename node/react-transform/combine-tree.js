/*
 * 结合两颗ast树
 **/
const transformAst = require("./ast-helper/transform-ast");

async function combineTree(sourceTree, targetTree) {
  // 转换sourceTree的ast结构
  transformAst(sourceTree, targetTree);

  return sourceTree;
}

module.exports = combineTree;
