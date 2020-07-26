import useReactState from "@/hooks/use-react-state";
import { createContainer } from "unstated-next";

function useProject() {
  let [value, setState] = useReactState({
    projectName: undefined,
    activeProject: undefined,
    projects: [],
    projectDirTree: [],
    selectedFiles: [],
    selectedCps: [],
  });
  return [value, setState];
}

export const ProjectStore = createContainer(useProject);
