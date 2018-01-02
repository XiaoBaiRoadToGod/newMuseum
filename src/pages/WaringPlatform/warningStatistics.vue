<template>
  <el-row class='warningStaContainer' >
      <el-col :span='24' >
        <TitleDate type='statistic' :data='warningSelect' @clickQueryBtn='queryData' @changeSelects='changeSelectData' @changeDate='changeDates' />
      </el-col>
      <el-col :span='24' class='waringContent'>
        <el-row type="flex" justify="space-around" style='height: 100%' >
          <el-col :span='11' class='chartContent leftChart'>
            <p class='chartTitle'>实时报警比例统计图</p>
            <ve-ring :data='pieChartData' legend-position='top' :title='pieTitle' ></ve-ring>
          </el-col>
          <el-col :span='11' class='chartContent '>
            <el-col :span='24' class='rightWarning'>
              <p class='chartTitle'>报警处理情况</p>
              <ve-bar :data='barChartData' :settings='barSetting' height='calc(100% - 30px)' :grid='grid' :title='barChartTitle' :legend-visible='false'></ve-bar>
            </el-col>
            <el-col :span='24' class='rightWarning bottomLineWarning'>
              <p class='chartTitle'>24小时报警曲线图</p>
              <ve-line :data='LineChartData' 
              height='calc(100% - 30px)'  
              :settings='LineChartDataSet' 
              :xAxis='LinexAxis'
              :yAxis='lineyAxis'
              :grid='grid' 
              :extend='lineExtend'
              :legend-visible='false'></ve-line>
            </el-col>
          </el-col>
        </el-row>
        
      </el-col>
  </el-row>
</template>
<script>
import TitleDate from '@/components/pageTitleDate/pageTitleDate'
import { warningBar, warningCurve, warningStatistical } from './api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      warningSelect: {
        selectLabel: '报警类型:',
        selectOptions: [{
          value: 1,
          label: '邮件报警'
        },{
          value: 2,
          label: '短信报警'
        }]
      },
      alermType: 1,  //报警类型  默认为1
      date: null,
      LineChartData: {
        columns: ['时间', '数量'],
        rows: []
      },
      LineChartDataSet: {
        metrics: [ '数量'],
        dimension: ['时间']
        
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
      LinexAxis: {
        type:'category',
        data:[],
        axisLine: {
          show: true
        },
        axisTick:{
          show: true
        }
      },
      lineyAxis: {
        axisLine: {
          show: true
        },
        axisTick:{
          show: true
        }
      },
      barChartData: {
        columns: ['type','数量'],
        rows: []
      },
      barSetting:{
        min: [4]
      },
      barChartTitle: {
        text: '单位:个',
        show: true,
        top:'10',
        right: '1%',
        textStyle: {
          color: '#333',
          fontSize: '14px'
        }
      },
      grid: {
        top: '20',
        right: '20',
        bottom: '0'
      },
      pieChartData:{
        columns: ['type', 'value'],
        rows:[]
      },
      pieTitle: {
        text: '总数量',
        subtext:  '8条',
        x: 'center',
        y:'center',
        subtextStyle: {
          color: '#333',
          fontSize: '18px'
        }
      },
    }
  },
  components: { TitleDate },
  computed: { ...mapGetters(['zhantingId']) },
  methods: {
    getPieData () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      console.log(user)
      var params = {
        groupID: this.zhantingId,
        flag:true,
        beginTime: this.date[0],
        endTime: this.date[1],
        UserName: user.name
      }
      warningStatistical(params).then(res => {
        console.log(res)
        this.barChartData.rows = []
        for(let item of res) {
          this.barChartData.rows.push({
            'type': item.group,
            '数量': item.value
          })
        }
      })
      let PieParams = { groupID:this.zhantingId }
      warningBar(PieParams).then(res => {
        console.log(res)
        this.pieChartData.rows = []
        let synNumber = 0
        for(let item of res) {
          synNumber += item.value
          this.pieChartData.rows.push({
            type: item.name,
            value: item.value
          })
        }
        this.pieTitle.subtext = synNumber + '条'
      });
      let curveParams = {
        groupID: this.zhantingId,
        flag: true,
        beginTime: this.date[0],
        endTime: this.date[1]
      }
      warningCurve(curveParams).then(res => {
        console.log(res)
        this.LineChartData.rows = []
        let dateArray= ['00:00', '02:00',  '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
       this.LinexAxis.data = dateArray
       for(let i = 0; i < res.length; i++) {
          // console.log(dateArray[i])
          this.LineChartData.rows.push({
            '时间': dateArray[i],
            '数量': res[i].value
          })
        }
      })
    },
    queryData () {
      this.getPieData()
    },
    changeSelectData (value) {
      // console.log(value)
      this.alermType = value
    },
    changeDates (val) {
      // console.log(val)
      this.date = val
    }
  },
  mounted () {
    this.getPieData()
  },
  watch:{
    zhantingId () {
      this.getPieData()
    }
  }
}
</script>
<style lang="scss" scoped>
.warningStaContainer {
  height: 100%;
  
  .waringContent{
    height: calc(100% - 50px);
    
    .chartContent {
      height: 100%;
      
      .chartTitle {
        height: 30px;
        line-height: 30px;
        color: #666;
        background: #f5f5f5;
        text-align: center;
        margin:0;
      }
      .rightWarning {
        height: calc(50% - 10px);
        background: #fff;
        border: 1px solid #ccc;
      }
      .bottomLineWarning {
        margin-top: 20px;
      }
    }
  }
  .leftChart {
    margin-right: 20px;
    background: #fff;
    border: 1px solid #ccc;
  }
  
  
}
</style>


