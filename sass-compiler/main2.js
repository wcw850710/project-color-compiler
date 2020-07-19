const fs = require('fs')
const path = require('path')
const result = {}
let sassFileLength = 0
let sassAfterFileLength = 0
let sassFileData = ''
let sassFileLengthWatcher = {}
Object.defineProperty(sassFileLengthWatcher, 'len', {
  get() {
    return sassAfterFileLength
  },
  set(len) {
    if (len === sassFileLength) {
      compiler(sassFileData)
    }
    sassAfterFileLength = len
  }
})
const compiler = (input) => {
  let cur = 0
  let colonIndex = 0
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
    }
    cur++
  }
  console.log(result)
}
const concatSassFileData = (input) => {
  sassFileData += '\n' + input
  sassFileLengthWatcher.len = sassAfterFileLength + 1
}
const folderCheck = (_path) => {
  fs.readdir(_path, (err, files) => {
    files.forEach((fileName) => {
      const newPath = _path + fileName
      const fileExtensionName = path.extname(fileName)
      const isFolder = fs.lstatSync(_path + fileName).isDirectory()
      if (fileExtensionName === '.sass') {
        sassFileLength++
        fs.readFile(newPath, (err, data) => {
          const sassData = data.toString()
          concatSassFileData(sassData)
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