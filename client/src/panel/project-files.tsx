import React from "react";
import { Input, Select } from "antd";
import style from "./project-files.module.less";
import { useStore } from "../store/index";
import { useObserver } from "mobx-react";

const { Option } = Select;

export default () => {
  const { project: store } = useStore();

  return useObserver(() => (
    <div className={style.box}>
      <Select
        className={style.projectName}
        placeholder="请选择项目"
        value={store.activeProject}
        onChange={active => {
          store.setActiveProject(active);
        }}
      >
        {store.projects.map(item => {
          return (
            <Option value={item.code} key={item.code}>
              {item.name}
            </Option>
          );
        })}
      </Select>
      <Input placeholder="请输入文件名过滤" />
    </div>
  ));
};
