<template>
  <el-row class='assessmentContainer'>
      <el-col :span='24'>
        <el-form :inline='true'>
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
        </el-form>
      </el-col>
      <el-col v-if='isNotData' class='isNotDataText' :span='24'>暂无数据</el-col>
      <el-col :span='24' v-if='!isNotData' v-loading='loading' element-loading-text="加载中">
        <el-row type="flex" justify="space-around" >
          <el-col :span='16' class='assessChartContent' style='margin-right: 20px;'>
            <el-col :span='24' class='content'>
              <div class='title'>温湿度平均曲线图</div>
              <ve-line
              height='240px'
              :grid='grid'
              :xAxis='xAxisOption'
              :extend='lineExtend'
              :yAxis='chartyAxis[0]'
              :data='tempChartLineData'>
              </ve-line>
              <ve-line
              height='240px'
              :grid='grid'
              :xAxis='xAxisOption'
              :extend='lineExtend'
              :yAxis='chartyAxis[1]'
              :data='humiChartlineData'>

              </ve-line>
            </el-col>
            
          </el-col>
          <el-col :span='7'  class='assessChartContent'>
            <el-col :span='24' class='content'>
              <div class='title'>区域九方格温湿度平均值</div>
              <el-col :span='24'>
                <el-radio-group v-model='radioVal' @change='radioValChange' >
                    <el-radio :label="1">温度</el-radio>
                    <el-radio :label="2">湿度</el-radio>
                  </el-radio-group>
              </el-col>
              <el-col :span='24' class='scratchable'>
                <el-col :span='8' v-for='(item,idx) in scratchableData' :key='idx' >
                  {{ radioVal == 1 ? item.temp : item.humi }}
                </el-col>
              </el-col>
              <el-col :span='24' class='zhibiao'>
                <el-col :span='12' >指标</el-col>
                <el-col :span='12' >合格率</el-col>
              </el-col>
              <el-col :span='24' class='hegelv' v-if='YIELD_data.length > 0' >
                <el-col :span='12' >温度</el-col>
                <el-col :span='12' >{{ YIELD_data[0].value1 }}</el-col>
                <el-col :span='12' >湿度</el-col>
                <el-col :span='12' >{{ YIELD_data[0].value2 }}</el-col>
              </el-col>
            </el-col>
            
          </el-col>
          
        </el-row>
        <el-col :span='24' class='assessTable'>
            <el-table :data='tab_buttom_data' border height='200' >
              <el-table-column prop='name' label='仪器名称' ></el-table-column>
              <el-table-column prop='Tmp_data_Max' label='Max温度(°C)' ></el-table-column>
              <el-table-column prop='Tmp_data_Min' label='Min温度(°C)' ></el-table-column>
              <el-table-column prop='Vaio_data_Tmp' label='平均温度(°C)' ></el-table-column>
              <el-table-column prop='wave_data_Tmp' label='温度波动' ></el-table-column>
              <el-table-column prop='Huid_data_Max' label='Max湿度(%RH)' ></el-table-column>
              <el-table-column prop='Huid_data_Min' label='Min湿度(%RH)' ></el-table-column>
              <el-table-column prop='Vod_data_Huid' label='平均湿度(%RH)' ></el-table-column>
              <el-table-column prop='Wave_data_Huid' label='湿度波动' ></el-table-column>
            </el-table>
          </el-col>
      </el-col>
      
      
  </el-row>
