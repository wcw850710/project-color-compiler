import axios from 'axios'
const baseUrl = '/api'
const https = Vue => {
  const apis = {
    compiler: (params) => axios.post(`${baseUrl}/compiler`, params),
    getColors: (params) => axios.post(`${baseUrl}/getColors`, params),
    addColors: (params) => axios.post(`${baseUrl}/addColors`, params),
    replaceColors: (params) => axios.post(`${baseUrl}/replaceColors`, params),
  }
  Vue.prototype.$http = apis
}

export default https