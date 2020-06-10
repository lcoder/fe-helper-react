import axios from "axios";

export const fetchDirs = (path: string) => {
  return axios.post("/directory", {
    path,
  });
};
