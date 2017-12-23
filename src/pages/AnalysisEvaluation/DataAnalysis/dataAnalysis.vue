<template>
  <el-row class='multiDataContainer'>
      <el-col :span='24' class='multiTitle'>
        <el-form :inline='true'>
          <el-form-item>
            <el-button type="primary" size='mini' icon='el-icon-setting'>选择参考设备</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size='mini' icon="el-icon-search" @click='openChildMulti'>查询多组数据</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size='mini' @click='outDataMultiAll' >导出数据</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size='mini'>导出图片</el-button>
          </el-form-item>
          <el-form-item class='goBack' >
            <div class='myIcon'></div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='24' v-if='noData' >
        暂无数据
      </el-col>
      <el-col :span='24'  v-if='!noData'>
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
      <el-row  v-if='!noData && isSingleChannel' type="flex" justify="space-around" style='width: 100%'>
        <el-col :span='21' class='chartsLine' >
          <ve-line height='250px' 
            v-for='(item,idx) in lineChartsData' :key='idx'
            :width='lineChartsData.length > 2 ? lineChartWidth/2 +"px" : lineChartWidth+"px"' 
            :ref='"charts"+idx'
            :data='item.data' 
            :title='item.title'
            :class='"charts"+idx'
            :xAxis='xAxisOption'
            :yAxis= 'item.yAxis'
            :after-set-option='lineChartSetOption'
            :grid='grid'
            :color='colors'
            :extend='chartsExtend'
            :legend-visible='false' ></ve-line>
        </el-col>
        <el-col :span='3' class='loggerNameCon'>
          <div class='loggerNameColor' v-for='(item, idx) in chartsLineName' :key='idx'>
              <span class='loggerColor' :style='{background: colors[idx]}' ></span>
              <span class='loggerName' >{{ item }}</span>
          </div>
        </el-col>
      </el-row>
      <el-col v-if='!noData && !isSingleChannel' class='chartsLine' :span='24'>
        <ve-line
          height='500px'
          width='100%'
          :data='dualChannelData'
          :settings='dualChannelSetting'
          :grid='grid'
          :xAxis='xAxisOption'
          :color='colors'
          :extend='dualExtend'
          :after-config="afterConfig"
          >
        </ve-line>
      </el-col>
      <el-col class='channelNumcontent' v-if='!noData' :span='24'>
        <el-button @click='switchChannel' :type=" isSingleChannel ? 'primary' : 'none'" size='small' :style='{borderColor: primaryColor}' >单通道数据综合</el-button>
        <el-button @click='switchChannel' :type=" !isSingleChannel ? 'primary' : 'none'" size='small' :style='{borderColor: primaryColor}'>温湿度数据综合</el-button>
      </el-col>
      <logger-dialog  @changeLogger='queryData' ref='openMulti'/>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import LoggerDialog from './selectMultipleDevices'
