import axios from 'axios'

// 展厅 + 时间 => 温湿度统计图 && 九宫格数据 && 合格率数据 && 仪器分析概览
export const BenchmarkStatistics = (params) => { return axios.get(`/Evaluation/GetTempHumiData`, { params: params }).then( res => res.data); };
export const SudukuMean = (params) => { return axios.get(`/Evaluation/GetNineSquareGraphData`, { params: params }).then( res => res.data); };
export const YIELD = (params) => { return axios.get(`/Evaluation/GetQualifiedRateData`, { params: params }).then( res => res.data); };
export const Wave = (params) => { return axios.get(`/Evaluation/GetFluctuateData`,{ params: params }).then( res => res.data); };
