const g = require("@babel/generator").default;
const { render } = require("../keys");

function lifecycle(path, tarLifeMethod) {
  // console.log( g( path.node ).code )
  for (let [tarMethod, tarNLifeode] of Object.entries(tarLifeMethod)) {
    const srcMethodPath = path.get("body").find(path => {
      return (
        path.node.static === false &&
        path.node.computed === false &&
        path.isClassMethod() &&
        path.get("key").isIdentifier() &&
        path.get("key").node.name === tarMethod
      );
    });
    // 存在合并，不存在追加
    if (srcMethodPath) {
      // 形参 src缺失 用target补充
      const tarParams = tarNLifeode.params;
      const srcParamPath = srcMethodPath.get("params");
      const sizeSrcParam = srcParamPath.length;
      const moreThanSrc = tarParams.length > sizeSrcParam;
      if (moreThanSrc) {
        const otherParam = tarParams.slice(sizeSrcParam);
        srcMethodPath.pushContainer("params", otherParam);
      }
      // 追加函数体
      const body = tarNLifeode.body ? tarNLifeode.body.body : [];
      srcMethodPath.get("body").pushContainer("body", body);
    } else {
      const renderPath = path.get("body").find(path => {
        return (
          path.node.static === false &&
          path.node.computed === false &&
          path.isClassMethod() &&
          path.get("key").isIdentifier() &&
          path.get("key").node.name === render
        );
      });
      // 有render方法，放在render之上，没有render方法，则添加到底部
      if (renderPath) {
        renderPath.insertBefore(tarNLifeode);
      } else {
        path.pushContainer("body", tarNLifeode);
      }
    }
  }
}

module.exports = lifecycle;
