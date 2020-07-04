import axios from "axios";
import { message } from "antd";

axios.interceptors.response.use(
  function (response) {
    const {
      data: { success, result, errorMsg },
    } = response;
    if (success) {
      return result;
    } else {
      const msg = errorMsg || "系统异常";
      message.error(msg);
      return Promise.reject(msg);
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

export interface DirectoryTree {
  name: string;
  path: string;
  isDir: boolean;
  children?: DirectoryTree[];
}

export const fetchDirs = (project: string) => {
  return axios.post<{ dirTrees: Array<DirectoryTree> }>("/directory", { project });
};
