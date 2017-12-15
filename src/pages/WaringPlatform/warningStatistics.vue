<template>
  <el-row class='warningStaContainer' >
      <el-col :span='24' >
        <TitleDate type='statistic' :data='warningSelect' @changeSelects='changeSelectData' @changeDate='changeDates' />
      </el-col>
      <el-col :span='24' class='waringContent'>
        <!-- <ve-line :data='chartData' :settings='chartDataSet' ></ve-line> -->
        <el-col :span='11' class='chartContent leftChart'>
          <p class='chartTitle'>实时报警比例统计图</p>
          <ve-ring :data='pieChartData' legend-position='top' :title='pieTitle' ></ve-ring>
        </el-col>
        <el-col :span='11' class='chartContent '>
          <el-col :span='24' style='height:50%'>
            <p class='chartTitle'>报警处理情况</p>
            <ve-bar :data='barChartData' height='100%' :grid='grid' :title='barChartTitle' :legend-visible='false'></ve-bar>
          </el-col>
          <el-col :span='24'>
            
          </el-col>
        </el-col>
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
      chartData: {
        columns: ['日期', '成本', '利润', '占比', '其他'],
        rows: [
          { '成本': 1523, '日期': '1月1日', '利润': 1523, '占比': 0.12, '其他': 100 },
          { '成本': 1223, '日期': '1月2日', '利润': 1523, '占比': 0.345, '其他': 100 },
          { '成本': 2123, '日期': '1月3日', '利润': 1523, '占比': 0.7, '其他': 100 },
          { '成本': 4123, '日期': '1月4日', '利润': 1523, '占比': 0.31, '其他': 100 },
          { '成本': 3123, '日期': '1月5日', '利润': 1523, '占比': 0.12, '其他': 100 },
          { '成本': 7123, '日期': '1月6日', '利润': 1523, '占比': 0.65, '其他': 100 }
        ]
      },
      chartDataSet: {
        metrics: ['成本', '利润'],
        dimension: ['日期']
      },
      barChartData: {
        columns: ['类型','num'],
        rows: [
          {'类型': '未处理报警', 'num': 6},
          {'类型': '已处理报警', 'num': 8},
          {'类型': '报警总个数', 'num': 10}
        ]
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
        bottom: '20'
      },
      pieChartData:{
        columns: ['type', 'value'],
        rows:[
          {"type": '温度','value': 4},
          {"type": '湿度', 'value': 5}
        ]
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
      })
      let PieParams = { groupID:this.zhantingId }
      warningBar(PieParams).then(res => {
        console.log(res)
      });
      let curveParams = {
        groupID: this.zhantingId,
        flag: true,
        beginTime: this.date[0],
        endTime: this.date[1]
      }
      warningCurve(curveParams).then(res => {
        console.log(res)
      })
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
      border: 1px solid #ccc;
      background: #fff;
      .chartTitle {
        height: 30px;
        line-height: 30px;
        color: #666;
        background: #f5f5f5;
        text-align: center;
      }
    }
  }
  .leftChart {
    margin-right: 20px;
  }
  
  
}
</style>


