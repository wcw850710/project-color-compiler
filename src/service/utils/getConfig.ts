import { iOriginConfig, iComputedConfig } from '../interfaces/config'

const formatPath = path => path[path.length - 1] !== '/' ? path + '/' : path

export default (config): iComputedConfig => {
  const {fileExtensions, rootPath, compilePath, compileFile, isAutoImport}: iOriginConfig = config
  const _fileExtensions = fileExtensions.reduce((p, e) => ({...p, [`.${e}`]: true}), {})
  const _rootPath = formatPath(rootPath)
  const _compilePath = formatPath(compilePath)
  const _compileFile = compileFile.join('.')
  const _compileFilePath = _compilePath + _compileFile
  const _isAutoImport = isAutoImport
  return {
    fileExtensions: _fileExtensions,
    rootPath: _rootPath,
    compilePath: _compilePath,
    compileFile: _compileFile,
    compileFileName: compileFile[0],
    compileFileType: compileFile[1],
    compileFilePath: _compileFilePath,
    isAutoImport: _isAutoImport,
  }
}