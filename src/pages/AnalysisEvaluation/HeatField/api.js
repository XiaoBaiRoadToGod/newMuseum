import axios from 'axios'

// 热量场
export const Field = params => {
  return axios
    .get(`/Head/GetHeatMapShow`, { params: params })
    .then(res => res.data);
};
