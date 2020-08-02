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
  const { rootPath, compileFile, fileExtensions }: iComputedConfig = config
  fs.readdir(rootPath, (_, files: string[]) => {
    files.forEach((fileName: string) => {
      const newPath: string = rootPath + fileName
      const fileExtensionName: string = path.extname(fileName)
      const isFolder: boolean = fs.lstatSync(rootPath + fileName).isDirectory()
      if (fileExtensions[fileExtensionName] && fileName !== compileFile && fileName !== 'variables.scss' && newPath.indexOf('vue-sidebar-menu') === -1) {
        readFileBeforeCallback()
        fs.readFile(newPath, (_, data) => {
          const fileData: string = data.toString()
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