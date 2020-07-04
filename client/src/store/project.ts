import { SelectValue } from "antd/es/select";
import { observable, action, computed } from "mobx";
import { DirectoryTree } from "../services/project";

interface ProjectItem {
  name: string;
  code: string;
  projectPath: string;
}

interface TreeNode {
  key: string;
  title: string;
  children: TreeNode[] | null;
  isDir: boolean;
}

export class ProjectStore {
  @observable
  activeProject: SelectValue | undefined = undefined;

  @observable
  searchLoading = false;

  @observable
  projects: Array<ProjectItem> = [
    {
      name: "夸父",
      code: "kuafu",
      projectPath:
        "/Users/maotingfeng/netease/opstask/opstask-web/src/main/webapp/source",
    },
    {
      name: "诺亚",
      code: "noah",
      projectPath: "/Users/maotingfeng/netease/noah/client",
    },
  ];
  @observable
  projectDirTree: TreeNode[] = [];

  @action
  setActiveProject(newVal?: SelectValue) {
    this.activeProject = newVal;
  }

  @observable
  selectedFiles: string[] = [];

  @action
  changeSelectedFiles(files: string[]) {
    this.selectedFiles = files;
  }

  @action
  setProjectDir(newVal: DirectoryTree[]) {
    // 生成tree节点树
    function traverse(list: DirectoryTree[]) {
      const result = [];
      for (let item of list) {
        const { isDir, name, path, children } = item;
        if (isDir && children && children.length === 0) {
          continue;
        }
        const newItem: TreeNode = {
          isDir,
          key: path,
          title: name,
          children: children ? traverse(children) : null,
        };
        result.push(newItem);
      }
      return result;
    }
    const treeList = traverse(newVal);
    this.projectDirTree = treeList;
  }

  @action
  setSearchLoading(newVal: boolean) {
    this.searchLoading = newVal;
  }

  @computed
  get projectSize() {
    return this.projects.length;
  }
}
