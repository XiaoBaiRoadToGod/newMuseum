<template>
  <el-row type='flex' justify='space-around' :gutter='10' class='overviewContainer'>
      <el-col :span='8' class='museumInfo myLeft' >
        <el-row class='container'>
          <el-col :span='24' class='content' >
            <el-col :span='24' class='title'><i class='gailanIcon'></i>博物馆概览</el-col>
            <el-col :span='24' class="imgCont"><img  v-bind:src='imgUrl' alt=""></el-col>
            <el-col :span='24' class='fontSize18'>博物馆简介</el-col>
            <el-col :span='24' class='detail'>{{detail}}</el-col>
            <el-col :span='24' class='moreDetail'>
              <a :href="GetmuseumURL" target='_blank ' v-if='GetMuseumShowUrl'><i class='el-icon-caret-right'></i>更多详情</a>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span='16' class='museumInfo'>
        <el-row class='rightContainer'>
          <el-col :span='24' class='myBorder content' style='margin-bottom: 20px'>
            <el-col :span='24' class='title'><i class="linshiIcon"></i>{{ viewName }}</el-col>
            
            <el-col :span='11' class='right20'>
              <span class='shebeiTitle'>文物保存环境状态汇总</span>
              <el-table :data='environmentState'>
                <el-table-column prop='name' label='文物名称'></el-table-column>
                <el-table-column prop='num' label='超标数量'></el-table-column>
                <el-table-column prop='sum' label='文物总数'></el-table-column>
              </el-table>
            </el-col>
            <el-col :span='11' class='right20'>
              <span class='shebeiTitle'>监测设备运行状况汇总</span>
              <el-table :data='shebeiState' class='my-el-table'>
                <el-table-column prop='name' label='设备名称'></el-table-column>
                <el-table-column prop='num' label='设备数量'></el-table-column>
                <el-table-column prop='sum' label='异常数量'></el-table-column>
                <el-table-column prop='chaoB' label='超标数量'></el-table-column>
              </el-table>
            </el-col>
            
          </el-col>
          <el-col :span='24' class='myBorder' v-if='!overviewGroup' >
            <el-col :span='24' class='title'><i class='quanIcon'></i>全馆运行环境情况监测</el-col>
            <el-col :span='11' class='right20'>
              <span class='shebeiTitle'>文物保存环境状态汇总</span>
              <el-table :data='quanguanEnState'>
                <el-table-column prop='name' label='文物名称'></el-table-column>
                <el-table-column prop='num' label='超标数量'></el-table-column>
                <el-table-column prop='sum' label='文物总数'></el-table-column>
              </el-table>
            </el-col>
            <el-col :span='11' class='right20'>
              <span class='shebeiTitle'>监测设备运行状况汇总</span>
              <el-table :data='quanguShebeiState'>
                <el-table-column prop='name' label='设备名称'></el-table-column>
                <el-table-column prop='num' label='异常数量'></el-table-column>
                <el-table-column prop='chaoB' label='超标数量'></el-table-column>
              </el-table>
            </el-col>
            
          </el-col>
          <el-col :span='24' class='myBorder' v-if='overviewGroup'>
            <el-col :span='24' align='left' style='margin-bottom:10px;'>
              <span :style="{width: '50px', color: primaryColor, borderBottom: '1px solid '+ primaryColor}" class='textButton' @click='bianjiDialog = true'>编辑</span>
              <el-dialog :visible.sync='bianjiDialog' title='添加设备' class='overViewDialog' @close="closeDialog">
                  <div class='checkGroup'>
                    <span class='checkTitle' style='border-bottom:1px solid #ccc'>展厅设备</span>
                    <div class='checkList'>
                      <el-checkbox-group v-model="checkedLoggers" @change="loggersChange">
                        <el-checkbox v-for="city in loggers" :label="city.key" :key="city.name">{{city.name}}</el-checkbox>
                    </el-checkbox-group>
                    </div>
                    <span class='checkTitle' style='border-top:1px solid #ccc'> <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="AllCheckChange"></el-checkbox>共选择 {{ num }} 项</span>
                  </div>
                  <span slot="footer" class="">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="okDialog">确 定</el-button>
                  </span>
              </el-dialog>
              <span :style="{width:'80px',color: primaryColor, borderBottom: '1px solid '+ primaryColor}" class='textButton' @click='setDate'>时间设定</span>
              <el-dialog class='setDialog' title='请设定时间' :visible.sync='setDialog' top='40%'>
                <div style='height:78px;line-height:78px;'>请设置时间： <input v-model='setDay' type="number" class='setInput'>  天</div>
                <span slot="footer" class="footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="okSetDialog">确 定</el-button>
                  </span>
              </el-dialog>
              <span class='overViewInput' >{{myDay}}天</span>
            </el-col>
            <el-col :span='24' class='myBorder'>
              <el-table
                :data='overViewTableData'
                border
                >
                <el-table-column
                  prop='name'
                  label='设备名称'>
                  
                </el-table-column>
                <el-table-column
                  prop='location'
                  label='设备位置'>
                  
                </el-table-column>
                <el-table-column
                  prop='temp'
                  min-width='90'
                  label='平均温度(℃)'>
                  
                </el-table-column>
                <el-table-column
                  prop='humi'
                  min-width='90'
                  label='平均湿度(%)'>
                  
                </el-table-column>
                <el-table-column
                  prop='tempMaxVal'
                  label='温度最大值'>
                  
                </el-table-column>
                <el-table-column
                  prop='tempMinVal'
                  label='温度最小值'>
                  
                </el-table-column>
                <el-table-column
                  prop='humiMaxVal'
                  label='湿度最大值'>
                  
                </el-table-column>
                <el-table-column
                  prop='humiMinVal'
                  label='湿度最小值'>
                  
                </el-table-column>
                <el-table-column
                  
                  label='操作'>
                  <template slot-scope='scope'>
                    <el-button type='text' @click.native.prevent="deleteRow(scope.$index, overViewTableData)">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
  </el-row>
