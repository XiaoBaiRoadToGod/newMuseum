<template>

<el-col :span='24' class='showStateContainer'>
    <el-dialog
    :visible.sync='setState'
    v-if='stateData'
    width='612px'
    :title='stateData.Device'>
        <h3>状态信息</h3>
        <div class='StateInfoContent'>
            <template >
                <!-- 展柜小型恒湿机 -->
                <div class='loggerState statePadding' v-if='stateData.VER_ID == 11'>
                    <span class='StateText' >电源状态:</span><span class='stateImg'><img :src="stateData.CompressH " ></span>
                    <span class='StateText'>水位状态:</span><span class='stateImg' :style='{color:stateData.waterColor}'>{{stateData.CompressO}} </span>
                    <span class='StateText'>风扇状态:</span><span class='stateImg'><img :src="stateData.MainBlowerO " ></span>
                    <span class='StateText'>设备温度:</span><span class='stateImg' :style='{color:stateData.shebeiColor}'>{{stateData.LoggerTemp}} </span>
                    <span class='StateText'>传感器状态:</span><span class='stateImg'><img :src="stateData.CompressL " ></span>
                    <span class='StateText'>冷凝片状态:</span><span class='stateImg' :style='{color:stateData.lingNingColor}'>{{stateData.MainBlower}} </span>
                </div>
                <span class='setState' v-if='stateData.VER_ID == 11' >
                    <el-form :model='setForm' :rules='formRules' ref='setFormRef' >
                        <el-form-item :label='"当前湿度是" + stateData.LOGS_CHTWO + "%，请设置湿度"' prop='setHumi'>
                            <el-input v-model.number='setForm.setHumi' size='mini'  ></el-input>
                        </el-form-item>
                    </el-form>
                </span>
                <!-- 展柜大型恒湿机 -->
                <div class='loggerState statePadding' v-if='stateData.VER_ID == 12'>
                    <span class='StateText'>压缩机高压:</span><span class='stateImg'><img :src="stateData.CompressH " ></span>
                    <span class='StateText'>高水位开关:</span><span class='stateImg'><img :src="stateData.HWater " ></span>
                    <span class='StateText'>送风机过载:</span><span class='stateImg'><img :src="stateData.MainBlowerO " ></span>
                    <span class='StateText'>压缩机低压:</span><span class='stateImg'><img :src="stateData.CompressL " ></span>
                    <span class='StateText'>低水位开关:</span><span class='stateImg'><img :src="stateData.LWater " ></span>
                    
                    <span class='StateText'>报警状态:</span><span class='stateImg'><img :src="stateData.AlarmState " > </span>
                    <span class='StateText'>压缩机过载:</span><span class='stateImg'><img :src="stateData.CompressO " ></span>
                    <span class='StateText'>漏水报警开关:</span><span class='stateImg'><img :src="stateData.OWater " ></span>
                    
                    <span class='StateText'>水箱温度:</span><span class='stateImg'>{{stateData.LoggerTemp}} </span>
                    <span class='StateText'>制冷除湿机压缩机:</span><span class='stateImg'><img :src="stateData.Compresser " ></span>
                    <span class='StateText'>水箱补水电磁阀:</span><span class='stateImg'><img :src="stateData.IntoFlood " ></span>
                    <span class='StateText'>系统送风机:</span><span class='stateImg'><img :src="stateData.MainBlower " > </span>
                    <span class='StateText'>制热加湿加热器:</span><span class='stateImg'><img :src="stateData.AddHumi " ></span>
                    <span class='StateText'>漏水断水电磁阀:</span><span class='stateImg'><img :src="stateData.OutFlood " > </span>
                </div>
                <span class='setState' v-if='stateData.VER_ID == 12' >
                    <el-form :model='setForm' :rules='formRules' ref='setFormRef' >
                        <el-form-item :label='"当前湿度是" + stateData.LOGS_CHTWO + "%，请设置湿度"' prop='setHumi'>
                            <el-input v-model.number='setForm.setHumi' size='mini'  ></el-input>
                        </el-form-item>
                        <template>
                            <div class='myResetWarning' @click='alermReset' :style='{background: primaryColor, float: "right"}'>预警复位</div>
                        </template>
                    </el-form>
                </span>
                <!-- 加湿除湿净化一体机 -->
                <div class='loggerState' v-if='stateData.VER_ID == 13'>
                    <span class='StateText' >压机高压:</span><span class='stateImg' ><img :src="stateData.CompressH " ></span>
                    <span class='StateText'>高水位开关:</span><span class='stateImg'><img :src="stateData.HWater " ></span>
                    <span class='StateText'>主风机过载:</span><span class='stateImg'><img :src="stateData.MainBlowerO " ></span>

                    <span class='StateText'>压机低压:</span><span class='stateImg'><img :src="stateData.CompressL " ></span>
                    <span class='StateText'>低水位开关:</span><span class='stateImg'><img :src="stateData.LWater " ></span>
                    <span class='StateText'>报警状态:</span><span class='stateImg'><img :src="stateData.AlarmState " > </span>

                    <span class='StateText'>压机过载:</span><span class='stateImg'><img :src="stateData.CompressO " ></span>
                    <span class='StateText'>超高水位开关:</span><span class='stateImg'><img :src="stateData.OWater " > </span>
                    <span class='StateText'>水箱温度:</span><span class='stateImg'>{{stateData.LoggerTemp}}</span>

                    <span class='StateText'>压机:</span><span class='stateImg'><img :src="stateData.Compresser " ></span>
                    <span class='StateText'>进水阀:</span><span class='stateImg'><img :src="stateData.IntoFlood " > </span>
                    <span class='StateText'>主风机:</span><span class='stateImg'><img :src="stateData.MainBlower " ></span>
                    
                    
                    <span class='StateText'>加湿:</span><span class='stateImg'><img :src="stateData.AddHumi " ></span>
                    <span class='StateText'>排水泵:</span><span class='stateImg'><img :src="stateData.OutFlood " ></span>
                </div>
                <span class='setState' v-if='stateData.VER_ID == 13' >
                    <el-form :model='setForm' :rules='formRules' ref='setFormRef' >
                        <el-form-item label="加湿设置" prop='setHumi'>
                            <p>上限:</p>
                            <el-input v-model.number='setForm.setHumi' size='mini'  ></el-input>
                        </el-form-item>
                        <template >
                            <div class='myResetWarning' @click='alermReset' :style='{background: primaryColor, float: "right"}'>预警复位</div>
                        </template>
                    </el-form>
                </span>
            </template>
        </div>
        <span slot="footer" class="dialog-footer DialogFooter">
            <el-button size='mini' @click="stateInfoCancel">取 消</el-button>
            <el-button size='mini' type="primary" @click="stateInfoOk">确 定</el-button>
        </span>
    </el-dialog>
