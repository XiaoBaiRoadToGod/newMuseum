<template>
  <el-row class='controlsContainer'>
    <el-col :span='24' >
      <el-table
        :data='controlTableData'
        stripe
        center
        style='width: 100%'>
        <el-table-column prop='LOGGER_NAME' label='名称' min-width='120'></el-table-column>
        <el-table-column prop='Device' label='设备类型' min-width='140'></el-table-column>
        <!-- <el-table-column prop='SPosition' label='安装位置'></el-table-column> -->
        <el-table-column label='温度 (℃)' min-width='70'>
          <template slot-scope="scope">
            <span :style='{color:controlTableData[scope.$index].Tcolor }' >{{ controlTableData[scope.$index].LOGS_CHONE }}</span>
          </template>
        </el-table-column>
        <el-table-column label='湿度 (%)'>
          <template slot-scope="scope">
            <span :style='{color:controlTableData[scope.$index].Hcolor }' >{{ controlTableData[scope.$index].LOGS_CHTWO }}</span>
          </template>
        </el-table-column>
        <el-table-column prop='Temperature' label='设置温度(℃)' min-width='94'></el-table-column>
				<el-table-column prop='Humidity' label='设置湿度(%)' min-width='90'></el-table-column>
        <el-table-column label='设备状态'> 
          <template slot-scope="scope">
            <span :style='{color:controlTableData[scope.$index].StateColor }' >{{ controlTableData[scope.$index].State }}</span>
          </template>
        </el-table-column>
        <el-table-column label='液位状态'>
          <template slot-scope="scope">
            <img v-bind:src="controlTableData[scope.$index].YiWei" alt="">
          </template>
        </el-table-column>
        <el-table-column label='操作' min-width='140'>
          <template slot-scope="scope">
            <el-button type="primary" size='mini' @click='setLoggerState(scope.$index)' :disabled="controlTableData[scope.$index].setBtnIsDisable"  >设置</el-button>
            <el-switch v-model='controlTableData[scope.$index].SwtichMachine' :disabled="controlTableData[scope.$index].switchIsDisable" ></el-switch>
          </template>
        </el-table-column>
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
    <show-state :stateData='dialogStateData' ref='showstate' />
  </el-row>
