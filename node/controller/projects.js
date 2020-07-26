const success = require("../services/success");
const config = require("../util/config");

module.exports = function (req, res) {
  const { projects } = config;
  success(res, {
    projects,
  });
};
