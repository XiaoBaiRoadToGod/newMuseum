import axios from 'axios'



// 仪器
export const Data_Instrument = params => {
  return axios
    .get(`/Login/GetLoggerInfoByGroupID`, { params: params })
    .then(res => res.data);
};


// 多数据查询
export const MultiData = params => {
  return axios
    .get(`/LogsAll/GetLoginfoContrast`, { params: params })
    .then(res => res.data);
};


// 表格
export const TabMulti = params => {
  return axios
    .get(`/LogsAll/GetLoginfoContrastWave`, { params: params })
    .then(res => res.data);
};

// 导出数据
export const multiDataOutExl = params => {
  return axios
    .get(`/LogsAll/GetContrastExportExcel`, { params, params })
    .then(res => res.data);
};

// 备忘录新增

export const GetMemorandumAdd = (params) => { return axios.get(`/LogsAll/GetMemorandumAdd`, { params: params }).then(res => res.data); };


