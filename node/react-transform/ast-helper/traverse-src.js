const tarverse = require("@babel/traverse").default;
const collectClsPropMethod = require("./collect-cls-prop-method");
const g = require("@babel/generator").default;
const { FEHELPER_SOURCE_CLASS } = require("./keys");
const isTargetRc = require("./is-target-rc");
const analysisLifeCycleVariables = require("./analysis-lifecycle-variables");
const renameLifeParam = require("./rename-life-param");
const srcStateCollect = require("./src-state-collect");

const visitor = {
  ClassDeclaration(path, state = {}) {
    // 已经找到一个有效的，且被遍历过了，返回
    if (state.hasTraversed) {
      return;
    }
    if (isTargetRc(path, state)) {
      state.hasTraversed = true;
      // 用于第三次traverse很快能找到该class
      path.node[FEHELPER_SOURCE_CLASS] = true;

      const declarationBody = path.get("body.body");
      // 收集 实例方法、实例字段
      const result = collectClsPropMethod(declarationBody);
      const { rcProperty, rcMethod, staticProps, propTypes, defaultProps } = result;
      state.rcClassProperty = rcProperty;
      state.rcClassMethod = rcMethod;
      state.staticProps = staticProps;
      state.propTypes = propTypes;
      state.defaultProps = defaultProps;

      // 收集React states
      srcStateCollect(declarationBody, state);

      // 强制 重命名 生命周期 形参
      declarationBody.forEach(renameLifeParam);

      // 收集 各个方法内冲突的变量
      analysisLifeCycleVariables(declarationBody, state);
    }
  },
  // 收集 模块内顶层变量
  Program(path, state) {
    const { bindings } = path.scope;
    const bindingIds = Object.keys(bindings);
    // 模块导入
    const importIds = [];
    // 顶层变量
    const moduleIds = [];
    bindingIds.forEach(key => {
      const binding = bindings[key];
      const { path } = binding;
      const { parentPath } = path;
      const { name } = binding.identifier;
      if (parentPath.isImportDeclaration()) {
        const source = parentPath.get("source").node.value;
        const idmodule = {
          id: name,
          source,
        };
        importIds.push(idmodule);
      } else {
        moduleIds.push(name);
      }
    });
    state.importIds.push(...importIds);
    state.moduleIds.push(...moduleIds);
  },
};

function traverseSrc(FileNode, state) {
  tarverse(FileNode, visitor, undefined, state);
}

module.exports = traverseSrc;
