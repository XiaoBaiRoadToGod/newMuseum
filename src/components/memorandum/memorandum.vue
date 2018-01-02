<template>
  <el-row class='memorandumContainer'>
      <el-col :span='24'>
          
        <el-dialog width='450px' :visible.sync='memorandumDialog' title='添加备忘录' class='addMemorandum'>
            <div class='dialogContent'>
                <span>描述：</span>
                <textarea v-model='memorandumContext' name="" id="" cols="30" rows="10" required></textarea>
            </div>
            <div class='dialogFooter'>
                <el-button size='small' @click='CloseMemorandumClick'>取消</el-button>
                <el-button type="primary" size='small' @click='AddMemorandumClick'>保存</el-button>
                <!-- <el-button>取消</el-button> -->
            </div>
        </el-dialog>
          
      </el-col>
  </el-row>
</template>
<script>
import { GetMemorandumAdd } from './api'
export default {
  data () {
      return {
          memorandumDialog: false,
          memorandumContext: ''
      }
  },
  props: ['data'],
  methods: {
      AddMemorandumClick () {
        if(this.memorandumContext == '' || this.memorandumContext == null) {
          this.$message({
            type: 'error',
            message: '请添加描述！！！'
          })
        } else {
            this.data.describe = this.memorandumContext
            console.log(this.data)
            GetMemorandumAdd(this.data).then(res =>{
                if (res == true) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!!!'
                    })
                    this.memorandumDialog = false
                    this.memorandumContext = ''
                } else {
                    this.$message({
                        type: 'success',
                        message: '添加失败!!!'
                    })
                }
            })
        }
      },
      openTheMemo (bool) {
          this.memorandumDialog = bool
      },
      CloseMemorandumClick () {
          this.memorandumDialog = false
          this.memorandumContext = ''
      }
  },
  mounted () {
      
  },
  watch: {
      data () {
          console.log(this.data)
      }
  }
}
</script>
<style lang="scss" scoped>
.memorandumContainer {
    display: block;
.addMemorandum {
  .el-dialog .el-dialog__header {
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    background: #eff3f8;
  }
  .dialogContent {
    padding: 20px 0;
    span {
      display: inline-block;
      vertical-align: top;
    }
    textarea {
      width: 350px;
      height: 150px;
      outline: none;
      border: 1px solid #666;
    }
  }
  .dialogFooter {
    text-align: center;
    padding-bottom: 20px;
  }
}
}
</style>


