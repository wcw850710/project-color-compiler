import {iComputedConfig} from "../interfaces/config";
import {iResolve} from "../routes/compiler/interfaces/resolve";

type iCallback = () => Promise<any>

export const checkScriptOrStyle = (config: iComputedConfig, scriptCallback: iCallback, styleCallback: iCallback) => new Promise<iResolve>(async (resolve, reject) => {
  const { compileFileType } = config
  const isScriptFile: boolean = /[jt]s/.test(compileFileType)
  try {
    if (isScriptFile) {
      await scriptCallback()
    } else {
      await styleCallback()
    }
    resolve({
      status: 200,
      message: '做得好'
    })
  } catch (err) {
    reject({
      status: 500,
      message: '服務器錯誤',
    })
  }
})