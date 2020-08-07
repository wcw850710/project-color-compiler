import * as fs from 'fs'
import * as path from 'path'
import createHash from '../utils/createHash'
import {iExpressRoute} from "../interfaces/route";
import {sendResponse} from "../utils/sendResponse";

const nodeEnviroment: string = process.env.NODE_ENV as string
const isProduction: boolean = nodeEnviroment === 'production'
const prePath: string = isProduction ? `./service/` : `./src/export-projects-cache/`
const filePath: (hashFileName: string) => string = hashFileName => path.relative('./', `${prePath}${hashFileName}`)

export const before: iExpressRoute = (req, res) => {
  const { data }: { data: string } = req.body
  const hashFileName: string = `export-${createHash()}.json`
  try{
    fs.writeFileSync(filePath(hashFileName), data)
    sendResponse(res, {
      status: 200,
      message: '取得下載連結成功',
      data: hashFileName
    })
  }catch(err) {
    console.log(err)
    sendResponse(res, {
      status: 400,
      message: '取得下載連結失敗',
      data: null
    })
  }
}
export const download: iExpressRoute = (req, res) => {
  const hashFileName: string = req.query.fileName as string
  res.download(filePath(hashFileName), `專案顏色數據.json`, err => {
    if(err) {
      console.log(err)
    }else {
      fs.unlinkSync(filePath(hashFileName))
    }
  })
}
