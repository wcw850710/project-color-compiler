module.exports = (colorPath, {compileFilePath, compileFileName}) => {
  const colorPathSp = colorPath.split(/[\\\/]/)
  colorPathSp.pop()
  const compilePathSp = compileFilePath.split(/[\\\/]/)
  compilePathSp.pop()

  const addPath = (sourcePath) => {
    const colorLen = colorPathSp.length
    const filterPath = sourcePath.filter((path, index) => colorPathSp[index] === path)
    const filterLen = filterPath.length
    const sourceLen = sourcePath.length
    let resultPath = ``
    // console.log('colorPathSp', colorPathSp,
    //   'sourcePath', sourcePath,
    //   'filterPath', filterPath,)
    if(filterLen < colorLen && sourceLen > filterLen) {
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\views\\a.sass
      // ../assets/_color
      // 路徑在 color 之後且不同資料結構
      const minusLen = sourceLen - filterLen
      let path = ``
      for (let i = 0; i < minusLen; i++) {
        path += '../'
      }
      const minusLen2 = colorLen - filterLen
      const compSourceLen = colorLen - minusLen2
      let path2 = ``
      for (let i = 0; i < minusLen2; i++) {
        const _path = colorPathSp[compSourceLen + i]
        path += _path + '/'
      }
      resultPath = `${path}${path2}${compileFileName}`
    } else if(filterLen + colorLen + sourceLen === sourceLen * 3) {
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\a.sass
      // ./_color
      // 同層的
      resultPath = `./${compileFileName}`
    } else if(filterLen < colorLen && sourceLen === filterLen) {
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\c.sass
      // ./src/assets/_color
      // 路徑在 color 之後且同資料結構
      const minusLen = colorLen - sourceLen
      const compSourceLen = colorLen - minusLen
      let path = ``
      for (let i = 0; i < minusLen; i++) {
        const _path = colorPathSp[compSourceLen + i]
        path += _path + '/'
      }
      resultPath = `./${path}${compileFileName}`
    } else if(sourceLen > colorLen) {
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\_color.sass
      // C:\\Users\\wcw85\\desk\\code\\ws-projects\\sass-colors-compiler\\src\\gui\\src\\assets\\haha\\jojo\\_color.sass
      // ../../_color
      // 超過 color 的資料夾
      const minusLen = sourceLen - colorLen
      const compSourceLen = sourceLen - minusLen
      let path = ``
      for (let i = 0; i < minusLen; i++) {
        path += '../'
      }
      resultPath = `${path}${compileFileName}`
    }
    return resultPath
  }

  return addPath(compilePathSp)
}