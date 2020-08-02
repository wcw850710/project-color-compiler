import {iComputedConfig} from "../interfaces/config";

export default (sourcePath: string, {compileFilePath, compileFileName, compileFileType}: iComputedConfig) => {
  const sourcePathSp: string[] = sourcePath.split(/[\\\/]/)
  const compilePathSp: string[] = compileFilePath.split(/[\\\/]/)
  sourcePathSp.pop()
  compilePathSp.pop()
  const filterPath: string[] = compilePathSp.filter((path, index) => sourcePathSp[index] === path)
  const sourceLen: number = sourcePathSp.length
  const filterLen: number = filterPath.length
  const compileLen: number = compilePathSp.length
  let resultPath: string = ``
  // console.log('sourcePathSp:', sourcePath, sourceLen, filterLen)
  // console.log('compilePathSp:', compileFilePath)
  if(sourceLen === compileLen && compileLen === filterLen) {
    // 同層的
    resultPath = `./${compileFileName}.${compileFileType}`
  } else if(filterLen < sourceLen) {
    // 我們不一樣
    let path: string = ``
    const minusSourceLen: number = sourceLen - filterLen
    const minusCompileLen: number = compileLen - filterLen
    for (let i = 0; i < minusSourceLen; i++) {
      path += '../'
    }
    for (let i = 0; i < minusCompileLen; i++) {
      const _path = compilePathSp[compileLen - minusCompileLen + i]
      path += _path + '/'
    }
    resultPath = `${path}${compileFileName}.${compileFileType}`
  } else if(filterLen === sourceLen && sourceLen < compileLen) {
    // 路徑在 color 之後且同資料結構
    const minusLen: number = compileLen - filterLen
    const compSourceLen: number = compileLen - minusLen
    let path = ``
    for (let i = 0; i < minusLen; i++) {
      const _path = compilePathSp[compSourceLen + i]
      path += _path + '/'
    }
    resultPath = `./${path}${compileFileName}.${compileFileType}`
  }
  return resultPath
}