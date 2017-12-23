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
                <el-button type="primary" size='mini'>导出数据</el-button>
                <el-button type="primary" size='mini'>导出图片</el-button>
              </el-form-item>
              <el-form-item style='float: right;' class='formTitleRight'>
                  <el-button @click='chartLineOrData = !chartLineOrData' :type=" chartLineOrData ? 'primary' : 'none'" size='mini' :style='{borderColor: primaryColor}'>曲线展示</el-button>
                  <el-button @click='chartLineOrData = !chartLineOrData' :type=" !chartLineOrData ? 'primary' : 'none'" size='mini' :style='{borderColor: primaryColor}'>数据展示</el-button>
              </el-form-item>
          </el-form>
      </el-col>
      <el-col :span='24' v-if='chartLineOrData' class='chartLineContsiner'>
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
        </el-col>
        <el-col :span='24' v-if='isSingleChannel' class='chartLine' >
          <ve-line
            height='250px'
            v-for='(item, idx) in historyChartData'
            :data='item.chartData'
            :grid='grid'
            :xAxis='xAxisOption'
            :key='idx'
            :after-config="afterConfig"
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
            :extend='dualExtend'
            :after-config="ChannelAfterConfig"
            >
          </ve-line>
        </el-col>
        <el-col class='channelNumcontent' :span='24'>
          <el-button @click='switchChannel' :type=" isSingleChannel ? 'primary' : 'none'" size='small' :style='{borderColor: primaryColor}' >单通道数据综合</el-button>
          <el-button @click='switchChannel' :type=" !isSingleChannel ? 'primary' : 'none'" size='small' :style='{borderColor: primaryColor}'>温湿度数据综合</el-button>
        </el-col>
      </el-col>
      <el-col :span='24' v-if='!chartLineOrData' class='chartLineContsiner'>
        <el-row  type="flex" justify="space-around">
          <el-col :span='16' style='position:relative'>
            <el-table :data='showDataTable' width='100%' border>
              <el-table-column prop='loggerName' label='仪器名称' ></el-table-column>
              <el-table-column prop='channelNum' label='通道数量' ></el-table-column>
              <el-table-column prop='date' label='采集时间' ></el-table-column>
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
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import { Data_Instrument, DataStat, DataAnalyzer, historyPageList, PieExceed } from './api'
import { SevenDay } from '@/assets/js/commonFunc'
// import LineCharts from '@/components/chartsComponent/lineCharts'
export default {
  data () {
    return {
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
      dualExtend: {
        grid:{
          top: '60'
        },
        series: {
          connectNulls: true
        },
        yAxis: []
      },
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
      rightTable: []

    }
  },
  computed: {
    ...mapGetters(['zhantingId', 'primaryColor'])
  },
  methods: {
    getLoggerData () {
      var params = { groupID: this.zhantingId }
      Data_Instrument(params).then(res => {
        console.log(res[0])
        this.selectOptions = []
        this.checkOptionSn = res[0] == undefined ? null : res[0].sn
        for(let item of res) {
          // console.log(item)
          this.selectOptions.push({
            value: item.sn,
            label: item.name
          })
        }
        this.getData()
      })
      
    },
    getData () {
      let params = {
        beginTime: this.date[0],
        endTime: this.date[1],
        sn: this.checkOptionSn
      }
      // console.log(params)
      // 曲线
      if(this.checkOptionSn !== null ) {
        DataStat(params).then(res => {
          console.log(res)
          if(res == [] || res.length == 0) {
              // 无数据
          } else {
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
            min: null,
            max: null,
            splitNumber: 5,
            interval: null,
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
        this.showDataTableTitle.push(eval('data[0].Ch' + idx +'Name'))
        for(let item of data) {
          let numName = eval('item.Ch' +idx +'NumName')
          let oneDateData = {}
          oneDateData['date'] = item.ITime
          oneDateData[numName] = eval('item.Ch' + idx)
          
          this.historyChartData[i].chartData.rows.push(oneDateData)
          this.xAxisOption.data.push(item.ITime)
          if(!isJustOne) {
            this.historyChartData[i].chartData.columns.push(numName)
            isJustOne = true
          }
        }
      }
      console.log(this.historyChartData)
    },
    dualChannelChart (data) {   // 温湿度综合
      // console.log(data)
      this.dualChannelData = {
        columns: [],
        rows: []
      }
      this.dualChannelSetting.axisSite.right = []
      let isOnec = false
      for(let i = 0; i < data.length; i++) {
        var tempName = data[i].IName + '-温度'
        var humiName = data[i].IName + '-湿度'
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
      options.yAxis[0].max = (value) => {
        return _this.integerMax(Math.ceil(value.max))
      }
      options.yAxis[0].min = (value) => {
        return _this.integerMin(Math.floor(value.min))
      }
      return options
    },
    ChannelAfterConfig (options) {  // 温湿度
      let _this = this
      options.yAxis[0].max = 40
      options.yAxis[0].min = (value) => {
        return _this.integerMin(Math.floor(value.min))
      }
      options.yAxis[1].max = (value) => {
        return _this.integerMax(Math.ceil(value.max))
      }
      options.yAxis[1].min = (value) => {
        return _this.integerMin(Math.floor(value.min))
      }
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
    }
  },
  mounted () {
    this.getLoggerData()
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
      margin-bottom: 10px;
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
    .el-button {
      float: left;
    }
    .el-button+.el-button {
      margin-left: 0;
    }
    .el-button:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .el-button:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .chartLineContsiner {
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
    }
    .myPagination {
      background: #fff;
      padding: 5px 0;
      height: 42px;
      // line-height: 42px;
      margin-bottom: 0;
      // position: absolute;
      // bottom: 0;
    }
  }
}
</style>


