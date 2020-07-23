const express = require('express')
const router = express.Router()
const compiler = require('./compiler')

router.post('/compiler', async (req, res) => {
  const { config } = req.body
  const ok = await compiler(config)
  if (ok === true) {
    res.status(200).send('顏色更新成功')
  } else {
    res.status(400).send('顏色更新失敗')
  }
})

module.exports = router