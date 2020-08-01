export interface iOriginConfig {
  fileExtensions: string[]
  rootPath: string
  compilePath: string
  compileFile: [string, string]
  isAutoImport: boolean
}

export interface iComputedConfig {
  fileExtensions: {[dotExtension: string]: boolean}
  rootPath: string
  compilePath: string
  compileFile: string
  compileFileName: string
  compileFileType: string
  compileFilePath: string
  isAutoImport: boolean
}