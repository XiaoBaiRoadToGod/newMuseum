<template>
  <el-row>
      <el-dialog
        title='文物预防性保护环境监控系统'
        width='520px'
        center
        custom-class='helpDialog'
        :visible.sync="helpVisible">
            <a href="http://www.huato.com" target="view_window"><img class='HuatoLogoImg' src="../assets/img/LOGO1.png" alt="HUATO"></a>
            <p>WWWRC V3.5.2.1 B001</p>
            <p>Copyright 2016 版权所有</p>
            <p>深圳华图测控系统有限公司</p>
            <p>电话：+86-755-23012549</p>
            <p>传真：+86-755-29748856</p>
            <p>Email：sales@huato.com</p>
            <p>网址：<a href="http://www.huato.com" target="view_window">http://www.huato.com</a></p>
            <p>地址：深圳市宝安西乡桃花源科技创新园四分园4楼</p>
      </el-dialog>
  </el-row>
</template>
<script>
export default {
  data () {
      return {
          helpVisible: false
      }
  },
  methods: {
      opeTheDialog (bool) {
          this.helpVisible = bool
      }
  }
}
</script>
<style lang="scss" scoped>

</style>


