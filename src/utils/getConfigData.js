const fs = require('fs')
const path = require('path')

module.exports = new Promise(res => {
  const compilerFolderPath = path.resolve(__dirname, '../')
  const config = JSON.parse((fs.readFileSync(`${compilerFolderPath}/conf.json`)).toString())
  const fileExtensions = config['file-extensions']
  const compileFile = config['compile-file'].join('.')
  const compilePath = config['compile-path']
  res({ fileExtensions, compileFile, compilePath })
})