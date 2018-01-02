/**
 * 请修改state.museumName 为博物馆简称，以下为简称
 * 南博、深博、国博、崇信、庄浪、陇西、鄂尔多斯、
 * 镇原、天水、庆城、绵阳、广东海上丝绸之路、安徽、
 */


const state = {
  museumName: '南博',                             
  httpUrl: "http://huato.net:8025/api",
  // httpUrl: "http://192.168.10.68:8080/api",  // ip
  LoginShowVeriCode: false,            // 登录页面，验证码，true 显示
  ShowQrCode: false,              // 登录和home页面显示二维码， true 显示
  QrCodeText: null,               // 二维码文字
  overviewMuseumShowUrl: false,       // 概览页面，博物馆信息显示更多详情
  museumURL: null,                    // 概览页面，更多详情，跳转博物馆官网地址
  showMemo: true,                     // 历史数据，数据分析，显示添加备忘录
  showPage: {                         // 博物馆显示的页面，false为显示，true 为隐藏
    showReal: false,                      // 实时监测
    showEnvir: false,                       // 环境调控
    showAir: false,                          // 空调调控
    showAlerm: false,                        // 预警平台 两个
    showHistory:false,                       // 历史数据
    showAnalysis:false,                      // 数据分析
    showGroup: false,                        // 分组统计
    showComprehen:false,                      // 综合评估
    showMemoPage: false,                      // 备忘录
    showHeatField: false,                     // 热量场
    showRelic: false,                         // 展陈文物
    showOverview:false,                       // 概览
    showHiddenLogger:false,                  // 隐藏仪器
    showUploadImg: false,                    // 上传文物图片和信息
  },
  PrimaryColor: "#365887", // 默认主题色
  allZhanting: null,       // 所有的展厅
  zhantingID: "100",
  LoggerSn: null, // 用于存放跳转的sn
  loggerDate: null,   // 跳转的时间
  overviewGroup: false   // 概览页面分组，true 为显示（深博、南博、国博）,其他false
};

switch (state.museumName) {
  case "南博":
    state.LoginShowVeriCode = true;
    state.ShowQrCode = true;
    state.QrCodeText = "http://192.168.90.157:8082";
    state.overviewMuseumShowUrl = true;
    state.overviewGroup = true;
    state.museumURL = "http://www.njmuseum.com/";
    break;
  case "深博":
    state.LoginShowVeriCode = true;
    state.ShowQrCode = true;
    state.QrCodeText = "http://172.16.50.245:8082";
    state.overviewMuseumShowUrl = true;
    state.overviewGroup = true;
    state.showPage.showAlerm = true;
    state.showPage.showHistory = true;
    state.showPage.showRelic = true;
    state.showPage.showUploadImg = true;
    state.museumURL = "http://www.shenzhenmuseum.com/";
    break;
  case "国博":
    state.LoginShowVeriCode = false;
    state.ShowQrCode = true;
    state.QrCodeText = "http://huato.net:8022";
    state.overviewMuseumShowUrl = true;
    state.overviewGroup = true;
    state.showPage.showAlerm = true;
    state.showPage.showHistory = true;
    state.showPage.showRelic = true;
    state.showPage.showUploadImg = true;
    state.museumURL = "http://www.chnmuseum.cn/";
    break;

  default:
    break;
}
export default state