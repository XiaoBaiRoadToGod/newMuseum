import axios from 'axios'

//  设置--修改密码
export const pwdChange = (params) => { return axios.post(`/Login/GetUpdatePwd`, params ).then( res => res.data ); };

//上传图片
export const uploadPostImg = (params,config) => { return axios.post(`/Setting/ImgUpload`, params, config ).then( res => res.data ); };
// 导入文物信息
export const uploadPostFile = (params,config) => { return axios.post(`/Setting/RelicUpload`, params, config ).then( res => res.data ); };
// 导入文物信息 -下载模板
export const uploadFileTemplate = () => { return axios.get(`/Setting/GetDownload`).then( res => res.data ); };
//隐藏仪器
export const setLoggerHide = (params) => { return axios.get(`/Login/GetDisplayAll`, {params: params}).then( res => res.data ); };

//提交隐藏仪器
export const AddsetLoggerHide = (params) => { return axios.get(`/Login/GetupdateDisplay`, {params: params}).then( res => res.data ); };
// 展厅列表
export const zhantingList = (params) => { return axios.post(`/Login/GetGrousShow`, params).then(res => res.data) }