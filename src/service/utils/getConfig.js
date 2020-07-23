const checkPath = path => path[path.length - 1] !== '/' ? path + '/' : path
module.exports = config => {
  const {fileExtensions, rootPath, compilePath, compileFile} = config
  const _fileExtensions = fileExtensions.reduce((p, e) => ({...p, [`.${e}`]: true}), {})
  const _rootPath = checkPath(rootPath)
  const _compilePath = checkPath(compilePath)
  const _compileFile = compileFile.join('.')
  const _compileFilePath = _compilePath + _compileFile
  return {
    fileExtensions: _fileExtensions,
    rootPath: _rootPath,
    compilePath: _compilePath,
    compileFile: _compileFile,
    compileFileName: compileFile[0],
    compileFileType: compileFile[1],
    compileFilePath: _compileFilePath
  }
}