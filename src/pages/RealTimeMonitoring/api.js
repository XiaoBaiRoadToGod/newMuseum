import axios from 'axios'

// 实时监测
// 数据
export const GetDeviceInfo = params => {
    return axios
        .get(`/Head/GetDeviceInfo`, { params: params })
        .then(res => res.data)
    };
// 环境评分
export const GetGetScore = params => {
    return axios
        .get(`/Head/GetGetScore`, { params: params })
        .then(res => res.data)
};
// 预警设备
export const GetDeviceAlarm = params => {
    return axios
        .get(`/Head/GetDeviceAlarm`, { params: params })
        .then(res => res.data)
};
// 设备统计
export const EqmtStatistics = params => {
  return axios
    .get(`/Head/GetDeviceStatistics`, { params: params })
    .then(res => res.data);
};

