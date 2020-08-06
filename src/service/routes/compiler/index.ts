import { styleCompile } from './style'
import { scriptCompile } from "./script"
import {iOriginConfig} from '../../interfaces/config'
import {iExpressRoute} from "../../interfaces/route"

export const compiler: iExpressRoute = async (req, res) => {
  const { config } = req.body as { config: iOriginConfig }
  const [, compileFileExtension] = config.compileFile
  const isScriptFile: boolean = /[jt]s/.test(compileFileExtension)
  let status: number = 500
  let message: string = ''
  try {
    if (isScriptFile) {
      const compileResult = await scriptCompile(config)
      status = compileResult.status
      message = compileResult.message
    } else {
      const compileResult = await styleCompile(config)
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