import { Request, Response } from "express";
import { go2Errors } from '../services/errors';
import { getProjectDirTree } from '../services/file';

export const getDirs = async (req: Request, res: Response) => {
  const { project } = req.body;
  const hasProject = Boolean(project);
  if (hasProject) {
    try {
      const dirTrees = getProjectDirTree({
        origin: project,
        base: project,
      });
      res.json({
        result: {
          dirTrees
        },
      });
    } catch(e) {
      go2Errors(res, e);
    }
  } else {
    go2Errors(res, "project项目地址，参数缺失");
  }
};
