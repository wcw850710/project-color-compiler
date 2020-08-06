import { styleCompile } from './style'
import { scriptCompile } from "./script"
import {iOriginConfig} from '../../interfaces/config'
import {iExpressRoute} from "../../interfaces/route"
import getConfig from "../../utils/getConfig";
import {iResolve} from "./interfaces/resolve";

export const compiler: iExpressRoute = async (req, res) => {
  const { config: originConfig } = req.body as { config: iOriginConfig }
  const config = getConfig(originConfig)
  const { compileFileType } = config
  const isScriptFile: boolean = /[jt]s/.test(compileFileType)
  let status: number = 500
  let message: string = ''
  try {
    if (isScriptFile) {
      const compileResult: iResolve = await scriptCompile(config)
      status = compileResult.status
      message = compileResult.message
    } else {
      const compileResult: iResolve = await styleCompile(config)
      status = compileResult.status
      message = compileResult.message
    }
  } catch (err) {
    res.status(500).send({
      message: '服務器錯誤',
      data: null
    })
  }
  res.status(status).send({
    message: message,
    data: null
  })
}