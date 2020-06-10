import React, { useEffect } from "react";
import { reaction } from "mobx";
import { useStore } from "../store";
import { fetchDirs } from "../services/project";

export default function useFetchDirs() {
  const store = useStore();
  const [result, setResult] = React.useState(null);

  const doFetch = () => {
    const {
      project: { activeProject },
    } = store;
    store.project.setSearchLoading(true);
    if (activeProject) {
      fetchDirs(activeProject as string)
        .then(result => {
          console.log(result);
        })
        .finally(() => {
          store.project.setSearchLoading(false);
        });
    }
  };
  useEffect(() => {
    doFetch();
    reaction(() => store.project.activeProject, doFetch);
  }, []);
  return result;
}
