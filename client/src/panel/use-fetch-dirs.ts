import React, { useEffect } from "react";
import { reaction } from "mobx";
import { useStore } from "../store";
import { fetchDirs } from "../services/project";

export default function useFetchDirs() {
  const store = useStore();
  const doFetch = () => {
    const {
      project: { activeProject, projects },
    } = store;
    store.project.setSearchLoading(true);
    const target = projects.find(({ code }) => code === activeProject);
    if (target) {
      fetchDirs(target.projectPath)
        .then(result => {
          store.project.setProjectDir(result.dirTrees);
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
}
