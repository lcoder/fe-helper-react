import { SelectValue } from "antd/es/select";

interface ProjectItem {
  name: string;
  code: string;
}

export function createPrject() {
  return {
    activeProject: undefined as SelectValue | undefined,
    projects: [
      { name: "夸父", code: "kuafu" },
      { name: "诺亚", code: "noah" },
    ] as Array<ProjectItem>,
    setActiveProject: function (newVal?: SelectValue) {
      this.activeProject = newVal;
    },
  };
}

export type TProject = ReturnType<typeof createPrject>;
