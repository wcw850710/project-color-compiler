const fs = require('fs')
const path = require('path')
const recursiveDir = (config, readFileBeforeCallback, readFileCallback) => {
  const { rootPath, compileFile, fileExtensions } = config
  fs.readdir(rootPath, (err, files) => {
    files.forEach((fileName) => {
      const newPath = rootPath + fileName
      const fileExtensionName = path.extname(fileName)
      const isFolder = fs.lstatSync(rootPath + fileName).isDirectory()
      if (fileExtensions[fileExtensionName] && fileName !== compileFile) {
        readFileBeforeCallback()
        fs.readFile(newPath, (err, data) => {
          const fileData = data.toString()
          readFileCallback(fileName, newPath, fileData)
        })
      }
      if (isFolder && fileName !== 'node_modules') {
        recursiveDir({...config, rootPath: newPath + '/'},  readFileBeforeCallback, readFileCallback)
      }
    })
  })
}
module.exports = recursiveDir