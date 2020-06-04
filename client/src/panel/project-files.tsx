import React, { useContext } from "react";
import { Input, Select } from "antd";
import style from "./project-files.module.less";
import { StoreContext } from "../store/index";

const { Option } = Select;

export default () => {
  const store = useContext(StoreContext);
  const { projects, activeProject } = store;

  return (
    <div className={style.box}>
      <Select
        className={style.projectName}
        placeholder="请选择项目"
        value={activeProject}
        onChange={active => {
          store.changeActiveProject(active);
        }}
      >
        {projects.map(item => {
          return (
            <Option value={item.code} key={item.code}>
              {item.name}
            </Option>
          );
        })}
      </Select>
      <Input placeholder="请输入文件名过滤" />
    </div>
  );
};
