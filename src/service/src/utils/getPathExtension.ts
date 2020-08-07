export default (path: string): string => {
  const filePathSp: string[] = path.split('.')
  return filePathSp[filePathSp.length - 1]
}