import {iExpressRoute} from "../interfaces/route"
import * as fs from 'fs'
import recursiveDir from '../utils/recursiveDir'
import getConfig from '../utils/getConfig'
import createHash from '../utils/createHash'
import {iComputedConfig, iOriginConfig} from "../interfaces/config";
// const getColorJSON = require('../utils/getColorJSON')

interface iBody {
  config: iOriginConfig
  colors: {
    color: string
    oldVariable: string
    newVariable: string
    commit: string
  }[]
}

const translateColorsAndVariables: iExpressRoute = async (req, res) => {
  const { config, colors }: iBody = req.body
  const _config: iComputedConfig = getConfig(config)
  const { compileFilePath, compileFileType }: iComputedConfig = _config

  // 覆蓋顏色
  const colorsString: string = colors.reduce((prev, {color, newVariable, commit}, index) => {
    const data: string = `$${newVariable.trim() !== '' ? newVariable.trim() : createHash()}: ${color.trim() === '' ? '#000' : color}${compileFileType === 'scss' ? ';' : ''}${commit !== '' ? `// ${commit}`: ''}`
    return index === 0 ? data : prev + `\n${data}`
  }, '')
  fs.writeFile(compileFilePath, colorsString, _ => {})


  // 遍歷調色變量
  let cacheFileLength = 0
  let doneFileLength = 0
  const replaceVariables = (data: string, path: string) => {
    colors.forEach(({ newVariable, oldVariable }) => {
      if(oldVariable !== '' && oldVariable !== newVariable) {
        while(data.search(`\\$${oldVariable}`) !== -1) {
          data = data.replace(new RegExp(`\\$${oldVariable}`, 'gm'), `$${newVariable}`)
        }
      }
    })
    fs.writeFile(path, data, (_) => {
      ++doneFileLength === cacheFileLength && res.status(200).send({
        message: '覆蓋顏色成功',
        data: null
      })
    })
  }
  recursiveDir(_config, () => cacheFileLength++, (_, path, data) => replaceVariables(data, path))
}
export default translateColorsAndVariables