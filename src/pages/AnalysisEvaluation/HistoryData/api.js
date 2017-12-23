import axios from 'axios'

// 展厅 => 仪器
export const Data_Instrument = (params) => { return axios.get(`/Login/GetLoggerInfoByGroupID`, { params:params }).then( res => res.data ); };
// 仪器 + 时间 => 表数据
export const DataAnalyzer = (params) => { return axios.get(`/LogsAll/GetInstrumentWaveAll`, { params:params }).then( res => res.data ); };
// 仪器 + 时间 => 统计图数据
export const DataStat = (params) => { return axios.get(`/LogsAll/GetDrawCurve`, { params: params }).then( res => res.data ); };
// 仪器 + 时间 => 统计图数据(饼图)
export const PieExceed = (params) => { return axios.get(`/LogsAll/GetInstrumentIimit`, { params: params }).then( res => res.data ); };
// 仪器 + 时间 => 导出数据
export const OutData = (params) => { return axios.get(`/LogsAll/GetExportExcel`, { params: params }).then( res => res.data ); };
/// 分页
export const historyPageList = (params) => { return axios.get(`/LogsAll/GetDrawCurveList`, { params: params }).then( res => res.data ); };
// 备忘录---新增
export const GetMemorandumAdd = (params) => { return axios.get(`/LogsAll/GetMemorandumAdd`, { params: params }).then(res => res.data); };
