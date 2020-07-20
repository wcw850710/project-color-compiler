const fs = require('fs')
const path = require('path')
const { compileFile } = require('./getConfigData')
const recursiveDir = (_path, readFileBeforeCallback, readFileCallback) => {
  fs.readdir(_path, (err, files) => {
    files.forEach((fileName) => {
      const newPath = _path + fileName
      const fileExtensionName = path.extname(fileName)
      const isFolder = fs.lstatSync(_path + fileName).isDirectory()
      if (fileExtensionName === '.sass' && fileName !== compileFile) {
        readFileBeforeCallback()
        fs.readFile(newPath, (err, data) => {
          const sassData = data.toString()
          readFileCallback(newPath, sassData)
        })
      }
      if (isFolder) {
        recursiveDir(newPath + '/', readFileBeforeCallback, readFileCallback)
      }
    })
  })
}
module.exports = recursiveDir