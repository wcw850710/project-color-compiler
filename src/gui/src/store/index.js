import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    projects: [],
  },
  mutations: {
    ADD_PROJECT(state, project) {
      state.projects.push(project)
    }
  },
  actions: {},
  modules: {}
})