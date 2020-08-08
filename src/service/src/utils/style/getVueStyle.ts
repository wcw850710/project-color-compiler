export interface iVueData {
  styleTagStartIndex: number
  styleTagEndIndex: number
  styleData: string
}

export const matchVueStartStyleTag: RegExp = /<\s*style\s*lang\s*=\s*['"]s[ca]ss['"]\s*(scoped|\s*)*>+|<\s*style\s*(scoped|\s*)*lang\s*=\s*['"]s[ca]ss['"]\s*>/m

export const compile = (vueStr: string): iVueData => {
  const matchVueEndStyleTag: RegExp = /^\s*<\s*\/\s*style\s*>\s*$/m
  const styleTagStartIndex: number = vueStr.search(matchVueStartStyleTag)
  const styleTagEndIndex: number = vueStr.search(matchVueEndStyleTag)
  const styleData: string = vueStr.substring(styleTagStartIndex, styleTagEndIndex)
  return {
    styleTagStartIndex,
    styleTagEndIndex,
    styleData
  }
}