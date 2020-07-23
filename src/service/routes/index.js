const express = require('express')
const router = express.Router()
const compiler = require('./compiler')
const getFileColors = require('../utils/getFileColors')
const getConfig = require('../utils/getConfig')

router.post('/compiler', async (req, res) => {
  const { config } = req.body
  const ok = await compiler(config)
  if (ok === true) {
    res.status(200).send({
      message: '顏色更新成功',
      data: null
    })
  } else {
    res.status(400).send({
      message: '顏色更新失敗',
      data: null
    })
  }
})

router.post('/getColors', async (req, res) => {
  const { config } = req.body
  const { compileFilePath } = getConfig(config)
  const colorJson = await getFileColors(compileFilePath)
  const colors = []
  for (const color in colorJson) {
    const { variable, commit } = colorJson[color]
    colors.push({
      color, variable, commit
    })
  }
  res.status(200).send({
    message: '取得顏色成功',
    data: colors
  })
})

module.exports = router