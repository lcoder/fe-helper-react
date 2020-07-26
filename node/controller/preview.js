const go2Errors = require("../services/errors");
const success = require("../services/success");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

function Preview(req, res) {
  const { infoPath } = req.query;
  if (infoPath) {
    const dirname = path.dirname(infoPath);
    const imgPath = path.resolve(dirname, "view.png");
    const isExist = fse.pathExistsSync(imgPath);
    if (isExist) {
      var stream = fs.createReadStream(imgPath);
      const responseData = [];
      stream.on("data", function (chunk) {
        responseData.push(chunk);
      });
      stream.on("end", function () {
        const finalData = Buffer.concat(responseData);
        res.write(finalData);
        res.end();
      });
    } else {
      res.status(404).send("未找到文件");
    }
  } else {
    res.status(404).send("未找到文件");
  }
}

module.exports = Preview;
