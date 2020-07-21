const fs = require('fs')
const path = require('path')

class Config {
  constructor(fileExtensions, compileFile, compilePath) {
    this.fileExtensions = fileExtensions
    this.compileFile = compileFile
    this.compilePath = compilePath
  }

  static instance = null

  static create(fileExtensions, compileFile, compilePath) {
    if (Config.instance === null) {
      Config.instance = new Config(fileExtensions, compileFile, compilePath)
    }
    return Config.instance
  }
}

exports = module.exports = Config
exports.setConfig = () => new Promise(res => {
  const compilerFolderPath = path.resolve(__dirname, '../')
  const config = JSON.parse((fs.readFileSync(`${compilerFolderPath}/conf.json`)).toString())
  const fileExtensions = config['file-extensions']
  const compileFile = config['compile-file'].join('.')
  const compilePath = config['compile-path']
  res(Config.create(fileExtensions, compileFile, compilePath))
})