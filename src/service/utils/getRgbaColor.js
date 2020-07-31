module.exports = (input, index, returnIndexCallback) => {
  let color = ''
  let rgba = ['r', 'g', 'b', 'a']
  let rgbaCur = 0
  let startBracketsLen = 0
  let endBracketsLen = 0
  while(input[index] !== undefined && input[index] === rgba[rgbaCur]) {
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