import axios from 'axios'

// 空调调控
export const GetAirControlDetails = () => { return axios.get(`/Controller/GetConditioningAll`).then( res => res.data ); };
// 调控
export const ControlsSet = params => {
  return axios
    .get(`/Controller/GetDevice`, { params: params })
    .then(res => res.data);
};
