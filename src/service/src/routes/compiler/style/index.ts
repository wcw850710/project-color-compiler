import * as fs from 'fs'
import getRgbaColor from "../../../utils/getRgbaColor"
import getHashColor from "../../../utils/getHashColor"
import recursiveDir from "../../../utils/recursiveDir"
import createHash from '../../../utils/createHash'
import getFileColors, {iFileResult, iColorJSONContent} from '../../../utils/style/getFileColors'
import autoImport from '../../../utils/style/autoImport'
import getPathExtension from '../../../utils/getPathExtension'
import {compile as vueCompile, iVueData} from '../../../utils/style/getVueStyle'
import {iComputedConfig} from '../../../interfaces/config'
import {iGetColor} from "../../../interfaces/color";
import {iResolve} from "../../../interfaces/resolve";

interface iResultColorVariables {
  [color: string]: string
}
type iColors = string | string[]

export const styleCompile =  (config: iComputedConfig): Promise<iResolve> => new Promise((resolve, reject) => {
  const {compileFilePath, compileFileType}: iComputedConfig = config
  const result: { [color: string]: boolean } = {}
  let cacheFile: string[] = []
  let cacheFileColors: iColors[][] = []
  let cacheFileLength: number = 0
  let compileCurrent: number = 0

  // 倒數第二步：將變量數據創建到對應的 colors file
  const setVariableToCompileFile = async () => {
    const resultColorVariables: iResultColorVariables = {}
    const colorsFileData: iFileResult = await getFileColors(compileFilePath)
    let colorsFileResult: string = ''
    if (Object.keys(result).length) {
      for (const color in colorsFileData) {
        const colorData: iColorJSONContent | {} = colorsFileData[color]
        if (colorData.hasOwnProperty('variable')) {
          const {variable, commit} = colorData as iColorJSONContent
          const period: string = (compileFileType === 'scss' ? `;` : '') + `${commit ? ` // ${commit}` : ''}\n`
          colorsFileResult += `$${variable}: ${color}${period}`
          resultColorVariables[color] = `$${variable}`
          if (result[color]) {
            delete colorsFileData[color]
            delete result[color]
          } else {
            delete colorsFileData[color]
          }
        }
      }
      for (const color in result) {
        const period: string = (compileFileType === 'scss' ? ';' : '') + '\n'
        const noSpaceColor: string = color.replace(/\s/g, '')
        if (colorsFileData[noSpaceColor]) {
          const {variable} = colorsFileData[noSpaceColor] as iColorJSONContent
          colorsFileResult += `$${variable}: ${noSpaceColor}${period}`
          resultColorVariables[noSpaceColor] = `$${variable}`
          delete colorsFileData[noSpaceColor]
          delete result[color]
        } else if (!resultColorVariables[noSpaceColor]) {
          const variable: string = createHash()
          colorsFileResult += `$${variable}: ${noSpaceColor}${period}`
          resultColorVariables[noSpaceColor] = `$${variable}`
          delete result[color]
        } else {
          delete result[color]
        }
      }
      fs.writeFileSync(compileFilePath, colorsFileResult)
      transformAllFilesColorToVariable(resultColorVariables)
    } else {
      return resolve({status: 200, message: '顏色更新成功'})
    }
  }

  // 最後一部：遍歷所有 file，將顏色轉成變量
  const transformAllFilesColorToVariable = (resultColorVariables: iResultColorVariables) => {
    let endIndex: number = 0
    // 將數據轉成顏色最長的在前
    const flatAndSortColorsFromStringLength = (colors: iColors[]): string[] =>
      colors.reduce<string[]>((prev: string[], color: iColors) => typeof color === 'string' ? [...prev, color] : [...prev, ...color], [])
        .sort((a, b) => b.length > a.length ? 1 : -1)
    cacheFile.forEach((path: string, index: number) => {
      fs.readFile(path, (_, data: Buffer) => {
        const extension: string = getPathExtension(path)
        const isVueFile: boolean = extension === 'vue'
        let fileData: string = data.toString()
        let {
          styleTagStartIndex: vueStyleTagStartIndex,
          styleTagEndIndex: vueStyleTagEndIndex,
          styleData: vueStyleData
        }: iVueData = isVueFile ? vueCompile(fileData) : {
          styleTagStartIndex: 0,
          styleTagEndIndex: 0,
          styleData: ';'
        }
        let fileResult: string = ''
        flatAndSortColorsFromStringLength(cacheFileColors[index]).forEach((color) => {
          if (isVueFile) {
            vueStyleData = vueStyleData.split(color).join(resultColorVariables[color.replace(/\s/g, '')])
          } else {
            fileData = fileData.split(color).join(resultColorVariables[color.replace(/\s/g, '')])
          }
        })
        if (isVueFile) {
          vueStyleData = autoImport(extension, path, vueStyleData, config)
          fileResult = fileData.substring(vueStyleTagStartIndex, 0) + vueStyleData + fileData.substring(vueStyleTagEndIndex)
        } else {
          fileData = autoImport(extension, path, fileData, config)
          fileResult = fileData
        }
        fs.writeFile(path, fileResult, err => {
          if (err) {
            reject(false)
          } else {
            ++endIndex === cacheFile.length && resolve({status: 200, message: '顏色更新成功'})
          }
        })
      })
    })
    return resolve({status: 200, message: '顏色更新成功'})
  }

  // 將遍歷到的 file 路徑及顏色緩存起來，到最後一步遍歷 file 時可以提速
  const recordCacheData = (path: string, colors: Set<string>) => {
    if (path !== compileFilePath && colors.size > 0) {
      const setToColors: string[] = [...colors]
      const uniqueColors: {
        [color: string]: iColors
      } = {}
      setToColors.forEach(color => {
        if (/rgba/.test(color) === true) {
          const noSpaceColor: string = color.replace(/\s/g, '')
          if (uniqueColors[noSpaceColor] !== undefined) {
            (uniqueColors[noSpaceColor] as string[]).push(color)
          } else {
            uniqueColors[noSpaceColor] = [color]
          }
        } else {
          uniqueColors[color] = color
        }
      })
      cacheFile.push(path)
      cacheFileColors.push(Object.values(uniqueColors))
    }
  }

  // 將遍歷到的 fileData 轉成 Set(cache) 及 json(result) 格式，好讓後面調用
  const compile = (input: string, path: string) => {
    const isVue: boolean = getPathExtension(path) === 'vue'
    let cur: number = 0
    let colors: Set<string> = new Set()
    let styleTagStartIndex: number = 0
    let styleTagEndIndex: number = 0
    let hasVueStyleTag: boolean = false
    const whileCondition: () => boolean = () =>
        isVue ? cur > styleTagStartIndex && cur < styleTagEndIndex && hasVueStyleTag === true
          : cur < input.length
      // 如果是 vue 檔，跑一波初始值定義
    ;(function initCurIndex(): void {
      if (isVue) {
        // 從 style tag 裡開始計算
        const {styleTagStartIndex: _styleTagStartIndex, styleTagEndIndex: _styleTagEndIndex} = vueCompile(input)
        styleTagStartIndex = _styleTagStartIndex
        styleTagEndIndex = _styleTagEndIndex
        cur = styleTagStartIndex + 1
        styleTagStartIndex !== -1 && (hasVueStyleTag = true)
      }
    })()
    // 取得 js 的 ={} 內值及 ='' :'' hash 及 rgba color
    // =\s*{[\n\sA-z0-9$#'"`?:_\-,&|().{}]*\}|[=:]\s*['"`](#[A-z0-9]*|rgba\(\s*[0-9,.\s]*\s*\))['"`]
    // 取得
    while (whileCondition()) {
      const txt = input[cur]
      if (txt === ':') {
        cur++
        while (/[\n;\{]/.test(input[cur]) === false && cur < input.length) {
          if (input[cur] === '#') {
            const [color, isHashColor]: iGetColor = getHashColor(input, cur, index => (cur = index))
            if (isHashColor) {
              result[color] !== true && (result[color] = true)
              colors.add(color)
            }
            break
          } else if (input[cur] === 'r') {
            const [color, isRgba]: iGetColor = getRgbaColor(input, cur, index => (cur = index))
            if (isRgba) {
              result[color] !== true && (result[color] = true)
              colors.add(color)
            }
            break
          } else {
            cur++
          }
        }
      } else {
        cur++
      }
    }
    recordCacheData(path, colors)
    ++compileCurrent === cacheFileLength && setVariableToCompileFile()
  }

  // 循環遍歷所有檔案，跟路徑從 rootPath 開始
  recursiveDir(config, () => cacheFileLength++, (_, path, data) => compile(data, path))

  setTimeout(() => {
    if (compileCurrent === 0) {
      resolve({status: 400, message: '找不到檔案'})
    }
  }, 2000)
})