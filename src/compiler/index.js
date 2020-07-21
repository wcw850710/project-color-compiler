(async () => {
  const fs = require('fs')
  const Config = require('./utils/getConfigData')
  const {fileExtensions, compileFile, compilePath} = await Config.setConfig()
  const getStyleName = require("./utils/getStyleName")
  const getColor = require("./utils/getColor")
  const recursiveDir = require("./utils/recursiveDir")
  const createHash = require('./utils/createHash')
  const result = {}
  let cacheSassFiles = []
  let cacheSassFileColors = []
  let sassFileLength = 0
  let sassCompileCurrent = 0

  const readColorsFileData = () => {
    const data = fs.readFileSync(compilePath + compileFile, (err, data) => {
      return data
    })
    return data
  }

  const compilerColorsFileData = input => {
    let cur = 0
    let result = {}
    while(cur < input.length){
      if (input[cur] === '$') {
        let variableName = ''
        let color = ''
        while (input[++cur] !== ':') {
          variableName+=input[cur]
        }
        while (input[++cur] !== '#') {
          continue
        }
        while (/[A-z0-9]/.test(input[++cur])) {
          color+=input[cur]
        }
        result['#' + color] = variableName
        cur++
        continue
      }
      cur++
    }
    return result
  }

  //TODO: 變例檔案更改顏色為變亮；支援 SASS, VUE, SCSS, JS 副檔名, commit 優化
  const setSassVariableToFile = () => {
    let index = 0
    let isFirstAdd = true
    const resultColorVariables = {}
    let colorsFileData = readColorsFileData().toString()
    const colorsFileResult = compilerColorsFileData(colorsFileData)
    if (Object.keys(result).length) {
      for (const color in result) {
        index++
        const commit = '// ' + [...result[color]].join(', ')
        const colorResultVariableName = colorsFileResult[color]
        let variableName = colorResultVariableName ? '$' + colorResultVariableName : '$' + createHash()
        colorsFileData += `${isFirstAdd ? '' : '\n'}${variableName}: ${color} ${commit}`
        isFirstAdd && (isFirstAdd = false)
        if (colorResultVariableName){
          variableName = colorResultVariableName
        }
        resultColorVariables[color] = '$' + variableName
      }
      fs.writeFileSync(compilePath + compileFile, colorsFileData)
      setColorVariableToSassFiles(resultColorVariables)
    }
  }

  const setColorVariableToSassFiles = (resultColorVariables) => {
    cacheSassFiles.forEach((path, index) => {
      fs.readFile(path, (err, data) => {
        let sassFileData = data.toString()
        cacheSassFileColors[index].forEach((color) => {
          sassFileData = sassFileData.replace(new RegExp(color, 'g'), resultColorVariables[color])
        })
        fs.writeFile(path, sassFileData, (err) => {})
      })
    })
  }

  const recordCacheSassData = (newPath, colors) => {
    cacheSassFiles.push(newPath)
    cacheSassFileColors.push([...colors])
  }

  const compiler = (input, newPath, fileName) => {
    let cur = 0
    let colorIndex = 0
    let colors = new Set()
    while (cur < input.length) {
      const txt = input[cur]
      if (txt === ':') {
        colorIndex = cur
      } else if (txt === '#') {
        const color = getColor(input, cur)
        const style = getStyleName(input, colorIndex)
        console.log(style)
        result['#' + color] ? result['#' + color].add(`[${fileName}]: ${style}`) : result['#' + color] = new Set([`[${fileName}]: ${style}`])
        colors.add('#' + color)
      }
      cur++
    }
    recordCacheSassData(newPath, colors)
    ++sassCompileCurrent === sassFileLength && setSassVariableToFile()
  }

  recursiveDir('./', () => sassFileLength++, (fileName, path, data) => compiler(data, path, fileName))
})()