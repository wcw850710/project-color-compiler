import * as fs from 'fs'
import createHash from '../utils/createHash'

export default {
  before: (req, res) => {
    const { data } = req.body
    const hashFileName = `export-${createHash()}.json`
    const filePath = `./src/service/export-projects-cache//${hashFileName}`
    try{
      fs.writeFileSync(filePath, data)
      res.status(200).send({
        message: '取得下載連結成功',
        data: hashFileName
      })
    }catch(err) {
      res.status(400).send({
        message: '取得下載連結失敗',
        data: null
      })
    }
  },
  download: (req, res) => {
    const path = `./src/service/export-projects-cache/` + req.query.fileName
    res.download(path, `專案顏色數據.json`, err => {
      if(err) {
        console.log(err)
      }else {
        fs.unlinkSync(path)
      }
    })
  }
}