import {iComputedConfig} from "../../interfaces/config";

type iColors = {
  [color: string]: string
}

export const createColorDeclare = (config: iComputedConfig, colors: iColors, suffix: string = "',") => {
  const {compileFileType, compileFileName}: iComputedConfig = config
  const fileName: string = compileFileName
  const colorsKeys: string[] = Object.keys(colors)
  let result = `export const ${fileName}`
  if (compileFileType === 'ts') {
    result = `interface iColor { [variable: string]: string }\n\n${result}: iColor`
  }
  result += ` = {`
  if (colorsKeys.length > 0) {
    result += '\n'
    colorsKeys.forEach(color => {
      const variable = colors[color]
      result += `  ${variable}: '${color}${suffix}\n`
    })
  }
  result += '}'
  return result
}