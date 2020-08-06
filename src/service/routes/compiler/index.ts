import {styleCompile} from './style'
import {scriptCompile} from "./script"
import {iOriginConfig} from '../../interfaces/config'
import {iExpressRoute} from "../../interfaces/route"
import getConfig from "../../utils/getConfig";
import {checkScriptOrStyle} from "../../utils/checkScriptOrStyle";
import {setResponse} from "../../utils/setResponse";

export const compiler: iExpressRoute = async (req, res) => {
  const {config: originConfig} = req.body as { config: iOriginConfig }
  const config = getConfig(originConfig)
  checkScriptOrStyle(config, () => scriptCompile(config), () => styleCompile(config))
    .then((resData) => setResponse(res, { ...resData, data: null }))
    .catch((resData) => setResponse(res, { ...resData, data: null }))
}