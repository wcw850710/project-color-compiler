const checkPath = path => path[path.length - 1] !== '/' ? path + '/' : path
module.exports = config => {
  const {fileExtensions, rootPath, compilePath, compileFile} = config
  return {
    fileExtensions: fileExtensions,
    rootPath: checkPath(rootPath),
    compilePath: checkPath(compilePath),
    compileFile: compileFile.join('.')
  }
}