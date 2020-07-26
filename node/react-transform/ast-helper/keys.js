// 标记目标ReactClass
exports.TargetClassFlag = Symbol.for("TargetReactClass");

// 默认构造函数的第一个形参名
exports.defaultConstructorParamName = "props";

// 标记 被合并的source文件中的class
exports.FEHELPER_SOURCE_CLASS = "FEHELPER_SOURCE_CLASS";

// 用户侧，用于标记 需要转换的组件
exports.FEHELPERRCKEY = /\s*fe-?helper\s*/i;

// 声明方法
exports.constructor = "constructor"; // 形参: props, context
exports.render = "render";
exports.didMount = "componentDidMount";
exports.shouldUpdate = "shouldComponentUpdate"; // 形参: nextProps, nextState
exports.didUpdate = "componentDidUpdate"; // 形参: prevProps, prevState, snapshot
exports.willUnmount = "componentWillUnmount";
exports.willUpdate = "componentWillUpdate"; // 形参: nextProps,nextState,nextContext
exports.willReceiveProps = "componentWillReceiveProps"; // 形参: nextProps, nextContext
exports.getDerivedStateFromProps = "getDerivedStateFromProps"; // static props,state
exports.snapshotBeforeUpdate = "getSnapshotBeforeUpdate"; // 形参: prevProps, prevState
exports.propTypes = "propTypes";
exports.defaultProps = "defaultProps";

// 非静态生命周期方法
exports.rcLifeClsMethods = [
  exports.constructor,
  exports.render,
  exports.didMount,
  exports.shouldUpdate,
  exports.didUpdate,
  exports.willUpdate,
  exports.willUnmount,
  exports.snapshotBeforeUpdate,
  exports.willReceiveProps,
];

// 目标return了jsx的标记点
exports.regJSXReturn = /^\s*fe-helper\s*$/i;
