
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
// 注意点 : iconfont的样式要放在element的 前面
import './assets/iconfont/iconfont.css'
// 引入饿了么ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// axiso 的设置
import axios from 'axios'
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // 处理请求之前的配置
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
