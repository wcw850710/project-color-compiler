const express = require('express');
const app = express();
const path = require('path')


app.use('/', express.static('./src/gui'));
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, '../gui')
  })
})

app.listen(4200, function () {
  console.log('服務已開啟，請查看 http://localhost:4200');
});