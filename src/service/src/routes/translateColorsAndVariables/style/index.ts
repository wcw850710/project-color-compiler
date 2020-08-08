import * as fs from 'fs'
import recursiveDir from '../../../utils/recursiveDir'
import createHash from '../../../utils/createHash'
import {iComputedConfig} from "../../../interfaces/config";
import {iTranslateColorList} from "../../../interfaces/color";
import {iReturnResponse} from "../../../interfaces/resolve";

interface iConfigAndColor {
  config: iComputedConfig
  colors: iTranslateColorList
}

export const translateStyle = ({config, colors}: iConfigAndColor): Promise<iReturnResponse> => new Promise((resolve) => {
  const { compileFilePath, compileFileType }: iComputedConfig = config

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
      ++doneFileLength === cacheFileLength && resolve({
        status: 200,
        message: '覆蓋顏色成功',
        data: null
      })
    })
  }

  recursiveDir(config, () => cacheFileLength++, (_, path, data) => replaceVariables(data, path))
})