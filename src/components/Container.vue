<template>
      <el-container>
        <el-header :style='{backgroundColor: primaryColor}' >
            
            <el-col :span='14' class='headerTitle'>
                <i class='museumLogo' v-bind:style='museumLogo' v-if='islogoShow'></i> 
                文物预防性保护环境监控系统
            </el-col>
            <el-col :span='5'>
                <ChangeTheme/>
            </el-col>
            <el-col :span='5'>
                <el-dropdown @command='dropdownClick'>
                    <span class='el-dropdown-link'>
                        <span class='dropdownImg' ></span>
                        admin
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot='dropdown'>
                        <el-dropdown-item command='主页'>主页</el-dropdown-item>
                        <el-dropdown-item command='帮助'>帮助</el-dropdown-item>
                        <el-dropdown-item command='设置'>设置</el-dropdown-item>
                        <el-dropdown-item command='扫码接口' v-if='GetShowQrCode'>扫码接口</el-dropdown-item>
                        <el-dropdown-item divided command='退出登录'>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-header>
        <el-container>
            <el-aside width="200px" v-if='type == "home"'>
                <div class='leftAsideTitle' :style='{background: changeMenuColor(primaryColor)}'>
                    <i class='asideIcon icon_home_select'></i>
                    <span>展厅区域分类</span>
                </div>
                 <div class='scrollBar'  v-bar >
                    <div>
                        <el-menu
                        class='zhantingMenu' 
                        :default-active='String(zhantingId)'
                        :default-openeds='defalutOpened'
                        @select='selectZhanting'
                        ref='menuRef'
                        v-if='zhantingList.length > 0'
                            >
                            <el-submenu v-if='zhantingList[0].length > 0' index='1' :style='{background: changeMenuColor(primaryColor)}'>
                                <template  slot='title' >
                                    <i class='asideIcon icon_home_zhanting'></i>
                                    <span class='MenuTitle'>展厅</span>
                                </template>
                                <el-menu-item v-for='item in zhantingList[0]' :key='item.GROUP_ID' :index='String(item.GROUP_ID)' >
                                    {{ item.GROUP_NAME }} 
                                </el-menu-item>
                            </el-submenu>
                            <el-submenu v-if='zhantingList[1].length > 0' index='2' :style='{background: changeMenuColor(primaryColor)}'>
                                <template slot='title' >
                                    <i class='asideIcon icon_home_kufang'></i>
                                    <span>文物库房</span>
                                </template>
                                <el-menu-item v-for='item in zhantingList[1]' :key='item.GROUP_ID' :index='String(item.GROUP_ID)' >
                                    {{ item.GROUP_NAME }}
                                </el-menu-item>
                            </el-submenu>
                            <el-submenu v-if='zhantingList[2].length > 0' index='3' :style='{background: changeMenuColor(primaryColor)}'>
                                <template slot='title' >
                                    <i class='asideIcon icon_home_guanwai'></i>
                                    <span>馆外环境</span>
                                </template>
                                <el-menu-item v-for='item in zhantingList[2]' :key='item.GROUP_ID' :index='String(item.GROUP_ID)' >
                                    {{ item.GROUP_NAME }}
                                </el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </div>
                </div>
                
            </el-aside>
            <el-aside width='200px' v-if='type == "setting"'>
                <!-- routePath.path + "/" + routePath.children[0].path -->
                <el-menu
                router
                :default-active='$route.path'
                    >
                    <el-menu-item v-for='item in routePath.children' 
                    v-if='!item.isHidden'
                    router
                    :key='routePath.path + "/" + item.path'
                    :index='routePath.path + "/" + item.path' 
                    >
                        {{ item.meta.title }}
                    </el-menu-item>
                </el-menu>
            </el-aside>
            
            <el-main v-bar='{el2Class: "mainScrollBar"}' style='height: 100%' >
                <div v-scroll='windowScroll'>
                    <el-col :span='24' class='navMenuContainer' v-if='type == "home"'>
                    <el-menu
                        :default-active='$route.path'
                        unique-opened
                        mode='horizontal'
                        router>
                        <template v-for='(item, idx) in routePath' >
                            <!-- {{ item }} -->
                            <el-submenu v-if='item.children && !item.isHidden ' :key='idx' :index='String(idx)' >
                                <template slot='title'>
                                    <i :class='item.iconCls'></i>
                                    <span>{{item.meta.title}}</span>
                                </template>
                                <el-menu-item  v-for='childItem in item.children' 
                                :index="'/' + item.path + '/' + childItem.path" 
                                :key='childItem.path' 
                                v-if='!childItem.isHidden'>
                                    {{ childItem.meta.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if='item.children == undefined && !item.isHidden  ' :key='idx' :index="'/' + item.path">
                                <i :class='item.iconCls'></i>{{ item.meta.title }}
                            </el-menu-item>
                        </template>
                
                    </el-menu>
                </el-col>
                <el-col :span='24' class='mainContainer' :class='{homeMain: type == "home", setMain: type !== "home"}' >
                    <keep-alive>
                        <router-view @windowReset='windowResets'></router-view>
                    </keep-alive>
                </el-col>
                </div>
                
            </el-main>
            <helpDialog ref='openHelp'/>
            <QrCode ref='qrCode'></QrCode>
        </el-container>
        <el-footer height='30px'>CopyRight&copy;2008-2018,深圳市华图测控系统有限公司,粤ICP备08032186号</el-footer>
    </el-container>
</template>
<script>
import ChangeTheme from '@/components/changeTheme/changeTheme'
import helpDialog from '@/components/helpComponent'
import QrCode from './qrCode'
import { mapGetters } from 'vuex'
import { UserLogin, zhantingList } from './api'
import qs from 'qs'
export default {
    data () {
        return {
            // primaryColor: '#365887',
            ids: null,
            zhantingList: [],
            defalutOpened: ['1','2','3'],
            defaultActive: '',
            screenWidth: new Date().getTime(),    // 监听窗口变化，默认值 时间戳 
            timer: false,
            containerHeight: null,
            islogoShow: true,
            museumLogo:{
                width: '50px',
                background: null, 
                backgroundPosition: '0px 4px'
            }
            
        }
    },
    components: { ChangeTheme, helpDialog, QrCode },
    props: [ 'routePath', 'type' ],
    computed: {
        ...mapGetters(['primaryColor', 'zhantingId', 'GetMuseumName', 'GetShowQrCode'])
    },
    methods: {
        dropdownClick (command) {
            console.log(command)
            switch (command) {
                case '主页':
                    this.$router.push('/RealTimeMonitoring')
                    break;
                case '帮助': 
                    this.$refs.openHelp.opeTheDialog(true)
                    break;
                case '设置': 
                    this.$router.push('/Setting/UpdatePass')
                    break;
                case '扫码接口': 
                    this.$refs['qrCode'].closeQrContent(true)
                    break;
                default:
                    console.log('tuichu')
                    this.$confirm('确定退出吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        sessionStorage.removeItem('user')
                        this.$router.push('/Login')
                    }).catch(() => {
                        return false
                    })
                    break;
            }
        },
        selectZhanting (idx) {
            console.log(idx)
            this.$store.commit('setZhantingId', idx)
        },
        getZhantingList () {
            let params = qs.stringify({
                "": this.ids
            })
            let _this = this
            zhantingList(params).then(res => {
                console.log(res)
                this.zhantingList = []
                // 概览页面  名字
                let overViewName = []
                
                Object.keys(res).forEach((key) => {
                    _this.zhantingList.push(res[key])
                    for( let i = 0; i < res[key].length; i++ ) {
                        overViewName.push(res[key][i]);
                    }

                })
                // console.log(this.zhantingList)
                if(this.zhantingList[0].length !== 0) {
                    this.defaultActive = String(this.zhantingList[0][0].GROUP_ID);
                } else if(this.zhantingList[1].length !== 0) {
                    this.defaultActive = String(this.zhantingList[1][0].GROUP_ID);
                }else if(this.zhantingList[2].length !== 0) {
                    this.defaultActive = String(this.zhantingList[2][0].GROUP_ID);
                }
                this.defaultActive = this.defaultActive
                this.$store.commit('setZhantingId', this.defaultActive )
                this.$store.commit('setAllZhanting', this.zhantingList)
                // console.log(this.defaultActive)
            })
        },
        changeMenuColor (color) {    // 十六进制颜色 改为 rgba
            // console.log(color)
            if(color) {
                let sColor = color.toLowerCase()
                // 十六进制的正则表达式
                let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
                if (sColor && reg.test(sColor)) {
                    // console.log(sColor)
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i=1; i<4; i+=1) {
                            sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for (var i=1; i<7; i+=2) {
                        sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
                    }
                    sColorChange.push('0.8')
                    // console.log("RGBA(" + sColorChange.join(",") + ")")
                    return "RGBA(" + sColorChange.join(",") + ")";
                    
                }
                // console.log(sColor)
                return sColor
            }
            
        },
        windowResets () {
            // console.log('---')
            let height = $(document.body).height()
            // console.log(height)
            this.containerHeight = height
            $('.mainContainer').height(height - 160)
        },
        windowScroll (event,position) {
            // console.log(event)
            if(event.target.className == 'mainScrollBar') {
                if(this.type == 'setting') {
                    $('.mainContainer').height('100%')
                } else {
                    let height = $(document.body).height()
                    $('.mainContainer').height(height - 160 + position.scrollTop)
                }
                
            } else {
                return false
            }
            
        }
    },
    mounted () {
        // console.log(this.type)
        // this.getMenuFouc()
        this.changeMenuColor()
        const that = this
        window.onresize = () => {
            return (() => {
                // console.log(new Date().getTime())
                window.screenWidth = new Date().getTime()
                that.screenWidth = window.screenWidth
            })()
        }
        
        // $('.vb-dragger-styler').css({'background-color': this.primaryColor})
        if(this.type == 'home') {
            this.menuDefaultAutive = '/' + this.routePath[0].path   // 导航菜单默认打开
            let user = JSON.parse(sessionStorage.getItem('user'))
            this.ids = user.ids
            this.getZhantingList()
            
            
        } else {
           this.setingDefault = '/' + this.routePath.path + '/' + this.routePath.children[0].path
        }
        
        // console.log(sessionStorage.getItem('user'))
        
        // console.log(this.routePath)

    },
    watch: {
        screenWidth (val) {
            if(!this.timer) {
                this.screenWidth = val
                this.timer = true
                let that = this
                setTimeout(() => {
                    that.windowResets()
                    that.timer = false
                }, 0);
            }
        }
    },
    created () {
        switch (this.GetMuseumName) {
            case '南博':
                this.museumLogo.background = 'url(/static/img/NanBoLogo.png) no-repeat'
                break;
            case '深博':
                this.museumLogo.background = 'url(/static/img/ShenBoLogo.png) no-repeat'
                break;
            case '国博':
                this.museumLogo.width = '175px'
                this.museumLogo.backgroundPosition = '0px 10px'
                this.museumLogo.background = 'url(/static/img//guoboLogo.png) no-repeat'
                break;
            case '镇原':
                this.museumLogo.backgroundPosition = '-4px 0px'
                this.museumLogo.background = 'url(/static/img/zhenYuanLogo.png) no-repeat'
                break;
            case '天水':
                this.museumLogo.background = 'url(/static/img/tianshuiLogo.png) no-repeat'
                break;
            case '安徽':
                this.museumLogo.backgroundPosition = '0px 0px'
                this.museumLogo.background = 'url(/static/img/anhuiLogo.png)'
                break;
        
            default:
            this.islogoShow = false
                break;
        }
    }
}
</script>
<style lang="scss" scoped>
.el-container {
    height: 100%;
    min-width: 1366px;
    .el-header{
        // background-color: #B3C0D1;
        color: #fff;
        background: url(../assets/img/head.png) no-repeat;
        text-align: center;
        line-height: 60px;
        .headerTitle {
            text-align: right;
            font-size: 22px;
            .museumLogo {
                display: inline-block;
                height:50px;
                vertical-align: middle;
                background-repeat: no-repeat;
                background-size: 100%;
                transform: scale(0.8);
            }
        }
        .el-dropdown {
            color: #fff;
            width: 194px;
            // background: #486596;
            cursor: pointer;
            .el-dropdown-link .dropdownImg {
                // display: inline-block;
                width: 45px;
                height: 45px;
                float: left;
                margin: 8px 0 0 8px;
                vertical-align: middle;
                background: url(../assets/img/icon.png) no-repeat;
                background-position: -7px -263px;
            }
        }
    }
    .el-aside {
        height: 100%;
        background: #f4f4f4;
        border-right: #cdcdcd;
        background-image: url(../assets/img/pic.png);
        background-repeat: no-repeat;
        background-position: 0 100%;
        .asideIcon {
            display: inline-block;
            width: 30px;
            height: 30px;
            vertical-align: middle;
            background: url(../assets/img/icon1.png) no-repeat;
        }
        .icon_home_select {
            background-position: -13px -274px;
        }
        .icon_home_zhanting {
            background-position: -15px -522px;
        }
        .icon_home_kufang {
            background-position: -15px -567px;
        }
        .icon_home_guanwai {
            background-position: -15px -595px;
        }
        .leftAsideTitle {
            width: 100%;
            height: 49px;
            line-height: 49px;
            text-align: center;
            font-size: 18px;
            color: #fff;
            // opacity: .8;
            background: #e9edf2;
            border-bottom: 1px solid #e2e2e2;
            
        }
        .scrollBar {
            height: calc(100% - 50px);
            width: 200px;
        }
        .el-menu {
            // height: 100%;
            color:#fff;
            background: #f4f4f4;
            .el-submenu .el-menu-item {
                background: #eef1f6;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
            }
            .el-menu-item.is-active {
                background: #fff;
            }
            .el-menu-item {
                border-bottom: 1px solid #d5d5d5;
            }
        }
    }
    .el-main {
        .navMenuContainer {
            .el-menu.el-menu--horizontal {
                background-color: #eef1f6;
                
                .el-menu-item {
                    font-size: 16px;
                    color: #666;
                }
                .el-menu-item:focus, .el-menu-item:hover {
                    outline: 0;
                    color: #333;
                    background-color: rgb(235, 238, 243);
                }
            }
        }
        .homeMain {  // home页面的main高度
            height: calc(100% - 51px);
            // height: auto;
            min-height: 627px;
            padding: 10px 20px;
        }
        .setMain { // 设置页面的main高度
            height: 100%;
            min-height: 678px;
            
        }
    }
    .el-footer  {
        background: #999;
        text-align: center;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
    }
    $color-primary: #438eb9;//#18c79c
    $icon-lt-w: -13px;
    $icon-lt-h: -25px;

    // 图标 icon --- img
    .icon_img_bg_01{
    display: inline-block;
    height: 40px;
    width: 40px;
    background: url(../assets/img/logo4.png);
    transform: scale(.4);
    background-size: cover;
    }
    .icon_img_lt_01,
    .icon_img_lt_02,
    .icon_img_lt_03,
    .icon_img_lt_04,
    .icon_img_lt_05,
    .icon_img_lt_06,
    .icon_img_lt_07,
    .icon_img_lt_08,
    .icon_img_lt_09,
    .icon_img_lt_11,
    .icon_img_lt_12{
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 3px;
    background: url(../assets/img/icon1.png);
    vertical-align: middle;
    }
    .icon_img_lt_01{
    background-position: $icon-lt-w -304px;
    }
    .icon_img_lt_02{
    background-position: $icon-lt-w (-303+$icon-lt-h);
    }
    .icon_img_lt_03{
    background-position: $icon-lt-w (-303+$icon-lt-h*2);
    }
    .icon_img_lt_04{
    background-position: $icon-lt-w (-300+$icon-lt-h*3);
    }
    .icon_img_lt_05{
    background-position: $icon-lt-w (-297+$icon-lt-h*4);
    }
    .icon_img_lt_06{
    background-position: $icon-lt-w*9.3 -98px;
    }
    .icon_img_lt_07{
    background-position: $icon-lt-w*9.3 -131px;
    }
    .icon_img_lt_08{
    background-position: $icon-lt-w*9.3 -159px;
    }
    .icon_img_lt_09{
    background-position: $icon-lt-w*9.3 -189px;
    }
    .icon_img_lt_11{
    background-position: $icon-lt-w (-302+$icon-lt-h*24.5);
    }
    .icon_img_lt_12{
    background-position: -13px -256px;
    /* vertical-align: middle; */
    margin-top: -3px;
    }
    .icon_img_lt_10{
    display: inline-block;
    height: 40px;
    width: 26px;
    background: url(../assets/img/icon1.png);
    // vertical-align: middle;
    background-position: 0 -859px;
    float: left;
    }

    .icon_img_lt_air {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 3px;
        background: url(../../static/img/airTitle.png) no-repeat;
        vertical-align: middle;
    }

    
}
</style>


