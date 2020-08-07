import {iExpressRoute} from "../../interfaces/route";
import {iOriginConfig} from "../../interfaces/config";
import getConfig from "../../utils/getConfig";
import {checkScriptOrStyle} from "../../utils/checkScriptOrStyle";
import {sendResponse} from "../../utils/sendResponse";
import {getScriptColors} from "./script";
import {getStyleColors} from "./style";

export const getColors: iExpressRoute = (req, res) => {
  const {config: originConfig} = req.body as { config: iOriginConfig }
  const config = getConfig(originConfig)
  checkScriptOrStyle(config, () => getScriptColors(config), () => getStyleColors(config))
    .then((resData) => sendResponse(res, resData))
    .catch((resData) => sendResponse(res, resData))
}