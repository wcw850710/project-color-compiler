import * as fs from "fs";
import {iComputedConfig} from "../../../interfaces/config";
import {iResolve} from "../interfaces/resolve";
import getToColorFilePath from '../../../utils/getToColorFilePath'
import recursiveDir from "../../../utils/recursiveDir";
import getRgbaColor from "../../../utils/getRgbaColor"
import getHashColor from "../../../utils/getHashColor"
import createHash from '../../../utils/createHash'
import {iGetColor} from "../../../interfaces/color";

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
  const {compileFileType, compileFileName, compileFilePath, isAutoImport}: iComputedConfig = config
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

  // 取得定義好的顏色
//   const getDeclaredColors = () => {
//     const colorFileData = `interface iColor { [variable: string]: string }
//
// export _colors = {
//   eJVUQJ1BI3: 'rgba(0,0,0,.5)',
//   vI62ughMdi: '#fff',
//   jKFX8UllXE: '#000',
//   commit1: '#1c1c1c', // 1111
//   commit2: '#1a1a1a', //2222222
//   commit3: '#1B1B1B',// 3
//   commit4: '#999',//444444
// }`
//     const colorFileDataLen = colorFileData.length
//     const exportIndex = colorFileData.search('export')
//     let colorResult = []
//     if(exportIndex === -1) return
//     else {
//       const afterExportFileData = colorFileData.substr(exportIndex, colorFileDataLen)
//       const afterExportFileDataLen = afterExportFileData.length
//       let index = 0
//       let openBraceIndex = 0
//       let closeBraceIndex = 0
//       while (index < afterExportFileDataLen) {
//         const txt = afterExportFileData[index]
//         if (txt === '{') openBraceIndex = index
//         if (txt === '}') closeBraceIndex = index
//         index++
//       }
//       const braceUglyFileData = afterExportFileData.substr(openBraceIndex, closeBraceIndex)
//       const matchColors = braceUglyFileData.match(/[A-z0-9$_]*:\s*['"`](rgba\s*\([0-9,.\s]*\)|#[A-z0-9]*)['"`](\s*,\s*[\/]{2}.*)?/gm)
//       console.log(braceUglyFileData)
//       matchColors.forEach(matchColor => {
//         const [variable, commitColor] = matchColor.split(/:\s*/)
//         const [color, commit] = commitColor.split(/,\s*[\/]{2}\s*/)
//         colorResult.push({
//           color, variable, commit: commit || ''
//         })
//       })
//     }
//     return colorResult
//   }

  // 建立顏色申明文件
  const createColorDeclareFile = () => new Promise<boolean>(resolve => {
    const isTs: boolean = compileFileType === 'ts'
    const fileName: string = compileFileName
    const cacheColorsKeys: string[] = Object.keys(cacheColors)
    let result = `export const ${fileName}`
    if(isTs) {
      result = `interface iColor { [variable: string]: string }\n\n${result}: iColor`
    }
    result += ` = {`
    if(cacheColorsKeys.length > 0) {
      result += '\n'
      cacheColorsKeys.forEach(color => {
        const variable = cacheColors[color]
        result += `  ${variable}: '${color}',\n`
      })
    }
    result += '}'
    fs.writeFileSync(compileFilePath, result)
    resolve(true)
  })

  // 遍歷檔案寫入變量
  const loopFilesToChangeVariable = () => new Promise<boolean>((resolve) => {
    const cacheFilesLen = cacheFiles.length
    if (cacheFilesLen > 0) {
      const checkIsImportRegex = new RegExp(`import\\s*{\\s*${compileFileName}\\s*}\\s*from\\s['"'][.\\/@$_\\-A-z0-9]*['"\`];?$`, 'm')
      let compiledLen: number = 0
      cacheFiles.forEach(({filePath, originData, compileData}) => {
        let result: string = originData
        compileData.forEach(({ compileContent, originContent }) => {
          result = result.replace(originContent, compileContent)
        })
        if (isAutoImport && !checkIsImportRegex.test(result)) {
          result = `import { ${compileFileName} } from '${getToColorFilePath(filePath, config)}';\n` + result
        }
        fs.writeFile(filePath, result, () => {
          ++compiledLen === cacheFilesLen && resolve(true)
        })
      })
    }
  })

  // 編譯 js file 並儲存 cache
  const compile = (input: string, filePath: string) => {
    const getColorRegex: RegExp = /{[\n\sA-z0-9$#'"`?:_\-,&|().{}]*\}|=\s*['"`](#[A-z0-9]*|rgba\(\s*[0-9,.\s]*\s*\))['"`]/gm
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
        } else {
          contentFrom = 'brackets'
          const isSimpleColor: boolean = /^{\s*['"`]\s*(#[A-z0-9]*|rgba\s*\([0-9\s,.]*\)\s*)\s*['"`]\s*}$/.test(matchResult) === true
          // 如果格式是 {'#000'} 這類的
          if (isSimpleColor) {
            const formatColor: string = matchResult.split(/[\{\}]/g).join('').trim().replace(/[\s'"`]/g, '')
            recordCacheJSColors(formatColor, (variable: string) => compileContent = `{${compileFileName}.${variable}}`)
          } else {
            // 如果是判斷式或者是 style {} 的
            const matchResultLen: number = matchResult.length
            const replaceColors: iReplaceColors[] = [] // {originColor, variable}
            let index: number = 0
            while (index++ < matchResultLen) {
              const strTag: string = matchResult[index]
              if (/['"`]/.test(strTag) === true) {
                index++
                if (matchResult[index] === '#') {
                  const [formatColor, isHashColor]: iGetColor = getHashColor(matchResult, index, _index => (index = _index))
                  const originColor: string = `${strTag}${formatColor}${strTag}`
                  if (isHashColor === false) continue
                  else {
                    recordCacheJSColors(formatColor, (variable: string) => replaceColors.push(
                      {
                        originColor,
                        variable
                      }
                    ))
                    continue
                  }
                } else if (matchResult[index] === 'r') {
                  const [color, isRgbaColor]: iGetColor = getRgbaColor(matchResult, index, _index => (index = _index))
                  const originColor: string = `${strTag}${color}${strTag}`
                  const formatColor: string = color.replace(/[\s'"`]/g, '').trim()
                  if (isRgbaColor === false) continue
                  else {
                    recordCacheJSColors(formatColor, (variable: string) => replaceColors.push(
                      {
                        originColor,
                        variable
                      }
                    ))
                    continue
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
        result.push({
          contentFrom,
          originContent: matchResult,
          compileContent,
        })
      })
      cacheFiles.push({
        filePath,
        originData: input,
        compileData: result
      })
    }
    ++compileCurrent === cacheFileLength && (async () => {
      try {
        await Promise.all([loopFilesToChangeVariable(), createColorDeclareFile()])
        resolve({
          status: 200,
          message: '交叉編譯成功！',
        })
      }catch (e) {
        reject(false)
      }
    })()
  }

  // 循環遍歷所有檔案，跟路徑從 rootPath 開始
  recursiveDir(config, () => cacheFileLength++, (_, path, data) => compile(data, path))

  setTimeout(() => {
    if (compileCurrent === 0) {
      resolve({status: 400, message: '找不到檔案'})
    }
  }, 2000)
})