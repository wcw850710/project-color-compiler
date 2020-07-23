import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import './main.scss'
import components from './components'
import http from './utils'

Vue.config.productionTip = false
Vue.use(components)
Vue.use(http)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
