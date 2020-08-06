import { iGetColor } from '../interfaces/color'
export default (input: string, index: number, returnIndexCallback: (index: number) => void): iGetColor => {
  let color: string = ''
  let rgba: string[] = ['r', 'g', 'b', 'a']
  let rgbaCur: number = 0
  let startBracketsLen: number = 0
  let endBracketsLen: number = 0
  let isRgba: boolean = false
  while(input[index] !== undefined && input[index] === rgba[rgbaCur]) {
    color += input[index]
    index++
    rgbaCur++
  }
  if(rgbaCur < 4) {
    returnIndexCallback(index)
    return ['', isRgba]
  } else {
    while(input[index] !== undefined){
      const txt: string = input[index]
      if(txt === '(') startBracketsLen++
      if(txt === ')') endBracketsLen++
      color+=txt
      index++
      if(txt === '$') {
        isRgba = false
        break
      }
      if(endBracketsLen === startBracketsLen) {
        isRgba = true
        break
      }
    }
    returnIndexCallback(index)
    return [color, isRgba]
  }
}