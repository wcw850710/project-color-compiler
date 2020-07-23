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
    try {
      const data = fs.readFileSync(compileFilePath)
      reslove(data.toString())
    } catch (err) {
      reslove('')
    }
  })

  // 將 colors file 原數據從 string 轉換成 json
  const compilerColorsFileData = input => {
    const result = {}
    const matchVariableAndColors = input.match(/(\$[A-z0-9-_]*)|(:\s?[#|A-z0-9(,#\.)\s;^\n]*)/g)
    for (let i = 0; i < matchVariableAndColors.length; i++) {
      const variable = matchVariableAndColors[i].substr(1, matchVariableAndColors[i].length)
      const color = matchVariableAndColors[++i].replace(/[:\s\n;]/g, '')
      result[color] = variable
    }
    return result
  }

  // 倒數第二步：將變量數據創建到對應的 colors file
  const setVariableToCompileFile = async () => {
    const resultColorVariables = {}
    let colorsFileData = await readColorsFileData()
    const colorsFileResult = compilerColorsFileData(colorsFileData)
    let newColorsFileData = ''
    if (Object.keys(result).length) {
      const isSass = fileExtensions['.sass'] === true
      const isScss = fileExtensions['.scss'] === true
      if (isSass || isScss) {
        const period = (compileFileType === 'scss' ? ';' : '') + '\n'
        for (const color in colorsFileResult) {
          if (result[color]) {
            const variable = colorsFileResult[color]
            newColorsFileData += `$${variable}: ${color}${period}`
            resultColorVariables[color] = `$${variable}`
            delete colorsFileResult[color]
            delete result[color]
          }
        }
        for (const color in result) {
          const noSpaceColor = color.replace(/\s/g, '')
          if(colorsFileResult[noSpaceColor]) {
            const variable = colorsFileResult[noSpaceColor]
            newColorsFileData += `$${variable}: ${noSpaceColor}${period}`
            resultColorVariables[noSpaceColor] = `$${variable}`
            delete colorsFileResult[noSpaceColor]
            delete result[color]
          } else if(!resultColorVariables[noSpaceColor]) {
            const variable = createHash()
            newColorsFileData += `$${variable}: ${noSpaceColor}${period}`
            resultColorVariables[noSpaceColor] = `$${variable}`
            delete result[color]
          } else {
            delete result[color]
          }
        }
      }
      fs.writeFileSync(compileFilePath, newColorsFileData)
      transformAllFilesColorToVariable(resultColorVariables)
    }
  }

  // 最後一部：遍歷所有 file，將顏色轉成變量
  const transformAllFilesColorToVariable = (resultColorVariables) => {
    let endIndex = 0
    // 將數據轉成顏色最長的在前
    const flatAndSortColorsFromStringLength = colors => colors.reduce((prev, color) => typeof color === 'string' ? [...prev, color] : [...prev, ...color], []).sort((a, b) => b.length > a.length ? 1 : -1)
    cacheFile.forEach((path, index) => {
      fs.readFile(path, (err, data) => {
        let fileData = data.toString()
        flatAndSortColorsFromStringLength(cacheFileColors[index]).forEach((color) => {
          fileData = fileData.split(color).join(resultColorVariables[color.replace(/\s/g, '')])
        })
        fs.writeFile(path, fileData, err => {
          if (err) {
            reject(false)
          } else {
            ++endIndex === cacheFile.length && reslove(true)
          }
        })
      })
    })
    return reslove(true)
  }

  // 將遍歷到的 file 路徑及顏色緩存起來，到最後一步遍歷 file 時可以提速
  const recordCacheData = (newPath, colors) => {
    if (newPath !== compileFilePath) {
      const setToColors = [...colors]
      const uniqueColors = {}
      setToColors.forEach(color => {
        if (/rgba/.test(color) === true) {
          const noSpaceColor = color.replace(/\s/g, '')
          if (uniqueColors[noSpaceColor] !== undefined) {
            uniqueColors[noSpaceColor].push(color)
          } else {
            uniqueColors[noSpaceColor] = [color]
          }
        } else {
          uniqueColors[color] = color
        }
      })
      cacheFile.push(newPath)
      cacheFileColors.push(Object.values(uniqueColors))
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
        const [color, isRgba] = getRgbaColor(input, cur, index => (cur = index))
        if (isRgba) {
          result[color] !== true && (result[color] = true)
          colors.add(color)
        }
      } else if (txt === '#') {
        const color = `#${getHashColor(input, cur, index => (cur = index))}`
        result[color] !== true && (result[color] = true)
        colors.add(color)
      }
      cur++
    }
    recordCacheData(path, colors)
    ++compileCurrent === cacheFileLength && setVariableToCompileFile()
  }

  // 循環遍歷所有檔案，跟路徑從 rootPath 開始
  recursiveDir(rootPath, config, () => cacheFileLength++, (fileName, path, data) => compiler(data, path))
})
