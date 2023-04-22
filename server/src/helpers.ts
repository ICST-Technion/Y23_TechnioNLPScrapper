import { Request, Response } from 'express';
import { ERROR_400 } from './consts.js';

export class DBerr {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export const setErrorResponse = (status:number, message:string, res: Response) => {

    res.status(status)
        .send(
        JSON.stringify({
            message: message,
        })
        );
    return;
  };

export const checkInvalidJsonBody = (jsonBody:any, res: Response) => {
    try{
      return JSON.parse(jsonBody);
    }
    catch{
      setErrorResponse(ERROR_400, "Invalid JSON Body in Req", res)
      return ERROR_400;
    }
  };
