import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import './main.scss'
import components from './components'

Vue.config.productionTip = false
Vue.use(components)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
