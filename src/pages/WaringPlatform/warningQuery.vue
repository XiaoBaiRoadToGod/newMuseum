<template>
  <el-row class='warningQueryContainer'>
    <TitleDate type='warningQuery' :data='selectData' @clickQueryBtn='queryData' @changeDate='changeWarningDate' @changeAlermSelects='ChangeAlerm' @changeSelects='alermGradeFunc'  />
    <el-col :span='24'>
      <el-table
        style='width: 100%'
        stripe
        :data='tableListData'>
        <el-table-column prop='monitoring' label='监测点' ></el-table-column>
        <el-table-column prop='instrument' label='仪器名称' ></el-table-column>
        <el-table-column prop='instrumentState' label='仪器运行状态' ></el-table-column>
        <el-table-column prop='showRoom' label='所属展厅' ></el-table-column>
        <el-table-column prop='warningDate' label='报警发生时间' ></el-table-column>
        <el-table-column prop='warningText' label='报警内容' width='300' ></el-table-column>
        <el-table-column prop='warningGrade' label='报警等级' ></el-table-column>
        <el-table-column prop='warningCate' label='报警类别' ></el-table-column>
      </el-table>
      <el-col :span='24' class='myPagination'>
        <el-pagination
          layout='prev, pager, next'
          :page-size='pageSize'
          @current-change='ChangePageIndex'
          :background='true'
          :total='pageNum'>

        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import TitleDate from '@/components/pageTitleDate/pageTitleDate'
import { warningQuery, warningQueryList } from './api'
import { mapGetters } from 'vuex'
import { timeFormatter } from '@/assets/js/commonFunc'
export default {
  data () {
    return {
      selectData: {
        selectLabel: '预警等级:',
        selectOptions: [
          {label: '全部', value: 5},
          {label: '正常', value: 0},
          {label: '一般', value: 1},
          {label: '严重', value: 2},
          {label: '致命', value: 3}
        ],
        alermTypeSeleLabel: '预警类别:',
        alermTypeSeleOptions: [
          {label: '邮件报警', value: 1},
          {label: '短信报警', value: 2}
        ]
      },
      date: null,
      alermGrade: 5,
      alermType: 1,
      tableListData: [],
      pageSize: 10,
      pageIndex: 0,
      pageNum: null

    }
  },
  components: { TitleDate },
  computed: {
    ...mapGetters(['zhantingId'])
  },
  methods: {
    getData () {
      var params = {
        groupID: this.zhantingId,
        beginTime: this.date[0],
        endTime: this.date[1],
        grade: this.alermGrade,
        mode: this.alermType,
        flag: true
      }
      /// 获取报警总条数
      warningQuery(params).then(res => {
        // console.log(res)
        this.pageNum = res.length
        // this.pageNum = 100
      })

      let dataParmas = {
        groupID: this.$store.state.zhantingID,
        beginTime: this.date[0],
        endTime: this.date[1],
        grade: this.alermGrade,
        mode: this.alermType,
        flag: true,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      /// 获取数据
      warningQueryList(dataParmas).then(res => {
        console.log(res)
        this.tableListData = []
        if(this.alermType == 2) {
          for(let item of res) {
            this.tableListData.push({
              'monitoring': this.moitoring(item.ToGroups.GROUP_CATEGORY),
              'instrument': item.LoggerInfo.LOGGER_NAME,
              'instrumentState': this.judgeState(item.LoggerInfo.LOGGER_STATE),
              'showRoom': item.ToGroups.GROUP_NAME,
              'warningDate': timeFormatter(item.AlarmsSms.ALARM_CREATE_TIME),
              'warningText': item.AlarmsSms.ALARM_MSG,
              'warningGrade': this.judgeGrade(item.AlarmsSms.ALARM_LEVEL),
              'warningCate': '短信报警'
            })
          }
        } else {
          for(let item of res) {
            this.tableListData.push({
              'monitoring': this.moitoring(item.ToGroups.GROUP_CATEGORY),
              'instrument': item.LoggerInfo.LOGGER_NAME,
              'instrumentState': this.judgeState(item.LoggerInfo.LOGGER_STATE),
              'showRoom': item.ToGroups.GROUP_NAME,
              'warningDate': timeFormatter(item.AlarmEmail.ALARM_CREATE_TIME),
              'warningText': item.AlarmEmail.ALARM_MSG,
              'warningGrade': this.judgeGrade(item.AlarmEmail.ALARM_LEVEL),
              'warningCate': '邮件报警'
            })
          }
        }
      })
    },
    queryData () {  //查询按钮
      this.getData()
    },
    ChangePageIndex (index) {   // 分页更改
      // console.log(index)
      this.pageIndex = index -1
      this.getData()
    },
    moitoring (num){
      if(num == 0) {
        return '展厅'
      } else if (num == 1) {
        return '库房'
      } else {
        return '馆外监测站'
      }
    },
    judgeState (num) {
      if (num == 0) {
        return '停止运行'
      } else {
        return '正常运行'
      }
    },
    judgeGrade (num) {
      switch (num) {
        case 0:
          return '正常'
          break;
        case 1:
          return '一般'
          break;
        case 2:
          return '严重'
          break;
        default:
          return '致命' 
          break;
      }
    },
    ChangeAlerm (val) {   // 预警类型
    // console.log(val)
      this.alermType = val
    },
    alermGradeFunc (val) {  // 预警等级
    // console.log(val)
      this.alermGrade = val
    },
    changeWarningDate (date) {   // 时间
    // console.log(date)
      this.date = date
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
.warningQueryContainer {
  height: 100%;
}
</style>


