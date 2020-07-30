const getToColorFilePath = require('./getToColorFilePath')
const matchVueStartStyleTag = require('./getVueStyle').matchVueStartStyleTag

module.exports = (extension, filePath, fileData, config) => {
  const {isAutoImport, compileFileName, compileFileType} = config
  if(isAutoImport === true) {
    const isImportedColor = new RegExp(`@import\\s?['"]+.*${compileFileName}(\\.s[ac]ss)?['"]+[;\\s]*$`, 'gm').test(fileData)
    if (isImportedColor === false) {
      const isVueFile = extension === 'vue'
      const importSentence = `@import '${getToColorFilePath(filePath, config)}'${(extension === 'scss' || isVueFile && compileFileType === 'scss') ? ';' : ''}\n`
      if(extension === 'vue') {
        const matchStyleTag = fileData.match(matchVueStartStyleTag)
        const [styleTag] = matchStyleTag
        fileData = fileData.replace(styleTag, styleTag + '\n' + importSentence)
      } else {
        fileData = importSentence + fileData
      }
      return fileData
    }
  }
  return fileData
}