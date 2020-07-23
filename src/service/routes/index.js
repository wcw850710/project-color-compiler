const express = require('express')
const router = express.Router()
const compiler = require('./compiler')
const fs = require('fs')
const getFileColors = require('../utils/getFileColors')
const getConfig = require('../utils/getConfig')
const createHash = require('../utils/createHash')

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

router.post('/addColors', async (req, res) => {
  const { config, colors } = req.body
  const { compileFilePath, compileFileType } = getConfig(config)
  const newColorsString = colors.reduce((prev, {color, variable, commit}, index) => {
    const data = `$${variable.trim() !== '' ? variable.trim() : createHash()}: ${color}${compileFileType === 'scss' ? ';' : ''}${commit !== '' ? `// ${commit}`: ''}`
    return index === 0 ? data : prev + `\n${data}`
  }, '')
  try {
    const fileData = fs.readFileSync(compileFilePath).toString()
    const isNewLine = fileData.trim().length > 1
    let newFileData = ''
    if(isNewLine) newFileData = fileData + `\n${newColorsString}`
    else newFileData = newColorsString
    fs.writeFileSync(compileFilePath, newFileData)
  } catch(err) {
    fs.writeFileSync(compileFilePath, newColorsString)
  }
  res.status(200).send({
    message: '新增顏色成功',
    data: 'colors'
  })
})

router.post('/replaceColors', async (req, res) => {
  const { config, colors } = req.body
  const { compileFilePath, compileFileType } = getConfig(config)
  const newColorsString = colors.reduce((prev, {color, variable, commit}, index) => {
    const data = `$${variable.trim() !== '' ? variable.trim() : createHash()}: ${color}${compileFileType === 'scss' ? ';' : ''}${commit !== '' ? `// ${commit}`: ''}`
    return index === 0 ? data : prev + `\n${data}`
  }, '')
  console.log(router)
  res.status(200).send({
    message: '覆蓋顏色成功',
    data: 'colors'
  })
  fs.writeFileSync(compileFilePath, newColorsString)
  res.status(200).send({
    message: '覆蓋顏色成功',
    data: 'colors'
  })
})



module.exports = router