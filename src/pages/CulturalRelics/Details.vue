<template>
  <el-row class='relicDetailsContainer'>
    <el-col :span='24'>
      <el-form :inline='true'>
        <el-form-item label='采集时间:'>
          <el-date-picker
              type='daterange'
              format='yyyy-MM-dd HH:mm:ss'
              size='mini'
              @change='changeDetailDate'
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
    <el-col :span='24' class='detailContent'>
      <el-row type="flex" justify="space-around" :gutter='20'>
        <el-col :span='11' v-if='relicDetailAll'>
          <el-row>
            <el-col :span='24' class='relicInfo'>
              <el-col :span='24' class='relicName'>
                {{ relicDetailAll.LOGGER_NAME }}
              </el-col>
              <el-col :span='12' style='height: 100%;border-right:1px solid #ddd;' >
                <el-col :span='24' class='relicImg'>
                  <img :src="relicDetailAll.RELICIM_PATH" alt="">
                </el-col>
                <el-col :span='24' style='text-align:center;'>
                  <el-button @click='prevRelic' type="primary" size="mini">上一文物</el-button>
                  <el-button @click='nextRelic' type="primary" size="mini">下一文物</el-button>
                </el-col>
              </el-col>
              <el-col :span='12'>
                <el-col :span='24' class='reliclishiInfo'>
                   文物历史朝代：{{ relicDetailAll.RELIC_YEAR }}
                </el-col>
                <el-col :span='24' class='reliclishiInfo'>
                  文物详细数据：{{ relicDetailAll.RELIC_DETAILED }}
                </el-col>
                <el-col :span='24' class='reliclishiInfo'>
                  文物介绍：
                  <p>{{ relicDetailAll.RELIC_DSC }}</p>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span='13' class='relicmontContent'>
          <el-row style='height: 100%; border: 1px solid #ddd;'>
            <el-col :span='12' class='relicmontInfo' v-if='relicDetailAll'>
              <el-col :span='24' class='title'>
                文物监测信息
              </el-col>
              <el-col :span='24' class='relicLogger' >
                <p>文物位置：{{ relicDetailAll.RELIC_POSITION }}</p>
                <p>文物周边监测仪器：({{ relicDetailAll.LOGGER_SN }}) {{ relicDetailAll.LOGGER_NAME }}</p>
              </el-col>
              <el-col :span='24' class='montTable'>
                <el-col :span='6'>监测指标</el-col>
                <el-col :span='6'>上限</el-col>
                <el-col :span='6'>下限</el-col>
                <el-col :span='6'>实时</el-col>
              </el-col>
              <el-col :span='24' v-if='tableData.Ch1Name !== null' class='montTable'>
                <el-col :span='6'>{{ tableData.Ch1Name }}</el-col>
                <el-col :span='6'>{{ tableData.Ch1CHONE_HIGH }}</el-col>
                <el-col :span='6'>{{ tableData.Ch1CHONE_LOW }}</el-col>
                <el-col :span='6' :style='{color: tableData.Ch1Color}'>{{ tableData.Ch1 }}</el-col>
              </el-col>
              <el-col :span='24' v-if='tableData.Ch2Name !== null' class='montTable'>
                <el-col :span='6'>{{ tableData.Ch2Name }}</el-col>
                <el-col :span='6'>{{ tableData.Ch2CHTWO_HIGH }}</el-col>
                <el-col :span='6'>{{ tableData.Ch2CHTWO_LOW }}</el-col>
                <el-col :span='6' :style='{color: tableData.Ch2Color}'>{{ tableData.Ch2 }}</el-col>
              </el-col>
              <el-col :span='24' v-if='tableData.Ch3Name !== null' class='montTable'>
                <el-col :span='6'>{{ tableData.Ch3Name }}</el-col>
                <el-col :span='6'>{{ tableData.Ch3CHTHR_HIGH }}</el-col>
                <el-col :span='6'>{{ tableData.Ch3CHTHR_LOW }}</el-col>
                <el-col :span='6' :style='{color: tableData.Ch3Color}'>{{ tableData.Ch3 }}</el-col>
              </el-col>
              <el-col :span='24' v-if='tableData.Ch4Name !== null' class='montTable'>
                <el-col :span='6'>{{ tableData.Ch4Name }}</el-col>
                <el-col :span='6'>{{ tableData.Ch4CHFOU_HIGH }}</el-col>
                <el-col :span='6'>{{ tableData.Ch4CHFOU_LOW }}</el-col>
                <el-col :span='6' :style='{color: tableData.Ch4Color}'>{{ tableData.Ch4 }}</el-col>
              </el-col>
            </el-col>
            <el-col :span='12' class='relicmontInfo'>
              <el-col :span='24' class='title'>
                预警统计
              </el-col>
              <el-col :span='24' v-if='pieChartData !== null'>
                <ve-pie
                height='250px'
                :extend='pieExtend'
                :settings='{radius: 50,center:["50%", "50%"]}'
                legend-position='bottom'
                :data='pieChartData'></ve-pie>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-col :span='24' class='chartTable' v-if='relicDetailAll !== null'>
        <el-col :span='14' class='chartLine'>
          <el-col :span='24' class='title'> {{ relicDetailAll.LOGGER_NAME }}</el-col>
          <ve-line
          v-if='!chartDataEmpty'
          height='290px'
          :data='chartLineData'
          :extend='chartLineExtend'
          :events='chartLineEvents'
          :settings='chartsLineSetting'
          :data-empty='chartDataEmpty'
          ref='chartLine'
          :grid='grid'
          :after-config='chartLineConfig'
          ></ve-line>
        </el-col>
        <el-col :span='10' class='volatTable'>
          <el-col :span='24' class='title'>
              <div class='tableTd'>指标</div>
              <div class='tableTd'>最大值</div>
              <div class='tableTd'>最小值</div>
              <div class='tableTd'>平均值</div>
              <div class='tableTd'>波动值</div>
          </el-col>
          <el-col :span='24'  v-for='item in volatilityTable' :key='item.Name'>
            <div class="tableTd">{{ item.Name }}</div>
            <div class="tableTd">{{ item.Max }}</div>
            <div class="tableTd">{{ item.Min }}</div>
            <div class="tableTd">{{ item.Avg }}</div>
            <div class="tableTd">{{ item.Waves }}</div>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { SevenDay } from '@/assets/js/commonFunc'
