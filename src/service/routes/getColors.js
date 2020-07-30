const getFileColors = require('../utils/getFileColors')
const getConfig = require('../utils/getConfig')

module.exports = async (req, res) => {
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
}