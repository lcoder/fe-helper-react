import { SelectValue } from "antd/es/select";
import { observable, action, computed } from "mobx";

interface ProjectItem {
  name: string;
  code: string;
  projectPath: string;
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

  @action
  setActiveProject(newVal?: SelectValue) {
    this.activeProject = newVal;
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
