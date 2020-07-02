import React, { useEffect } from "react";
import { reaction } from "mobx";
import { useStore } from "../store";
import { fetchDirs } from "../services/project";

export default function useFetchDirs() {
  const store = useStore();
  const [result, setResult] = React.useState([]);

  const doFetch = () => {
    const {
      project: { activeProject, projects },
    } = store;
    store.project.setSearchLoading(true);
    const target = projects.find(({ code }) => code === activeProject);
    if (target) {
      fetchDirs(target.projectPath)
        .then(result => {
          console.log(222, result);
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
