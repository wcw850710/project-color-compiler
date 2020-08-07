import * as express from 'express'
type request = express.Request
type response = express.Response
export interface iExpressRoute {
  (req: request, res: response): void
}