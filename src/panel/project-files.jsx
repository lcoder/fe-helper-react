import React, { useEffect } from "react";
import { Input, Select, Tree } from "antd";
import style from "./project-files.module.less";
import { ProjectStore } from '@/store/preject';
import { fetchDirs, fetchProjects } from '@/services/project';
const { Option } = Select;

export default function ProjectFiles() {
  const [project, setProject] = ProjectStore.useContainer();

  useEffect(() => {
    const target = project.projects.find(({ code }) => code === project.activeProject);
    if (target) {
      fetchDirs(target.projectPath).then( data => {
        const newVal = data.dirTrees;
        // 生成tree节点树
        function traverse(list) {
          const result = [];
          for (let item of list) {
            const { isDir, name, path, children } = item;
            if (isDir && children && children.length === 0) {
              continue;
            }
            const newItem = {
              isDir,
              key: path,
              title: name,
              children: children ? traverse(children) : null,
            };
            result.push(newItem);
          }
          return result;
        }
        const projectDirTree = traverse(newVal);
        setProject({
          projectDirTree,
        });
      });
    }
  }, [project.activeProject, project.projects, setProject]);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        const { projects } = data;
        setProject({
          projects,
        });
      })
  }, [setProject]);

  return (
    <div className={style.box}>
      <Select
        className={style.projectName}
        placeholder="请选择项目"
        value={project.activeProject}
        onChange={active => {
          setProject({
            activeProject: active,
          });
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
          const selectedFiles = selectedNodes
            .map(({ isDir, key }) => {
              if (isDir) {
                return undefined;
              }
              return key;
            })
            .filter(Boolean);
          setProject({
            selectedFiles,
          });
        }}
        className={style.tree}
        treeData={project.projectDirTree}
      />
    </div>
  );
};
