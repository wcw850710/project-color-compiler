const fs = require('fs')
const path = require('path')
const recursiveDir = (_path, config, readFileBeforeCallback, readFileCallback) => {
  const { compileFile } = config
  fs.readdir(_path, (err, files) => {
    files.forEach((fileName) => {
      const newPath = _path + fileName
      const fileExtensionName = path.extname(fileName)
      const isFolder = fs.lstatSync(_path + fileName).isDirectory()
      if (fileExtensionName === '.sass' && fileName !== compileFile) {
        readFileBeforeCallback()
        fs.readFile(newPath, (err, data) => {
          const sassData = data.toString()
          readFileCallback(fileName, newPath, sassData)
        })
      }
      if (isFolder && fileName !== 'node_modules') {
        recursiveDir(newPath + '/', config,  readFileBeforeCallback, readFileCallback)
      }
    })
  })
}
module.exports = recursiveDir