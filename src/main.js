const getStyleName = require("./utils/getStyleName")
const getColor = require("./utils/getColor")
const recursiveDir = require("./utils/recursiveDir")
const fs = require('fs')
const path = require('path')
const result = {}
let cacheSassFiles = []
let cacheSassFileColors = []
let sassFileLength = 0
let sassCompileCurrent = 0
const compilerFolderPath = path.resolve(__dirname)
const config = JSON.parse((fs.readFileSync(`${compilerFolderPath}/conf.json`)).toString())
const fileExtensions = config['file-extensions']
const compileFile = config['compile-file'].join('.')
const compilePath = config['compile-path']
// const {fileExtensions, compileFile, compilePath} = require('./utils/getConfigData')

//TODO: 變例檔案更改顏色為變亮；支援 SASS, VUE, SCSS, JS 副檔名
const setSassVariableToFile = () => {
  let index = 0
  let data = ''
  const resultColorVariables = {}
  for (const color in result) {
    index++
    const commit = '// ' + [...result[color]].join(', ')
    data += `$color_${index}: ${color} ${commit}\n`
    resultColorVariables[color] = `$color_${index}`
  }
  fs.writeFileSync(compilePath + compileFile, data)
  setColorVariableToSassFiles(resultColorVariables)
}

const setColorVariableToSassFiles = (resultColorVariables) => {
  cacheSassFiles.forEach((path, index) => {
    fs.readFile(path, (err, data) => {
      let sassFileData = data.toString()
      cacheSassFileColors[index].forEach((color) => {
        sassFileData = sassFileData.replace(new RegExp(color, 'g'), resultColorVariables[color])
      })
      // fs.writeFile(path, sassFileData, (err) => {})
    })
  })
}

const recordCacheSassData = (newPath, colors) => {
  cacheSassFiles.push(newPath)
  cacheSassFileColors.push([...colors])
}

const compiler = (input, newPath) => {
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
      result['#' + color] ? result['#' + color].add(style) : result['#' + color] = new Set([style])
      colors.add('#' + color)
    }
    cur++
  }
  recordCacheSassData(newPath, colors)
  ++sassCompileCurrent === sassFileLength && setSassVariableToFile()
}

recursiveDir('./', () => sassFileLength++, (path, data) => compiler(data, path))