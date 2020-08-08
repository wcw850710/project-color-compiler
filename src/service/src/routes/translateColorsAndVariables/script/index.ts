import * as fs from 'fs'
import recursiveDir from '../../../utils/recursiveDir'
import {iComputedConfig} from "../../../interfaces/config";
import {iTranslateColorList} from "../../../interfaces/color";
import {iReturnResponse} from "../../../interfaces/resolve";
import {createColorDeclare} from "../../../utils/script/createColorDeclare";

interface iConfigAndColor {
  config: iComputedConfig
  colors: iTranslateColorList
}

type iColors = {
  [color: string]: string
}

export const translateScript = ({config, colors}: iConfigAndColor): Promise<iReturnResponse> => new Promise((resolve) => {
  const { compileFilePath, compileFileName }: iComputedConfig = config

  // 覆蓋顏色
  const cacheColors = colors.reduce<iColors>((prev: iColors, {newVariable, color, commit}) => ({
    ...prev,
    [`${color}', ${commit !== '' ? `// ${commit}`: ''}`]: newVariable,
  }), {})
  const declaredFileData = createColorDeclare(config, cacheColors, '')
  fs.writeFile(compileFilePath, declaredFileData, _ => {})

  // 遍歷調色變量
  let cacheFileLength = 0
  let doneFileLength = 0
  const replaceVariables = (data: string, path: string) => {
    colors.forEach(({ newVariable, oldVariable }) => {
      if(oldVariable !== '' && oldVariable !== newVariable) {
        while(data.search(`${compileFileName}.${oldVariable}`) !== -1) {
          data = data.replace(new RegExp(`${compileFileName}.${oldVariable}`, 'gm'), `${compileFileName}.${newVariable}`)
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