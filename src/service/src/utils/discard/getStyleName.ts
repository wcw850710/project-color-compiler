export default (input: string, index: number) => {
  let style: string = ''
  while (/[A-z\-]/.test(input[--index])) {
    style = input[index] + style
  }
  return style
}