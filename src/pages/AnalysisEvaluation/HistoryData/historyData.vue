<template>
  <el-row class='historyDataContainer'>
      <el-col :span='24'>
        <el-form 
            inline>
              <el-form-item label='仪器名称:'>
                  <el-select
                  v-model='checkOptionSn'
                  @change='changeSelectOption'
                  size='mini'>
                    <el-option v-for='item in selectOptions' :key='item.value' :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label='采集时间:'>
                  <el-date-picker
                    type='daterange'
                    format='yyyy-MM-dd HH:mm:ss'
                    size='mini'
                    @change='changeHistoryDate'
                    v-model='date'
                    :clearable='false'
                    :picker-options='disabledDate'
                    range-separator="到">

                  </el-date-picker>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" size='mini' @click='queryData'>查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size='mini' @click='tableDataOut'>导出数据</el-button>
                <el-button type="primary" size='mini' @click='OutPutImg'>导出图片</el-button>
              </el-form-item>
              <el-form-item style='float: right;' class='formTitleRight'>
                  <span v-if='GetshowMemo' class='memorandum' @click='openAddMemorandumDialog' ></span>
                  
                  <el-button class='firstButton' @click='chartLineOrData = !chartLineOrData' :type=" chartLineOrData ? 'primary' : 'none'" size='mini' :style='{borderColor: primaryColor}'>曲线展示</el-button>
                  <el-button @click='chartLineOrData = !chartLineOrData' :type=" !chartLineOrData ? 'primary' : 'none'" size='mini' :style='{borderColor: primaryColor}'>数据展示</el-button>
              </el-form-item>
              <Memo :data='memorandumData' ref='memorand'/>
          </el-form>
      </el-col>
      <el-col v-if='isNotData' class='isNotDataText' :span='24'>暂无数据</el-col>
      <el-col :span='24' v-loading='loading' element-loading-text="加载中">
         <el-col :span='24' id='canvasToImg' v-if='chartLineOrData && !isNotData' class='chartLineContsiner'>
          <el-col :span='24' id='hideenText'  style='text-align: center; color:#666;margin-top: 5px; opacity:0' >{{ hiddenImgName }}</el-col>
          <el-col :span='24'  >
            <table class='multiTable' width='100%' border='0' cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th width="10%">{{ tableData.channelNum }}个测量通道</th>
                  <th width="10%">{{ tableData.count }}条记录</th>
                  <th width="10%">开始时间</th>
                  <th colspan="3">{{ tableData.beginTime }}</th>
                  <th width="10%">结束时间</th>
                  <th colspan="3">{{ tableData.endTime }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for='(item, index) in tableData.data' :key='index'>
                  <td>{{ item.Analyzer }}</td>
                  <td>{{ item.record }}</td>
                  <td>{{ item.S_data }}</td>
                  <td>{{ item.S_datas_1 }}</td>
                  <td>{{ item.S_datas_2 }}</td>
                  <td>{{ item.S_datas_3 }}</td>
                  <td>{{ item.N_data }}</td>
                  <td>{{ item.N_datas_1 }}</td>
                  <td>{{ item.N_datas_2 }}</td>
                  <td>{{ item.N_datas_3 }}</td>
                </tr>
              </tbody>
            </table>
          </el-col >
          <el-col :span='24' v-if='isSingleChannel' class='chartLine' >
            <ve-line
              height='250px'
              :width=' channelNum > 2? lineChartWidth/2+"px" : lineChartWidth + "px"'
              v-for='(item, idx) in historyChartData'
              :data='item.chartData'
              :yAxis='item.yAxis'
              :grid='grid'
              :extend='lineExtend'
              :ref='"charts"+idx'
              :xAxis='xAxisOption'
              :key='idx'
              :after-set-option='lineChartSetOption'
              ></ve-line>
          </el-col>
          <el-col v-if='!isSingleChannel' class='chartLine'>
            <ve-line
              height='500px'
              width='100%'
              :data='dualChannelData'
              :settings='dualChannelSetting'
              :grid='grid'
              :xAxis='xAxisOption'
              :yAxis='dualyAxis'
              :extend='dualExtend'
              :after-config="ChannelAfterConfig"
              >
            </ve-line>
          </el-col>
          <el-col class='channelNumcontent' :span='24'>
            <el-button class='firstButton' @click='isSingleChannel = true' :type=" isSingleChannel ? 'primary' : 'none'" size='small' :style='{borderColor: primaryColor}' >单通道数据综合</el-button>
            <el-button @click='isSingleChannel = false' :type=" !isSingleChannel ? 'primary' : 'none'" size='small' :style='{borderColor: primaryColor}'>温湿度数据综合</el-button>
          </el-col>
        </el-col>
        <el-col :span='24' v-if='!chartLineOrData && !isNotData' class='chartLineContsiner'>
          <el-row  type="flex" justify="space-around">
            <el-col :span='16' style='position:relative'>
              <el-table :data='showDataTable' width='100%' border>
                <el-table-column prop='loggerName' label='仪器名称' min-width='150'></el-table-column>
                <el-table-column prop='channelNum' label='通道数量' ></el-table-column>
                <el-table-column prop='date' label='采集时间' min-width='140' ></el-table-column>
                <el-table-column prop='channelOne' :label='showDataTableTitle[0]' v-if='showDataTableTitle[0]'></el-table-column>
                <el-table-column prop='channelTwo' :label='showDataTableTitle[1]' v-if='showDataTableTitle[1]' ></el-table-column>
                <el-table-column prop='channelThree' :label='showDataTableTitle[2]' v-if='showDataTableTitle[2]'></el-table-column>
                <el-table-column prop='channelFour' :label='showDataTableTitle[3]' v-if='showDataTableTitle[3]'></el-table-column>
              </el-table>
              <el-col :span='24' class='myPagination'>
                <el-pagination
                  layout='prev, pager, next'
                  :page-size='pageSize'
                  @current-change='ChangePageIndex'
                  :background='true'
                  :total='pageNum'
                ></el-pagination>
              </el-col>
            </el-col>
            <el-col :span='7' class='dataShowRight'>
              <el-col :span='24'>
                <p class='textTitle'>预警统计</p>
                <ve-pie
                  legend-position='bottom'
                  height='240px'
                  :extend='pieExtend'
                  :settings='{radius: 50,center:["50%", "50%"]}'
                  :data='pieChartData'></ve-pie>
              </el-col>
              <el-col :span='24'>
                <el-table border :data='rightTable'>
                  <el-table-column label='指标' prop='name' min-width='60'></el-table-column>
                  <el-table-column label='最大值' prop='max_data' min-width='55'></el-table-column>
                  <el-table-column label='最小值' prop='min_data' min-width='55'></el-table-column>
                  <el-table-column label='平均值' prop='Vao_data' min-width='55'></el-table-column>
                  <el-table-column label='波动值' prop='Waves_data' min-width='55'></el-table-column>
                </el-table>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-col>
     
      
  </el-row>
  
</template>
<script>
import { mapGetters } from 'vuex'
import { Data_Instrument, DataStat, DataAnalyzer, historyPageList, PieExceed, OutData } from './api'
import { SevenDay, saveImg, arrayMin, arrayMax } from '@/assets/js/commonFunc'
import Memo from '@/components/memorandum/memorandum'
import html2canvas from 'html2canvas'
import echarts from 'echarts'
export default {
  data () {
    return {
      isNotData: false,    // 无数据时
      selectOptions:[],
      date: [ new Date(SevenDay(new Date())), new Date()],
      disabledDate: {
          disabledDate(time) {
              return time.getTime() > Date.now();
          }
      },
      checkOptionSn: null,     // 选择的设备
      channelNum: null,         // 设备的通道数量
      isNoData: false,   
      chartLineOrData: true,    // true 为曲线展示 
      isSingleChannel: true,    // 单通道，双通道
      tableData: {
        channelNum: 0,    // 通道数量
        count: 0,          // 多少条数据
        beginTime: null,    // 开始时间
        endTime: null,     // 结束时间
        data: []           // 数据
      },
      historyChartData: [],  // 单通道数据
      dualChannelData: [],   // 温湿度数据
      dualChannelSetting: {  // 温湿度配置
        axisSite: { right: [] },
        yAxisName: ['(℃)温度', '(%)湿度']
      },
      lineExtend: {
      	series: {
      	  type: 'line',
          symbol: 'none',
          lineStyle: {
          	normal: { width: '1.5'}
          }
      	}
      },
      dualExtend: {
        grid:{
          top: '60'
        },
        series: {
          connectNulls: true,
          type: 'line',
          symbol: 'none',
          lineStyle: {
          	normal: { width: '1.5'}
          }
        },
        yAxis: {
        	axisLine: {
	            show: true
	          },
	        interval: null
	    }
      },
      dualyAxis: [
        {
          interval: null,
          axisLine: {
            show: true,
            symol: ['none', 'arrow']
          },
          axisTick: {
            show: true
          }
        },
        {
          interval: null,
          axisLine: {
            show: true,
            symol: ['none', 'arrow']
          },
          axisTick: {
            show: true
          }
        }
      ],
      dualMaxMin: [],
      grid: {
          top: '40',
          bottom: '20',
          left: '20',
          right: '20'
      },
      xAxisOption: {
        type: 'category',
        data:[],
        axisLabel: {
          formatter: function(value) {
            // console.log(value)
            var str_before = value.split(' ')[0];
            var str_after = value.split(' ')[1];
            return str_after + '\n' + str_before;
            
          }
        },
        axisLine: {
          show: true,
          symol: ['none', 'arrow']
        },
        axisTick: {
          show:true
        },
        splitLine: {
          show: true
        }
      },
      showDataTable:[],    // 数据展示表格
      showDataTableTitle: [], // 存放通道的名字
      pageIndex: 0,
      pageSize:10,
      pageNum: null,
      pieChartData: null,
      pieExtend: {
        series: {
          center: ['50%', '50%']
        }
      },
      rightTable: [],
      hiddenImgName: null,
      memorandumData: null,     // 备忘录
      lineChartWidth: null,
      loading: false

    }
  },
  computed: {
    ...mapGetters(['zhantingId', 'primaryColor', 'allZhanting', 'Loggersn', 'LoggerDate', 'GetshowMemo'])
  },
  components: { Memo },
  methods: {
    getLoggerData () {
      var params = { groupID: this.zhantingId }
      Data_Instrument(params).then(res => {
        console.log(res[0])
        this.selectOptions = []
        this.checkOptionSn = null
        if(res.length !== 0) {
          // this.isNotData = false
          for(let item of res) {
            // console.log(item)
            this.selectOptions.push({
              value: item.sn,
              label: item.name
            })
          }
          if(this.Loggersn !== null){
            this.checkOptionSn = this.Loggersn[0]
            for(let item of res) {
              if(this.Loggersn == item.sn) {
                this.hiddenImgName = item.name + '-' + item.sn
                this.$store.commit('setLoggerSn', null)
                break;
              }
            }
          } else {
            this.checkOptionSn = res[0] == undefined ? null : res[0].sn
            this.hiddenImgName = res[0].name + '-' + res[0].sn
          }
          
          
          this.getData()
        } else {
          this.isNotData = true
        }
        
      })
      
    },
    getData () {
      let params = {
        beginTime: this.date[0],
        endTime: this.date[1],
        sn: this.checkOptionSn
      }
      console.log(params)
      // 曲线
      if(this.checkOptionSn !== null ) {
        this.loading = true
        DataStat(params).then(res => {
          console.log(res)
          if(res == [] || res.length == 0) {
              // 无数据
              this.loading = false
              this.isNotData = true
          } else {
            this.loading = false
            this.isNotData = false
            this.channelNum = res[0].ChannelNum
            this.pageNum = res.length
            this.chartsLineFunc(res)     // dantongdao
            this.dualChannelChart(res)   // 温湿度
          }
        })
        
        // 曲线表格
        DataAnalyzer(params).then(res => {
          // console.log(res)
          if(res == [] || res == null) {
            this.isNoData = true
            return false
          } else {
            this.isNoData = false
            this.addTableData(res)
          }
        })
        // 数据展示表格
        this.dataShowTable()
        // 统计图
        PieExceed(params).then(res => {
          console.log(res)
          this.pieChartData = {
            columns: ['type', 'value'],
            rows: []
          }
          for(let item of res) {

            this.pieChartData.rows.push({
              type: item.name,
              value: item.value
            })

          }
          
          console.log(this.pieChartData)
        })
      }
    },
    chartsLineFunc (data) {
      this.historyChartData = []
      for(let i = 0; i < this.channelNum; i++ ) {
        this.historyChartData.splice(i, 1, {
          chartData: {
            columns: ['date'],
            rows: []
          },
          yAxis:{
            splitNumber: 5,
            interval: null,
            min: null,
            max: null,
            axisLine: {
              show: true,
              symol: ['none', 'arrow']
            },
            name: null
          }
        })
        
        let idx = i +1
        let isJustOne = false
        this.xAxisOption.data = []
        let maxArr = []
        this.showDataTableTitle.push(eval('data[0].Ch' + idx +'Name'))
        for(let item of data) {
          let numName = eval('item.Ch' +idx +'NumName')
          let oneDateData = {}
          oneDateData['date'] = item.ITime
          oneDateData[numName] = eval('item.Ch' + idx)
          maxArr.push(eval('item.Ch' + idx))
          this.historyChartData[i].chartData.rows.push(oneDateData)
          this.xAxisOption.data.push(item.ITime)
          if(!isJustOne) {
            this.historyChartData[i].chartData.columns.push(numName)
            this.historyChartData[i].yAxis.name = eval('item.Ch' + idx +'Unit')
            isJustOne = true
          }
        }
        let max = this.integerMax(Math.ceil(arrayMax(maxArr)))
        let min = this.integerMin(Math.floor(arrayMin(maxArr)))
        let interval = (max - min) / 5
        this.historyChartData[i].yAxis.max = max
        this.historyChartData[i].yAxis.min = min
        this.historyChartData[i].yAxis.interval = interval
      }
      console.log(this.historyChartData)
      for(let n = 0; n < this.channelNum; n++) {
      	this.$nextTick( _ => {
          console.log(this.$refs[`charts${n}`][0])
          if(this.$refs[`charts${n}`][0] !== undefined ) {
            this.$refs[`charts${n}`][0].echarts.resize()
          }
          
          // this.$refs[`charts${i}`].echarts.resize()
        })
      }
    },
    dualChannelChart (data) {   // 温湿度综合
      // console.log(data)
      this.dualChannelData = {
        columns: [],
        rows: []
      }
      let tempArr = [],
      	  humiArr = []

      this.dualChannelSetting.axisSite.right = []
      let isOnec = false
      for(let i = 0; i < data.length; i++) {
        var tempName = data[i].IName + '-温度'
        var humiName = data[i].IName + '-湿度'
        tempArr.push(data[i].Ch1)
         humiArr.push(data[i].Ch2)
        if( !isOnec) {
          this.dualChannelData.columns.push('date')
          this.dualChannelData.columns.push(tempName)
          this.dualChannelData.columns.push(humiName)
          this.dualChannelSetting.axisSite.right.push(humiName)
          if(i == 0) {
            isOnec = true
          }
        }
        let oneDateData = {}
        oneDateData['date'] = data[i].ITime
        oneDateData[tempName] = data[i].Ch1
        oneDateData[humiName] = data[i].Ch2
        this.dualChannelData.rows.push(oneDateData)
      }
      // console.log(this.dualChannelData)
      let tempMax = this.integerMax(Math.ceil(arrayMax(tempArr)))
      let tempMin = this.integerMin(Math.floor(arrayMin(tempArr)))
      let humiMax = this.integerMax(Math.ceil(arrayMax(humiArr)))
      let humiMin = this.integerMin(Math.floor(arrayMin(humiArr)))
      this.dualMaxMin.splice(0, 0, {
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        },
        max: tempMax,
        min: tempMin,
        interval: (tempMax - tempMin) / 5
      })
      this.dualMaxMin.splice(1, 0, {
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        },
        max: humiMax,
        min: humiMin,
        interval: (humiMax - humiMin) / 5
      })
      // console.log(this.dualChannelSetting)
    },
    dataShowTable () {
      let params = {
        sn: this.checkOptionSn,
        beginTime: this.date[0],
        endTime: this.date[1],
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      this.showDataTable = []
      historyPageList(params).then(res => {
        console.log(res)
        if(res.length > 0) {
          for(let item of res) {
            this.showDataTable.push({
              loggerName: item.IName,
              channelNum: this.channelNum,
              date: item.ITime,
              channelOne: item.Ch1,
              channelTwo: item.Ch2,
              channelThree: item.Ch3,
              channelFour: item.Ch4,
            })
          }
        }
      })
    },
    ChangePageIndex (index){
      this.pageIndex = index - 1
      this.dataShowTable()
    },
    afterConfig (options) {
      // console.log(options)
      let _this = this
      options.yAxis.max = (value) => {
        return _this.integerMax(Math.ceil(value.max))
      }
      options.yAxis.min = (value) => {
        return _this.integerMin(Math.floor(value.min))
      }
      return options
    },
    lineChartSetOption (chart) {  // 设置联动
      chart.group = 'multiData'
      echarts.connect('multiData')
    },
    ChannelAfterConfig (options) {  // 温湿度
      let _this = this
      console.log(options)
      options.yAxis[0].max = 40
      options.yAxis[0].min = this.dualMaxMin[0].min
      options.yAxis[0].interval = (40 - this.dualMaxMin[0].min) / 5
      
      options.yAxis[1].max = this.dualMaxMin[1].max
      options.yAxis[1].min = this.dualMaxMin[1].min
      options.yAxis[1].interval = _this.dualMaxMin[1].interval
      // options.yAxis[1].interval = (options.yAxis[1].max - options.yAxis[1].min)/5
      console.log(options)
      return options
    },
    integerMax (max) {
      if(max) {
        if(max%5 == 0){
          return max;
        }else{
          max++;
          return this.integerMax(max);
        }
      } else {
        return 0
      }
    },
    integerMin (max) {
      // console.log(max)
      if(max) {
        if(max%5 == 0){
          return max;
        }else{
          max--;
          return this.integerMin(max);
        }
      } else {
        return 0
      }
    },
    addTableData (data) {
      // 表头
      this.tableData.channelNum = data[0].ChannelNum
      this.tableData.count = data[0].count
      this.tableData.beginTime = data[0].beginTime
      this.tableData.endTime = data[0].endTime
      // td
      this.tableData.data = []
      this.rightTable = []
      for (let i = 1; i < data.length; i++) {
        this.tableData.data.push({
          "Analyzer": data[i].Name, 
          "record": data[i].Unit, 
          "S_data": '最大值:', 
          "S_datas_1": data[i].Max, 
          "S_datas_2": '最小值:', 
          "S_datas_3": data[i].Min, 
          "N_data": '平均值:', 
          "N_datas_1": data[i].Avg  , 
          "N_datas_2": '波动值:', 
          "N_datas_3": data[i].Waves 
        })
        this.rightTable.push({
          name: data[i].Name,
          max_data: data[i].Max,
          min_data: data[i].Min,
          Vao_data: data[i].Avg,
          Waves_data: data[i].Waves
        })
      }
    },
    tableDataOut () {   // 导出数据
      let params = {
        beginTime: this.date[0],
        endTime:this.date[1],
        sn: this.checkOptionSn
      }
      OutData(params).then(res =>{
        // console.log(res)
        window.open(res)
      })
    },
    OutPutImg () {   // 导出图片
     let zhantingName = ''
      //  outerloop:// 命名圈外语句
      $('#hideenText').css({'opacity': '1'})
     console.log(this.allZhanting)
      for(let key of this.allZhanting) {
        for(let item of key) {
          if(this.zhantingId == item.GROUP_ID) {
            zhantingName = item.GROUP_NAME
            break ;
          }
        }
      }

      html2canvas(document.querySelector('#canvasToImg')).then( (canvas) => {
        
          let fileName = zhantingName + '-数据分析-' + new Date().getTime() +'.png'

          

          saveImg(canvas,fileName);
          $('#hideenText').css({'opacity':'0'});
        
      })
    },
    openAddMemorandumDialog () {
      this.memorandumData = {
        Usn: this.checkOptionSn,
        beginTime: this.date[0],
        endTime: this.date[1],
        Entrance: '历史数据',
        GROUP_ID: this.zhantingId
      }
      this.$refs['memorand'].openTheMemo(true)
    },
    switchChannel () {
      this.isSingleChannel = !this.isSingleChannel
    },
    changeHistoryDate (date) {  // 选择时间
      if (date == null) {
          return false
      }
      let newDate = new Date();
      let chooseDate = new Date(date[1])
      let stopEndDate = new Date(date[1])
      stopEndDate.setHours(23)
      stopEndDate.setMinutes(59)
      stopEndDate.setSeconds(59)
      if(chooseDate.setHours(0,0,0,0) == newDate.setHours(0,0,0,0)) {
          date[1] = new Date()
      } else {
          date[1] = stopEndDate
      }
      this.date = date
    },
    queryData () {  // 查询按钮
      this.getLoggerData()
    },
    changeSelectOption (val) {  // 选择仪器
      this.checkOptionSn = val
      for(let item of this.selectOptions) {
        if(val == item.value) {
          this.hiddenImgName = item.label + '-' + val
          break;
        }
      }
    },
    getChartsContainerWidth () {
      this.lineChartWidth = $('.chartLine').width() - 22
    }
  },
  mounted () {
    if(this.Loggersn !== null) {
      this.checkOptionSn = this.Loggersn[0]
      console.log(this.checkOptionSn)
      if(this.LoggerDate !== null) {
        this.date = this.LoggerDate
        this.$store.commit('setDate', null)
      }
    }
    this.getLoggerData()
    this.getChartsContainerWidth()
  },
  watch: {
    zhantingId () {
      this.getLoggerData()
    }
  }
}
</script>
<style lang="scss" scoped>
.historyDataContainer {
  height: 100%;
  .el-form {
    .el-form-item {
      margin-bottom: 0px;
    }
    
  }
  .el-form--inline .el-form-item{
    margin-right: 5px;
    .el-button+.el-button {
      margin-left: 5px;
    }
  }
  .el-form--inline .formTitleRight, .channelNumcontent {
    padding-top: 10px;
    .memorandum {
      display: inline-block;
      width: 26px;
      height: 26px;
      float:left;
      vertical-align: middle;
      margin-right: 5px;
      cursor: pointer;
      background: url(../../../assets/img/eqitIcon.png) no-repeat;
    }
    .el-button {
      float: left;
    }
    .el-button+.el-button {
      margin-left: 0;
    }
    .firstButton {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .el-button:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .chartLineContsiner {
    #hideenText {
      height: 30px;
      line-height: 30px;
      background: #fff;
    }
    .multiTable {
      background: #fff;
      text-align: center;
      border: 1px solid #ddd;
      border-bottom: none;
      border-right: none;
      th {
        background: #ececec;
      }
      th, td {
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        height: 30px;
        line-height: 30px;
      }
    }
    .chartLine {
      padding: 10px 0;
      background: #fff;
      .ve-line {
        display: inline-block;
      }
    }
    .dataShowRight {
      background: #fff;
      .textTitle {
        height: 48px;
        line-height: 48px;
        text-align: center;
        margin-bottom: 0;
        background: #ececec;
      }
      .ve-pie {
        border-right:1px solid #ddd;
        border-left: 1px solid #ddd;
      }
    }
    .myPagination {
      // background: #fff;
      
      // height: 42px;
      // line-height: 42px;
      margin-bottom: 0;
      // position: absolute;
      // bottom: 0;
    }
  }
}
</style>


