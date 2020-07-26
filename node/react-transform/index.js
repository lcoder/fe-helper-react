const { fileParser, codeParser } = require("./parser");
const combineTree = require("./combine-tree");
const ast2stirng = require("./ast2string");

async function combineAst2Code(sourceAst, targetAst) {
  const resultTree = await combineTree(sourceAst, targetAst);
  const resultCode = ast2stirng(resultTree);
  return resultCode;
}

async function createCombinedFile(sourceFile, targetFile) {
  const [sourceAst, targetAst] = await Promise.all([
    fileParser(sourceFile),
    fileParser(targetFile),
  ]);
  return combineAst2Code(sourceAst, targetAst);
}

async function createCombinedCode(sourceCode, targetCode) {
  const [sourceAst, targetAst] = await Promise.all([
    codeParser(sourceCode),
    codeParser(targetCode),
  ]);
  return combineAst2Code(sourceAst, targetAst);
}

module.exports = {
  createCombinedFile,
  createCombinedCode,
};
