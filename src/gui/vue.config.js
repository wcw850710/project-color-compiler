module.exports = {
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