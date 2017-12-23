
import axios from 'axios'

// 环境调控接口
 // 获取信息
 // 环境调控
export const Controls = (params) => { return axios.get(`/Controller/GetAlarmsList`, { params:params }).then(res => res.data); };
// 获取调控总条数
export const ControlNum = (params) => { return axios.get(`/Controller/GetController`, { params:params }).then(res => res.data); };
// 调控操作
export const ControlsSet = (params) => { return axios.get(`/Controller/GetDevice`, { params:params }).then(res => res.data); };
// 调控--除湿
export const ControlsDevicecopy = (params) => { return axios.get(`/Controller/GetDevicecopy`, { params:params }).then(res => res.data); };
// 调控--加湿
export const ControlsDeviceBack = (params) => { return axios.get(`/Controller/GetDeviceBack`, { params:params }).then(res => res.data); };
