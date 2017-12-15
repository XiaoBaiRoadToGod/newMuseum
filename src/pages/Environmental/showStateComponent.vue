<template>
  <el-row>
    <el-col :span='24'>
        <el-dialog
        :visible.sync='setState'>
        <span>{{stateData.LOGGER_NAME}}</span>
        </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data () {
      return {
          setState: false
      }
  },
  props: ['stateData'],
  methods: {
      openTheDialog (bool) {
          this.setState = bool
      }
  },
  mounted () {
      console.log(this.stateData)
  }
}
</script>
<style lang="scss" scoped>

</style>


