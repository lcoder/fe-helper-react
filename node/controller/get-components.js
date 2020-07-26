const success = require("../services/success");
const getComponents = require("../services/components");

module.exports = function (req, res) {
  success(res, {
    components: getComponents(),
  });
};
