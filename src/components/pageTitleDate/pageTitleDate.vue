<template>
  <el-row class='pageTitle'>
      <el-col :span='24'>
          <el-form 
            inline>
              <el-form-item :label='data.selectLabel'>
                  <el-select
                  v-model='selectData'
                  @change='changeSelect'
                  size='mini'>
                    <el-option v-for='item in data.selectOptions' :key='item.value' :label="item.label" :value="item.value"></el-option>
                  </el-select>
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
                  <el-button type="primary" size='mini'>查询</el-button>
              </el-form-item>
          </el-form>
      </el-col>
  </el-row>
</template>
<script>
import { SevenDay } from '@/assets/js/commonFunc'
export default {
  data () {
      return {
          selectData: null,
          startEndDate: [ new Date(SevenDay(new Date())), new Date()],
          disabledDate: {
              disabledDate(time) {
                  return time.getTime() > Date.now();
              }
          }
      }
  },
  props: ['type', 'data'],
  methods: {
      initFormData () {
          this.selectData = this.data.selectOptions[0].value
          this.$emit('changeDate', this.startEndDate)
      },
      changeSelect (value) {
          this.$emit('changeSelects', value)
      },
      chooseDate (date) {
          console.log(date)
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
      }
  },
  mounted () {
      console.log(this.data)
      this.initFormData()
  }
}
</script>
<style lang="scss" scoped>
.pageTitle {
    .el-form .el-form-item {
        margin-bottom: 9px;
    }
}
</style>


