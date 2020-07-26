const go2Errors = require("../services/errors");
const success = require("../services/success");
const { getProjectDirTree } = require("../services/file");

module.exports = function (req, res) {
  const { project } = req.body;
  const hasProject = Boolean(project);
  if (hasProject) {
    try {
      const dirTrees = getProjectDirTree({
        origin: project,
        base: project,
      });
      success(res, { dirTrees });
    } catch (e) {
      go2Errors(res, e);
    }
  } else {
    go2Errors(res, "project项目地址，参数缺失");
  }
};
