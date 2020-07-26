### Fe-Heler-React 版

![演示图片](./docs/demo.gif)

### 配置 store 仓库地址

新建`node/feHelper_config.json`配置文件。

配置如下:

```json
{
  // 本地仓库地址，绝对路径
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
