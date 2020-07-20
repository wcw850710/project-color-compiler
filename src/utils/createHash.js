module.exports = (randomCodesHashLength = 10) => {
  const allEnglishBytes = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const allNumberBytes = '0123456789'
  const allBytes = allEnglishBytes + allNumberBytes
  const allEnglishBytesLength = allEnglishBytes.length
  const allNumberBytesLength = allNumberBytes.length
  const allBytesLength = allEnglishBytesLength + allNumberBytesLength
  const hashVariable = Array.from(new Array(randomCodesHashLength), (_, i) => i).reduce((prev, _, i) => prev + (i === 0 ? allEnglishBytes[~~(Math.random() * allEnglishBytesLength)] : allBytes[~~(Math.random() * allBytesLength)]), '')
  return hashVariable
}