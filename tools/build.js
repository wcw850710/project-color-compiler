const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')

const buildDistDir = () => new Promise((resolve => {
  fs.mkdirSync(path.resolve(__dirname, '../dist'))
  console.log('資料夾創建完成')
  resolve()
}))

const buildStartSh = () => new Promise((resolve => {
  fs.writeFileSync('./dist/start.sh', 'start http://localhost:4200\nnode ./service/index.js')
  console.log('開始 shell 建立完成')
  resolve()
}))

const buildServicePromise = () => new Promise((resolve) => {
  exec('cd ./src/service && npm run build:service', err => {
    console.log('服務器編譯完成')
    resolve()
  })
})

const buildGUIPromise = () => new Promise((resolve) => {
  exec('cd ./src/gui && npm run build:gui', err => {
    console.log('GUI 編譯完成')
    resolve()
  })
})

const removeDistDir = () => new Promise(resolve => {
  fs.rmdirSync(path.resolve(__dirname, '../dist'),{recursive: true})
  console.log('資料夾刪除完成')
  resolve()
})

const doUpdate = () => Promise.all([buildDistDir(), buildStartSh(), buildServicePromise(), buildGUIPromise()]).then(() => {
  console.log('全部編譯完成，重新啟動專案成功')
  exec('start http://localhost:4200 && cd ./dist && node ./service/index.js', err => {})
})

try {
  fs.readdirSync(path.resolve(__dirname, '../dist'))
  ;(async () => {
    await removeDistDir()
    doUpdate()
  })()
} catch (e) {
  doUpdate()
}






