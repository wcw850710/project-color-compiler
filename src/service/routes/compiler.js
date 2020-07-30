module.exports = (_config) => new Promise((reslove, reject) => {
  const fs = require('fs')
  const getConfig = require('../utils/getConfig')
  const getRgbaColor = require("../utils/getRgbaColor")
  const getHashColor = require("../utils/getHashColor")
  const recursiveDir = require("../utils/recursiveDir")
  const createHash = require('../utils/createHash')
  const getFileColors = require('../utils/getFileColors')
  const autoImport = require('../utils/autoImport')
  const getPathExtension = require('../utils/getPathExtension')
  const getVueStyle = require('../utils/getVueStyle')
  const config = getConfig(_config)
  const {fileExtensions, compileFilePath, rootPath, compileFileType, isAutoImport} = config
  const result = {}
  let cacheFile = []
  let cacheFileColors = []
  let cacheFileLength = 0
  let compileCurrent = 0

  // 倒數第二步：將變量數據創建到對應的 colors file
  const setVariableToCompileFile = async () => {
    const resultColorVariables = {}
    const colorsFileData = await getFileColors(compileFilePath)
    let colorsFileResult = ''
    if (Object.keys(result).length) {
      // TODO 這裡判斷待修正，多餘的判斷欠砍
      const isSass = fileExtensions['.sass'] === true
      const isScss = fileExtensions['.scss'] === true
      const isVue = fileExtensions['.vue'] === true
      if (isSass || isScss || isVue) {
        for (const color in colorsFileData) {
          const { variable, commit } = colorsFileData[color]
          const period = (compileFileType === 'scss' ? `;` : '') + `${commit ? ` // ${commit}` : ''}\n`
          colorsFileResult += `$${variable}: ${color}${period}`
          resultColorVariables[color] = `$${variable}`
          if (result[color]) {
            delete colorsFileData[color]
            delete result[color]
          } else {
            delete colorsFileData[color]
          }
        }
        for (const color in result) {
          const period = (compileFileType === 'scss' ? ';' : '') + '\n'
          const noSpaceColor = color.replace(/\s/g, '')
          if(colorsFileData[noSpaceColor]) {
            const { variable } = colorsFileData[noSpaceColor]
            colorsFileResult += `$${variable}: ${noSpaceColor}${period}`
            resultColorVariables[noSpaceColor] = `$${variable}`
            delete colorsFileData[noSpaceColor]
            delete result[color]
          } else if(!resultColorVariables[noSpaceColor]) {
            const variable = createHash()
            colorsFileResult += `$${variable}: ${noSpaceColor}${period}`
            resultColorVariables[noSpaceColor] = `$${variable}`
            delete result[color]
          } else {
            delete result[color]
          }
        }
      }
      fs.writeFileSync(compileFilePath, colorsFileResult)
      transformAllFilesColorToVariable(resultColorVariables)
    } else {
      return reslove({ status: 200, message: '顏色更新成功' })
    }
  }

  // 最後一部：遍歷所有 file，將顏色轉成變量
  const transformAllFilesColorToVariable = (resultColorVariables) => {
    let endIndex = 0
    // 將數據轉成顏色最長的在前
    const flatAndSortColorsFromStringLength = colors => colors.reduce((prev, color) => typeof color === 'string' ? [...prev, color] : [...prev, ...color], []).sort((a, b) => b.length > a.length ? 1 : -1)
    cacheFile.forEach((path, index) => {
      fs.readFile(path, (err, data) => {
        const extension = getPathExtension(path)
        const isVueFile = extension === 'vue'
        let fileData = data.toString()
        let { styleTagStartIndex: vueStyleTagStartIndex,
          styleTagEndIndex: vueStyleTagEndIndex,
          styleData: vueStyleData
        } = isVueFile ? getVueStyle.compile(fileData) : {}
        let fileResult = ''
        flatAndSortColorsFromStringLength(cacheFileColors[index]).forEach((color) => {
          if (isVueFile) {
            vueStyleData = vueStyleData.split(color).join(resultColorVariables[color.replace(/\s/g, '')])
          } else {
            fileData = fileData.split(color).join(resultColorVariables[color.replace(/\s/g, '')])
          }
        })
        if (isVueFile) {
          vueStyleData = autoImport(extension, path, vueStyleData, config)
          fileResult = fileData.substring(vueStyleTagStartIndex, 0) + vueStyleData + fileData.substring(vueStyleTagEndIndex)
        } else {
          fileData = autoImport(extension, path, fileData, config)
          fileResult = fileData
        }
        fs.writeFile(path, fileResult, err => {
          if (err) {
            reject(false)
          } else {
            ++endIndex === cacheFile.length && reslove({ status: 200, message: '顏色更新成功' })
          }
        })
      })
    })
    return reslove({ status: 200, message: '顏色更新成功' })
  }

  // 將遍歷到的 file 路徑及顏色緩存起來，到最後一步遍歷 file 時可以提速
  const recordCacheData = (path, colors) => {
    if (path !== compileFilePath && colors.size > 0) {
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
      cacheFile.push(path)
      cacheFileColors.push(Object.values(uniqueColors))
    }
  }

  // 將遍歷到的 fileData 轉成 Set(cache) 及 json(result) 格式，好讓後面調用
  const compiler = (input, path, fileName) => {
    let cur = 0
    let colorIndex = 0
    let colors = new Set()
    const isVue = getPathExtension(path) === 'vue'
    let styleTagStartIndex = 0
    let styleTagEndIndex = 0
    let hasVueStyleTag = false
    const whileCondition = () => isVue ? cur > styleTagStartIndex && cur < styleTagEndIndex && hasVueStyleTag === true : cur < input.length
      // 如果是 vue 檔，跑一波初始值定義
    ;(function initCurIndex () {
      if(isVue) {
        // 從 style tag 裡開始計算
        const {styleTagStartIndex: _styleTagStartIndex, styleTagEndIndex: _styleTagEndIndex} = getVueStyle.compile(input)
        styleTagStartIndex = _styleTagStartIndex
        styleTagEndIndex = _styleTagEndIndex
        cur = styleTagStartIndex + 1
        styleTagStartIndex !== -1 && (hasVueStyleTag = true)
      }
    })()
    while (whileCondition()) {
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
  recursiveDir(config, () => cacheFileLength++, (fileName, path, data) => compiler(data, path))

  setTimeout(() => {
    if(compileCurrent === 0) {
      reslove({ status: 400, message: '找不到檔案' })
    }
  }, 2000)
})
