import * as fs from 'fs'
import {iComputedConfig} from "../../interfaces/config";
interface iResult {
  [variable: string]: string
}

// 將 colors file 原數據從 string 轉換成 json (暫時沒用)
export const compileSass = ({ compileFilePath }: iComputedConfig) => new Promise<iResult | boolean>(resolve =>  {
  try{
    const sassFileData: string = (fs.readFileSync(compileFilePath)).toString()
    const result: iResult = {}
    const matchVariableAndColors: RegExpMatchArray | null = sassFileData.match(/(\$[A-z0-9-_]*)|(:\s?[#|A-z0-9(,#\.)\s;^\n]*)/g)
    if(matchVariableAndColors !== null) {
      for (let i = 0; i < matchVariableAndColors.length; i++) {
        const variable: string = matchVariableAndColors[i].substr(1, matchVariableAndColors[i].length)
        const color: string = matchVariableAndColors[++i].replace(/[:\s\n;]/g, '')
        result[variable] = color
      }
    }
    resolve(result)
  }catch (err) {
    resolve(false)
  }
})