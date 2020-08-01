import * as fs from 'fs'
import * as path from 'path'
import { iComputedConfig } from '../interfaces/config'

interface iReadFileBeforeCallback {
  (): void
}

interface iReadFileCallback {
  (fileName: string, filePath: string, fileData: string): void
}

interface iRecursiveDir {
  (config: iComputedConfig,
   readFileBeforeCallback: iReadFileBeforeCallback,
   readFileCallback: iReadFileCallback): void
}

const recursiveDir: iRecursiveDir = (config, readFileBeforeCallback, readFileCallback) => {
  const { rootPath, compileFile, fileExtensions } = config
  fs.readdir(rootPath, (err, files: string[]) => {
    files.forEach((fileName: string) => {
      const newPath = rootPath + fileName
      const fileExtensionName = path.extname(fileName)
      const isFolder = fs.lstatSync(rootPath + fileName).isDirectory()
      if (fileExtensions[fileExtensionName] && fileName !== compileFile && fileName !== 'variables.scss' && newPath.indexOf('vue-sidebar-menu') === -1) {
        readFileBeforeCallback()
        fs.readFile(newPath, (err, data) => {
          const fileData = data.toString()
          readFileCallback(fileName, newPath, fileData)
        })
      }
      if (isFolder && fileName !== 'node_modules') {
        recursiveDir({...config, rootPath: newPath + '/'},  readFileBeforeCallback, readFileCallback)
      }
    })
  })
}

export default recursiveDir