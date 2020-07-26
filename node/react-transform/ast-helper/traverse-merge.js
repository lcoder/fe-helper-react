const tarverse = require("@babel/traverse").default;
const g = require("@babel/generator").default;
const t = require("@babel/types");
const { FEHELPER_SOURCE_CLASS } = require("./keys");
const mergeImports = require("./merge/imports");
const mergeRender = require("./merge/render");
const mergeStatic = require("./merge/static");
const mergeLifecycle = require("./merge/lifecycle");
const mergeConstructor = require("./merge/constructor/index");

const visitor = {
  ClassDeclaration(path, state) {
    // 寻找，第一次traverse标记的class
    if (path.node[FEHELPER_SOURCE_CLASS] === true) {
      const clsBody = path.get("body"),
        declaBody = clsBody.get("body");

      // 合并constructor中的代码
      mergeConstructor(clsBody, state);

      // 添加 目标组件的 类方法 实例方法
      const renderPath = declaBody.find(
        path =>
          path.isClassMethod() && path.get("key").isIdentifier({ name: "render" })
      );
      const { targetPropMethodNodes } = state;
      if (renderPath !== undefined && targetPropMethodNodes.length > 0) {
        renderPath.insertBefore(targetPropMethodNodes);
      }

      // 合并静态属性
      mergeStatic(clsBody, state.targetStaticNodes);

      // 合并render语句，合并jsx
      mergeRender(renderPath, state);

      // 合并生命周期
      mergeLifecycle(clsBody, state.targetLifeMethods);
    }
  },
  // 合并模块变量和import语句
  Program(path, state) {
    mergeImports(path, state);
  },
};

function traverseMerge(FileNode, state) {
  tarverse(FileNode, visitor, undefined, state);
  // console.log( g( FileNode ).code )
}

module.exports = traverseMerge;
