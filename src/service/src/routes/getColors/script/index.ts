import {iReturnResponse} from "../../../interfaces/resolve";
import {iComputedConfig} from "../../../interfaces/config";
import {iColorList} from "../../../interfaces/color";
import {getDeclaredColors} from "../../../utils/script/getDeclaredColors"

export const getScriptColors = (config: iComputedConfig): Promise<iReturnResponse> => new Promise(async (resolve, reject) => {
  try {
    const colorJson: iColorList = await getDeclaredColors(config)
    resolve({
      status: 200,
      message: '取得顏色成功',
      data: colorJson,
    })
  } catch (err) {
    reject({
      status: 400,
      message: '取得顏色失敗',
      data: null,
    })
  }
})
