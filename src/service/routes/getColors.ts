import getFileColors from '../utils/getFileColors'
import getConfig from '../utils/getConfig'
import { iComputedConfig } from "../interfaces/config";
import { iFileResult, iColorJSONContent } from "../utils/getFileColors";
import {iExpressRoute} from "../interfaces/route";

const getColors: iExpressRoute = async (req, res) => {
  const { config } = req.body
  const { compileFilePath }: iComputedConfig = getConfig(config)
  const colorJson: iFileResult = await getFileColors(compileFilePath)
  const colors: {color: string, variable: string, commit: string}[] = []
  for (const color in colorJson) {
    const cJSON: {} | iColorJSONContent = colorJson[color]
    if(cJSON.hasOwnProperty('variable')) {
      const {variable, commit}: iColorJSONContent = colorJson[color] as iColorJSONContent
      colors.push({
        color, variable, commit
      })
    }
  }
  res.status(200).send({
    message: '取得顏色成功',
    data: colors
  })
}
export default getColors