const t = require("@babel/types");
const g = require("@babel/generator").default;
const traverseSrc = require("./traverse-src");
const traverseTarget = require("./traverse-target");
const tarverseMerge = require("./traverse-merge");
const { didMount, rcLifeClsMethods } = require("./keys");

function transformAst(FileNode, TarFileNode) {
  // 收集
  const stateSrc = {
    // 是否已经被解析过了（一个文件最多一个class能被解析）
    hasTraversed: false,
    stateField: false, // 是否含有，state field
    constructor: false, // 是否含有，rcLifeClsMethods内的生命周期方法
    // ... render
    // 各类方法、状态变量绑定
    ids: {
      constructor: [],
      states: [],
      // rcLifeClsMethods，生命周期方法内的局部变量
    },
    // 模块内import，模块内变量
    importIds: [],
    moduleIds: [],
    // 组件 实例方法，类方法
    rcClassMethod: [],
    rcClassProperty: [],
    // 静态属性
    staticProps: [],
    propTypes: [],
    defaultProps: [],
  };
  traverseSrc(FileNode, stateSrc);

  // 替换，解决与FileNode中冲突的变量名，state名，方法名
  const stateTar = {
    hasTraversed: false,
    targetConstructorBodys: [],
    // 是否含有state实例属性
    stateField: false,
    // 是否有构造函数
    constructor: false,
    // 待合并的state ast node对象
    tarStateObjNode: null,
    // 构造函数 函数体 ast对象,区分位置，相对于this.state语句
    cnstrctNode: {
      row: null, // 函数体节点
      params: [],
      stateUp: [],
      stateDown: [],
    },
    // state 新名字
    stateRenameMap: {},
    // src中各个方法和状态的变量
    srcIds: stateSrc.ids,
    // 保留关键字
    preservedRcClassMethod: [...stateSrc.rcClassMethod],
    preservedRcClassProperty: [...stateSrc.rcClassProperty],
    preservedRcMedProp: [...stateSrc.rcClassMethod, ...stateSrc.rcClassProperty],
    preservedImportIds: [...stateSrc.importIds],
    preservedModuleIds: [...stateSrc.moduleIds],
    preservedStaticProps: [...stateSrc.staticProps],
    preservedPropTypes: [...stateSrc.propTypes],
    preservedDefaultProps: [...stateSrc.defaultProps],
    // 实例属性和方法变更记录
    medPropRenameMap: {},
    // target 方法和实例属性 key字符串
    selfRcMedProp: [],
    // 方法和实例属性
    rcPropAndMethodNodes: [],
    // import和各种变量绑定
    targetImportBindings: [],
    // render函数 函数体 ， return的节点
    renderBodyNodes: [],
    renderReturnNode: null,
    staticNodes: [],
    // 是否含有，对应的生命周期方法
    ...rcLifeClsMethods.reduce((obj, method) => {
      return Object.assign(obj, { [method]: stateSrc[method] });
    }, {}),
    // 声明周期方法
    lifeMethods: {
      // [string]: [ nodes... ]
    },
  };
  traverseTarget(TarFileNode, stateTar);

  // 合并
  const stateMerge = {
    tar: {
      stateField: stateTar.stateField,
      constructor: stateTar.constructor,
      tarStateObjNode: stateTar.tarStateObjNode,
      cnstrctNode: stateTar.cnstrctNode,
    },
    targetImportBindings: [...stateTar.targetImportBindings],
    targetPropMethodNodes: [...stateTar.rcPropAndMethodNodes],
    targetConstructorBodys: [...stateTar.targetConstructorBodys],
    targetRenderBodyNodes: stateTar.renderBodyNodes,
    targetRenderReturnNode: stateTar.renderReturnNode,
    targetStaticNodes: stateTar.staticNodes,
    targetLifeMethods: stateTar.lifeMethods,
  };
  tarverseMerge(FileNode, stateMerge);
  // console.log( g( TarFileNode ).code )
}

module.exports = transformAst;
