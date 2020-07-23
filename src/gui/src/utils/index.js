import axios from 'axios'
const baseUrl = '/api'
const https = Vue => {
  const apis = {
    'compiler': (params) => axios.post(`${baseUrl}/compiler`, params)
  }
  Vue.prototype.$http = apis
}

export default https