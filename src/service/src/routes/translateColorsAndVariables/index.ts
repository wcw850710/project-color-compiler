import { translateStyle } from './style'
import { translateScript } from "./script"
import {iExpressRoute} from "../../interfaces/route";
import {iOriginConfig} from "../../interfaces/config";
import getConfig from "../../utils/getConfig";
import {checkScriptOrStyle} from "../../utils/checkScriptOrStyle";
import {sendResponse} from "../../utils/sendResponse";
import {iTranslateColorList} from "../../interfaces/color";

export { translateStyle, translateScript }

export const translateColorsAndVariables: iExpressRoute = (req, res) => {
  const {config: originConfig, colors} = req.body as { config: iOriginConfig, colors: iTranslateColorList}
  const config = getConfig(originConfig)
  checkScriptOrStyle(config, () => translateScript({config, colors}), () => translateStyle({config, colors}))
    .then((resData) => sendResponse(res, resData))
    .catch((resData) => sendResponse(res, resData))
}