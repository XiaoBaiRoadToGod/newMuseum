// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../static/theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/index.scss'
import './assets/css/scrollBar.scss'
// import ChangeTheme from './components/changeTheme/changeTheme'
// vuex 
import store from './store/index'
import axios from 'axios'
// 使用滚动条组件
import Vuebar from 'vuebar'
Vue.use(Vuebar)

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://huato.net:8025/api'

Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.component('componnent', ChangeTheme)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
