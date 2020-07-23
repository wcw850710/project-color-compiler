module.exports = (input, index) => {
  let color = ''
  let rgbaCur = 0
  while(input[index] !== undefined && /[rgba]/.test(input[index])) {
    color += input[index]
    index++
    rgbaCur++
  }
  if(rgbaCur < 4) {
    return ['', false]
  } else {
    while(input[index] !== undefined && /[A-z0-9\s(#,\.)]/.test(input[index])){
      const txt = input[index]
      if(!(/\s/.test(txt) === true)) {
        color+=input[index]
      }
      index++
    }
    return [color, true]
  }
}