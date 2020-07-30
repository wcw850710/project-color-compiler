const getToColorFilePath = require('./getToColorFilePath')

module.exports = (extension, filePath, fileData, {isAutoImport, compileFileName, compilePath}) => {
  // console.log(`compilePath: ${compilePath}`)
  // console.log(`filePath: ${filePath}`)
  // console.log(`compileFileName: ${compileFileName}`)
  // return fileData
  if(isAutoImport === true) {
    const isImportedColor = new RegExp(`@import\\s?['"]+.*${compileFileName}(\\.s[ac]ss)?['"]+[;\\s]*$`, 'gm').test(fileData)
    if (isImportedColor === false) {
      fileData = `@import '${getToColorFilePath(filePath, compilePath, compileFileName)}'${extension === 'scss' ? ';' : ''}\n` + fileData
      return fileData
    }
  }
  return fileData
}