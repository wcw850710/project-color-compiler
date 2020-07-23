module.exports = (_config) => new Promise((reslove, reject) => {
  const fs = require('fs')
  const getConfig = require('../utils/getConfig')
  const getRgbaColor = require("../utils/getRgbaColor")
  const getHashColor = require("../utils/getHashColor")
  const recursiveDir = require("../utils/recursiveDir")
  const createHash = require('../utils/createHash')
  const config = getConfig(_config)
  const {fileExtensions, compileFilePath, rootPath, compileFileType} = config
  const result = {}
  let cacheFile = []
  let cacheFileColors = []
  let cacheFileLength = 0
  let compileCurrent = 0

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
  const setVariableToFile = async () => {
    const resultColorVariables = {}
    let colorsFileData = await readColorsFileData()
    const colorsFileResult = compilerColorsFileData(colorsFileData)
    let newColorsFileData = ''
    if (Object.keys(result).length) {
      const isSass = fileExtensions['.sass'] === true
      const isScss = fileExtensions['.scss'] === true
      if(isSass || isScss) {
        const period = (compileFileType === 'scss' ? ';' : '') + '\n'
        for (const color in colorsFileResult) {
          if(result[color]) {
            const variable = colorsFileResult[color]
            newColorsFileData += `$${variable}: ${color}${period}`
            resultColorVariables[color] = `$${variable}`
            delete result[color]
          }
        }
        for (const color in result) {
          if(!colorsFileResult[color]) {
            const variable = createHash()
            newColorsFileData += `$${variable}: ${color}${period}`
            resultColorVariables[color] = `$${variable}`
            delete result[color]
          }
        }
      }
      fs.writeFileSync(compileFilePath, newColorsFileData)
      setColorVariableToFiles(resultColorVariables)
    }
  }

  // 最後一部：遍歷所有 file，將顏色轉成變量
  const setColorVariableToFiles = (resultColorVariables) => {
    let endIndex = 0
    cacheFile.forEach((path, index) => {
      fs.readFile(path, (err, data) => {
        let fileData = data.toString()
        cacheFileColors[index].forEach((color) => {
          fileData = fileData.replace(new RegExp(color, 'g'), resultColorVariables[color])
        })
        fs.writeFile(path, fileData, err => {
          if(err) {
            reject(false)
          }else {
            ++endIndex === cacheFile.length && reslove(true)
          }
        })
      })
    })
  }

  // 將遍歷到的 file 路徑及顏色緩存起來，到最後一步遍歷 file 時可以提速
  const recordCacheData = (newPath, colors) => {
    if(newPath !== compileFilePath) {
      cacheFile.push(newPath)
      cacheFileColors.push([...colors])
    }
  }

  // 將遍歷到的 fileData 轉成 Set(cache) 及 json(result) 格式，好讓後面調用
  const compiler = (input, path, fileName) => {
    let cur = 0
    let colorIndex = 0
    let colors = new Set()
    while (cur < input.length) {
      const txt = input[cur]
      if (txt === ':') {
        colorIndex = cur
      } else if (txt === 'r') {
        const [color, isRgba] = getRgbaColor(input, cur)
        if (isRgba) {
          result[color] !== true && (result[color] = true)
          colors.add(color)
        }
      } else if (txt === '#') {
        const color = `#${getHashColor(input, cur)}`
        result[color] !== true && (result[color] = true)
        colors.add(color)
      }
      cur++
    }
    console.log(1, colors)
    console.log(2, result)
    return reslove(true)
    recordCacheData(path, colors)
    ++compileCurrent === cacheFileLength && setVariableToFile()
  }

  // 循環遍歷所有檔案，跟路徑從 rootPath 開始
  recursiveDir(rootPath, config, () => cacheFileLength++, (fileName, path, data) => compiler(data, path))
})
