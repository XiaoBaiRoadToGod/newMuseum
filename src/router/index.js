import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

// 实时监测
import RealTimeMonitoring from '@/pages/RealTimeMonitoring/realTimeMonitoring'
// 环境调控
import Environmental from '@/pages/Environmental/environmental'
// 空调调控
import AirControl from '@/pages/AirConditionControl/airControl'
// 预警平台 -- 预警统计

import WarningStatistics from '@/pages/WaringPlatform/warningStatistics'
// 预警平台 -- 预警查询
import WarningQuery from '@/pages/WaringPlatform/warningQuery'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        { 
          path: 'RealTimeMonitoring', 
          name: 'RealTime', 
          component: RealTimeMonitoring,
          meta: {
            title: '实时监测'
          } 
        },
        { 
          path: 'Environmental', 
          name: 'Environmental', 
          component: Environmental,
          meta: {
            title: '环境调控'
          }
        }
      ]
    }
  ]
})
