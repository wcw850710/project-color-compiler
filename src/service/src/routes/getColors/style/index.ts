import {iReturnResponse} from "../../../interfaces/resolve";
import {iComputedConfig} from "../../../interfaces/config";
import {iColorJSONContent, iFileResult} from "../../../utils/style/getFileColors";
import {iColorList} from "../../../interfaces/color";
import getFileColors from "../../../utils/style/getFileColors"

export const getStyleColors = (config: iComputedConfig): Promise<iReturnResponse> => new Promise(async (resolve, reject) => {
  try {
    const {compileFilePath}: iComputedConfig = config
    const colorJson: iFileResult = await getFileColors(compileFilePath)
    const colors: iColorList = []
    for (const color in colorJson) {
      const cJSON: {} | iColorJSONContent = colorJson[color]
      if (cJSON.hasOwnProperty('variable')) {
        const {variable, commit}: iColorJSONContent = colorJson[color] as iColorJSONContent
        colors.push({
          color, variable, commit
        })
      }
    }
    resolve({
      status: 200,
      message: '取得顏色成功',
      data: colors,
    })
  } catch (err) {
    reject({
      status: 400,
      message: '取得顏色失敗',
      data: null,
    })
  }
})
