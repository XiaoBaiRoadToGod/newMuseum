<template>
  <el-row>
      <el-col :span='24'>
          路由1   {{ msg }}
          <button @click='fun(10)'>改变msg</button>
      </el-col>
  </el-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    data () {
        return {

        }
    },
    computed: {
        ...mapGetters(['msg'])
    },
    methods: {
        ...mapActions({fun: 'fun'})
    }
}
</script>
<style lang="scss" scoped>

</style>


