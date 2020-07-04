import React from "react";
import { Input, Select, Tree } from "antd";
import { useStore } from "../store/index";
import { useObserver } from "mobx-react";
import useFetchDirs from "./use-fetch-dirs";
import style from "./project-files.module.less";

const { Option } = Select;

export default () => {
  const { project } = useStore();
  useFetchDirs();
  return useObserver(() => {
    return (
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
        <Tree
          selectedKeys={project.selectedFiles}
          onSelect={(sel, { selectedNodes }) => {
            const list = selectedNodes
              .map(({ isDir, key }: any) => {
                if (isDir) {
                  return undefined;
                }
                return key;
              })
              .filter(Boolean);
            project.changeSelectedFiles(list);
          }}
          className={style.tree}
          treeData={project.projectDirTree as any}
        />
      </div>
    );
  });
};
