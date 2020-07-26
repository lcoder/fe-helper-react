### Fe-Heler-React 版

![演示图片](./docs/demo.gif)

### 配置 store 仓库地址

项目根目录下新建`feHelper_config.json`配置文件

配置如下:

```json
{
  // 本地项目地址，绝对路径
  "projects": [
    {
      "name": "项目1",
      "code": "project1",
      "projectPath": "/xxx/project1"
    },
    {
      "name": "项目2",
      "code": "project2",
      "projectPath": "/xxx/project2"
    }
  ],
  // 配置store仓库地址，绝对路径
  "storePath": "/xx/fe-helper-store-react"
}
```

### 启动

安装依赖：`yarn`

启 动：`yarn start`

### store 仓库文件格式

比如一个 button 组件，需要配置如下。

```shell
➜  button tree
.
├── index.js
└── info
    ├── info.json
    └── view.png

1 directory, 3 files
```

#### button/index.js

```jsx
import React from "react";

export default class Button extends React.Component {
  render() {
    return <div>I'm a button</div>;
  }
}
```

#### button/info/info.json

```json
{
  "type": "按钮类型",
  "cName": "普通按钮",
  "name": "button",
  "author": "test"
}
```

#### button/info/view.png

button 预览图片文件
