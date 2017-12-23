// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/index.scss'
import './assets/css/scrollBar.scss'
// import ChangeTheme from './components/changeTheme/changeTheme'
// 图表

import VeLine from 'v-charts/lib/line'  // 折线
import VeBar from 'v-charts/lib/bar'     // 条形图
import VePie from 'v-charts/lib/pie'     // 饼图
import VeRing from 'v-charts/lib/ring'   // 环形图
import VeTitle from 'echarts/lib/component/title'
Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)
Vue.component(VeBar.name, VeBar)
Vue.component(VeRing.name, VeRing)
Vue.use( VeTitle)
// echarts
import echarts from 'echarts'
Vue.use(echarts)
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
  // console.log(to)
  if(to.path == '/Login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.stringify(sessionStorage.getItem('user'))
  // console.log(user == 'null')
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
