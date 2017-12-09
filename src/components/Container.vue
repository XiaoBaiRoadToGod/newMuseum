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
                <el-dropdown >
                    <span class='el-dropdown-link'>
                        <span class='dropdownImg' ></span>
                        admin
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot='dropdown'>
                        <el-dropdown-item>主页</el-dropdown-item>
                        <el-dropdown-item>帮助</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item>扫码接口</el-dropdown-item>
                        <el-dropdown-item divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <div class='leftAsideTitle'>
                    <i class='asideIcon'></i>
                    <span>展厅区域分类</span>
                </div>
                 <div class='scrollBar' v-bar >
                    <div>
                        <el-menu
                        class='zhantingMenu' 
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
            
            <el-main>
                <el-col :span='24' class='navMenuContainer'>
                    <el-menu
                        background-color='#D3DCE6'
                        :default-active='$router.path'
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
                                <el-menu-item v-for='childItem in item.children' :index="'/' + item.path + '/' + childItem.path" :key='childItem.path' >
                                    {{ childItem.meta.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if='item.children == undefined' :key='idx' :index="'/' + item.path">
                                {{ item.meta.title }}
                            </el-menu-item>
                        </template>
                
                    </el-menu>
                </el-col>
                <el-col :span='24' class='mainContainer'>
                    <router-view></router-view>
                </el-col>
                
            </el-main>
            
        </el-container>
        <el-footer height='30px'>CopyRight&copy;2008-2016,深圳市华图测控系统有限公司,粤ICP备08032186号</el-footer>
    </el-container>
</template>
<script>
import ChangeTheme from '@/components/changeTheme/changeTheme'
import { UserLogin, zhantingList } from './api'
import qs from 'qs'
export default {
    data () {
        return {
            primaryColor: '#365887',
            ids: null,
            zhantingList: [],
            defaultActive: '',
            scrollOpt: {
                background:"#cecece",
                width:'5px',
                deltaY:'100'
            }
        }
    },
    components: { ChangeTheme },
    props: [ 'routePath', 'type' ],
    methods: {
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
                if(this.zhantingList[0].length !== 0) {
                    this.defaultActive = JSON.stringify(this.zhantingList[0][0].GROUP_ID);
                } else if(this.zhantingList[1].length !== 0) {
                    this.defaultActive = JSON.stringify(this.zhantingList[1][0].GROUP_ID);
                }else if(this.zhantingList[2].length !== 0) {
                    this.defaultActive = JSON.stringify(this.zhantingList[2][0].GROUP_ID);
                }
            })
        }
    },
    mounted () {
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.ids = user.ids
        this.getZhantingList()
        console.log(this.routePath)
        console.log(this.type)
        var params = qs.stringify({
            name: 'admin',
            pwd: 'admin'
        })
        //   UserLogin(params).then(res => {
        //       console.log(res);
        //       let userInfo =  JSON.stringify({
        //           name: res.ok[0].USER_NAME,
        //           ids: res.ok[0].USER_GROUP_IDS
        //       });
        //       sessionStorage.setItem('user', userInfo)
        //   })
    }
}
</script>
<style lang="scss" scoped>
.el-container {
    height: 100%;
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
    .el-footer  {
        background: #999;
        text-align: center;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
    }
    
}
</style>


