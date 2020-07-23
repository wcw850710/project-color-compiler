module.exports = (input, index, returnIndexCallback) => {
  let color = ''
  let rgbaCur = 0
  while(input[index] !== undefined && /[rgba]/.test(input[index])) {
    color += input[index]
    index++
    rgbaCur++
  }
  if(rgbaCur < 4) {
    returnIndexCallback(index)
    return ['', false]
  } else {
    while(input[index] !== undefined && /[A-z0-9\s(#,\.)]/.test(input[index])){
      color+=input[index]
      index++
    }
    returnIndexCallback(index)
    return [color, true]
  }
}