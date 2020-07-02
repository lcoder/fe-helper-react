import { Response } from 'express';

interface ErrorRes {
  success: boolean,
  errorMsg?: string,
  result: null | object | Array<any>,
}

export function go2Errors(res: Response, errorMsg: string) {
  const errorObj: ErrorRes = {
    success: false,
    errorMsg,
    result: null,
  }
  res.json(errorObj);
}