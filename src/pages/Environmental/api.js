
import axios from 'axios'

// 环境调控接口
 // 获取信息
 // 环境调控
export const Controls = (params) => { return axios.get(`/Controller/GetAlarmsList`, { params:params }).then(res => res.data); };
// 获取调控总条数
export const ControlNum = (params) => { return axios.get(`/Controller/GetController`, { params:params }).then(res => res.data); };