</template>
<script>
import { SevenDay, arrayMin, arrayMax  } from '@/assets/js/commonFunc'
import { BenchmarkStatistics, SudukuMean, YIELD, Wave } from './api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      date: [ new Date(SevenDay(new Date())), new Date()],
      disabledDate: {
          disabledDate(time) {
              return time.getTime() > Date.now();
          }
      },
      tempChartLineData: {},
      humiChartlineData: {},
      grid:{
        top: '40',
        bottom: '20',
        right: '40',
        left: '20'
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
          show: true
        },
        axisTick: {
          show: true
        }
      },
      chartyAxis: [],
      radioVal: 1,
      scratchableData: [],     // 九宫格
      YIELD_data: [],             // 合格率
      tab_buttom_data: [],          // 表格
      loading: false,
      isNotData: false
    }
  },
  computed: {
    ...mapGetters(['zhantingId'])
  },
  methods: {
    getData () {

      this.loading = true
      this.isNotData = false
      let params = {
        groupID: this.zhantingId,
        beginTime: this.date[0],
        endTime: this.date[1]
      }
      // 温湿度
      BenchmarkStatistics(params).then(res => {
        console.log(res)
        if(res == [] || res.length == 0) {
          this.isNotData = true
          this.loading = false
        } else {
          this.isNotData = false
          this.loading = false
          this.tempChartLineData = {
            columns: ['date', '温度'],
            rows: []
          }
          this.humiChartlineData = {
            columns: ['date', '湿度'],
            rows: []
          }
          this.xAxisOption.data = []
          let tempArr = [], humiArr = []
          for(let item of res) {
            tempArr.push(item.Temperature)
            humiArr.push(item.Humidity)
            this.xAxisOption.data.push(item.MyTime)
            this.tempChartLineData.rows.push({
              'date': item.MyTime,
              '温度': item.Temperature
            })
            this.humiChartlineData.rows.push({
              'date': item.MyTime,
              '湿度': item.Humidity
            })
          }
          let tempMax = this.integerMax(Math.ceil(arrayMax(tempArr)))
          let tempMin = this.integerMin(Math.floor(arrayMin(tempArr)))
          let humiMax = this.integerMax(Math.ceil(arrayMax(humiArr)))
          let humiMin = this.integerMin(Math.floor(arrayMin(humiArr)))
          this.chartyAxis.splice(0, 0, {
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            max: tempMax,
            min: tempMin,
            interval: (tempMax - tempMin) / 5,
            name: '(%) '
          })
          this.chartyAxis.splice(1, 0, {
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            max: humiMax,
            min: humiMin,
            interval: (humiMax - humiMin) / 5,
            name: '(℃)'
          })
        }
        
      })
      // 九宫格
      SudukuMean(params).then(res => {
        console.log(res)
        this.scratchableData = []
        if(res !== [] || res.length > 0) {
          for(let item of res) {
            this.scratchableData.push({
              temp: item[0],
              humi: item[1]
            })
          }
        }
        
      })
      // 合格率
      YIELD(params).then( data => { 
        console.log(data)
        this.YIELD_data = []
        // this.YiEld_UpData(data);
        if(data.length > 0) {
          let temprate = ((1.0 - (1.0 * parseFloat(data[1]) / parseFloat(data[0]))).toFixed(4) * 100).toFixed(2) + '%'; 
          let humirate = ((1.0 - (1.0 * parseFloat(data[2]) / parseFloat(data[0]))).toFixed(4) * 100).toFixed(2) + '%';
          console.log(temprate,humirate)
          this.YIELD_data.push({
            "value1": temprate,
            "value2": humirate
          })
        }
        
      });
      // 表格
      Wave(params).then( data => {
        console.log(data)
        this.Wear_UpData(data);
      });
    },
    queryData () {
      this.getData()
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
    Wear_UpData (data) {
      if( data != [] ){
					data = data.sort(function(a, b){  // 按名字排序							
						return (a[0]).localeCompare(b[0], 'zh-Hans-CN', {sensitivity: 'accent'});
					});
					this.tab_buttom_data = [];
					for (var i = 0; i < data.length; i++) {
						this.tab_buttom_data.push({
							"name": data[i][0],
							"Tmp_data_Max": data[i][1],
							"Tmp_data_Min":data[i][2],
							"Vaio_data_Tmp":data[i][5],
							"wave_data_Tmp":data[i][7],
							"Huid_data_Max":data[i][3],
							"Huid_data_Min":data[i][4],
							"Vod_data_Huid":data[i][6],
							"Wave_data_Huid":data[i][8]
						})
					}
					this.loading = false; 
					// console.log(this.tab_buttom_data)
				}
    }, 
    changeHistoryDate (date) {   //选择时间
      this.date = date
    },
    radioValChange (val) {  // 九宫格 改变温度湿度
      this.radioVal = val
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    zhantingId () {
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.assessmentContainer {
  .el-form-item {
    margin-bottom: 0;
  }
  .assessChartContent {
    border:1px solid #ddd;
    .content {
      height: 100%;
      background: #fff;
      .title {
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #666;
        border-bottom: 1px solid #ddd;
        background: linear-gradient(#fdfdfd, #efeff0);
      }
      .el-radio-group {
        height: 42px;
        padding-top: 15px;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #ddd;
      }
      .scratchable .el-col-8 {
        text-align: center;
        height: 70px;
        line-height: 70px;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
      }
      .zhibiao {
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #ddd;
      }
      .hegelv .el-col-12 {
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
    
  }
  .assessTable {
    padding: 0 8px;
    margin-top: 10px;
  }
}
</style>


