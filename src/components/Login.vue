<template>
  <el-row class='loginContainer'>
      <el-col :span='24' class='loginTopBack' :style='{background: primaryColor}'>

      </el-col>
      <el-col class='LoginFormContent'>
          <el-col :span='24' class='LoginTile'>
              <img :src="loginTitleImg" alt="">
          </el-col>
          <el-col :span='14' class='museumImg'>
              <img class='loginBgImg' :src="loginMuseumImg" >
          </el-col>
          <el-col :span='9' class='Loginfrom'>
              <h3>用户登录</h3>
              <el-form label-position="left" inline :model='loginForm' :rules="LoginRules" ref='loginRef'>
                <el-form-item prop='name' :error='showError'>
                    <el-input class='loginInput UserName' size='small' v-model='loginForm.name' name='name'></el-input>
                </el-form-item>
                <el-form-item prop='pwd' :error='showError'>
                    <el-input class='loginInput UserPwd' size='small' v-model='loginForm.pwd' type='password' name='pwd'></el-input>
                </el-form-item>
                <el-form-item v-if='GetLoginVeriCode'>
                    <el-col :span='24' class='verification'>
                        <div id='verCode'></div>
                    </el-col>
                    <span class='errorText' v-if='!verifycation && verifycation !== null'>验证码错误</span>
                </el-form-item>
                <el-form-item class='submitBtn'>
                    <el-button v-if='!GetLoginVeriCode'  size='small' type='primary' @click='onSunmit'>登录</el-button>
                    <button v-if='GetLoginVeriCode' id="check-btn" :style='{background: primaryColor}' type='button' >登录</button>
                </el-form-item>
                <el-form-item class='appQrCode' v-if='GetShowQrCode'>
                    <span class='qrcodeText' @click='openQrCode'>手机APP接口地址</span><i class='el-icon-arrow-down'></i>
                </el-form-item>
            </el-form>
          </el-col>
          
      </el-col>
      <QrCode ref='qrCode'></QrCode>
  </el-row>
</template>

