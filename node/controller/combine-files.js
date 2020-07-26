const go2Errors = require("../services/errors");
const success = require("../services/success");
const combine = require("../services/combine");
const path = require("path");

module.exports = function (req, res) {
  const { sourceFile, components = [] } = req.body;
  const targetFiles = components.map(item => {
    const { infoPath } = item;
    const dir = path.dirname(infoPath);
    const targetFile = path.resolve(dir, "../index.js");
    return targetFile;
  });
  combine(sourceFile, targetFiles)
    .then(() => {
      success(res);
    })
    .catch(e => {
      go2Errors(res, e);
    });
};