</el-col>
</template>
<script>
import { mapGetters } from 'vuex'
import { ControlsSet, ControlsDevicecopy, ControlsDeviceBack } from './api'
import { openWarningMessage } from '@/assets/js/commonFunc'
export default {
  data () {
      var checkNumber = (rule, value, callback) => {
        //   console.log((/^-?\d*\.?\d+$/).test(value))
          if (!(/^-?\d*\.?\d+$/).test(value)) {
            //   console.log(value)
              
              callback(new Error('请输入有效的数值'))
          } else {
            //   console.log(value)
              if (value > 100 || value < 0) {
                  callback(new Error('请输入有效的数值'))
              } else {
                  callback()
              }
              
          }
      }
      return {
          setState: false,
          setForm: {
            setTemp: null,          // 设置温度
            setHumi: null,          // 设置湿度
            setHumiOffset: null,    // 设置湿度偏差
            setDehumiCeling: null,  // 除湿上限
            setDehumiFloor: null,   // 除湿下限
            setAddHumiCeling: null,  // 加湿上限
            setAddHumiFloor: null,    // 加湿下限
          },
          formRules: {
              setHumi: [
                //   { type: 'float', required: true, message: '请输入正确的数值', trigger: 'blur' }
                  { validator: checkNumber, trigger: 'blur' }
              ]
          }
          
      }
  },
  computed: {
      ...mapGetters(['primaryColor'])
  },
  props: ['stateData'],
  methods: {
      openTheDialog (bool) {
          this.setState = bool
      },
      stateInfoCancel () {
          this.setState = false
      },
      stateInfoOk () {
          this.$refs['setFormRef'].validate((valid) => {
              if(valid) {
                  switch (this.stateData.VER_ID) {
                      case value:
                          
                          break;
                  
                      default:
                          break;
                  }
              }else {
                  return false
              }
          })
          this.setState = true
      },
      alermReset () {  // 预警复位
      let _this = this
        let params = { type: 'Reset', sn: this.stateData.LoggerSN, strVal1:'',strVal2:'',strVal3:'',strVal4:'',strVal5:'',strVal6:'' }
        ControlsSet(params).then(res => {
            if (res == '200') {
                openWarningMessage('success', '设置成功!!!', _this)
            } else {
                openWarningMessage('error', '设置失败!!!', _this)
            }
        })
      }
  },
  mounted () {
      
    //   if (this.stateData !== null) {
    //       console.log(this.stateData.Humidity)
    //       this.setForm.setHumi = this.stateData.Humidity
    //   } 
  },
  watch: {
      stateData () {
          console.log(this.stateData)
          this.setForm.setHumi = this.stateData.Humidity
      }
  }
}
</script>
<style lang="scss" scoped>
.showStateContainer {
    .el-dialog .StateInfoContent{
        height: 100%;
        .loggerState {
            img {
                vertical-align: middle;
            }
            span {
                display: inline-block;
                height: 40px;
                line-height: 40px;
            }
            .StateText {
                width: 120px;
            }
            .stateImg {
                width: 90px;
                color: #419700;
                text-align: center;
                
            }
        }
        .setState .el-form{
            .el-form-item {
                width: 45%;
                display: inline-block;
                
            }
            .myResetWarning {
                width: 31px;
                height: 46px;
                margin-top: 20px;
                border-radius: 10px;
                color: #fff;
                padding: 10px 17px;
                cursor: pointer;
            }

        }
        .statePadding {
            padding: 0 40px 20px 60px;
        }
        
    }
}
</style>


