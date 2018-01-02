import axios from 'axios'

// 备忘录---新增
export const GetMemorandumAdd = (params) => { return axios.get(`/LogsAll/GetMemorandumAdd`, { params: params }).then(res => res.data); };
