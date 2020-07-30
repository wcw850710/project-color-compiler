module.exports = path => {
  const filePathSp = path.split('.')
  const extension = filePathSp[filePathSp.length - 1]
  return extension
}