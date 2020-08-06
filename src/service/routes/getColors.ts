import getFileColors from '../utils/style/getFileColors'
import getConfig from '../utils/getConfig'
import { iComputedConfig } from "../interfaces/config";
import { iFileResult, iColorJSONContent } from "../utils/style/getFileColors";
import {iExpressRoute} from "../interfaces/route";
import {iColorList} from "../interfaces/color";
import {sendResponse} from "../utils/sendResponse";

const getColors: iExpressRoute = async (req, res) => {
  const { config } = req.body
  const { compileFilePath }: iComputedConfig = getConfig(config)
  const colorJson: iFileResult = await getFileColors(compileFilePath)
  const colors: iColorList = []
  for (const color in colorJson) {
    const cJSON: {} | iColorJSONContent = colorJson[color]
    if(cJSON.hasOwnProperty('variable')) {
      const {variable, commit}: iColorJSONContent = colorJson[color] as iColorJSONContent
      colors.push({
        color, variable, commit
      })
    }
  }
  sendResponse(res, {
    status: 200,
    message: '取得顏色成功',
    data: colors
  })
}
export default getColors