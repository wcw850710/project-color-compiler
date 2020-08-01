const fs = require('fs')
import recursiveDir from '../utils/recursiveDir'
import getConfig from '../utils/getConfig'
import createHash from '../utils/createHash'
// const getColorJSON = require('../utils/getColorJSON')
export default async (req, res) => {
  const { config, colors } = req.body
  const _config = getConfig(config)
  const { compileFilePath, compileFileType } = _config

  // 覆蓋顏色
  const colorsString = colors.reduce((prev, {color, newVariable, commit}, index) => {
    const data = `$${newVariable.trim() !== '' ? newVariable.trim() : createHash()}: ${color.trim() === '' ? '#000' : color}${compileFileType === 'scss' ? ';' : ''}${commit !== '' ? `// ${commit}`: ''}`
    return index === 0 ? data : prev + `\n${data}`
  }, '')
  fs.writeFile(compileFilePath, colorsString, err => {})


  // 遍歷調色變量
  let cacheFileLength = 0
  let doneFileLength = 0
  const replaceVariables = (data, path) => {
    colors.forEach(({ newVariable, oldVariable }) => {
      if(oldVariable !== '' && oldVariable !== newVariable) {
        while(data.search(`\\$${oldVariable}`) !== -1) {
          data = data.replace(new RegExp(`\\$${oldVariable}`, 'gm'), `$${newVariable}`)
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
  recursiveDir(_config, () => cacheFileLength++, (fileName, path, data) => replaceVariables(data, path))
}