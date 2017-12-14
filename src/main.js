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
import state from './store/rootState'
// 使用滚动条组件
import Vuebar from 'vuebar'
Vue.use(Vuebar)

Vue.prototype.$http = axios
// console.log(this.$store)
axios.defaults.baseURL = state.httpUrl

Vue.config.productionTip = false
Vue.use(ElementUI)
router.beforeEach((to, from, next) => {
  console.log(to)
  if(to.path == '/Login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.stringify(sessionStorage.getItem('user'))
  console.log(user == 'null')
  if(user == 'null' && to.path !== '/Login') {
    next({ path: "/Login" })
  } else {
    next()
  }
})
// Vue.component('componnent', ChangeTheme)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
