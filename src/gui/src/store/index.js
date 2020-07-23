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
