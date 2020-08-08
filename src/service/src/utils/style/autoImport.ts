import getToColorFilePath from '../getToColorFilePath'
import { matchVueStartStyleTag } from './getVueStyle'
import { iComputedConfig } from '../../interfaces/config'

const getImportedRegex: RegExp = /@import\s?['"][._/\-A-z0-9]*['"][;]?/gm

const importSassInLastImported = (input: string, importSentence: string, cacheImporteds: RegExpMatchArray = []): string => {
  const importeds: RegExpMatchArray | null = cacheImporteds.length ? cacheImporteds :input.match(getImportedRegex)
  let result: string = ''
  if(importeds !== null) {
    const importedsLen: number = importeds.length
    const lastImported: string = importeds[importedsLen - 1]
    result = input.replace(lastImported, `${lastImported}\n${importSentence}`)
  } else {
    result = `${importSentence}\n${input}`
  }
  return result
}

export default (extension: string, filePath: string, fileData: string, config: iComputedConfig): string => {
  const {isAutoImport, compileFileName, compileFileType}: iComputedConfig = config
  if(isAutoImport) {
    const isImportedColor: boolean = new RegExp(`@import\\s?['"]+.*${compileFileName}(\\.s[ac]ss)?['"]+[;\\s]*$`, 'gm').test(fileData)
    if (!isImportedColor) {
      const isVueFile: boolean = extension === 'vue'
      const importSentence: string = `@import '${getToColorFilePath(filePath, config)}'${(extension === 'scss' || isVueFile && compileFileType === 'scss') ? ';' : ''}`
      if(extension === 'vue') {
        const matchStyleTag: RegExpMatchArray | null = fileData.match(matchVueStartStyleTag)
        if(matchStyleTag !== null) {
          const [styleTag]: string[] = matchStyleTag
          const importeds: RegExpMatchArray | null = fileData.match(getImportedRegex)
          if(importeds === null) {
            fileData = fileData.replace(styleTag, styleTag + '\n' + importSentence)
          } else {
            fileData = importSassInLastImported(fileData, importSentence, importeds)
          }
        }
      } else {
        fileData = importSassInLastImported(fileData, importSentence)
      }
      return fileData
    }
  }
  return fileData
}