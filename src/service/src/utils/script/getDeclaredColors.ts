import {iComputedConfig} from "../../interfaces/config";
import {iColorList} from "../../interfaces/color";
import * as fs from "fs";

// 取得定義好的顏色
export const getDeclaredColors = ({ compileFilePath }: iComputedConfig): Promise<iColorList> => new Promise<iColorList>((resolve) => {
  try {
    const colorFileData = (fs.readFileSync(compileFilePath)).toString()
    const colorFileDataLen = colorFileData.length
    const exportIndex: number = colorFileData.search('export')
    let colorList: iColorList = []
    if (exportIndex === -1) return []
    else {
      const afterExportFileData: string = colorFileData.substr(exportIndex, colorFileDataLen)
      const afterExportFileDataLen: number = afterExportFileData.length
      let index: number = 0
      let openBraceIndex: number = 0
      let closeBraceIndex: number = 0
      while (index < afterExportFileDataLen) {
        const txt = afterExportFileData[index]
        if (txt === '{') openBraceIndex = index
        if (txt === '}') closeBraceIndex = index
        index++
      }
      const braceUglyFileData: string = afterExportFileData.substr(openBraceIndex, closeBraceIndex)
      const matchColors: RegExpMatchArray | null = braceUglyFileData.match(/[A-z0-9$_]*:\s*['"`].*['"`](\s*,\s*[\/]{2}.*)?/gm)
      if (matchColors !== null) {
        matchColors.forEach(matchColor => {
          const [variable, commitColor] = matchColor.split(/:\s*/)
          const [color, commit] = commitColor.split(/,\s*[\/]{2}\s*/)
          const formatColor: string = color.replace(/['"`]/g, '')
          colorList.push({
            color: formatColor, variable, commit: commit || ''
          })
        })
      }
    }
    resolve(colorList)
  } catch (err) {
    resolve([])
  }
})