<script>
import { UserLogin } from './api'
import QrCode from './qrCode'
import qs from 'qs'
import { mapGetters } from 'vuex'
import jQuery from 'jquery'
import '@/assets/js/verify.js'
export default {
    data () {
        return {
            loginForm:{
                name: 'admin',
                pwd: 'admin'
            },
            LoginRules: {
                name: [ { required: true, message: '请填写用户名', trigger: 'change' } ],
                pwd: [ { required: true, message: '请填写密码', trigger: 'change' } ]
            },
            loginTitleImg: require('@/assets/museumImg/LoginLogo.png'),
            showError: null,   
            loginMuseumImg: null,
            verifycation: null   // 验证是否通过，true 通过
        }
    },
    computed: {
        ...mapGetters(['primaryColor', 'GetMuseumName', 'GetLoginVeriCode', 'GetShowQrCode'])
    },
    components: { QrCode },
    methods: {
        openQrCode () {
            this.$refs['qrCode'].closeQrContent(true)
        },
       onSunmit() {
           this.showError = null
           this.$refs['loginRef'].validate((valid) => {
            //    console.log(this.verifycation)
               if(valid ) {
                   var params =  qs.stringify({
                        name: this.loginForm.name,
                        pwd: this.loginForm.pwd
                    })
                    UserLogin(params).then(res => {
                        console.log(res)
                        if(res.ok) {
                            const user = JSON.stringify({
                                name: res.ok[0].USER_NAME, 
                                ids: res.ok[0].USER_GROUP_IDS, 
                                level: res.ok[0].USER_LEVEL     // 用户的权限
                            })
                            sessionStorage.setItem('user', user)
                            this.$router.push('/RealTimeMonitoring')
                        } else {
                            this.showError = '用户名或密码错误'
                        }
                    })
               } else {
                   return false
               }
           })
           
           
       } 
    },
    mounted () {
        let _this = this
        if(this.GetLoginVeriCode) {
            $('#verCode').codeVerify({
                type: 1,
                width: '150px',
                height: '100%',
                fontSize: '30px',
                codeLength: 4,
                btnId: 'check-btn',
                ready: () => {

                },
                success: () => {
                    console.log('验证通过')
                    _this.showError = null
                    _this.verifycation = true
                    _this.$refs['loginRef'].validate((valid) => {
                        console.log(_this.verifycation)
                        if(valid && _this.verifycation) {
                            var params =  qs.stringify({
                                    name: _this.loginForm.name,
                                    pwd: _this.loginForm.pwd
                                })
                                UserLogin(params).then(res => {
                                    console.log(res)
                                    if(res.ok) {
                                        const user = JSON.stringify({
                                            name: res.ok[0].USER_NAME, 
                                            ids: res.ok[0].USER_GROUP_IDS, 
                                            level: res.ok[0].USER_LEVEL     // 用户的权限
                                        })
                                        sessionStorage.setItem('user', user)
                                        _this.$router.push('/RealTimeMonitoring')
                                    } else {
                                        _this.showError = '用户名或密码错误'
                                    }
                                })
                        } else {
                            return false
                        }
                    })
                },
                error: () => {
                    console.log('验证失败')
                    _this.verifycation = false
                    $('.varify-input-code').css({borderColor: 'red'})
                }

            })
            $('.varify-input-code').focus(() => {
                $('.varify-input-code').css({borderColor: _this.primaryColor})
                _this.verifycation = null
            })
        }
        
    },
    created () {
        switch (this.GetMuseumName) {
            case '南博':
                this.loginMuseumImg = require('@/assets/museumImg/nanboLoginLogo.png')
                break;
            case '深博':
                this.loginMuseumImg = require('@/assets/museumImg/shenboLoginLogo.png')
                break;
            case '国博':
                this.loginMuseumImg = require('@/assets/museumImg/guoboLoginLogo.png')
                break;
            case '崇信':
                this.loginMuseumImg = require('@/assets/museumImg/chongxinLoginLogo.jpg')
                break;
            case '庄浪':
                this.loginMuseumImg = require('@/assets/museumImg/zhuanglangLogin.png')
                break;
            case '陇西':
                this.loginMuseumImg = require('@/assets/museumImg/longxiLoginLogo.jpg')
                break;
            case '鄂尔多斯':
                this.loginMuseumImg = require('@/assets/museumImg/eerLoginLogo.jpg')
                break;
            case '镇原':
                this.loginMuseumImg = require('@/assets/museumImg/zhenyuanLogin.jpg')
                break;
            case '金昌':
                this.loginMuseumImg = require('@/assets/museumImg/jinchang.jpg')
                break;
            case '天水':
                this.loginMuseumImg = require('@/assets/museumImg/tianshui.jpg')
                break;
            case '庆城':
                this.loginMuseumImg = require('@/assets/museumImg/qingchengLogin.png')
                break;
            case '绵阳':
                this.loginMuseumImg = require('@/assets/museumImg/mianyangLoginLogo.png')
                break;
            case '广东海上丝绸之路':
                this.loginMuseumImg = require('@/assets/museumImg/haishangsichouLogin.jpg')
                break;
            case '安徽':
                this.loginMuseumImg = require('@/assets/museumImg/anhuiLogin.png')
                break;
            default:
                // this.loginMuseumImg = require('@/assets/museumImg/huato.JPG')
                break;
        }
        
    },
	deactivated(){
		this.$destroy(true);
	}
}
</script>
<style lang="scss" scoped>
.loginContainer {
    position: relative;
    width: 100%;
    height: 100%;
    .loginTopBack {
        height: 43%;
    }
    .LoginFormContent {
        width: 1024px;
        height: 400px;
        padding: 45px;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        border-radius: 10px;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .LoginTile {
            position: absolute;
            top: -100px;
            left: 0px;
        }
        .museumImg {
            height: 100%;
            img {
                width: 100%;
                height: 100%;
                margin: auto;
                vertical-align: middle;
            }
        }
        
        .Loginfrom {
            -webkit-border-radius: 10px;
            border-radius: 10px;
            -moz-border-radius: 10px;
            background-clip: padding-box;
            width: 350px;
            height: 100%;
            padding: 10px 20px 0px 20px;
            background: #fff;
            border: 1px solid #cfcfcf;
            float: right;
            h3 {
                margin-bottom: 0;
                padding-bottom: 15px;
                padding-left: 15px;
                border-bottom: 1px solid #333;
            }
            .el-form {
                width: 100%;
                .el-form-item {
                    width: 305px;
                    margin-bottom: 20px;
                    .el-input {
                        width: 300px;
                    }
                    .el-button {
                        width: 300px;
                    }
                    #check-btn {
                        width: 300px;
                        height: 30px;
                        border: none;
                        color: #fff;
                        line-height: 30px;
                        border-radius: 5px;
                        outline: none;
                        cursor: pointer;
                    }
                    
                }
                .el-form-item.submitBtn {
                    margin-bottom: 0;
                }
                .el-form-item.appQrCode {
                    height: 25px;
                    // line-height: 25px;
                    margin-bottom: 0;
                    text-align: center;
                    .qrcodeText {
                        border-bottom: 1px solid #333;
                        cursor: pointer;
                        margin-right: 10px;
                    }
                }
            }
        }

    }
}
</style>


