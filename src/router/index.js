import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import RouterView from '@/pages/router-view'

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

// 分析评估--历史数据
import HistoryData from '@/pages/AnalysisEvaluation/HistoryData/historyData'
// 数据分析
import DataAnalysis from '@/pages/AnalysisEvaluation/DataAnalysis/dataAnalysis'
// 分组统计
import GroupStatistics from '@/pages/AnalysisEvaluation/GroupStatistics/groupingStatistics'
// 平均值

// 综合评估
import Comprehensive from '@/pages/AnalysisEvaluation/Comprehensive/comprehensive'
// 备忘录
import TheMemo from '@/pages/AnalysisEvaluation/TheMemo/theMemo'
// 热量场
import HeatField from '@/pages/AnalysisEvaluation/HeatField/heatField'

// 展陈文物--文物列表
import CulturalRelics from '@/pages/CulturalRelics/culturalRelic'
// 文物详情
import RelicsDetails from '@/pages/CulturalRelics/Details'
// 概览
import Overview from '@/pages/Overview/overview'
// 设置-- 
import SettingHome from '@/pages/Setting/home'
//修改密码
import UpdatePass from '@/pages/Setting/changePass'
// 隐藏仪器
import HiddenLogger from '@/pages/Setting/hiddenLogger'
// 上传文物信息
import RelicsInfo from '@/pages/Setting/importRelicsInfo'
// 上传文物图片
import RelicsImg from '@/pages/Setting/importRelicsImg'


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
        },
        {
          path: 'AirControl',
          name: 'AirControl',
          component: AirControl,
          meta: {
            title: '空调调控'
          }
        },
        {
          path: 'Warning',
          name: 'Warning',
          component: RouterView,
          meta: {
            title: '预警平台'
          },
          children: [
            { path: 'WarningStatistics', name: 'WarningStatistics', component: WarningStatistics, meta:{ title: '预警统计'} },
            { path: 'WarningQuery', name: 'WarningQuery', component: WarningQuery, meta: { title: '预警查询'} }
          ]
        },
        {
          path: 'Analysis',
          name: 'Analysis',
          component: RouterView,
          meta: {
            title: '分析评估'
          },
          children: [
            { path: 'HistoryData', name: 'HistoryData', component: HistoryData, meta: { title: '历史数据' } },
            { path: 'DataAnalysis', name: 'DataAnalysis', component: DataAnalysis, meta: { title: '数据分析' } },
            { path: 'GroupStatistics', name: 'GroupStatistics', component: GroupStatistics, meta: { title: '分组统计' } },
            { path: 'Comprehensive', name: 'Comprehensive', component: Comprehensive, meta: { title: '综合评估' } },
            { path: 'TheMemo', name: 'TheMemo', component: TheMemo, meta: { title: '备忘录' } },
            { path: 'HeatField', name: 'HeatField', component: HeatField, meta: { title: '热量场' } }
          ]
        },
        {
          path: 'Overview',
          name: 'Overview',
          component: Overview,
          meta: {
            title: '概览'
          }
        }
      ]
    },
    {
      path: 'Setting',
      name: 'Setting',
      component: SettingHome,
      children: [
        { 
          path: 'UpdatePass',
          name: 'UpdatePass',
          component: UpdatePass,
          meta: {
            title: '修改密码'
          }
        },
        {
          path: 'HiddenLogger',
          name: 'HiddenLogger',
          component: HiddenLogger,
          meta: {
            title: '隐藏仪器'
          }
        },
        {
          path: 'RelicsInfo',
          name: 'RelicsInfo',
          component: RelicsInfo,
          meta: {
            title: '导入文物信息'
          }
        },
        {
          path: 'RelicsImg',
          name: 'RelicsImg',
          component: RelicsImg,
          meta: {
            title: '导入文物图片'
          }
        }
      ]
    }
  ]
})