</template>
<script>
import { Controls, ControlNum } from './api'
import { mapGetters } from 'vuex'
import { deviceType, subDotN } from '@/assets/js/commonFunc'
import ShowState from '@/pages/Environmental/showStateComponent'
export default {
  data () {
    return {
      pageSize: 10,
      pageIndex: 0,
      pageNum: null,
      controlTableData: [],
      dialogStateData: null
    }
  },
  components: { ShowState },
  computed: {
    ...mapGetters(['zhantingId'])
  },
  methods: {
    getDefaultData () {  // 获取页面数据
      var numParams = {
        GroupId:this.zhantingId
      }
      ControlNum(numParams).then(res => {  // 获取总条数
        if(res.length > 0){
          this.pageNum = res.length
        } else {
          this.pageNum = null
        }
      })
      var params = {
        GroupId: this.zhantingId,
        pageSize: this.pageSize,
        pageIndex:this.pageIndex
      }
      Controls(params).then(res => {
        console.log(res)  
        // 按名称排序
        res = res.sort((a, b) => {
          return (a.LOGGER_NAME).localeCompare(b.LOGGER_NAME, 'zh-Hans-CN', {sensitivity: 'accent'})
        })
        for(let item of res) {
          item.Device = deviceType(item.VER_ID)  // 设备类型
          item.LOGS_CHONE = item.VER_ID == 13 || item.VER_ID == 17 ? '--' : subDotN(1, item.LOGS_CHONE == null ? '--' : item.LOGS_CHONE) //温度
          item.LOGS_CHTWO = item.VER_ID == 13?subDotN(1,item.LOGS_CHONE==null?'--':item.LOGS_CHONE):subDotN(1, item.LOGS_CHTWO==null?'--':item.LOGS_CHTWO) // 湿度
          item.Temperature = subDotN(1, item .Temperature==null?'--': item.Temperature)   // 设置温度
          item.Humidity = item.VER_ID == 13?'--':item.VER_ID == 17?'--':subDotN(1,item.Humidity == null?'--':item.Humidity)   // 设置湿度
          item.State = this.equipmentState(item.LOGGER_STATE, item.SAMPLING_INT, item.LOGS_TIME)    //设备状态
          item.StateColor = item.State == '故障' ? 'red' : '#666'                                   // 设备状态颜色
          // item.MainBlower = item.VER_ID == 12 ? '--' : item.MainBlower                             // 冷凝片状态
          item.YiWei = this.yeweiImg(item.CompressO)                                // 液位图片
          item.SwtichMachine = this.isSwitchBtn(item.Switch, item.SwitchState)                  // 开关机
          item.switchIsDisable = this.switchIsDisable(item.Switch, item.SwitchState)  //开关机按钮是否禁用
          item.setBtnIsDisable = this.setBtnIsDisable(item.VER_ID)            // 设置按钮是否禁用


        }
        this.controlTableData = res
        console.log(this.controlTableData)
      })
    },
    setBtnIsDisable (num) {   // 设置按钮是否禁用
      var user = JSON.parse(sessionStorage.getItem('user'));
				var name = user.level;
				console.log(name);
				if(num == 14  || name !== 120 ){ // 设备类型等于 14  或者用户权限 !== 120 不可操作
					return true;
				}else{
					return false;
				}
    },
    switchIsDisable (switchNum, switchState) {   // 判断开关机按钮是否禁用
      var user = JSON.parse(sessionStorage.getItem('user'));
				// console.log(user);
      var name = user.level;
      if(name == 120){    // 用户权限是 120 可以操作
        if(switchNum == 0){
          if(switchState == 0){
            return false;
          }else{
            return true;  // 开机当中不可操作
          }
        }else if(switchNum == 1){
          if(switchState == 0){
            return false;
          }else{
            return true;   // 关机当中不可操作
          }
        }
      }else{  // 用户权限不是120， 不可操作
        return true;
      }
    },
    isSwitchBtn (switchNum, switchState) {   //判断开关机
      if(switchNum == 0){
        if(switchState == 0){
          return false;        // 0,0关机
        }else{
          return false;        // 0,1 关机当中
        }
      }else if(switchNum == 1){
        if(switchState == 0){   // 1,0
          return true;
        }else{
          return true;
        }
      }
    },
    ChangePageIndex (index) {
      this.pageIndex = index - 1
      this.getDefaultData()
    },
    setLoggerState (idx) {
      this.dialogStateData = this.controlTableData[idx]
      this.$refs.showstate.openTheDialog(true)
    },
    equipmentState (state, int, logsTime) {    //判断设备状态
        var shebeiState = ''; // 设备状态
				var myDate = new Date(); //获取当前时间  时间戳
				var date1 = new Date(logsTime);
				var num = myDate.getTime() - date1.getTime(); // 计算出相差毫秒数
				var seconds = Math.round(num / 1000);
				if(state == 0){
					shebeiState = '停止';
				}else if(state == 1){
					// console.log('seconds---'+seconds);
					// console.log('int---'+int);
					if(seconds > int + 100){
						// shebeiState = '故障';
						shebeiState = '运行';
					}else{
						shebeiState = '运行';
					}
				}
				return shebeiState;
    },
    yeweiImg (value) {
      if(value == '低') {
        return '../../../static/img/yeweidi.png'
      } else if (value == '中') {
        return '../../../static/img/yeweizhong.png'
      } else  {
        return '../../../static/img/yeweigao.png'
      }
    }
  },
  mounted () {
    this.getDefaultData()
  },
  watch: {
    zhantingId () {
      this.pageIndex = 0
      this.getDefaultData()
    }
  }
}
</script>
<style lang="scss" scoped>
.controlsContainer {
  .el-table {
    .el-button {
      margin-right: 10px;
    }
  }
}
</style>


