<template>
  <el-row>
      <el-col :span='24'>
          <el-dialog
            :visible.sync='setState'>
            <span>fagafdhg</span>
          </el-dialog>
      </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  data () {
      return {
          setState: false
      }
  },
  props: [],
  methods: {
      openTheDialog () {
          this.setState = true
      }
  },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>

</style>