import {  wenwuDetail,
          warningDetail,
          wenwuList,
          humidGraphDetail,
          humidTableDetail,
          wenwuDetailReal } from './api'
export default {
  data () {
    return {
      relicId: null,
      date: [ new Date(SevenDay(new Date())), new Date()],
      disabledDate: {
          disabledDate(time) {
              return time.getTime() > Date.now();
          }
      },
      relicDetailAll: null,
      relicInfo: null,
      monitringInfo: null,
      tableData: [],
      pieChartData: null,
      pieExtend: {
        series: {
          center: ['50%', '50%']
        }
      },
      chartLineData: null,
      chartLineExtend: {
        legend:{
          selectedMode: 'single',
          selected: {}
        },
        xAxis: {
          axisLabel: {
            formatter: null
          }
        },
        series: {
          type: 'line',
          symbol: 'none',
          lineStyle: {
          	normal: { width: '1.5'}
          }
        }
      },
      chartsLineSetting: {
        yAxisName: null
      },
      chartLineUnit: {},
      grid: {
        top: '40',
        bottom: '20',
        left: '40',
        right: '40'
      },
      chartLineEvents: {
        legendselectchanged: (v) => {
          console.log(v)
          console.log(this.chartLineUnit)
          console.log(this.chartLineUnit[v.name])
          this.chartsLineSetting.yAxisName = [this.chartLineUnit[v.name]]
          console.log(this.chartsLineSetting)
          this.changeSelect(v.name)
        }
      },
      chartDataEmpty: false,
      volatilityTable: null,    // 波动表格
      relicIdNum: []
    }
  },
  methods: {
    getRelicDetailData () {
      let params = { RlicName:this.relicId }
      wenwuDetail(params).then(res => {
        console.log(res)
        this.relicDetailAll = res[0]
        if(res[0].LOGGER_SN == null){
            this.$message({
                type:'warning',
                message:'暂无设备！！！'
            });
            this.loading = false;
        }else{
            this.getRelicData()
        }
      })
      wenwuDetailReal(params).then(res => {
        console.log(res)
        this.tableData = res[0]
        
      })
      let relicNum = {
        groupID: '',
        Name: '',
        Type: '',
        pageSize: 1000, 
        pageIndex: 0
      }
      wenwuList(relicNum).then(res => {
        console.log(res)
        this.relicIdNum = []
        for(let key of Object.keys(res)) {
          for(let item of res[key]) {
            this.relicIdNum.push(item.RELIC_ID)
          }
        }
      })
    },
    getRelicData () {
      let PieParams = {
        RlicName: this.relicId,
        beginTime: this.date[0],
        endTime:this.date[1]
      }
      // 饼图
      warningDetail(PieParams).then(res => {
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
        // console.log(this.pieChartData)
      })
      // 曲线图
      humidGraphDetail(PieParams).then(res => {
        console.log(res)
        if(res == [] || res.length == 0) {
          console.log('notData')
          this.chartLineData = {
            columns: ['date'],
            rows: []
          }
          this.chartDataEmpty = true
        } else {
          this.chartsLine(res)
          this.chartDataEmpty = false
        }
        
      })
      // 波动表格
      humidTableDetail(PieParams).then(res => {
        console.log(res)
        if(res == []) {
          this.volatilityTable = null
        } else {
          this.volatilityTable = res
        }
        
      })
    },
    chartsLine (data) {
      this.chartLineData = {
        columns: ['date'],
        rows: []
      }
      this.chartLineUnit = {}
      let isOnec = true
      this.chartsLineSetting.yAxisName = data[0].Ch1Unit
      for(let i = 0; i< data[0].ChannelNum; i++) {
        let idx = i +1
        let name = eval('data[0].Ch' + idx +'Name')
        this.chartLineUnit[name] = eval('data[0].Ch' + idx + 'Unit')
        this.chartLineData.columns.push(name)
        for(let n = 0; n < data.length; n++) {
          
          if(isOnec) {
            let oneDateDate= {}
            oneDateDate['date'] = data[n].ITime
            oneDateDate[name] = eval('data[n].Ch' + idx)
            this.chartLineData.rows.push(oneDateDate)
            
            if(n == data.length - 1) {
              isOnec = false
            }
          } else {
            this.chartLineData.rows[n][name] = eval('data[n].Ch' + idx)
          }
          
        }
      }
      console.log(this.chartLineData)
    },
    chartLineConfig (options) {
      // console.log(options)
      // y 轴名称
       const selected = options.legend.selected
       Object.keys(selected).forEach(key => {
        //  console.log(selected[key])
         if(selected[key] == true) {
          //  console.log(key)
          //  this.chartsLineSetting.yAxisName = [this.chartLineUnit[key]]
          options.yAxis[0].name = this.chartLineUnit[key]
         }
       })
      // x 轴时间
      options.xAxis[0].axisLabel.formatter = (value) => {
          var str_before = value.split(' ')[0];
          var str_after = value.split(' ')[1];
          return str_after + '\n' + str_before;
      }
      return options
    },
    changeSelect (name) {
      const selected = {}
      Object.keys(this.chartLineUnit).forEach( key => { selected[key] = false })
      selected[name] = true
      this.chartLineExtend.legend.selected = selected
    },
    prevRelic () {  //上一文物
      let paramsId = this.$route.params.id
      let number = null
      for(let key of Object.keys(this.relicIdNum)) {
        if(this.relicIdNum[key] == paramsId) {
          number = key
          break;
        }
      }
      if(number == 0) {
        this.$message({
          type: 'warning',
          message: '这已经是第一件文物了！'
        })
      } else {
        console.log(this.relicIdNum)
        console.log(number)
        console.log(this.$route.params.id)
        console.log(this.relicIdNum[number--])
        this.relicId = this.relicIdNum[number--]
        this.$router.push({name: 'RelicDetails', params: { id: this.relicId}})
        // this.$route.params.id = this.relicId
      }
    },
    nextRelic () {   // 下一文物
      let paramsId = this.$route.params.id
      let number = null
      for(let key of Object.keys(this.relicIdNum)) {
        if(this.relicIdNum[key] == paramsId) {
          number = key
          break;
        }
      }
      if(number == this.relicIdNum.length - 1) {
        this.$message({
          type: 'warning',
          message: '这已经是最后一件文物了！'
        })
      } else {
        console.log(this.relicIdNum)
        console.log(number)
        console.log(this.$route.params.id)
        console.log(this.relicIdNum[number++])
        this.relicId = this.relicIdNum[number++]
        this.$router.push({name: 'RelicDetails', params: { id: this.relicId}})
        // this.$route.params.id = this.relicId
      }
    },
    queryData () {
      this.getRelicDetailData()
    },
    changeDetailDate (date) {
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
    }
  },
  created () {
    this.relicId = this.$route.params.id
  },
  mounted () {
    console.log(this.$route.params.id)
    // this.getRelicDetailData()
  },
  watch: {
    relicId () {
      console.log('change')
      this.getRelicDetailData()
    }
  },
  deactivated(){
    this.$destroy(true);
  }
}
</script>
<style lang="scss" scoped>
.relicDetailsContainer {
  .el-form .el-form-item {
    margin-bottom: 0;
  }
  .detailContent {
    .relicInfo {
      padding-bottom: 10px;
      border: 1px solid #ddd;
      background: #fff;
      .relicName {
        background: linear-gradient(#fdfdfd, #efeff0);
        height: 40px;
        border-bottom: 1px solid #ddd;
        line-height: 40px;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 18px;
        color: #666;
      }
      .relicImg img {
        display: block;
        width: 71.9%;
        margin: 10px 0 20px 5.96%;
        border: 1px solid #8A9DA2;
      }
      .reliclishiInfo {
        padding: 5px 10px;
        color: #666;
        p {
          margin: 0;
          color: #666;
          font-size: 14px;
          font-family: 'Microsoft YaHei';
          font-weight: normal;
          text-indent: 28px;
        }
      }
    }
    .relicmontContent {
      // background: #fff;
      .relicmontInfo {
        border-right: 1px solid #ddd;
        height: 100%;
        background: #fff;
        .title {
          background: linear-gradient(#fdfdfd, #efeff0);
          height: 40px;
          border-bottom: 1px solid #ddd;
          line-height: 40px;
          text-align: center;
          font-family: 'Microsoft YaHei';
          font-size: 18px;
          color: #666;
        }
        .relicLogger{
          border-bottom: 1px solid #ddd;
          p {
            padding: 0 15px;
            color: #666;
          }
        }
        .montTable {
          color: #666;
          div {
            height: 35px;
            line-height: 35px;
            text-align: center;
            border-left: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
          }
        }
        
      }
    }
  }
  .chartTable {
    background: #fff;
    margin-top: 20px;
    border: 1px solid #ddd;
    .chartLine {
      border-right: 1px solid #ddd;
      height: 330px;
    }
    .title {
      background: linear-gradient(#fdfdfd, #efeff0);
      height: 40px;
      border-bottom: 1px solid #ddd;
      line-height: 40px;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      color: #666;
    }
    .volatTable {
      .tableTd {
        width: 19%;
        display: inline-block;
        text-align: center;
        color: #666;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>


