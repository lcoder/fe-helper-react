import React, { createContext, Props } from "react";
import { useLocalStore, useObserver } from "mobx-react";
import { createPrject, TProject } from "./project";

interface TMixStore {
  project: TProject;
}

const initValues = () => ({
  project: createPrject(),
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
