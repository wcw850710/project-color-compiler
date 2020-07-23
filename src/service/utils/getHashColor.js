module.exports = (input, index, returnIndexCallback) => {
  let color = ''
  while(input[++index] !== undefined && /[0-9A-z]/.test(input[index])){
    color+=input[index]
  }
  returnIndexCallback(index)
  return color
}