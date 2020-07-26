const { render, TargetClassFlag } = require("./keys");
const tarverse = require("@babel/traverse").default;
const scopeRename = require("./scope-rename");
const g = require("@babel/generator").default;
const { RenameStateVisitor } = require("./rename-state-visitor");
const collectClsPropMethod = require("./collect-cls-prop-method");
const isTargetRc = require("./is-target-rc");
const targetRenderFix = require("./target-render-fix");
const diffStaticProps = require("./diff-static-props");
const fixTargetLifeMethod = require("./fix-target-life-method");
const fixTargetConstruct = require("./fix-target-construct");
const copyTargetLifeMethod = require("./copy-target-life-method");
const u = require("./util");
const fixClsPropAndMethod = require("./tar-fix-cls-prop-method");

const visitor = {
  ClassDeclaration(path, state) {
    // 已经找到一个有效的，且被遍历过了，返回
    if (state.hasTraversed) {
      return;
    }
    if (isTargetRc(path, state)) {
      state.hasTraversed = true;
      path.node[TargetClassFlag] = true;
      const allMethods = path.get("body.body").filter(path => {
        return path.isClassMethod() || path.isClassProperty();
      });
      // fix 构造函数
      fixTargetConstruct(allMethods, state);

      // rename state
      path.traverse(RenameStateVisitor, state);

      // 修复render 变量冲突，检测return
      const renderClsMedPath = allMethods.find(path =>
        path.get("key").isIdentifier({ name: render })
      );
      if (renderClsMedPath) {
        targetRenderFix(renderClsMedPath, state);
      }

      // 删除冲突的静态属性，保存不冲突的属性
      state.staticNodes = diffStaticProps(allMethods, state);

      // 生命周期方法 冲突解决
      fixTargetLifeMethod(allMethods, state);

      // 拷贝 生命周期方法
      copyTargetLifeMethod(allMethods, state);

      // 1.收集 方法名和实例属性名
      const { rcProperty, rcMethod } = collectClsPropMethod(allMethods);
      state.selfRcMedProp = rcProperty.concat(rcMethod);

      // 2.重命名 冲突的实例属性和方法
      fixClsPropAndMethod(path, state);

      // 保存 方法体、实例方法体
      const rcPropMethodNodes = allMethods
        .filter(path => {
          const isState =
            path.node.static === false &&
            path.node.computed === false &&
            path.get("key").isIdentifier() &&
            path.get("key").node.name === "state";
          const spec =
            path.node.static === true ||
            // 忽略生命周期方法
            u.isLifecycleMethod(path) ||
            // 忽略state 实例属性
            isState;
          return !spec;
        })
        .map(path => path.node);
      state.rcPropAndMethodNodes.push(...rcPropMethodNodes);
    }
  },
  // 修复 import冲突
  "ImportSpecifier|ImportDefaultSpecifier|ImportNamespaceSpecifier"(path, state) {
    const { parentPath } = path;
    const { preservedImportIds, preservedModuleIds } = state;
    const findSameId = id => preservedImportIds.find(({ id: key }) => key === id);
    const source = parentPath.get("source").node.value;
    const srcPreserved = preservedImportIds
      .map(({ id }) => id)
      .concat(preservedModuleIds);
    const localName = path.get("local").node.name;
    const targetPreserved = findSameId(localName);
    const isRepet = targetPreserved !== undefined;
    if (isRepet) {
      const { source: srcImportFrom } = targetPreserved;
      // 导入相同的内容，删除本次import
      if (source === srcImportFrom) {
        path.remove();
        // check 命名导入和默认导入都没有，则删除本条import
        if (parentPath.get("specifiers").length === 0) {
          parentPath.remove();
        }
        // 不同模块冲突，重命名冲突的导出
      } else {
        scopeRename(srcPreserved, path, id => id === localName);
      }
    }
    // console.log( g( path.parentPath.node ).code )
  },
  Program: {
    // 替换冲突的顶层变量
    enter(path, state) {
      const { preservedImportIds, preservedModuleIds } = state;
      const srcPreserved = preservedImportIds
        .map(({ id }) => id)
        .concat(preservedModuleIds);
      scopeRename(srcPreserved, path, (id, binding) => {
        // 如果类名冲突，则忽略
        if (binding.path.parentPath.isExportDefaultDeclaration()) {
          return false;
        }
        return preservedModuleIds.includes(id);
      });
    },
    // 收集 imports 顶层变量
    exit(path, state) {
      const body = path.get("body");
      const targetImportBindings = body
        .filter(path => {
          return !path.isExportDefaultDeclaration();
        })
        .map(path => path.node);
      state.targetImportBindings = targetImportBindings;
    },
  },
};

function traverseTarget(FileNode, state) {
  tarverse(FileNode, visitor, undefined, state);
  // console.log( g( FileNode ).code )
}

module.exports = traverseTarget;
