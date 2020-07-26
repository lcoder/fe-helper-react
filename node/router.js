const compression = require("compression");
const bodyParser = require("body-parser");
const directory = require("./controller/directory");
const getComponets = require("./controller/get-components");
const preview = require("./controller/preview");
const combineFiles = require("./controller/combine-files");
const projects = require("./controller/projects");

module.exports = function (app) {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/projects", projects);
  app.use("/directory", directory);
  app.use("/getComponets", getComponets);
  app.use("/preview", preview);
  app.use("/combineFiles", combineFiles);
};
