const path = require('path');

module.exports = {
  outputDir: path.resolve('./', '../../dist/gui'),
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:4200',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}