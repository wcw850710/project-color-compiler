import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    projects: [],
    theme: 'night',
  },
  mutations: {
    ADD_PROJECT(state, project) {
      state.projects.push(project)
    },
    SET_PROJECT(state, {project, index}) {
      state.projects[index] = project
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects
    },
    REMOVE_PROJECT(state, index){
      state.projects.splice(index, 1)
    },
    SET_THEME(state, theme) {
      state.theme = theme
    }
  },
  actions: {},
  modules: {}
})