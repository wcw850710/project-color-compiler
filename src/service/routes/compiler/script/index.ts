import {iComputedConfig, iOriginConfig} from "../../../interfaces/config";
import {iResolve} from "../interfaces/resolve";
import recursiveDir from "../../../utils/recursiveDir";
import getConfig from "../../../utils/getConfig";

const compile = (input: string, path: string) => {
  console.log(input, path)
}

export const scriptCompile = (_config: iOriginConfig): Promise<iResolve> => new Promise((resolve, _) => {
  const config: iComputedConfig = getConfig(_config)
  // const {fileExtensions, compileFilePath, compileFileType}: iComputedConfig = config
  // let cacheFile: string[] = []
  // let cacheFileColors: iColors[][] = []
  let cacheFileLength: number = 0
  let compileCurrent: number = 0

  // 循環遍歷所有檔案，跟路徑從 rootPath 開始
  recursiveDir(config, () => cacheFileLength++, (_, path, data) => compile(data, path))

  setTimeout(() => {
    if (compileCurrent === 0) {
      resolve({status: 400, message: '找不到檔案'})
    }
  }, 2000)
})