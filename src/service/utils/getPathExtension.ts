export default (path): string => {
  const filePathSp: string[] = path.split('.')
  const extension: string = filePathSp[filePathSp.length - 1]
  return extension
}