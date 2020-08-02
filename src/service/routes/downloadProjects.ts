import * as fs from 'fs'
import * as path from 'path'
import createHash from '../utils/createHash'
import {iExpressRoute} from "../interfaces/route";

export const before: iExpressRoute = (req, res) => {
  const { data }: { data: string } = req.body
  const hashFileName: string = `export-${createHash()}.json`
  const filePath: string = path.relative('./', `export-projects-cache/${hashFileName}`)
  try{
    fs.writeFileSync(filePath, data)
    res.status(200).send({
      message: '取得下載連結成功',
      data: hashFileName
    })
  }catch(err) {
    console.log(err)
    res.status(400).send({
      message: '取得下載連結失敗',
      data: null
    })
  }
}
export const download: iExpressRoute = (req, res) => {
  const filePath = path.relative('./', `export-projects-cache/${req.query.fileName}`)
  res.download(filePath, `專案顏色數據.json`, err => {
    if(err) {
      console.log(err)
    }else {
      fs.unlinkSync(filePath)
    }
  })
}
