const getToColorFilePath = require('./getToColorFilePath')
const matchVueStartStyleTag = require('./getVueStyle').matchVueStartStyleTag

module.exports = (extension, filePath, fileData, config) => {
  const {isAutoImport, compileFileName} = config
  if(isAutoImport === true) {
    const isImportedColor = new RegExp(`@import\\s?['"]+.*${compileFileName}(\\.s[ac]ss)?['"]+[;\\s]*$`, 'gm').test(fileData)
    if (isImportedColor === false) {
      const importSentence = `@import '${getToColorFilePath(filePath, config)}'${extension === 'scss' ? ';' : ''}\n`
      if(extension === 'vue') {
        const matchStyleTag = fileData.match(matchVueStartStyleTag)
        const { index, input } = matchStyleTag
        const inputLen = input.length
        fileData = input + '\n' + importSentence + + fileData.substring(inputLen)
      } else {
        fileData = importSentence + fileData
      }
      return fileData
    }
  }
  return fileData
}