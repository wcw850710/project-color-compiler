import getToColorFilePath from './getToColorFilePath'
import { matchVueStartStyleTag } from './getVueStyle'
import { iComputedConfig } from '../interfaces/config'

export default (extension: string, filePath: string, fileData: string, config: iComputedConfig): string => {
  const {isAutoImport, compileFileName, compileFileType}: iComputedConfig = config
  if(isAutoImport) {
    const isImportedColor: boolean = new RegExp(`@import\\s?['"]+.*${compileFileName}(\\.s[ac]ss)?['"]+[;\\s]*$`, 'gm').test(fileData)
    if (!isImportedColor) {
      const isVueFile: boolean = extension === 'vue'
      const importSentence: string = `@import '${getToColorFilePath(filePath, config)}'${(extension === 'scss' || isVueFile && compileFileType === 'scss') ? ';' : ''}\n`
      if(extension === 'vue') {
        const matchStyleTag: RegExpMatchArray | null = fileData.match(matchVueStartStyleTag)
        if(matchStyleTag !== null) {
        const [styleTag]: string[] = matchStyleTag
          fileData = fileData.replace(styleTag, styleTag + '\n' + importSentence)
        }
      } else {
        fileData = importSentence + fileData
      }
      return fileData
    }
  }
  return fileData
}