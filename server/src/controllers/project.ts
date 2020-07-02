import { Request, Response } from "express";
import { go2Errors } from '../services/errors';

export const getDirs = async (req: Request, res: Response) => {
  const { project } = req.body;
  const hasProject = Boolean(project);
  if (hasProject) {
    console.log(22, project);
  } else {
    go2Errors(res, "project项目地址，参数缺失");
  }
};
