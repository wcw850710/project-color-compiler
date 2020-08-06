import * as express from 'express'
import {iResolve} from "../routes/compiler/interfaces/resolve";

interface iReturnResponse extends iResolve {
  data: any
}

export const setResponse = (
  res: express.Response,
  {status, message, data}: iReturnResponse
) => res.status(status).send({
    message,
    data,
  })
