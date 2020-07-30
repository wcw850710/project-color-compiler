const getToColorFilePath = require('./getToColorFilePath')

module.exports = (extension, filePath, fileData, config) => {
  const {isAutoImport, compileFileName, compileFilePath} = config
  if(isAutoImport === true) {
    const isImportedColor = new RegExp(`@import\\s?['"]+.*${compileFileName}(\\.s[ac]ss)?['"]+[;\\s]*$`, 'gm').test(fileData)
    if (isImportedColor === false) {
      fileData = `@import '${getToColorFilePath(filePath, config)}'${extension === 'scss' ? ';' : ''}\n` + fileData
      return fileData
    }
  }
  return fileData
}