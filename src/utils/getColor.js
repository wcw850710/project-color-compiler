module.exports = (input, index) => {
  let color = ''
  while(input[++index] !== undefined && /[0-9A-z]/.test(input[index])){
    color+=input[index]
  }
  return color
}