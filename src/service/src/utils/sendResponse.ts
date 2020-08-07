import * as express from 'express'
import {iReturnResponse} from "../interfaces/resolve";

export const sendResponse = (
  res: express.Response,
  {status, message, data}: iReturnResponse
) => res.status(status).send({
    message,
    data,
  })
