const config = require("../util/config");
const glob = require("glob");

function getComponents() {
  const { storePath } = config;
  const infosFiles = glob.sync(`${storePath}/*/info/info.json`);
  const infoArr = [];
  infosFiles.forEach(item => {
    let info = require(item);
    infoArr.push({
      ...info,
      infoPath: item,
    });
  });
  return infoArr;
}

module.exports = getComponents;
