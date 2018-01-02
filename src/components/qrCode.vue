<template>
  <el-row class='qrCodeContainer' v-if='qrShow'>
    <el-col :span='24' class='scanCode' >
        <el-col :span='24' class='scanCodeClose'>
          <span  @click='closeQrContent(false)'></span>
          <div class='QrCode' id='myQrCode'>
            <vue-qr :text='GetQrCodeText' :logoSrc='QrLogoSrc' dotScale='0.5' logoMargin='5' width='230' height='230' size='230'></vue-qr>
            
          </div>
        </el-col>
        <el-col :span='24'  class='picTitle'>
          <span>
            <span class='step'>
              <span class='codeLeft'>
                <i class='circle'>第一步</i>
              </span>
              <span class='codeRight'>
                <i class='text'>打开手机APP</i>
                <i class='text bottomText'>点击登录按钮下方“服务器设置”</i>
              </span>
            </span>
            <img src="../assets/img/iPhone-1.png" >
          </span>
          <span  class='step'>
              <span class='codeLeft'>
                <i class='circle'>第二步</i>
              </span>
              <span class='codeRight'>
                <i class='text'>点击弹窗左上方图标" <i class='sao'></i> "</i>
              </span>
            <img src="../assets/img/iPhone-2.png" >
          </span>
          <span  class='step'>
              <span class='codeLeft'>
                <i class='circle'>第三步</i>
              </span>
              <span class='codeRight'>
                <i class='text'>扫描上方二维码</i>
                <i class='text bottomText'>读取当前APP服务端地址点击“确定”</i>
              </span>
            <img src="../assets/img/iPhone-3.png" >
          </span>
        </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      qrShow: false,
      QrLogoSrc: require('../assets/img/LOGO182.png'),
      codeVal: 'http://172.16.50.245:8082', 

    }
  },
  computed: {
    ...mapGetters(['GetQrCodeText'])
  },
  methods: {
    closeQrContent (bool) {
      this.qrShow = bool
    }
  }
}
</script>
<style lang="scss" scoped>
.qrCodeContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.scanCode{
  // position: absolute;
  width: 100%;
  height: 100%;

  background: rgba(0,0,0,.95);
  z-index: 99;
}
.scanCode .scanCodeClose{
  margin-top: 30px;
  text-align: center;
  padding-right: 30px;
  height: 50%;
}
.scanCode .scanCodeClose span{
    display: block;
    float: right;
    width: 65px;
    height: 65px;
    background: url(../assets/img/icon1.png) no-repeat;
    background-position: -13px -1476px;
    cursor: pointer;
}
.scanCode .scanCodeClose .QrCode{
  width: 230px;
  height: 230px;
  display: inline-block;
  position: relative;
  margin-top: 60px;
  border-radius: 10px;
  border:10px solid #4db3ff;

}
#myQrCode .codeLogo{
  width: 50px;
  height: 50px;
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.scanCode .picTitle{
  text-align: center;
  .step {
    width: 300px;
  }
}
.scanCode .picTitle span{
  display: inline-block;
  width: 300px;
}
.step{
  display: inline-block;
  width: 250px;
}
.step span.codeLeft{
  display: inline-block;
  float: left;
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
}
.step span.codeRight{
  display: inline-block;
  float: right;
  width: 230px;
  height: 70px;
  margin-bottom: 10px;
  /*line-height: 70px;*/
  
}
.step .codeLeft .circle{
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 30px;
  background: #fff;
  color:#333;
  font-style: normal;
}
.step  .text{
  color: #fff;
  display: inline-block;
  width: 230px;
  text-align: left;
  margin-top: 20px;
  font-style: normal;
}
// .text .sao{
//   background: url(../../static/img/sao.png) no-repeat;
//   display: inline-block;
//   width: 18px;
//   height: 18px;
//   vertical-align: middle;
// }
.step .bottomText{
  margin-top: 7px;
}
.scanCode{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left:0;
  background: rgba(0,0,0,.95);
  z-index: 99;
}
.scanCode .scanCodeClose{
  margin-top: 30px;
  text-align: center;
  padding-right: 30px;
  height: 50%;
}
// .scanCode .scanCodeClose span{
//     display: block;
//     float: right;
//     width: 65px;
//     height: 65px;
//     background: url(/static/img/icon.ad0330f.png) no-repeat;
//     background-position: -13px -1476px;
//     cursor: pointer;
// }

</style>


