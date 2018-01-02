import axios from 'axios'

// 陈展文物--文物列表
export const wenwuList = (params) => { return axios.get(`/Relic/GetRlicShow`, { params: params }).then( res => res.data ); };

// 文物列表  --分页
export const wenwuListPage = (params) => { return axios.get(`/Relic/GetRlicShowList`, { params: params }).then( res => res.data ); };
//  文物信息--详情
export const wenwuDetail = (params) => { return axios.get(`/Relic/GetRlicNameAll`, { params: params }).then( res => res.data ); };
//  文物详情--饼图
export const warningDetail = (params) => { return axios.get(`/Relic/GetRlicShowCount`, { params: params }).then( res => res.data ); };
//  文物详情--曲线图
export const humidGraphDetail = (params) => { return axios.get(`/Relic/GetRlicNameShow`, { params: params }).then( res => res.data ); };
//  文物详情--温湿度表格
export const humidTableDetail = (params) => { return axios.get(`/Relic/GetInstrumentWaveAlls`, { params: params }).then( res => res.data ); };
// 文物详情--实时数据以及上下限
export const wenwuDetailReal = (params) => { return axios.get(`/Relic/GetRlicNameAllss`, { params: params }).then( res => res.data ); };
