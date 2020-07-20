const fs = require('fs')
const path = require('path')
const compilerFolderPath = path.resolve(__dirname)
const result = {}
let cacheSassFiles = []
let cacheSassFileColors = []
let sassFileLength = 0
let sassCompileCurrent = 0
const config = JSON.parse((fs.readFileSync(`${compilerFolderPath}/conf.json`)).toString())
const fileExtensions = config['file-extensions']
const compileFile = config['compile-file'].join('.')
const compilePath = config['compile-path']
//TODO: 變例檔案更改顏色為變亮；支援 SASS, VUE, SCSS, JS 副檔名
const setSassVariableToFile = () => {
  let index = 0
  let data = ''
  const resultColorVariables = {}
  for (const color in result) {
    index++
    const commit = '// ' +  [...result[color]].join(', ')
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
      fs.writeFile(path, sassFileData, (err) => {})
    })
  })
}
const recordCacheSassData = (newPath, colors) => {
  cacheSassFiles.push(newPath)
  cacheSassFileColors.push([...colors])
}
const compiler = (input, newPath) => {
  let cur = 0
  let colonIndex = 0
  let colors = new Set()
  while (cur < input.length) {
    const txt = input[cur]
    if (txt === ':') {
      colonIndex = cur
    } else if (txt === '#') {
      let color = ''
      let style = ''
      while(input[++cur] !== undefined && /[0-9A-z]/.test(input[cur])){
        color+=input[cur]
      }
      while (/[A-z\-]/.test(input[--colonIndex])) {
        style = input[colonIndex] + style
      }
      result['#' + color] ? result['#' + color].add(style) : result['#' + color] = new Set([style])
      colors.add('#' + color)
    }
    cur++
  }
  recordCacheSassData(newPath, colors)
  ++sassCompileCurrent === sassFileLength && setSassVariableToFile()
}
const folderCheck = (_path) => {
  fs.readdir(_path, (err, files) => {
    files.forEach((fileName) => {
      const newPath = _path + fileName
      const fileExtensionName = path.extname(fileName)
      const isFolder = fs.lstatSync(_path + fileName).isDirectory()
      if (fileExtensionName === '.sass' && fileName !== compileFile) {
        sassFileLength++
        fs.readFile(newPath, (err, data) => {
          const sassData = data.toString()
          compiler(sassData, newPath)
        })
      }
      if (isFolder) {
        folderCheck(newPath + '/')
      }
    })
  })
}
const fileWatcher = async () => {
  let rootPath = './'
  folderCheck(rootPath)
}
fileWatcher()