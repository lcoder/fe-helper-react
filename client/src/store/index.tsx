import React, { createContext, Props } from "react";
import { useLocalStore, useObserver } from "mobx-react";
import { ProjectStore } from "./project";

interface TMixStore {
  project: ProjectStore;
}

const initValues = () => ({
  project: new ProjectStore(),
});

export const StoreContext = createContext<TMixStore | null>(null);

export const StoreProvider = (props: Props<{}>) => {
  const store = useLocalStore(initValues);
  return useObserver(() => (
    <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
  ));
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
