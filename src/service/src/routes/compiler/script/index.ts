import * as fs from "fs";
import {iComputedConfig} from "../../../interfaces/config";
import {iResolve} from "../../../interfaces/resolve";
import getToColorFilePath from '../../../utils/getToColorFilePath'
import recursiveDir from "../../../utils/recursiveDir";
import getRgbaColor from "../../../utils/getRgbaColor"
import getHashColor from "../../../utils/getHashColor"
import createHash from '../../../utils/createHash'
import {iColorList, iGetColor} from "../../../interfaces/color";
import {getDeclaredColors} from "../../../utils/script/getDeclaredColors";
import {createColorDeclare} from "../../../utils/script/createColorDeclare";

interface iColorVariable {
  [color: string]: string
}

interface iCompileData {
  compileContent: string
  contentFrom: string
  originContent: string
}

interface iCacheFiles {
  filePath: string
  originData: string
  compileData: iCompileData[]
}

interface iReplaceColors {
  variable: string
  originColor: string
}


export const scriptCompile = (config: iComputedConfig): Promise<iResolve> => new Promise((resolve, reject) => {
  const {compileFileName, compileFilePath, isAutoImport}: iComputedConfig = config
  const cacheColors: iColorVariable = {} // {["'" + color + "'"]: variable}
  const cacheFiles: iCacheFiles[] = []
  let cacheFileLength: number = 0
  let compileCurrent: number = 0

  // rgba簡單空格過濾及 callback 回傳 variable
  const recordCacheJSColors = (color: string, getVariable: (variable: string) => void) => {
    const cacheVariable: string = cacheColors[color]
    if(cacheVariable !== undefined) {
      getVariable(cacheVariable)
    } else {
      const variable: string = createHash()
      cacheColors[color] = variable
      getVariable(variable)
    }
  }

  // 建立顏色申明文件
  const createColorDeclareFile = () => new Promise<boolean>(resolve => {
    // return resolve(true)
    const fileData: string = createColorDeclare(config, cacheColors)
    fs.writeFileSync(compileFilePath, fileData)
    resolve(true)
  })

  // 遍歷檔案寫入變量
  const loopFilesToChangeVariable = () => new Promise<boolean>((resolve) => {
    // return resolve(true)
    const cacheFilesLen = cacheFiles.length
    if (cacheFilesLen > 0) {
      const checkIsImportRegex: RegExp = new RegExp(`import\\s*{\\s*${compileFileName}\\s*}\\s*from\\s['"\`][.\\/@$_\\-A-z0-9]*['"\`];?$`, 'm')

      let compiledLen: number = 0
      cacheFiles.forEach(({filePath, originData, compileData}) => {
        let result: string = originData
        compileData.forEach(({ compileContent, originContent }) => {
          result = result.replace(originContent, compileContent)
        })
        if (isAutoImport && !checkIsImportRegex.test(result)) {
          const getAllImportedRegex: RegExp = /import\s*(\*\s*as\s*[A-z0-9_$]*|{[A-z0-9_$,\s]*}|[$_A-z0-9]*(,\s*{[A-z0-9_$,\s]*})*)\s*from\s*['"`][.\/@$_\-A-z0-9]*['"`];?/gm
          const matchImported: RegExpMatchArray | null = originData.match(getAllImportedRegex)
          const importColorsDeclared: string = `import { ${compileFileName} } from '${getToColorFilePath(filePath, config)}';`
          if (matchImported === null) {
            result = `${importColorsDeclared}\n${result}`
          } else {
            const lastImported: string = matchImported[matchImported.length - 1]
            result = result.replace(lastImported, `${lastImported}\n${importColorsDeclared}`)
          }
        }
        fs.writeFile(filePath, result, () => {
          ++compiledLen === cacheFilesLen && resolve(true)
        })
      })
    }
  })

  // 編譯 js file 並儲存 cache
  const compile = (input: string, filePath: string) => {
    // 取得 ``, {} 內的顏色及 ={}, ='' 的顏色及單純 '' 的顏色
    const getColorRegex: RegExp = /`[^`]*`|{[\n\sA-z0-9$#'"`?:_\-,&|().{}]*}|=\s*['"`](#[A-z0-9]*|rgba\(\s*[0-9,.\s]*\s*\))['"`]|['"`]+\s*(#[A-z0-9]*|rgba\(\s*[0-9,.\s]*\))\s*['"`]+/gm
    const bracketAndStringColors: RegExpMatchArray | null = input.match(getColorRegex)
    if (bracketAndStringColors !== null) {
      const result: iCompileData[] = []
      bracketAndStringColors.forEach((matchResult: string) => {
        const firstStr: string = matchResult[0]
        let contentFrom: string = ''
        let compileContent: string = ''
        if (firstStr === '=') {
          contentFrom = 'equal-str'
          const formatColor: string = matchResult.substr(1, matchResult.length).trim().replace(/[\s'"`]/g, '')
          recordCacheJSColors(formatColor, (variable: string) => compileContent = `={${compileFileName}.${variable}}`)
        } else if(firstStr === '`') {
          contentFrom = 'quotation-marks'
          const getHashAndRgbaColorRegex: RegExp = /(['"`]?|['"`]+\s*)(#[A-z0-9]*|rgba\(\s*[0-9,.\s]*\))(\s*['"`]+|['"`]?)/gm
          const matchedColors: RegExpMatchArray | null = matchResult.match(getHashAndRgbaColorRegex)
          if(matchedColors !== null) {
            matchedColors.forEach((color: string) => {
              const content: string = compileContent !== '' ? compileContent : matchResult
              const colorLen: number = color.length
              const colorFirstStr: string = color[0]
              const colorLastStr: string = color[colorLen - 1]
              const checkHasQuotationMarksRegex: RegExp = /['"`]/
              const hasFirstQuotationMarks: boolean = checkHasQuotationMarksRegex.test(colorFirstStr)
              const hasLastQuotationMarks: boolean = checkHasQuotationMarksRegex.test(colorLastStr)
              // 表示為前後都有引號的顏色，如：'#fff'，可以直接寫入變量
              if(hasFirstQuotationMarks && hasLastQuotationMarks) {
                const formatColor: string = color.trim().replace(/[\s'"`]/g, '')
                recordCacheJSColors(formatColor, (variable: string) => compileContent = content.replace(color, `${compileFileName}.${variable}`))
              } else if(hasFirstQuotationMarks) {
                // 表示為只有前面有引號的顏色，如：'#fff
                const formatColor: string = color.trim().replace(/[\s'"`]/g, '')
                recordCacheJSColors(formatColor, (variable: string) => compileContent = content.replace(color, `${compileFileName}.${variable} + ${colorFirstStr}`))
              } else if(hasLastQuotationMarks) {
                // 表示為只有最後有引號的顏色，如：#fff'
                const formatColor: string = color.trim().replace(/[\s'"`]/g, '')
                recordCacheJSColors(formatColor, (variable: string) => compileContent = content.replace(color, `${colorLastStr} + ${compileFileName}.${variable}`))
              } else {
                // 表示為無引號的顏色，如：#fff，需要 ${} 寫入變量
                const formatColor: string = color.trim().replace(/[\s]/g, '')
                recordCacheJSColors(formatColor, (variable: string) => compileContent = content.replace(color, `\${${compileFileName}.${variable}}`))
              }
            })
          }
        } else if(/['"`]/.test(firstStr)) {
          // 純 '' 的值
          contentFrom = 'simple-str'
          const formatColor: string = matchResult.trim().replace(/[\s'"`]/g, '')
          recordCacheJSColors(formatColor, (variable: string) => compileContent = `${compileFileName}.${variable}`)
        } else {
          contentFrom = 'brackets'
          const isSimpleColor: boolean = /^{\s*['"`]\s*(#[A-z0-9]+|rgba\s*\([0-9\s,.]*\)\s*)\s*['"`]\s*}$/.test(matchResult)
          // 如果格式是 {'#000'} 這類的
          if (isSimpleColor) {
            const formatColor: string = matchResult.split(/[{}]/g).join('').trim().replace(/[\s'"`]/g, '')
            recordCacheJSColors(formatColor, (variable: string) => compileContent = `{${compileFileName}.${variable}}`)
          } else {
            // 如果是判斷式或者是 style {} 的
            const matchResultLen: number = matchResult.length
            const replaceColors: iReplaceColors[] = [] // {originColor, variable}
            let index: number = 0
            while (index++ < matchResultLen) {
              const strTag: string = matchResult[index]
              if (/['"`]/.test(strTag)) {
                index++
                if (matchResult[index] === '#') {
                  const [formatColor, isHashColor]: iGetColor = getHashColor(matchResult, index, _index => (index = _index))
                  const originColor: string = `${strTag}${formatColor}${strTag}`
                  if (isHashColor) {
                    recordCacheJSColors(formatColor, (variable: string) => replaceColors.push(
                      {
                        originColor,
                        variable
                      }
                    ))
                  }
                } else if (matchResult[index] === 'r') {
                  const [color, isRgbaColor]: iGetColor = getRgbaColor(matchResult, index, _index => (index = _index))
                  const originColor: string = `${strTag}${color}${strTag}`
                  const formatColor: string = color.replace(/[\s'"`]/g, '').trim()
                  if (isRgbaColor) {
                    recordCacheJSColors(formatColor, (variable: string) => replaceColors.push(
                      {
                        originColor,
                        variable
                      }
                    ))
                  }
                }
              }
            }
            if (replaceColors.length > 0) {
              replaceColors.forEach(({originColor, variable}) => {
                const content: string = compileContent !== '' ? compileContent : matchResult
                compileContent = content.replace(originColor, `${compileFileName}.${variable}`)
              })
            } else {
              // 過濾掉無顏色的，如 {true} 這類的數據
              return false
            }
          }
        }
        if(compileContent !== '') {
          result.push({
            contentFrom,
            originContent: matchResult,
            compileContent,
          })
        }
      })
      cacheFiles.push({
        filePath,
        originData: input,
        compileData: result
      })
    }
    ++compileCurrent === cacheFileLength && (async () => {
      try {
        await createColorDeclareFile()
        await loopFilesToChangeVariable()
        return resolve({
          status: 200,
          message: '交叉編譯成功！',
        })
      }catch (e) {
        reject(false)
      }
    })()
  }

  // 遍歷前先提取顏色定義並注入到 cacheColors 裡
  const beforeCompile = async () => {
    const colorList: iColorList = await getDeclaredColors(config)
    if (colorList.length > 0) {
      colorList.forEach(({color, variable}) => {
        cacheColors[color] = variable
      })
    }
  }

  beforeCompile()
    .then(() => {
      // 循環遍歷所有檔案，跟路徑從 rootPath 開始
    recursiveDir(config, () => cacheFileLength++, (_, path, data) => compile(data, path))

    setTimeout(() => {
      if (compileCurrent === 0) {
        throw new Error('找不到檔案');
      }
    }, 2000)
  }).catch((err: string) => reject(err))
})