</template>
<script>
import {
    museumInfo, 
    wenwuEnvir, 
    wenwuFacility, 
    GetOverviewGroupLoggers, 
    AddOverviewGroupLoggers, 
    DeleteOverviewGroupLoggers, 
    GetOverviewGroupDetails  
  } from './api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      detail: null,
      imgUrl: null,
      viewName: null,
      environmentState: [],   //临时博物馆文物保存环境状态汇总
			shebeiState: [],          //临时博物馆设备运行状态汇总
			quanguanEnState:[],		//全馆文物保存环境状态汇总
      quanguShebeiState:[],		//全馆设备运行状态汇总
      user:'',
      viewName: '',
      overViewTableData:[],    //平均温湿度表格
      bianjiDialog: false,
      checkedLoggers:[], // 选择的的设备
      loggers:[],  // 未分组设备
      checkAll:false, 
      isIndeterminate:true,
      num: 0,     // 共选择了多少
      myDay: 7,
      setDay: null,
      setDialog: false,
      loading: false,
      quanguanInfo: false,     //  深博、国博、南博为true, 其他false
    }
  },
  computed: {
    ...mapGetters(['zhantingId', 'allZhanting', 'primaryColor', 'overviewGroup', 'GetMuseumShowUrl', 'overviewGroup', 'GetmuseumURL'])
  },
  methods: {
    getData () {
      let params = { SName: this.zhantingId }

      wenwuEnvir(params).then(res =>{   // 当前展厅
        this.environmentState = [];  // 清空数组
        if(res != null){
          for(var i = 0; i<res.length; i++){
            this.environmentState.push({'name':res[i].name,'num':res[i].value,'sum':res[i].values});
          }
        }
      })
      wenwuFacility(params).then(res => {   // 当前展厅运行汇总
        this.shebeiState = []
        if(res != null){
          for(var i = 0; i<res.length; i++){
            this.shebeiState.push({'name':res[i].name,'num':res[i].value,'sum':res[i].values,'chaoB': res[i].valuess});
          }
        }
      })
      if (this.overviewGroup) {
        this.getLoggers()
      }
    },
    getLoggers(){
      var loggerParams = { groupid: this.zhantingId };
      GetOverviewGroupLoggers(loggerParams).then(res => {
        console.log(res);
        this.loggers = [];
        var allLoggers = [],notGroupLoggers = [];
        allLoggers = res[0].one;
        var groupLogger = res[0].tue;
        if(groupLogger.length != 0){
          for(var i = 0; i< groupLogger.length;i++){
            for(var j = 0;j<allLoggers.length;j++){
              if(groupLogger[i].LOGGER_SN == allLoggers[j].LOGGER_SN){
                allLoggers.splice(j,1);
                j = j-1 < 0 ? 0 : j-1;
              }
            }
          };
          for(var k = 0; k<allLoggers.length;k++){
            this.loggers.push({
              name:allLoggers[k].LOGGER_NAME,
              key:allLoggers[k].LOGGER_SN
            })
          }
        }else{
          for(var i = 0; i < allLoggers.length; i++){
            this.loggers.push({
              'key': allLoggers[i].LOGGER_SN,
              'name': allLoggers[i].LOGGER_NAME
            })
          }
        }
        console.log(this.loggers);

      });
    
      this.getGroupData();
    },
    getGroupData(){
      this.loading = true;
      var params = {day: this.myDay};
      GetOverviewGroupDetails(params).then(res => {
        console.log(res);
        res = res.sort(function(a, b){  // 按名字排序					
          return (a.LOGGER_NAME).localeCompare(b.LOGGER_NAME, 'zh-Hans-CN', {sensitivity: 'accent'});
        });
        this.loading = false;
        this.overViewTableData = []; 
        for(var i = 0;i<res.length;i++){
          this.overViewTableData.push({
            'name':res[i].LOGGER_NAME,
            'location':res[i].Position,
            'temp': res[i].Ch1Avg || 0,
            'humi': res[i].Ch2Avg || 0,
            'tempMaxVal': res[i].Ch1Max || 0,
            'tempMinVal': res[i].Ch1Min || 0,
            'humiMaxVal': res[i].Ch2Max || 0,
            'humiMinVal': res[i].Ch2Min || 0,
            'sn': res[i].LOGGER_SN
          })
        }
      })
    },
    setDate(){
      this.setDialog = true;
      // console.log(this.myDay);
      this.setDay = '';
      // console.log(this.setDay);
      this.setDay = this.myDay;
      // console.log(this.setDay);
      
    },
    okSetDialog(){
      
      // console.log('-'+this.setDay+'-');
      if(!(/^\d+$/.test(this.setDay)) || this.setDay == ''){
        this.$message({
          type:'warning',
          message:'请输入正确的天数！！！'
        })
      }else{
        // this.setDay.replace('.','');
        this.setDialog = false;
        this.myDay = parseInt(this.setDay);
        this.getGroupData();
      }
      
    },
    deleteRow(idx, rows){
      console.log(rows[idx].sn);
      var params = { sn: rows[idx].sn };
      DeleteOverviewGroupLoggers(params).then(res => {
        console.log(res);
        if(res == 200){
          this.$message({
            type:'success',
            message:'删除成功！！！'
          });
          this.getLoggers();
          this.getGroupData();
        }else{
          this.$message({
            type:'warning',
            message:'删除失败！！！'
          })
        }
      })
    },
    loggersChange(value){
      // console.log(value);
      // console.log(this.checkedLoggers);
      this.num = value.length;
      this.checkAll = value.length === this.loggers.length;
      this.isIndeterminate = value.length > 0 && value.length < this.loggers.length
    },
    AllCheckChange(event){
      // console.log(event.target.checked);
      // console.log(this.loggers);
      var logg = [];
      for(var j = 0;j<this.loggers.length;j++){
        logg.push(this.loggers[j].key);
      }
      this.checkedLoggers = event.target.checked ? logg : [];
      this.num = this.checkedLoggers.length;
      this.isIndeterminate = false;
      // console.log(this.checkedLoggers)
    },
    closeDialog(){
      this.bianjiDialog = false;
      this.checkedLoggers = [];
      this.num = 0;
      this.checkAll = false;
      // console.log(this.isIndeterminate)
      this.setDialog = false;
    },
    okDialog(){
      if(this.checkedLoggers.length){
        var params = { sn: this.checkedLoggers.join(',').replace('"',"")};
        console.log(params);
        AddOverviewGroupLoggers(params).then(res => {
          console.log(res);
          if(res == 200){
            this.$message({
              type:'success',
              message:'添加成功！！！'
            });
            this.checkedLoggers = [];
            this.num = 0;
            this.getLoggers();
            this.getGroupData();
          }else{
            this.$message({
              type:'warning',
              message:'添加失败！！！'
            })
          }
        })
        this.bianjiDialog = false;
      }else{
        this.$message({
          type:'warning',
          message:'请选择设备！！！'
        })
      }
    },
    getZhantingName () {
      if (this.allZhanting) {
        for(let key of this.allZhanting) {
          for(let item of key) {
            if(this.zhantingId == item.GROUP_ID) {
              this.viewName = item.GROUP_NAME
            }
          }
        }
      }
      
    }
  },
  created () {
    
    museumInfo().then(res => {
      this.imgUrl = res.ImageURL
      this.detail = res.MDetails
    })
    let params = { SName: '' }
    wenwuEnvir(params).then(res => {
      if(res != null){
					for(var i = 0; i<res.length; i++){
						this.quanguanEnState.push({'name':res[i].name,'num':res[i].value,'sum':res[i].values});
					}
				}
    })
    wenwuFacility(params).then(res => {
      if(res != null){
        for(var i = 0; i<res.length; i++){
          this.quanguShebeiState.push({'name':res[i].name,'num':res[i].value,'sum':res[i].values,'chaoB': res[i].valuess});
        }
      }
    })
    if(this.environmentState == ''){
				this.getData();
		};
  },
  mounted () {
    this.getZhantingName()
    this.getData()
  },
  watch: {
    zhantingId () {
      this.getZhantingName()
    }
  }
}
</script>
<style lang="scss" scoped>
.overviewContainer {
  .museumInfo {
    .title {
      height: 44px;
      line-height: 44px;
      // text-align: center;
      padding-left: 20px;
      background: #efeff0;
      .gailanIcon {
        display: inline-block;
        width: 28px;
        height: 28px;
        vertical-align: middle;
        background-image: url(../../assets/img/icon1.png);
        background-repeat: no-repeat;
        margin-right: 20px;
        background-position: -119px -226px;
      }
    }
    .imgCont {
      padding: 10px;
    }
    .fontSize18 {
      font-size: 18px;
      text-align: left;
      padding-left: 12px;
    }
    .detail {
      overflow: hidden;
      color: #666;
      padding: 10px 12px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 6;
      text-align: left;
    }
    .moreDetail {
      text-align: right;
      padding-right: 22px;
      margin-top: 20px;
      color: #b2865d;
      a {
        color: #b2865d;
        text-decoration: none;
      }
    }
    .container {
      height: 100%;
      border: 1px solid #ddd;
      .content {
        height: 100%;
        background: #fff;

      }
    }
    .rightContainer {
      height: 50%;
      
      .myBorder {
        background: #fff;
        border: 1px solid #ddd;
        .textButton{
          display: inline-block;
          height:26px;
          line-height: 26px;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          margin-right: 10px;
        }
        .overViewInput{
          display: inline-block;
          width: 60px;
          height:26px;
          line-height: 26px;
          border:1px solid #ccc;
          border-radius: 8px;
          text-align: center;
          color:#666;
        }
        .overViewInput.el-input input{
          display: inline-block;
          height:26px;
          border:1px solid #ccc;
          padding-left: 8px;
          text-indent: 1em;
        }
        .title i {
          display: inline-block;
          width: 28px;
          height: 28px;
          vertical-align: middle;
          background-image: url(../../assets/img/icon1.png);
          background-repeat: no-repeat;
          background-position: -119px -264px;
          margin-right: 20px;
        }
        .right20 {
          margin-left: 20px;
          .shebeiTitle {
            display: block;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            text-align: left;
          }
        }
      }
    }
    
  }

}
</style>


