const fs = require('fs')
module.exports = {
  // 將 colors file 原數據從 string 轉換成 json
  compileSass: ({ compileFilePath }) => new Promise(resolve =>  {
    try{
      const sassFileData = (fs.readFileSync(compileFilePath)).toString()
      const result = {}
      const matchVariableAndColors = sassFileData.match(/(\$[A-z0-9-_]*)|(:\s?[#|A-z0-9(,#\.)\s;^\n]*)/g)
      for (let i = 0; i < matchVariableAndColors.length; i++) {
        const variable = matchVariableAndColors[i].substr(1, matchVariableAndColors[i].length)
        const color = matchVariableAndColors[++i].replace(/[:\s\n;]/g, '')
        result[variable] = color
      }
      resolve(result)
    }catch (err) {
      resolve(false)
    }
  })
}