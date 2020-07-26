const { createCombinedFile } = require("../react-transform/index");
const { writeFile } = require("./file");

module.exports = async function (sourceFile, targetFiles) {
  for (let target of targetFiles) {
    const resultCode = await createCombinedFile(sourceFile, target);
    await writeFile(sourceFile, resultCode);
  }
};
