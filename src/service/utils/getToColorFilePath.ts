export default (sourcePath, {compileFilePath, compileFileName, compileFileType}) => {
  const sourcePathSp = sourcePath.split(/[\\\/]/)
  const compilePathSp = compileFilePath.split(/[\\\/]/)
  sourcePathSp.pop()
  compilePathSp.pop()
  const filterPath = compilePathSp.filter((path, index) => sourcePathSp[index] === path)
  const sourceLen = sourcePathSp.length
  const filterLen = filterPath.length
  const compileLen = compilePathSp.length
  let resultPath = ``
  // console.log('sourcePathSp:', sourcePath, sourceLen, filterLen)
  // console.log('compilePathSp:', compileFilePath)
  if(sourceLen === compileLen && compileLen === filterLen) {
    // 同層的
    resultPath = `./${compileFileName}.${compileFileType}`
  } else if(filterLen < sourceLen) {
    // 我們不一樣
    let path = ``
    const minusSourceLen = sourceLen - filterLen
    const minusCompileLen = compileLen - filterLen
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
    const minusLen = compileLen - filterLen
    const compSourceLen = compileLen - minusLen
    let path = ``
    for (let i = 0; i < minusLen; i++) {
      const _path = compilePathSp[compSourceLen + i]
      path += _path + '/'
    }
    resultPath = `./${path}${compileFileName}.${compileFileType}`
  }
  return resultPath
}