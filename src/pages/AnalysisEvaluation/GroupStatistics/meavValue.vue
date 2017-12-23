<template>
  <el-row class='meavValueContainer'>
      <el-col :span='24'>
          <el-form class="from_hei" :inline='true'>
                <el-form-item  class="cj_data_Pic myLabel" label='采集时间:'>
                    <el-date-picker
                    type='daterange'
                    format='yyyy-MM-dd HH:mm:ss'
                    size='mini'
                    @change='chooseDate'
                    v-model='startEndDate'
                    :clearable='false'
                    :picker-options='disabledDate'
                    range-separator="到">
                </el-date-picker>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click='queryGroupFn' size='mini'>查询</el-button>       
                </el-form-item>
                <el-form-item style='float: right;'>
                    
                </el-form-item>
        </el-form>
      </el-col>
      <el-col v-if='noData' class='isNotData' >暂无数据</el-col>
      <el-col :span='24' class='meavTable' v-if='!noData'>
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
      <el-col :span='24' v-if='!noData' class='meavCharts'>
            <ve-line
                v-for='(item, idx) in chartLineData'
                :key='idx'
                :width='channelNum > 2 ? chartsLineWidth/2 + "px" : chartsLineWidth + "px" '
                height='250px'
                :data='item.lineData'
                :title='item.title'
                :tooltip='item.tooltip'
                :grid='grid'
                :legend-visible='false'
            ></ve-line>
      </el-col>
  </el-row>
</template>
<script>
import { SevenDay } from '@/assets/js/commonFunc'
import { TabMulti, GetMeanValue } from './api'
export default {
  data () {
      return {
        startEndDate: [ new Date(SevenDay(new Date())), new Date()],
        disabledDate: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },
        tableData: {         // 表格数据
            channelNum: 0,    // 通道数量
            count: 0,          // 多少条数据
            beginTime: null,    // 开始时间
            endTime: null,     // 结束时间
            data: []           // 数据
        },
        paramsSn: null,
        channelNum: null,
        noData: false,
        chartLineData: [],     // 曲线数据
        grid: {
            top: '40',
            bottom: '20',
            left: '20',
            right: '20'
        },
        chartsLineWidth: null 
      }
  },
  methods: {
      queryGroupFn () {
          this.getMeavData()
      },
      getMeavData () {
          let params = {
              beginTime: this.startEndDate[0],
              endTime: this.startEndDate[1],
              sn: this.paramsSn
          }
          TabMulti(params).then(res => {
              console.log(res)
              this.addTableData(res)
          })
          let meavParams = {
              beginTime: this.startEndDate[0],
              endTime: this.startEndDate[1],
              Usn: this.paramsSn
          }
          GetMeanValue(meavParams).then(res => {
              this.channelNum = res[0].LOGGER_CHNUM;
              this.addChartLineData(res)
          })
      },
      addChartLineData (data) {  // 曲线数据
        if (data == [] || data.length == 0) {
            this.noData = true
        } else {
            this.noData = false
            let isOnce = false
            
            console.log(data)
            for(let i = 0; i < this.channelNum; i++ ){
                // console.log('-=--')
                this.chartLineData.splice(i, 1, {
                    lineData: {
                        columns: ['date'],
                        rows: []
                    },
                    title: {
                        text: null,
                        x: 'center',
                        textStyle: {
                            fontSize: '14px',
                            color: '#666'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: null
                    }
                })
                let isMyOnce = false
                let idx = i + 1
                for(let n = 0; n < data.length; n++) {
                    // console.log(n)
                    let name = eval('data[n].Ch' + idx + 'Name')
                    let oneDateData = {}
                    oneDateData['date'] = data[n].MyTime
                    oneDateData[name] = eval('data[n].Ch' + idx)
                    if(!isMyOnce) {
                        this.chartLineData[i].lineData.columns.push(name)
                        this.chartLineData[i].lineData.rows.push(oneDateData)
                        this.chartLineData[i].title.text = name + '平均值'
                        this.chartLineData[i].tooltip.formatter = '{b} <br/> '+name+'  :{c} '+ eval('data[n].Ch' + idx +'Unit')
                        isMyOnce = true
                    } else {
                        this.chartLineData[i].lineData.rows.push(oneDateData)
                    }
                    
                }
            }
            console.log(this.chartLineData)
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
      chooseDate (date) {
          this.startEndDate = date
      },
      getChartWidth () {
          this.chartsLineWidth = $('.meavCharts').width()
      }
  },
  created () {
      console.log(this.$route.params.id)
      this.paramsSn = this.$route.params.id
  },
  mounted () {
      this.getMeavData()
      this.getChartWidth()
  }
}
</script>
<style lang="scss" scoped>
.meavValueContainer {
    .meavTable {
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
    }
    .meavCharts {
        background: #fff;
        padding: 10px 0 ;
        .ve-line {
            display: inline-block;
        }
    }
}
</style>


