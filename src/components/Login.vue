<template>
  <el-row>
      <el-col :span='24'>
          <el-form>
              <el-form-item label='用户名'>
                  <el-input v-model='name' name='name'></el-input>
              </el-form-item>
              <el-form-item label='密码'>
                  <el-input v-model='pwd' name='pwd'></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click='onSunmit'>登录</el-button>
              </el-form-item>
          </el-form>
      </el-col>
  </el-row>
</template>
<script>
import { UserLogin } from './api'
import qs from 'qs'
export default {
    data () {
        return {
            name: 'admin',
            pwd: 'admin'
        }
    },
    methods: {
       onSunmit() {
           var params =  qs.stringify({
               name: 'admin',
               pwd: 'admin'
           })
           UserLogin(params).then(res => {
               console.log(res)
               if(res.ok) {
                   const user = JSON.stringify({ name: res.ok[0].USER_NAME, ids: res.ok[0].USER_GROUP_IDS})
                   sessionStorage.setItem('user', user)
                   this.$router.push('/RealTimeMonitoring')
               }
           })
       } 
    },
    mounted () {

    }
}
</script>
<style lang="scss" scoped>

</style>


