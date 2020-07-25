const path = require('path')
const fs = require('fs')
module.exports = filePath => new Promise(async (reslove) => {
  const absPath = path.resolve(filePath)
  const paths = await fs.readdirSync(absPath)
  const folders = []
  // .map(f => ({ name: f, extensions: path.extname(f), isDirectory: fs.lstatSync(filePath + f).isDirectory()}))
  paths.forEach(function (filename, index) {
    const filedir = path.resolve(filePath, filename);
    fs.stat(filedir, function (error, stats) {
      if (error) {
        if(index === paths.length - 1)
          reslove(folders)
      } else {
        const isFile = stats.isFile();
        const isDir = stats.isDirectory();
        if (isFile) {
        }
        if (isDir) {
          folders.push({ name: filename, extensions: '', isDirectory: true })
        }
        if(index === paths.length - 1)
          reslove(folders)
      }
    })
  });
})