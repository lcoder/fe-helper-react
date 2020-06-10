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

export const fetchDirs = (path: string) => {
  return axios.post("/directory", {
    path,
  });
};
