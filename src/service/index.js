const express = require('express');
const app = express();
const path = require('path')

app.get('/', (req, res) => {
  res.status(200).send('hello express!')
})

app.listen(4200, function () {
  console.log('服務已開啟，請查看 http://localhost:4200');
});