import {styleCompile} from './style'
import {scriptCompile} from "./script"
import {iOriginConfig} from '../../interfaces/config'
import {iExpressRoute} from "../../interfaces/route"
import getConfig from "../../utils/getConfig";
import {checkScriptOrStyle} from "../../utils/checkScriptOrStyle";
import {sendResponse} from "../../utils/sendResponse";

export const compiler: iExpressRoute = (req, res) => {
  const {config: originConfig} = req.body as { config: iOriginConfig }
  const config = getConfig(originConfig)
  checkScriptOrStyle(config, () => scriptCompile(config), () => styleCompile(config))
    .then((resData) => sendResponse(res, { ...resData, data: null }))
    .catch((resData) => sendResponse(res, { ...resData, data: null }))
}