<template>

    <el-col :span='24' class='loggerDialogContent' v-if='isShow' >
        <div class='loggerContainer'>
          <div class='loggerTitle'>
              
              <el-form :inline='true'>
                  <el-form-item>
                      <el-checkbox class='checkAll' 
                        :indeterminate="isIndeterminate" 
                        v-model="checkAll" 
                        @change="handleCheckAllChange" size='12'>
                            全选
                    </el-checkbox>
                  </el-form-item>
                  <el-form-item label='采集时间:'>
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
                  <el-form-item>
                      <!-- <div @click.native='closeMultiContent' class='closeMulti' >
                          <i class='el-icon-close ' ></i>
                      </div> -->
                      
                      <span class='closeMulti' @click='closeMultiContent'>X</span>
                  </el-form-item>
              </el-form>
              
          </div>
          <div class='loggerContent'>
              <div v-bar style='height: 100%'>
                  <div>
                      <el-checkbox-group
                        @change="CheckedArray"
                        v-model="checkedProduct">
                        <el-checkbox v-for='item in allLoggerSn' :key='item.label' :label='item.label' >
                            {{ item.value }}
                        </el-checkbox>
                    </el-checkbox-group>
                  </div>
              </div>
              
          </div>
          <div class='loogerFooter'>
              <el-button type="primary" size='mini' @click='queryData'>确定</el-button>
              <el-button type="primary" size='mini' @click='clearChecked'>清空</el-button>
          </div>
        </div>
    </el-col>

    

</template>
<script>
import { mapGetters } from 'vuex'
import { SevenDay, openWarningMessage } from '@/assets/js/commonFunc'
import { Data_Instrument } from './api'
export default {
  data () {
      return {
          isIndeterminate: true,
          checkAll: false,
          startEndDate: [ new Date(SevenDay(new Date())), new Date()],
          disabledDate: {
              disabledDate(time) {
                  return time.getTime() > Date.now();
              }
          },
          checkedProduct: [],    // 选中的
          allLoggerSn: [],
          allLoggerSnValue: [],
          isShow: true
      }
  },
  computed: {
      ...mapGetters(['zhantingId', 'Loggersn', 'LoggerDate'])
  },
  methods: {
      handleCheckAllChange (ev) {  // 全选按钮
    //   console.log(ev)
    //   console.log(this.allLoggerSn)
        this.checkedProduct = ev ? this.allLoggerSnValue : []
        this.isIndeterminate = false;
      },
      chooseDate (date) {  // 日期
    //   console.log('change')
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
          this.startEndDate = date
          this.$emit('changeDate', this.startEndDate)
      },
      CheckedArray (value) {  // 点击多选框
        //   console.log(value)
          this.checkAll = value.length === this.allLoggerSn.length
          this.isIndeterminate = value.length > 0 && value.length < this.allLoggerSn.length
      },
      queryData () {  // 确定按钮
        console.log(this.checkedProduct.length)
        // console.log(this.startEndDate)
        let _this = this
        if( this.checkedProduct.length == 0 ) {
            openWarningMessage('error', '请选择设备!!!', _this)
        } else {
            // this.show= false
            this.$emit('changeLogger', this.checkedProduct)
        }
        

      },
      closeMultiContent () {
        //   console.log('dianjiguanbi ')
          this.openTheDialog(false)
      },
      openTheDialog (bool) {   // 打开或关闭弹窗
          this.isShow = bool
      },
      clearChecked () {  // 清空选择的
          this.checkedProduct = []
          this.isIndeterminate = true
          this.checkAll = false
      },
      getLoggerData () {
          let params = { groupID: this.zhantingId }
          Data_Instrument(params).then(res => {
              console.log(res)
              this.allLoggerSn = []
              this.allLoggerSnValue = []
              for(let item of res) {
                  this.allLoggerSnValue.push(item.sn + '/' + item.VER_ID)
                  this.allLoggerSn.push({
                      value: item.name,
                      label: item.sn + '/' + item.VER_ID
                  })
              }
          })
      }
  },
  created () {
      
  },
  mounted () {
      this.getLoggerData()
      console.log(this.startEndDate)
      this.$emit('changeDate', this.startEndDate)
      
  },
  watch: {
      zhantingId () {
          this.getLoggerData()
      }
  },
  activated () {
      console.log(this.Loggersn)
      console.log(this.LoggerDate)
      if(this.Loggersn !== null) {
          this.checkedProduct = []
          for(let item of this.Loggersn) {
              this.checkedProduct.push(item)
          }
          this.$store.commit('setLoggerSn', null)
          if(this.LoggerDate !== null) {
              this.startEndDate = this.LoggerDate
              console.log(this.startEndDate)
              this.$emit('changeDate', this.startEndDate)
              this.$store.commit('setDate', null)
              
          } else {
              this.startEndDate = [ new Date(SevenDay(new Date())), new Date()]

          }
          this.queryData()
      }
  }
}
</script>
<style lang="scss" scoped>
.loggerDialogContent {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    .loggerContainer {
      width: 540px;
      height: 240px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background: #fff;
      .loggerTitle {
        height: 50px;
        line-height: 50px;
        padding: 0 0 0 10px;
        border: 1px solid #ccc;
        position: relative;
        .el-form-item {
            margin-bottom: 0;
            
        }
        .closeMulti {
            // position: absolute;
            // top: 0px;
            // right: 5px;
            width: 25px;
            height:25px;
            // height: 50px;
            text-align: center;
            z-index: 99;
            cursor: pointer;

        }
      }
      .loggerContent {
          padding: 0 20px;
          height: 150px;
          
          .el-checkbox+.el-checkbox {
            margin-left: 0px;
          }
          .el-checkbox {
              width: 160px;
              height: 30px;
              line-height: 30px;
          }
      }
      .loogerFooter {
          height: 44px;
          line-height: 44px;
          text-align: center;
          background: #eff3f8;
      }
    }
  }
</style>


