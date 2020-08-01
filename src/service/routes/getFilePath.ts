import * as path from 'path'
import * as fs from 'fs'

interface iFolders {
  name: string
  extensions: string
  isDirectory: boolean
}

export default filePath => new Promise(async (reslove) => {
  const absPath = path.resolve(filePath)
  try {
    const paths = await fs.readdirSync(absPath)
    const folders: iFolders[] = []
    // .map(f => ({ name: f, extensions: path.extname(f), isDirectory: fs.lstatSync(filePath + f).isDirectory()}))
    paths.forEach(function (filename, index) {
      const filedir = path.resolve(filePath, filename);
      fs.stat(filedir, function (error, stats) {
        if (error) {
          if (index === paths.length - 1)
            reslove(folders)
        } else {
          const isFile = stats.isFile();
          const isDir = stats.isDirectory();
          if (isFile) {
          }
          if (isDir) {
            folders.push({name: filename, extensions: '', isDirectory: true})
          }
          if (index === paths.length - 1)
            reslove(folders)
        }
      })
    });
  } catch(err) {
    reslove([])
  }
})