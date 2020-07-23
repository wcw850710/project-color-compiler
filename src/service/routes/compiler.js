module.exports = (config) => new Promise((reslove, reject) => {
  const fs = require('fs')
  const getConfig = require('../utils/getConfig')
  const getStyleName = require("../utils/getStyleName")
  const getColor = require("../utils/getColor")
  const recursiveDir = require("../utils/recursiveDir")
  const createHash = require('../utils/createHash')
  const {compileFilePath, rootPath} = getConfig(config)
  const result = {}
  let cacheSassFiles = []
  let cacheSassFileColors = []
  let sassFileLength = 0
  let sassCompileCurrent = 0

  const readColorsFileData = () => new Promise(reslove => {
    try{
      const data = fs.readFileSync(compileFilePath)
      reslove(data.toString())
    }catch (err) {
      reslove('')
    }
  })

  const compilerColorsFileData = input => {
    let cur = 0
    let result = {}
    while (cur < input.length) {
      if (input[cur] === '$') {
        let variableName = ''
        let color = ''
        while (input[++cur] !== ':') {
          variableName += input[cur]
        }
        while (input[++cur] !== '#') {
          continue
        }
        while (/[A-z0-9]/.test(input[++cur]) && input[cur] !== undefined) {
          color += input[cur]
        }
        result['#' + color] = variableName
        cur++
        continue
      }
      cur++
    }
    return result
  }

  const setSassVariableToFile = async () => {
    const resultColorVariables = {}
    let colorsFileData = await readColorsFileData()
    const colorsFileResult = compilerColorsFileData(colorsFileData)
    let newColorsFileData = ''
    if (Object.keys(result).length) {
      for (const color in colorsFileResult) {
        if(result[color]) {
          const variable = colorsFileResult[color]
          newColorsFileData += `$${variable}: ${color}\n`
          resultColorVariables[color] = `$${variable}`
          delete result[color]
        }
      }
      for (const color in result) {
        if(!colorsFileResult[color]) {
          const variable = createHash()
          newColorsFileData += `$${variable}: ${color}\n`
          resultColorVariables[color] = `$${variable}`
          delete result[color]
        }
      }
      fs.writeFileSync(compileFilePath, newColorsFileData)
      setColorVariableToSassFiles(resultColorVariables)
    }
  }

  const setColorVariableToSassFiles = (resultColorVariables) => {
    let endIndex = 0
    cacheSassFiles.forEach((path, index) => {
      fs.readFile(path, (err, data) => {
        let sassFileData = data.toString()
        cacheSassFileColors[index].forEach((color) => {
          sassFileData = sassFileData.replace(new RegExp(color, 'g'), resultColorVariables[color])
        })
        fs.writeFile(path, sassFileData, err => {
          if(err) {
            reject(false)
          }else {
            ++endIndex === cacheSassFiles.length && reslove(true)
          }
        })
      })
    })
  }

  const recordCacheSassData = (newPath, colors) => {
    if(newPath !== compileFilePath) {
      cacheSassFiles.push(newPath)
      cacheSassFileColors.push([...colors])
    }
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
        result['#' + color] ? result['#' + color].add(`[${fileName}]: ${style}`) : result['#' + color] = new Set([`[${fileName}]: ${style}`])
        colors.add('#' + color)
      }
      cur++
    }
    recordCacheSassData(newPath, colors)
    ++sassCompileCurrent === sassFileLength && setSassVariableToFile()
  }

  recursiveDir(rootPath, config, () => sassFileLength++, (fileName, path, data) => compiler(data, path, fileName))
})
