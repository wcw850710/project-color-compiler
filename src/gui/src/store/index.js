import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [
      {
        config: {
          fileExtensions: ["sass"],
          compileFile: ["_colors", "sass"],
          compilePath: "C:/Users/wcw85/desk/code/ws-projects/sass-colors-compiler/example/styles",
          rootPath: "C:/Users/wcw85/desk/code/ws-projects/sass-colors-compiler/example/"
        }
      }
    ],
  },
  mutations: {},
  actions: {},
  modules: {}
})

const _colors =
  {
    '#000': 'JXQjdRD8aQ',
    '#666666': 'axQsKWnaVi',
    '#fff': 'cbEXMoMBOu',
    '#1c1c1c': 'pCPUnZca2Y',
    '#999': 'zp78x0whia'
  }
const result = {
  '#000': true,
  '#777': true,
  '#fff': true,
  '#1c1c1c': true,
  '#666666': true,
  '#999': true,
}
const toFiles = {
  '#000': '$JXQjdRD8aQ',
  '#777': '$',
  '#fff': '$cbEXMoMBOu',
  '#1c1c1c': '$pCPUnZca2Y',
  '#999': '$zp78x0whia',
  '#666666': '$axQsKWnaVi'
}