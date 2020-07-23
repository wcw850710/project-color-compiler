const checkPath = path => path[path.length - 1] !== '/' ? path + '/' : path
module.exports = config => {
  const {fileExtensions, rootPath, compilePath, compileFile} = config
  const _rootPath = checkPath(rootPath)
  const _compilePath = checkPath(compilePath)
  const _compileFile = compileFile.join('.')
  const _compileFilePath = _compilePath + _compileFile
  return {
    fileExtensions: fileExtensions,
    rootPath: _rootPath,
    compilePath: _compilePath,
    compileFile: _compileFile,
    compileFilePath: _compileFilePath
  }
}