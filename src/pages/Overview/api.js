import axios from 'axios'

// 博物馆信息
export const museumInfo = () => { return axios.get(`/Analysis/GetToMuseumShow`).then(res => res.data[0]); };
// 文物环境信息
export const wenwuEnvir = (params) => { return axios.get(`/Analysis/GetRlicShowALL`, { params:params }).then(res => res.data); };
// 监测设备
export const wenwuFacility = (params) => { return axios.get(`/Analysis/GetRlicShowALLss`, { params:params }).then(res => res.data); };


// 概览 查询分组仪器
export const GetOverviewGroupLoggers = (params) => { return axios.get(`/Analysis/GetInstrumentCountAll`,{params,params}).then( res => res.data ); };

// 概览   新增分组
export const AddOverviewGroupLoggers = (params) => { return axios.get(`/Analysis/GetInstrumentCountAdd`,{params,params}).then( res => res.data ); };
//  概览   删除分组仪器
export const DeleteOverviewGroupLoggers = (params) => { return axios.get(`/Analysis/GetInstrumentCountDel`,{params,params}).then( res => res.data ); };
// 概览   显示分组详情
export const GetOverviewGroupDetails = (params) => { return axios.get(`/Analysis/GetInstrumentCountShow`,{params,params}).then( res => res.data ); };
