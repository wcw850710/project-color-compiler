const express = require('express')
const router = express.Router()
const compiler = require('./compiler')
const fs = require('fs')
const getFileColors = require('../utils/getFileColors')
const getConfig = require('../utils/getConfig')
const createHash = require('../utils/createHash')
const recursiveDir = require('../utils/recursiveDir')

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
  const _config = getConfig(config)
  const { rootPath, compileFilePath, compileFileType } = _config

  // 覆蓋顏色
  const colorsString = colors.reduce((prev, {color, newVariable, commit}, index) => {
    const data = `$${newVariable.trim() !== '' ? newVariable.trim() : createHash()}: ${color}${compileFileType === 'scss' ? ';' : ''}${commit !== '' ? `// ${commit}`: ''}`
    return index === 0 ? data : prev + `\n${data}`
  }, '')
  fs.writeFileSync(compileFilePath, colorsString)


  // 遍歷調色變量
  let cacheFileLength = 0
  let doneFileLength = 0
  const replaceVariables = (data, path) => {
    colors.forEach(({ newVariable, oldVariable }) => {
      if(oldVariable !== '') {
        while(data.search(`\\$${oldVariable}`) !== -1) {
          data = data.replace(`$${oldVariable}`, `$${newVariable}`)
        }
      }
    })
    fs.writeFile(path, data, (err) => {
      ++doneFileLength === cacheFileLength && res.status(200).send({
        message: '覆蓋顏色成功',
        data: null
      })
    })
  }
  recursiveDir(rootPath, _config, () => cacheFileLength++, (fileName, path, data) => replaceVariables(data, path))
})



module.exports = router