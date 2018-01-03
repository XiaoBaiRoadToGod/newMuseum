<template>
  <el-row class='theMemoContainer'>
    <el-col :span='24'>
      <el-form :inline='true' >
        <el-form-item label='时间:'>
          <el-date-picker
              type='daterange'
              format='yyyy-MM-dd'
              size='mini'
              @change='changeMemoDate'
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
    <el-col :span='24' class='content'>
      <el-row align='middle'>
        <el-col :span='24' class='logDataContent' v-for='(item, idx) in memoData' :key='idx'>
          <el-col :span='3' class='logDate sameHeight'>
              {{item.PreservationTime}}
          </el-col>
          <el-col :span='15' class='logContext sameHeight'>
              {{item.Describe}}
          </el-col>
          <el-col :span='3' class='logOperation sameHeight'>
              <span @click='jumpDataChart(item)' >查看</span>
          </el-col>
          <el-col :span='3' class='logOperation sameHeight deleteRmark'>
              <span @click='Delete(item)' >删除</span>
          </el-col>
           
        </el-col>
        <el-col class='myPagination' :span='24'>
          <el-pagination
            layout="prev, pager, next"
            :page-size='pageSize'
            :current-page.sync="pageIndex"
            @current-change="PaginationCurrentChange"
            :total="pageNum"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { SevenDay  } from '@/assets/js/commonFunc'
import { GetMemorandumAll, MemorandumDelect } from './api'
export default {
  data () {
    return {
      date: [ new Date(SevenDay(new Date())), new Date()],
      disabledDate: {
        disabledDate(time) {
            return time.getTime() > Date.now();
        }
      },
      memoData: [],
      pageIndex: 0,
      pageSize:10,
      pageNum: 0
    }
  },
  methods: {
    getAllData () {
      var params = {
        beginTime: this.date[0],
        endTime: this.date[1],
        pageIndex: this.pageIndex
      }
      GetMemorandumAll(params).then(res => {
        GetMemorandumAll(params).then(res => {
            console.log(res);
            this.memoData = [];
            this.pageNum = 0;
            if(res.length !== 0) {
                this.pageNum = res[0].Count
                this.memoData = res;
            }
            
        })
      })
    },
    jumpDataChart (item) {
      console.log(item)
      let date = []
      // let loggersn = []
      date.push(new Date(item.BeginTime))
      date.push(new Date(item.EndTime))
      console.log(date)
      let loggersn = item.LOGGER_SN.split(',')
      console.log(loggersn)
      this.$store.commit('setZhantingId', item.GROUP_ID)
      this.$store.commit('setDate', date)
      this.$store.commit('setLoggerSn', loggersn )
      if(item.Entrance == '数据分析') {
        this.$router.push('/Analysis/DataAnalysis')
      } else {
        this.$router.push('/Analysis/HistoryData')
      }
      
    },
    Delete (item) {
      let params = {id: item.Id}
        MemorandumDelect(params).then(res => {
            if(res == 200) {
                this.$message({
                    type: 'success',
                    message: '删除成功！！！'
                });
                this.getAllData()
            } else {
                this.$message({
                    type: 'error',
                    message: '删除失败！！！'
                })
            }
        })
    },
    PaginationCurrentChange (index) {
      this.pageIndex = index - 1
      this.getAllData()
    },
    queryData () {
      this.getAllData()
    },
    changeMemoDate (date) {
      this.date = date
    }
  },
  mounted () {
    this.getAllData()
  },
	deactivated(){
		this.$destroy(true);
	}
}
</script>
<style lang="scss" scoped>
.theMemoContainer {

  .content {
    // width: 100%;
    .logDataContent {
        width:100%;
        margin-bottom: 20px;
        display: table;
        border: 1px solid #ccc;
        height: 30px;
        line-height: 30px;
        background: #fff;
        .sameHeight{
            display:table-cell;
            word-break: break-all;
            padding: 15px 0;
        }
        .deleteRmark {
            border-left: 1px solid #ccc;
        }
        .logDate {
            background: #ebf8ff;
            text-align: center;
        }
        .logContext {
            padding: 15px 15px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
        }
        .logOperation {
            color: #438eb9;
            cursor: pointer;
            text-align: center;
            span {
                display: inline-block;
                width: 50px;
            }
        }
        .el-col-3, .el-col-18, .el-col {
            float: none;
        }
    }
    .el-col .el-pagination {
        text-align: right;
    }
}
}
</style>


