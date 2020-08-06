import * as path from 'path'
import * as fs from 'fs'
import {iExpressRoute} from "../interfaces/route";

interface iFolders {
  name: string
  extensions: string
  isDirectory: boolean
}

const getFilePath: iExpressRoute = async (req, res) => {
  const { path: filePath } = req.query as { path: string }
  const paths = await new Promise<iFolders[]>(async (resolve) => {
    const absPath = path.resolve(filePath)
    try {
      const paths: string[] = await fs.readdirSync(absPath)
      const folders: iFolders[] = []
      // .map(f => ({ name: f, extensions: path.extname(f), isDirectory: fs.lstatSync(filePath + f).isDirectory()}))
      paths.forEach(function (filename, index) {
        const filedir: string = path.resolve(filePath, filename);
        fs.stat(filedir, function (error, stats) {
          if (error) {
            if (index === paths.length - 1)
              resolve(folders)
          } else {
            const isFile: boolean = stats.isFile();
            const isDir: boolean = stats.isDirectory();
            if (isFile) {
            }
            if (isDir) {
              folders.push({name: filename, extensions: '', isDirectory: true})
            }
            if (index === paths.length - 1)
              resolve(folders)
          }
        })
      });
    } catch(err) {
      resolve([])
    }
  })
  try {
    res.status(200).send({
      message: '路徑獲取成功',
      data: paths
    })
  }catch (err) {
    res.status(400).send({
      message: '找不到路徑',
      data: []
    })
  }
}

export default getFilePath