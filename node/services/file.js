const klawSync = require("klaw-sync");
const path = require("path");
const fs = require("fs");

async function writeFile(p, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(p, data, "utf-8", function (err) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

exports.writeFile = writeFile;

exports.getProjectDirTree = function getProjectDirTree(project) {
  const result = [];
  const paths = klawSync(project.base, {
    depthLimit: 0,
    filter: item => {
      const WhiteReg = /\.(j|t)sx?$/;
      const DirReg = /src/;
      const rel = path.relative(project.origin, item.path);
      return (
        (item.stats.isDirectory() && DirReg.test(rel)) || WhiteReg.test(item.path)
      );
    },
  });
  for (let i of paths) {
    const isDir = i.stats.isDirectory();
    const name = path.basename(i.path);
    const children = isDir
      ? getProjectDirTree({
          origin: project.origin,
          base: i.path,
        })
      : null;
    const item = {
      name,
      isDir,
      path: i.path,
      children,
    };
    result.push(item);
  }
  return result;
};
