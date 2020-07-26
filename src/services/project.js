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

export const fetchProjects = () => {
  return axios.post("/projects");
};

export const fetchDirs = project => {
  return axios.post("/directory", { project });
};

export const fetchComponents = () => {
  return axios.post("/getComponets");
};

export const insertCode = (params = {}) => {
  return axios.post("/combineFiles", params);
};
