### React 组件规范

```jsx
import React from "react";
import { Input } from "antd";

export default class extends React.PureComponent {
  constructor(props) {
    this.state = {
      value: "",
    };
  }
  changeValue = e => {
    this.setState({
      value: e.target.vaue,
    });
  };
  render() {
    // 必须默认导出一个jsx
    return <Input value={this.state.value} onChange={this.changeValue} />;
  }
}
```

### 合并过程细节

- 两个文件的 import 内容会合并

  - 区分，相同模块默认导入和命名导入名称是否相同
    - 名称相同，则自动忽略，不重复导入
    - 名称不同，则按新名称继续导入
  - 暂不区分 imported 和 local 的差别

- constructor 构造方法合并

  - state 合并，通过 merge
  - super(props) 去重
  - 其余内容直接 push

- 方法合并

  - 直接合并

- 实例属性(实例方法)

  - state 属性自动合并内容
  - 其他属性，直接拷贝

- 类的某些特性，暂不实现
  - 取值，存值函数(get set) 暂不考虑
  - 属性表达式(类的属性名是个表达式)
  - Generator 方法
  - 类静态方法
    - 冲突的话，保留一份
  - 类静态属性
    - ES6 明确规定，Class 内部只有静态方法，没有静态属性
    - 后续可针对 propTypes 和 defaultProps 自动合并
  - 公有字段
    - 公有静态字段：`static staticField = 'static field';`
    - 公有实例字段：`instanceField = 'instance field';`
  - 公有方法
    - 公有静态方法：`static staticMethod(){}`
    - 公有实例方法：`publicMethod(){}`，可使用迭代器，异步，异步生成器
  - 私有字段 暂时不支持

待办

- done tarverse-src 等，做默认导出不是 class 的判断并跳过(默认导出是变量,查找定义是 class 的话，则继续)
- done 合并同一个 import 的源
- done 支持装饰器
- 支持各种生命周期，静态类方法
- 支持静态属性，propTypes 和 defaultProps 合并,this.props 合并
- done return 自闭合的元素，再包一层
- Select Option 重复定义 会重命名的 问题
- done render 语句合并
