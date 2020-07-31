module.exports = (input, index, returnIndexCallback) => {
  let color = ''
  let rgbaCur = 0
  let startBracketsLen = 0
  let endBracketsLen = 0
  while(input[index] !== undefined && /[rgba]/.test(input[index])) {
    color += input[index]
    index++
    rgbaCur++
  }
  if(rgbaCur < 4) {
    returnIndexCallback(index)
    return ['', false]
  } else {
    while(input[index] !== undefined){
      if(input[index] === '(') startBracketsLen++
      if(input[index] === ')') endBracketsLen++
      color+=input[index]
      index++
      if(endBracketsLen === startBracketsLen) break
    }
    returnIndexCallback(index)
    return [color, true]
  }
}