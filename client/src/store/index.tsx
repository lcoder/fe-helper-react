import React, { createContext, Props } from "react";
import { useLocalStore, useObserver } from "mobx-react";
import { createPrject, TProject } from "./project";

export const StoreContext = createContext<TProject | null>(null);

export const StoreProvider = (props: Props<{}>) => {
  const store = useLocalStore(createPrject);
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
