module.exports = (_config) => new Promise((reslove, reject) => {
  const fs = require('fs')
  const getConfig = require('../utils/getConfig')
  const getColor = require("../utils/getColor")
  const recursiveDir = require("../utils/recursiveDir")
  const createHash = require('../utils/createHash')
  const config = getConfig(_config)
  const {compileFilePath, rootPath} = config
  const result = {}
  let cacheSassFiles = []
  let cacheSassFileColors = []
  let sassFileLength = 0
  let sassCompileCurrent = 0

  // 讀取 colors file 變倒出 fileData: string
  const readColorsFileData = () => new Promise(reslove => {
    try{
      const data = fs.readFileSync(compileFilePath)
      reslove(data.toString())
    }catch (err) {
      reslove('')
    }
  })

  // 將 colors file 原數據從 string 轉換成 json
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

  // 倒數第二步：將變量數據創建到對應的 colors file
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

  // 最後一部：遍歷所有 sass file，將顏色轉成變量
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

  // 將遍歷到的 sass file 路徑及顏色緩存起來，到最後一步遍歷 sass file 時可以提速
  const recordCacheSassData = (newPath, colors) => {
    if(newPath !== compileFilePath) {
      cacheSassFiles.push(newPath)
      cacheSassFileColors.push([...colors])
    }
  }

  // 將遍歷到的 sass fileData 轉成 Set(cache) 及 json(result) 格式，好讓後面調用
  const compiler = (input, path, fileName) => {
    let cur = 0
    let colorIndex = 0
    let colors = new Set()
    while (cur < input.length) {
      const txt = input[cur]
      if (txt === ':') {
        colorIndex = cur
      } else if (txt === '#') {
        const color = getColor(input, cur)
        result['#' + color] !== true && (result['#' + color] = true)
        colors.add('#' + color)
      }
      cur++
    }
    recordCacheSassData(path, colors)
    ++sassCompileCurrent === sassFileLength && setSassVariableToFile()
  }

  // 循環遍歷所有檔案，跟路徑從 rootPath 開始
  recursiveDir(rootPath, config, () => sassFileLength++, (fileName, path, data) => compiler(data, path))
})