import { analysisSn, openWarningMessage, arrayMin, arrayMax } from '@/assets/js/commonFunc'
import { TabMulti, MultiData, multiDataOutExl } from './api'
export default {
  data () {
    return {
      checkSn: [],        // 选择的sn
      date: null,
      noData: false,
      tableData: {
        channelNum: 0,    // 通道数量
        count: 0,          // 多少条数据
        beginTime: null,    // 开始时间
        endTime: null,     // 结束时间
        data: []           // 数据
      },
      lineChartsData: [],
      referEquipment: null,     // 参考设备
      isIdentical: false,        // 判断是否需要补数据 true 为补数据
      dataMaxLength: null,        // 补数据最长的数据
      MaxDataChatLine: null,      // 通道数量
      chartsLineName: [],          // 选择的设备名字
      colors: ['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#0067a6', '#c4b4e4', '#d87a80', '#9cbbff', '#d9d0c7', '#87a997', '#d49ea2', '#5b4947','#336699','#77aa22','#776611','#ffdd44','#48bbef','#6d51eb','#f14562','#32beb2','#e911fc','#32beb2','#36f7a7','#03d723','#a4f736','#f7ea36','#f79736','#f76d36','#b06a00','#96b000','#00b00f'],
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
      grid: {
        top: '50',
        bottom: '0'
      },
      chartsExtend: {
        series: {
          connectNulls: true
        },
        
      },
      dualExtend: {
        grid: {
          right: '20%'
        },
        series: {
          connectNulls: true
        },
        legend: {
          type: 'scroll',
          align: 'left',
          orient: 'vertical',
          right: '10',
          top: '5%',
        },
        yAxis: []
      },
      dualChannelData: {
        columns: [],
        rows: [],
      },    // 温湿度数据
      dualChannelSetting: {  // 温湿度配置
        axisSite: { right: [] },
        yAxisName: ['(℃)温度', '(%)湿度']
      },
      lineChartWidth: null,
      isSingleChannel: true ,      // true为单通道数据
      Parmas: {}                  // 传给后台的参数
    }
  },
  computed: {
    ...mapGetters(['zhantingId','primaryColor'])
  },
  components:{ LoggerDialog },
  methods: {
    queryData (snArr, date) {
      // console.log(snArr)
      // console.log(date)
      this.$refs.openMulti.openTheDialog(false)
      this.date = date
      let chooseSn = snArr
      let verId = []
      this.checkSn = []
      for (let val of chooseSn) {
        this.checkSn.push(analysisSn(val).sn)
        verId.push(analysisSn(val).verId)
      }
      verId = new Set(verId)
      let myVerId = []
      for(let key of verId) {
        myVerId.push(key)
      }
      // console.log(this.checkSn)
      // console.log(myVerId)
      let _this = this
      if(myVerId.length > 1) {
        openWarningMessage('error', '选择的设备类型不同!!!', _this)
      } else {
        this.checkSn = Array.from(new Set(this.checkSn))
        let snArray = this.checkSn.join(',')
        this.Parmas = {
          beginTime: this.date[0],
          endTime: this.date[1],
          sn: snArray
        }
        //  表格数据
        TabMulti(this.Parmas).then(res => {
          console.log(res)
          if (res == [] || res == null) {
            this.noData = true
            return false
          } else {
            this.addTableData(res)
          }
        })
        // 曲线数据
        if (this.referEquipment == null ) {
          MultiData( this.Parmas).then(res => {
            console.log(res)
            if(res !== []) {
              this.chartLine(res)
            }
          })
        } else {
        }
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
      }
    },
    chartLine (data) {   // 单通道数据
      /**
       * 去除没有数据的
       */
      let  removeEmptyData = data;
      data = [];
      for( var i = 0; i < removeEmptyData.length; i++ ) {
        // console.log(removeEmptyData[i] !== []);
        if( removeEmptyData[i] !== []  && removeEmptyData[i].length !== 0) {
          data.push(removeEmptyData[i]);
        }
      }

      let sortData = this.bubbleSort(data);
      this.dataMaxLength = sortData[sortData.length - 1];//最长的数组
			/**@augments
       * 判断是否需要补数据
       */
      if ( this.referEquipment == null ) {
        if(data.length > 1) {
          this.isIdentical = false
          for(let item of data) {
            if(item.data.length !== data[0].data.length) {
              this.isIdentical = true
              break
            }
          }
        }
      }
      /**@augments
       * 补数据
       */
      data = this.fillTheData(data)
      data = data.sort(function(a, b){  // 按名字排序
        return (a.IName).localeCompare(b.IName, 'zh-Hans-CN', {sensitivity: 'accent'});
      });
      this.dualChannelChart(data)    // 显示温湿度通道
      this.MaxDataChatLine = data[0].ChannelNum; //通道的数量
      /***@augments
       * 循环设备
       */
      this.lineChartsData = []    // 清空以前的
      this.chartsLineName = []
      for(let i = 0; i < this.MaxDataChatLine; i++) {
        this.lineChartsData.splice(i, 1, {  // 数组指定位置添加
          data: {
            columns: ['date'],
            rows:[],
          },
          title: {
            text: null,
            width: '100%',
            x: 'center',
            textStyle: {
              fontSize: '14px',
              align: 'center'
            }
            
          },
          subText: null,
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
        
        let dataArr = []
        let isOnec = false
        for(let key of Object.keys(data)) {
          this.lineChartsData[i].data.columns.push(data[key].IName)  
          let name = data[key].IName
          this.chartsLineName.push( data[key].IName)
          this.xAxisOption.data = []
          // console.log(name)
          this.lineChartsData[i].title.text = eval('data[key].Ch' + idx + 'NumName')
          this.lineChartsData[i].yAxis.name = "(" + eval('data[key].Ch'+ idx+ "Unit") +")"+eval('data[key].Ch' + idx + 'Name')
          for(let n = 0; n < data[key].data.length; n++) {
            // console.log(n)
            let oneDateData = {}
            dataArr.push(eval('data[key].data[n].Ch' + idx))
            this.xAxisOption.data.push(data[key].data[n].ITime)
            // console.log(eval('data[key].data[n].Ch' + idx))
            if(isOnec) {
              // console.log(n)
              // console.log('erci')
              // console.log(this.lineChartsData[i].data.rows[n])
              this.lineChartsData[i].data.rows[n][name] = eval('data[key].data[n].Ch' + idx)
            } else {
              oneDateData.date = data[key].data[n].ITime
              oneDateData[name] = eval('data[key].data[n].Ch' + idx)
              // console.log('onec')
              this.lineChartsData[i].data.rows.push(oneDateData)
              if(n == data[key].data.length - 1) {
                isOnec = true
              }
            }
          }
        } 
        // console.log(dataArr)
        this.lineChartsData[i].yAxis.max = this.integerMax(Math.ceil(arrayMax(dataArr)))
        this.lineChartsData[i].yAxis.min = this.integerMin(Math.floor(arrayMin(dataArr)))
        // console.log('----')
        // console.log(this.lineChartsData[i].yAxis.min)
        this.lineChartsData[i].yAxis.interval = (this.lineChartsData[i].yAxis.max - this.lineChartsData[i].yAxis.min) / 5
      }
      // console.log(this.lineChartsData)
      this.chartsLineName = Array.from(new Set(this.chartsLineName)) 
      this.$emit('windowReset')
      for(let i = 0; i < this.MaxDataChatLine; i++) {
        this.$nextTick( _ => {
          //console.log(this.$refs[`charts${i}`][0].echarts)
          this.$refs[`charts${i}`][0].echarts.resize()
          // this.$refs[`charts${i}`].echarts.resize()
        })
      }
      
    },
    dualChannelChart (data) {   // 温湿度综合
      console.log(data)
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
        }
        this.dualChannelData.columns.push(tempName)
        this.dualChannelData.columns.push(humiName)
        this.dualChannelSetting.axisSite.right.push(humiName)
        for(let n = 0; n < data[i].data.length; n++ ) {
          let oneDateData = {}

          if( !isOnec ) {
            console.log('onec')
            oneDateData['date'] = data[i].data[n].ITime
            oneDateData[tempName] = data[i].data[n].Ch1
            oneDateData[humiName] = data[i].data[n].Ch2
            this.dualChannelData.rows.push(oneDateData)
            if(n == data[i].data.length - 1) {
              isOnec = true
            }
          } else {
            this.dualChannelData.rows[n][tempName] = data[i].data[n].Ch1
            this.dualChannelData.rows[n][humiName] = data[i].data[n].Ch2
          }
          
        }
      }
      console.log(this.dualChannelData)
      console.log(this.dualChannelSetting)
    },
    fillTheData (data) {   // 补数据
      if(this.isIdentical) {
        for(var i = 0,len = this.dataMaxLength.data.length; i<len; i++){
								// console.log(this.dataMaxLength[i]);
          for(var j = 0; j < data.length;j++){	
            // console.log(data[j][i])
            if(data[j].data[i]){
              var MaxDataDate = Date.parse(new Date(this.getHoursDate(this.dataMaxLength.data[i].ITime)));
              var buDataDate = Date.parse(new Date(this.getHoursDate(data[j].data[i].ITime)));
              // console.log(Date.parse(new Date((this.dataMaxLength[i].ITime).replace('-', '/'))));
              if( MaxDataDate !== buDataDate){
                
                if(MaxDataDate < buDataDate){
                  data[j].data.splice(i, 0, {
                    'Ch1': '-',
                    'Ch2': '-',
                    'Ch3': '-',
                    'Ch4': '-',
                    'ITime':this.dataMaxLength.data[i].ITime
                  });
                  
                } else {
                  this.dataMaxLength.data.splice(i, 0, {
                    'Ch1': '-',
                    'Ch2': '-',
                    'Ch3': '-',
                    'Ch4': '-',
                    'ITime':data[j].data[i].ITime
                  });
                  len += 1;
                  j = -1;
                }
                
              }
            } else {
              //console.log(i);
              data[j].data.splice(i, 0, {
                'Ch1': '-',
                'Ch2': '-',
                'Ch3': '-',
                'Ch4': '-',
                'ITime':this.dataMaxLength.data[i].ITime
              })
            }
            
          }
        }
        return data
      } else {
        return data
      }
    },
    getHoursDate(str) {   // 获取时间， 到小时， 因为有的同一时间段的数据时间分钟不一样
				var date = new Date(Date.parse(str.replace(/-/g, '/')));
				var year = date.getFullYear();
				var Month = date.getMonth() + 1;
				var day = date.getDate();
				var H = date.getHours();
				return year + '/'+ Month + '/' + day + ' ' + H + ':00:00';
		},
    bubbleSort (arr) {    // 数组排序，最长的在最后面
      var len = arr.length;
      for (var i = 0; i < len; i++) {
          for (var j = 0; j < len - 1 - i; j++) {
              if (arr[j].data.length > arr[j+1].data.length) {        //相邻元素两两对比
                  var temp = arr[j+1];        //元素交换
                  arr[j+1] = arr[j];
                  arr[j] = temp;
              }
          }
      }
      return arr;
    },
    openChildMulti () {
      this.$refs.openMulti.openTheDialog(true)
    },
    integerMax (max) {
      if(max) {
        if(max%5 == 0){
          return max;
        }else{
          max++;
          return this.integerMax(max);
        }
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
    afterConfig (options) {
      console.log(options)
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
    beforeChartConfig (data) {
      console.log(data)
    },
    lineChartSetOption (chart) {  // 设置联动
      chart.group = 'multiData'
      echarts.connect('multiData')
    },
    getChartsContainerWidth () {  // 获取图表容器的width
      // console.log($('.chartsLine').width())
      this.lineChartWidth = $('.chartsLine').width() - 22
      // console.log(this.lineChartWidth)
    },
    switchChannel () {   //切换单通道和温湿度通道
      this.isSingleChannel = !this.isSingleChannel

    },
    outDataMultiAll () {
      multiDataOutExl(this.Parmas).then(res => {
        console.log(res)
        window.open(res)
      })
    }

  },
  mounted () {
    this.getChartsContainerWidth()
    window.onscroll = () => {
      console.log('scroll')
    }
  }
}
</script>
<style lang="scss" scoped>
.multiDataContainer {
  height: 100%;
  position: relative;
  .multiTitle {
    .el-form-item {
      margin-bottom: 0;
       
    }
    .goBack {
      float: right;
      .myIcon {
        display: inline-block;
        width: 30px;
        height:25px;
        background: url(../../../assets/img/icon1.png) no-repeat;
        background-position: -19px -775px;
      }
    }
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
  .chartsLine {
    background: #fff;
    padding-bottom: 20px;
    .ve-line {
      display: inline-block;
    }
  }
  .loggerNameCon {
    background: #fff;
    padding-top: 20px;
    .loggerNameColor {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .loggerColor {
        display: inline-block;
        width: 12px;
        height: 8px;
      }
      .loggerName {
        font-size: 12px;

      }
      
    }
  }
  .channelNumcontent {
    padding: 10px 20px;
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
  
}
</style>


