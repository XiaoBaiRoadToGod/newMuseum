import axios from 'axios'

// 预警查询
export const warningQuery = (params) => { return axios.get(`/LogsAll/GetAlarmsShow`, { params: params }).then( res => res.data ); };
//  预警查询--分页
export const warningQueryList = (params) => { return axios.get(`/LogsAll/GetAlarmsList`, { params: params }).then( res => res.data ); };
//   预警统计--柱状图
export const warningStatistical = (params) => { return axios.get(`/Alarm/GetHistogramData`, { params: params }).then( res => res.data ); };
//   预警统计--饼图
export const warningBar = (params) => { return axios.get(`/Alarm/GetDrawPieData`, { params: params }).then( res => res.data ); };
//   预警统计--24小时图
export const warningCurve = (params) => { return axios.get(`/Alarm/GetDrawCurveData`, { params: params }).then( res => res.data ); };
