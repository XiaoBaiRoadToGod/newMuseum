
import axios from 'axios'
 // 用户登录
export const UserLogin = (params) => {
    return axios.post(`/Login/GetIPAddressByIP`, params).then(res => res.data)
}

// 展厅列表
export const zhantingList = (params) => { return axios.post(`/Login/GetGrousShow`, params).then(res => res.data) }