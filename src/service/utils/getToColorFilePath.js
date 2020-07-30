module.exports = (sourcePath, {compileFilePath, compileFileName, compileFileType}) => {
  const sourcePathSp = sourcePath.split(/[\\\/]/)
  const compilePathSp = compileFilePath.split(/[\\\/]/)
  sourcePathSp.pop()
  compilePathSp.pop()
  const filterPath = compilePathSp.filter((path, index) => sourcePathSp[index] === path)
  const sourceLen = sourcePathSp.length
  const filterLen = filterPath.length
  const compileLen = compilePathSp.length
  let resultPath = ``
  // console.log(sourcePath, compileFilePath)
  // console.log('sourcePathSp', sourcePathSp,
  //   'compilePathSp', compilePathSp,
  //   'filterPath', filterPath,)
  if(filterLen < sourceLen && compileLen > filterLen) {
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\views\\a.sass
    // ../assets/_color
    // 路徑在 color 之後且不同資料結構
    const minusLen = compileLen - filterLen
    let path = ``
    for (let i = 0; i < minusLen; i++) {
      path += '../'
    }
    const minusLen2 = sourceLen - filterLen
    const compSourceLen = sourceLen - minusLen2
    let path2 = ``
    for (let i = 0; i < minusLen2; i++) {
      const _path = sourcePathSp[compSourceLen + i]
      path += _path + '/'
    }
    resultPath = `${path}${path2}${compileFileName}.${compileFileType}`
  } else if(filterLen + sourceLen + compileLen === compileLen * 3) {
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\a.sass
    // ./_color
    // 同層的
    resultPath = `./${compileFileName}.${compileFileType}`
  } else if(sourceLen > compileLen) {
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\haha\\jojo\\_color.sass
    // ../../_color
    // 超過 color 的資料夾
    const minusLen = sourceLen - compileLen
    let path = ``
    for (let i = 0; i < minusLen; i++) {
      path += '../'
    }
    resultPath = `${path}${compileFileName}.${compileFileType}`
  } else if(filterLen < sourceLen && compileLen === filterLen) {
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
    // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\c.sass
    // ./src/assets/_color
    // 路徑在 color 之後且同資料結構
    const minusLen = sourceLen - compileLen
    const compSourceLen = sourceLen - minusLen
    let path = ``
    for (let i = 0; i < minusLen; i++) {
      const _path = sourcePathSp[compSourceLen + i]
      path += _path + '/'
    }
    resultPath = `./${path}${compileFileName}.${compileFileType}`
  }
  return resultPath
}