import Vue from 'vue'
import App from './app.vue'
import Element from 'element-ui';
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import './main.scss'
import http from './utils'

Vue.config.productionTip = false
Vue.use(http)
Vue.use(Element, { size: 'small', zIndex: 3000 });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
