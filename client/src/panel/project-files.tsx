import React from "react";
import { Input, Select } from "antd";
import style from "./project-files.module.less";
import { useStore } from "../store/index";
import { useObserver } from "mobx-react";
import useFetchDirs from "./use-fetch-dirs";

const { Option } = Select;

export default () => {
  const { project } = useStore();
  useFetchDirs();

  return useObserver(() => (
    <div className={style.box}>
      <Select
        className={style.projectName}
        placeholder="请选择项目"
        value={project.activeProject}
        onChange={active => {
          project.setActiveProject(active);
        }}
      >
        {project.projects.map(item => {
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
