<template>
    <el-row class='realTimeContainer'>
        <el-col :span='24' class='content'  >
            <div class='ListContainer' v-if='!showList && !isNotData'>
                <img :src="rela_img" alt="" class='ListBackImg' @click='clickHideDetails'>
                <div v-for='(item, idx) in items' :key='idx' class='LoggerContent' :style="{top:item.Top+'%',left:item.Left+'%'}">
                    <img :src="item.UulIng" @click='clickHideDetails(idx)' v-if='item.iconShow' alt="" class='LoggerIcon' :style='{width:item.isHengwen?"48px":"24px"}'>
                    <div  class='passagewayContainer' @click='clickShowDetail(idx)' v-if='!item.iconShow' >
                        <p v-if="item.Tmp != null" :style="{color:item.color1}"  >{{ item.Tmp + item.Tmp_Unit }}</p>
                        <p v-if="item.Huid != null" :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit   }}</p>
                        <p v-if="item.Songd != null" :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</p>
                        <p v-if="item.Uaug != null" :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</p>
                    </div>
                    <!-- 详情 -->
                    <!-- 居中 -->
                    <div class='LoggerAwayDetails'  style="left:-90px;top:35px" v-if="20<item.Left && item.Left<80 && 20<item.Top && item.Top<80 && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_center arrows'></i>
                    </div>
                    <!-- 左中 -->
                    <div class='LoggerAwayDetails' style="left:40px;top:-20px;" v-else-if="20>item.Left && 20<item.Top && item.Top<80 && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_left_center arrows'></i>
                    </div>
                    <!-- 右中 -->
                    <div class="LoggerAwayDetails"  style="left:-240px;top:-20px;" v-else-if="80<item.Left && 20<item.Top && item.Top<80 && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_right_center arrows'></i>
                    </div>
                    <!-- 上中 -->
                    <div class="LoggerAwayDetails"  style="left:-90px;top:35px" v-else-if="20<item.Left && item.Left<80 && item.Top<20 && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_top_center arrows'></i>
                    </div>
                    <!-- 下中 -->
                    <div class="LoggerAwayDetails" style="left:40px;top:-40px" v-else-if="20<item.Left && item.Left<80 && 80<item.Top && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_bottom_center arrows'></i>
                    </div>
                    <!-- 左上 -->
                    <div class="LoggerAwayDetails" style="left:40px;top:0px" v-else-if="20>item.Left && 20>item.Top && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_left_top arrows'></i>
                    </div>
                    <!-- 右上 -->
                    <div class="LoggerAwayDetails" style="left:-240px;top:0px" v-else-if="80<item.Left && 20>item.Top && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_right_top arrows'></i>
                    </div>
                    <!-- 左下 -->
                    <div class="LoggerAwayDetails" style="left:40px;top:-80px" v-else-if="20>item.Left && 80<item.Top && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_lift_bottom arrows'></i>
                    </div>
                    <!-- 右下 -->
                    <div class="LoggerAwayDetails" style="left: -240px;top:-50px;" v-else-if="80<item.Left && 80<item.Top && item.iconShow">
                        <section class="title_img">
                            <h4>{{ item.Name }}</h4><img :src="item.UingElecT" alt="">
                        </section>
                        <section class="cons_text">
                            <section v-if="item.Tmp != null">{{ item.Tmp_Name }}<span :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</span></section>
                            <section v-if="item.Huid != null">{{ item.Huid_Name }}<span :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit }}</span></section>
                            <section v-if="item.Songd != null">{{ item.Songd_Name }}<span :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</span></section>
                            <section v-if="item.Uaug != null">{{ item.Uaug_Name }}<span class='overflowDisplay' :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</span></section>
                        </section>
                        <section class="right_fr"><span @click="Data_Router(idx)" :name="item.yiId">查看统计图>></span></section>
                        <i class='arrows_right_bottom arrows'></i>
                    </div>
                </div>  
                
            </div>
            <div class='ListContainer' v-if='showList'>
                <div v-bar style='height: 100%'>
                    <div>
                        <div class='showListBox' v-for='(item,idx ) in items' :key='idx'>
                            <p class='title' :style='{backgroundColor: primaryColor}'> {{ item.Name }}</p>
                            <div class='showListDetails' :class="{twoAisle: item.number <= 2, threeAisle: item.number >= 3 }">
                                <p v-if='item.Tem !== null' :style="{color:item.color1}">{{ item.Tmp + item.Tmp_Unit }}</p>
                                <p v-if="item.Huid !== null" :style="{color:item.color2}">{{ item.Huid + item.Huid_Unit   }}</p>
                                <p v-if="item.Songd !== null" :style="{color:item.color3}">{{ item.Songd + item.Songd_Unit }}</p>
                                <p v-if="item.Uaug !== null" :style="{color:item.color4}">{{ item.Uaug + item.Uaug_Unit }}</p>
                            </div>
                            <div class='showListFooter'>
                                <div>
                                    <img :src="item.UingElecT" alt="">
                                </div>
                                <div class='date'>
                                    {{ item.time}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='LoggerInfoContainer'>
                <div class='qualityAssessment'>
                    <p class='textAlignCenFFF' :style='{background: primaryColor}'>环境质量评估</p>
                    <div class='fractions' :style='{border: "3px solid " + primaryColor}' >{{ evalQualityScore }}</div>
                </div>
                <div class='monitoringPoint'>
                    <p class='textAlignCenFFF' :style='{background: primaryColor}'>监测点统计: 共{{ monitoringPointNum }}台</p>
                    <div v-bar class='scorllBar'>
                        <div>
                            
                            <div class='monitorCont' v-for='(item, idx) in monitoringPoint' :key='idx'>
                                <img class='monitorImg' :src="item.PropPathURL" alt="">
                                <span class='montorSb'>{{ item.PropString }}</span>
                                <span class='montorNum'>:{{ item.PropInteger }}台</span>
                            </div> 
                           
                        </div>
                    </div>
                </div>
                <div class='alermNumber monitoringPoint'>
                    <p class='textAlignCenFFF' :style='{background: primaryColor}'>报警数量统计</p>
                    <div class='content'>
                        <div class='monitorCont'>
                            <img class='monitorImg' src="../../assets/img/正常运行.png" >
                            <span class='montorSb'>正常运行</span>
                            <span class='montorNum'>:{{ warningNumber[0] }}个</span>
                        </div>
                        <div class='monitorCont' >
                            <img class='monitorImg' src="../../assets/img/一般预警.png" >
                            <span class='montorSb'>一般预警</span>
                            <span class='montorNum'>:{{ warningNumber[1] }}个</span>
                        </div>
                        <div class='monitorCont' >
                            <img class='monitorImg' src="../../assets/img/严重预警.png" >
                            <span class='montorSb'>严重预警</span>
                            <span class='montorNum'>:{{ warningNumber[2] }}个</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class='switchContainer' v-if='!isNotData'>
                <el-switch
                v-model="showList"
                active-text="列表"
                inactive-text="分布图">
                </el-switch>
            </div>
            <el-col :span='15' v-if='isNotData' class='isNotDataText' style='float: left' >暂无数据</el-col>
        </el-col>
        
    </el-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { GetDeviceInfo, GetGetScore, GetDeviceAlarm, EqmtStatistics } from './api'
export default {
    data () {
        return {
            items: [],
            rela_img: '',
            showDetails: false,
            showList: true,
            isNotData: false,
            evalQualityScore: null,    // 质量评估
            monitoringPoint: null,     // 监测点统计
            monitoringPointNum: null,   // 监测点统计共几台
            warningNumber: ['','','']         // 报警数量
        }
    },
    computed: {
        ...mapGetters(['zhantingId', 'primaryColor'])
        // zhantingId () {
        //     return this.$store.getters.zhantingId
        // },
        // primaryColor () {
        //     return this.$store.getters.primaryColor
        // }
    },
    methods: {
       getDataAll () {
           let params = { GROUP_ID: this.zhantingId }
           
           GetDeviceInfo(params).then(res => {
               this.items = []
               console.log(res);
                if(res[0][0] === null ) {
                    this.isNotData = true
                } else {
                    this.isNotData = false
                    let data = res.sort((a, b) => {   // 按名字排序
                        return (a[0].localeCompare(b[0], 'zh-Hans-CN', {sensitivity: 'accent'}))
                    })
                    // console.log(data);
                    for(let item of data) {
                        // console.log(key)
                        // console.log(item)
                        this.rela_img = item[23]  // 背景图片
                        let shebeiNumber;
                        if(item[1] !== null && item[2] !== null && item[3] !== null && item[4] !== null ) {
                            shebeiNumber = 4
                        } else if (item[1] !== null && item[2] !== null && item[3] !== null) {
                            shebeiNumber = 3
                        } else if (item[1] !== null && item[2] !== null ) {
                            shebeiNumber = 2
                        } else {
                            shebeiNumber = 1
                        }
                        // 是否是恒温恒湿机
                        let isHengwen
                        // let isHengwen = item[13].indexOf('恒温恒湿机') >= 0
                        item[13] == null ? isHengwen = false : isHengwen = item[13].indexOf('恒温恒湿机') >= 0

                        this.items.push({
                            Name: item[0],
                            UulIng: item[13],
                            UingElecT: item[22],
                            Top: (Number(item[11])+Number(item[12])) * 50,
                            Left: (Number(item[9])+Number(item[10])) * 50,
                            Tmp: item[1],
                            Huid: item[2],
                            Songd: item[3],
                            Uaug: item[4],
                            Tmp_Unit: item[5],
                            Huid_Unit:item[6],
                            Songd_Unit: item[7],
                            Uaug_Unit: item[8],
                            color1: item[14],
                            color2: item[15],
                            color3:item[16],
                            color4: item[17],
                            yiId: item[20] + '/' + item[19],
                            Tmp_Name: item[24],
                            Huid_Name: item[25],
                            Songd_Name: item[26],
                            Uaug_Name: item[27],
                            isHengwen: isHengwen,
                            number: shebeiNumber,
                            time: item[21],
                            iconShow: false
                        })

                    }
                }
           })
       },
       getFractions () {    // 获取质量评估分数
           var params = { GROUP_ID:this.zhantingId, flag: false }
           GetGetScore(params).then(res => {
               this.evalQualityScore = res
           })
       },
       getMonitoringStatis () {  // 获取监测点统计
            let params = { GROUP_ID: this.zhantingId, flag:true }
            EqmtStatistics(params).then(res => {
                // console.log(res)
                this.monitoringPointNum = res[res.length - 1].PropInteger
                this.monitoringPoint = res.slice(0, res.length-1)
            })
       },
       getAlermNumber () {
           let params = { GROUP_ID: this.zhantingId, flag:false }
           GetDeviceAlarm(params).then(res => {
               this.warningNumber = res;
           })
       },
       Data_Router (idx) {
           console.log(this.items[idx].yiId)
           this.$store.commit('setLoggerSn', this.items[idx].yiId.split(','))
           this.$router.push('/Analysis/DataAnalysis')
       },
       clickShowDetail (idx) {
           console.log(idx)
           for(var i = 0; i < this.items.length; i++) {
               if(i == idx) {
                   this.items[i].iconShow = true
               } else {
                   this.items[i].iconShow = false
               }
           }
        //    this.items[idx].iconShow = true
       },
       clickHideDetails (idx) {
        //    this.showDetails = false
        //    this.items[idx].iconShow = false
        for( let item of this.items) {
            item.iconShow = false
        }
       }
    },
    mounted () {
        this.getDataAll()
        this.getFractions()
        this.getMonitoringStatis()
        this.getAlermNumber()
        let _this = this
        setInterval(() => {
            _this.getDataAll()
            _this.getFractions()
            _this.getMonitoringStatis()
            _this.getAlermNumber()
        }, 30000)
    },
    watch: {
        zhantingId () {
            // console.log('----')
            this.getDataAll()
            this.getFractions()
            this.getMonitoringStatis()
            this.getAlermNumber()
        }
    }
}
</script>
<style lang="scss" scoped>
.realTimeContainer, .content {
    height: 100%;
    position: relative;
    .ListContainer {
        width: calc(100% - 180px);
        height: 100%;
        position: relative;
        display: inline-block;
        .ListBackImg {
            width: 100%;
            height: 100%;
        }
        .LoggerContent {
            position: absolute;
            .LoggerIcon {
                // display: none;
            }
            .passagewayContainer {
                
                background: #fff;
                box-shadow: 1px 1px 1px 1px #999;
                // display: none;
                font-size: 12px;
                line-height: 14px;
                padding: 5px;
                border-radius: 3px;
                cursor: pointer;
                p {
                    margin: 0;
                    height: 14px;
                }
                
            }
            .LoggerAwayDetails {
                // display: none;
                position: absolute;
                width: 213px;
                border: 1px solid #ddd;
                box-shadow: 1px 1px 6px 2px #ddd;
                border-radius: 6px;
                background: #fff;
                padding: 10px 6px;
                z-index: 99;
                .title_img {
                    h4 {
                        display: inline-block;
                        margin:0;
                    }
                    img {
                        float: right;
                    }
                }
                .cons_text section{
                    color: #666;
                    width: 49%;
                    display: inline-block;
                    span {
                        padding-left: 10px;
                    }
                }
                .right_fr {
                    float: right;
                    color: #67b6df;
                    cursor: pointer;
                    
                }

            }
            .arrows_center{
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 10px solid #fff;
                position: absolute;
                top:-10px;
                left: 100px;

            }
            .arrows_right_top{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-left: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                right: -10px;
                top:10px;
            }
            .arrows_left_top{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-right: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                left:-10px;
                top:10px;
            }
            .arrows_top_center{
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 10px solid #fff;
                position: absolute;
                top:-10px;
                left:100px;
            }
            .arrows_bottom_center{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-right: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                top:50px;
                left: -10px;
            }
            .arrows_lift_bottom{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-right: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                top:80px;
                left: -10px;
            }

            .arrows_right_bottom{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-left: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                top: 60px;
                right: -10px;
            }
            .arrows_right_center{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-left: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                top:28px;
                right:-10px;
            }
            .arrows_left_center{
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-right: 10px solid #fff;
                border-bottom: 5px solid transparent;
                position: absolute;
                top:30px;
                left: -10px;
            }
        }
        .showListBox {
            width: 228px;
            height: 130px;
            margin: 0 5px 20px 0;
            border-radius: 5px;
            border:1px solid #ccc;
            display: inline-block;
            .title {
                color: #fff;
                height: 30px;
                line-height: 30px;
                margin: 0;
                text-align: center;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;
            }
            .showListDetails {
                border-bottom: 1px solid #ccc;
                p {
                    width: 110px;
                    text-align: center;
                    display: inline-block;
                    font-size: 20px;
                    margin: 0;
                }
            }
            .twoAisle p {
                height: 74px;
                line-height: 74px;
            }
            .threeAisle p {
                height: 37px;
                line-height: 37px;
                
            }
            .showListFooter {
                padding: 0 10px;
                div {
                    width: 100px;
                    height: 25px;
                    line-height: 25px;
                    display: inline-block;
                    vertical-align: top;
                }
                .date {
                    color: #8f9092;
                    text-align: center;
                }
            }
        }
        

    }
    .LoggerInfoContainer {
        width: 170px;
        position: absolute;
        right: -20px;
        top: -10px;
        display: inline-block;
        padding: 10px 12px;
        padding-top: 20px;
        height: calc(100% - 20px);
        vertical-align: top;
        background-color: #e9edf2;
        .textAlignCenFFF {
            color: #fff;
            text-align: center;
            margin:0;
        }
        .qualityAssessment {
            .fractions {
                width: 70px;
                height: 70px;
                border: 3px solid #88bfdf;
                margin: 20px auto;
                border-radius: 50%;
                text-align: center;
                line-height: 70px;
                font-size: 36px;
                color: #8e8e8e;
            }
        }
        .monitoringPoint {
            .scorllBar {
                height: 162px;
            }
            .monitorCont {
                padding: 7px 0;
                text-align: center;
                .monitorImg {
                    width: 24px;
                    height: 24px;
                    vertical-align: middle;
                }
                .montorSb {
                    display: inline-block;
                    width: 56px;
                    overflow: hidden;
                    text-align: right;
                    white-space: nowrap;
                    margin-left: 10px;
                    vertical-align: middle;
                }
                .montorNum {
                    display: inline-block;
                    width: 45px;
                    overflow: hidden;
                    text-align: left;
                    vertical-align: middle;
                }
            }
        }
        .alermNumber {
            .content {

            }
        }
    }
    .switchContainer {
        position: absolute;
        top: -45px;
        right: 0;
    }
}
</style>


