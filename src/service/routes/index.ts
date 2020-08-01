import * as express from 'express'
const router = express.Router()
import compiler from './compiler'
// import * as fs from 'fs'
// import * as createHash from '../utils/createHash'
import getColors from './getColors'
import getFilePath from './getFilePath'
import translateColorsAndVariables from './translateColorsAndVariables'
import { before as beforeDownloadProjectsJSON, download as downloadProjectsJSON } from './downloadProjects'

// (主要 API) 交叉編輯
router.post('/compiler', async (req, res) => {
  const { config } = req.body
  const { status, message } = await compiler(config)
  res.status(status).send({
    message: message,
    data: null
  })
})

// 取得顏色
router.post('/getColors', getColors)

// 取代所有顏色及變量
router.post('/translateColorsAndVariables', translateColorsAndVariables)

// 廢棄，新增顏色時新增在後
// router.post('/addColors', async (req, res) => {
//   const { config, colors } = req.body
//   const { compileFilePath, compileFileType } = getConfig(config)
//   const newColorsString = colors.reduce((prev, {color, variable, commit}, index) => {
//     const data = `$${variable.trim() !== '' ? variable.trim() : createHash()}: ${color}${compileFileType === 'scss' ? ';' : ''}${commit !== '' ? `// ${commit}`: ''}`
//     return index === 0 ? data : prev + `\n${data}`
//   }, '')
//   try {
//     const fileData = fs.readFileSync(compileFilePath).toString()
//     const isNewLine = fileData.trim().length > 1
//     let newFileData = ''
//     if(isNewLine) newFileData = fileData + `\n${newColorsString}`
//     else newFileData = newColorsString
//     fs.writeFileSync(compileFilePath, newFileData)
//   } catch(err) {
//     fs.writeFileSync(compileFilePath, newColorsString)
//   }
//   res.status(200).send({
//     message: '新增顏色成功',
//     data: 'colors'
//   })
// })

// 設定時用的本地檔案路徑
router.get('/getFilePath', async (req, res) => {
  const { path: filePath } = req.query
  const paths = await getFilePath(filePath)
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
})

// 匯出專案 json
router.post('/beforeDownload', beforeDownloadProjectsJSON)
router.get('/download', downloadProjectsJSON)

// 匯入專案
router.post('/importProject', (req, res) => {
  const { buffer } = req.file
  const data = JSON.parse(buffer.toString())
  res.status(200).send({
    message: '哈囉',
    data
  })
})

// TODO 過濾顏色 api
export default router