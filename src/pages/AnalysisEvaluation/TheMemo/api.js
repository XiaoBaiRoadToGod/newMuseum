import axios from 'axios'

// 备忘录--- 查询
export const GetMemorandumAll = (params) => { return axios.get(`/LogsAll/GetMemorandumAll`, { params: params }).then(res => res.data); };
// 备忘录-- 删除
export const MemorandumDelect = (params) =>  { return axios.get(`/LogsAll/GetMemorandumDalect`, { params: params }).then(res => res.data);}
