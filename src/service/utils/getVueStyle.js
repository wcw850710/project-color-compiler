const matchVueStartStyleTag = /^\s*<\s*style\s*lang\s*=\s*['"]s[ca]ss['"]\s*(scoped|\s*)*>+\s*$|^\s*<\s*style\s*(scoped|\s*)*lang\s*=\s*['"]s[ca]ss['"]\s*>\s*$/m

exports.matchVueStartStyleTag = matchVueStartStyleTag

exports = module.exports = (vueStr) => {
  const matchVueEndStyleTag = /^\s*<\s*\/\s*style\s*>\s*$/m
  const styleTagStartIndex = vueStr.search(matchVueStartStyleTag)
  const styleTagEndIndex = vueStr.search(matchVueEndStyleTag)
  const styleData = vueStr.substring(styleTagStartIndex, styleTagEndIndex)
  return {
    styleTagStartIndex,
    styleTagEndIndex,
    styleData
  }
}