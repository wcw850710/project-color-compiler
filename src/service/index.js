const express = require('express');
const app = express();
const path = require('path')
const router = require('./routes')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/', router)

app.listen(4200, function () {
  console.log('服務已開啟，請查看 http://localhost:4200');
});