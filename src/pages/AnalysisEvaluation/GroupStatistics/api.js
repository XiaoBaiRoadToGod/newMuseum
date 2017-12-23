import axios from 'axios'

// 分组统计  新增分组
export const addGroup = (params) => { return axios.get(`/GroupAll/GetGroupllAdd`,{params,params}).then( res => res.data ); };
// 分组统计  删除分组
export const delateGroup = (params) => { return axios.get(`/GroupAll/GetGroupDelete`,{params,params}).then( res => res.data ); };
// 分组统计  编辑分组
export const updateGroup = (params) => { return axios.get(`/GroupAll/GetGroupUpdate`,{params,params}).then( res => res.data ); };
// 分组统计  查询分组
export const queryGroup = (params) => { return axios.get(`/GroupAll/GetGroupAllquery`,{params,params}).then( res => res.data ); };
// 分组统计  查询分组的设备
export const GetGroupLoggers = (params) => { return axios.get(`/GroupAll/GetLoggersnAll`,{params,params}).then( res => res.data ); };
// 分组统计-- 平均值
export const GetMeanValue = (params) => { return axios.get(`/GroupAll/GetLoginfoAvgAll`,{params,params}).then( res => res.data ); };

// 平均值页面
// 表格
export const TabMulti = params => {
  return axios
    .get(`/LogsAll/GetLoginfoContrastWave`, { params: params })
    .then(res => res.data);
};
