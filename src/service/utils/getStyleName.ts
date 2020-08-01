export default (input, index) => {
  let style = ''
  while (/[A-z\-]/.test(input[--index])) {
    style = input[index] + style
  }
  return style
}