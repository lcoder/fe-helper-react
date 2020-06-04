import React, { createContext, Context } from "react";
import { useLocalStore, useObserver } from "mobx-react";
import { SelectValue } from "antd/es/select";

interface Project {
  name: string;
  code: string;
}

export interface StoreTypes {
  activeProject?: SelectValue;
  projects: Array<Project>;
  changeActiveProject: (project: SelectValue) => void;
}

const initValues: StoreTypes = {
  activeProject: undefined,
  projects: [],
  changeActiveProject: () => {},
};

export const StoreContext: Context<StoreTypes> = createContext(initValues);

export const StoreProvider = (props: any) => {
  const store = useLocalStore(
    () =>
      ({
        activeProject: undefined,
        projects: [
          { name: "夸父", code: "kuafu" },
          { name: "诺亚", code: "noah" },
        ],
        changeActiveProject(project: SelectValue) {
          store.activeProject = project;
        },
      } as StoreTypes)
  );
  return useObserver(() => (
    <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
  ));
};
