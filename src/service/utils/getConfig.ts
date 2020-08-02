import {iComputedConfig, iOriginConfig} from '../interfaces/config'

const formatPath = (path: string): string => path[path.length - 1] !== '/' ? path + '/' : path
interface iFileExtensions {
  [extension: string]: boolean
}
export default (config: iOriginConfig): iComputedConfig => {
  const {fileExtensions, rootPath, compilePath, compileFile, isAutoImport}: iOriginConfig = config
  const _fileExtensions: iFileExtensions = fileExtensions.reduce((p, e) => ({...p, [`.${e}`]: true}), {})
  const _rootPath: string = formatPath(rootPath)
  const _compilePath: string = formatPath(compilePath)
  const _compileFile: string = compileFile.join('.')
  const _compileFilePath: string = _compilePath + _compileFile
  return {
    fileExtensions: _fileExtensions,
    rootPath: _rootPath,
    compilePath: _compilePath,
    compileFile: _compileFile,
    compileFileName: compileFile[0],
    compileFileType: compileFile[1],
    compileFilePath: _compileFilePath,
    isAutoImport: isAutoImport,
  }
}