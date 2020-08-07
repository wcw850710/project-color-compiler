import {iComputedConfig} from "../interfaces/config";
import {iReturnResponse} from "../interfaces/resolve";

type iCallback = () => Promise<any>

export const checkScriptOrStyle = (config: iComputedConfig, scriptCallback: iCallback, styleCallback: iCallback) => new Promise<iReturnResponse>(async (resolve, reject) => {
  const { compileFileType } = config
  const isScriptFile: boolean = /[jt]s/.test(compileFileType)
  let data: any = null
  try {
    if (isScriptFile) {
      data = (await scriptCallback()).data || null
    } else {
      data = (await styleCallback()).data || null
    }
    resolve({
      status: 200,
      message: '做得好',
      data,
    })
  } catch (err) {
    reject({
      status: 500,
      message: '服務器錯誤',
      data,
    })
  }
})