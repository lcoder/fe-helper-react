import { Response } from 'express';

interface ErrorRes {
  success: boolean,
  errorMsg?: string,
  result: null | object | Array<any>,
}

export function go2Errors(res: Response, errorMsg: string|Error) {
  const errorObj: ErrorRes = {
    success: false,
    errorMsg: typeof errorMsg === 'string' ? errorMsg : errorMsg.message,
    result: null,
  }
  res.json(errorObj);
}