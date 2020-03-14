
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
// 注意点 : iconfont的样式要放在element的 前面
import './assets/iconfont/iconfont.css'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入饿了么ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// vue-table-with-tree-grid的引用
import TreeTable from 'vue-table-with-tree-grid'
// 引入进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// axiso 的设置
import axios from 'axios'
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  Nprogress.start()
  // 处理请求之前的配置
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// vue-table-with-tree-grid的注册
Vue.component('tree-table', TreeTable)

// 全局时间过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
