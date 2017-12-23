<template>
      <el-container>
        <el-header :style='{backgroundColor: primaryColor}' >
            
            <el-col :span='14' class='headerTitle'>
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
                        <el-dropdown-item command='扫码接口'>扫码接口</el-dropdown-item>
                        <el-dropdown-item divided command='退出登录'>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-header>
        <el-container>
            <el-aside width="200px" v-if='type == "home"'>
                <div class='leftAsideTitle'>
                    <i class='asideIcon'></i>
                    <span>展厅区域分类</span>
                </div>
                 <div class='scrollBar' v-bar >
                    <div>
                        <el-menu
                        class='zhantingMenu' 
                        :default-active='"100"'
                        :default-openeds='["1","2","3"]'
                        @select='selectZhanting'
                            >
                            <el-submenu v-if='zhantingList[0]' index='1'>
                                <template slot='title'>
                                    <i></i>
                                    <span>展厅</span>
                                </template>
                                <el-menu-item v-for='item in zhantingList[0]' :key='item.GROUP_ID' :index='String(item.GROUP_ID)' >
                                    {{ item.GROUP_NAME }} 
                                </el-menu-item>
                            </el-submenu>
                            <el-submenu v-if='zhantingList[1]' index='2'>
                                <template slot='title'>
                                    <i></i>
                                    <span>文物库房</span>
                                </template>
                                <el-menu-item v-for='item in zhantingList[1]' :key='item.GROUP_ID' :index='String(item.GROUP_ID)' >
                                    {{ item.GROUP_NAME }}
                                </el-menu-item>
                            </el-submenu>
                            <el-submenu v-if='zhantingList[2]' index='3'>
                                <template slot='title'>
                                    <i></i>
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
                <el-menu
                router
                :default-active='routePath.path + "/" + routePath.children[0].path'
                    >
                    <el-menu-item v-for='item in routePath.children' 
                    router
                    :key='routePath.path + "/" + item.path'
                    :index='routePath.path + "/" + item.path' 
                    >
                        {{ item.meta.title }}
                    </el-menu-item>
                </el-menu>
            </el-aside>
            
            <el-main v-bar style='height: 100%' ref='homeBar' @scroll='windowScroll'>
                <div>
                    <el-col :span='24' class='navMenuContainer' v-if='type == "home"'>
                    <el-menu
                        :default-active='menuDefaultAutive'
                        text-color='#333'
                        unique-opened
                        mode='horizontal'
                        router>
                        <template v-for='(item, idx) in routePath' >
                            <!-- {{ item }} -->
                            <el-submenu v-if='item.children' :key='idx' :index='String(idx)' >
                                <template slot='title'>
                                    <span>{{item.meta.title}}</span>
                                </template>
                                <el-menu-item  v-for='childItem in item.children' 
                                :index="'/' + item.path + '/' + childItem.path" 
                                :key='childItem.path' 
                                v-if='!childItem.isHidden'>
                                    {{ childItem.meta.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if='item.children == undefined ' :key='idx' :index="'/' + item.path">
                                {{ item.meta.title }}
                            </el-menu-item>
                        </template>
                
                    </el-menu>
                </el-col>
                <el-col :span='24' class='mainContainer' :class='{homeMain: type == "home", setMain: type !== "home"}' >
                    <router-view @windowReset='windowResets'></router-view>
                </el-col>
                </div>
                
                
            </el-main>
            <helpDialog ref='openHelp'/>
        </el-container>
        <el-footer height='30px'>CopyRight&copy;2008-2016,深圳市华图测控系统有限公司,粤ICP备08032186号</el-footer>
    </el-container>
</template>
<script>
import ChangeTheme from '@/components/changeTheme/changeTheme'
import helpDialog from '@/components/helpComponent'
import { mapGetters } from 'vuex'
import { UserLogin, zhantingList } from './api'
import qs from 'qs'
export default {
    data () {
        return {
            // primaryColor: '#365887',
            ids: null,
            zhantingList: [],
            defaultActive: '',
            menuDefaultAutive: '',
            screenWidth: new Date().getTime(),    // 监听窗口变化，默认值 时间戳 
            timer: false
        }
    },
    components: { ChangeTheme, helpDialog },
    props: [ 'routePath', 'type' ],
    computed: {
        ...mapGetters(['primaryColor'])
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
                case '扫码登录': 
                    break;
                default:
                console.log('tuichu')
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
                // console.log(this.defaultActive)
            })
        },
        getMenuFouc () {
            let path = this.$route.path
            // console.log(path)
            for( let item of this.routePath) {
                if(item.children) {
                    for(let value of item.children) {
                        if(( '/' + item.path + "/" + value.path) == path ) {
                            this.menuDefaultAutive = '/' + item.path + "/" + value.path
                            break;
                        }
                    }
                } else {
                    if(("/" + item.path ) == path) {
                        this.menuDefaultAutive = '/' + item.path
                    }
                }
            }
        },
        windowResets () {
            // console.log('---')
            let height = $(document.body).height()
            console.log(height)
            $('.mainContainer').height(height - 160)
        },
        windowScroll (event) {
            console.log('scroll')
            console.log(event)
        }
    },
    mounted () {
        // console.log(this.type)
        const that = this
        window.onresize = () => {
            return (() => {
                console.log(new Date().getTime())
                window.screenWidth = new Date().getTime()
                that.screenWidth = window.screenWidth
            })()
        }
        let homeBox = this.$refs['homeBar']
        window.addEventListener('scroll', () => {
            console.log('scroll')
        },false)
        console.log(this.$vuebar.getState($('.vb')))
        if(this.type == 'home') {
            this.menuDefaultAutive = '/' + this.routePath[0].path   // 导航菜单默认打开
            let user = JSON.parse(sessionStorage.getItem('user'))
            this.ids = user.ids
            this.getZhantingList()
            this.getMenuFouc()
            
        } else {
           
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
        }
        .el-dropdown {
            color: #fff;
            width: 194px;
            background: #486596;
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
        background: #e9edf2;
        border-right: #cdcdcd;
        background-image: url(../assets/img/pic.png);
        background-repeat: no-repeat;
        background-position: 0 100%;
        .leftAsideTitle {
            width: 100%;
            height: 49px;
            line-height: 49px;
            text-align: center;
            font-size: 18px;
            color: #4b6eaa;
            background: #e9edf2;
            border-bottom: 1px solid #e2e2e2;
            
        }
        .scrollBar {
            height: calc(100% - 50px);
            width: 200px;
        }
        .el-menu {
            // height: 100%;
            background: #e9edf2;
            .el-submenu .el-menu-item {
                background: #dadde3;
            }
        }
    }
    .el-main {
        .homeMain {  // home页面的main高度
            height: calc(100% - 51px);
            // height: auto;
            min-height: 627px;
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
    
}
</style>


