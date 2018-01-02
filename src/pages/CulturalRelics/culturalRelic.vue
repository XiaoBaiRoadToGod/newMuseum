<template>
  <el-row class='cultualRelicContainer'>
      <el-col :span='24'>
        <el-form :inline='true'>
          <el-form-item label='文物名称:'>
            <el-input v-model='relicName' size='mini' placeholder='文物名称'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size='mini' @click='queryRelicData'>查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='24' class='relicContainer'>
        <el-col :span='24' class='wenwuTitle'><i class='wenwuIcon'></i>文物陈列</el-col>
        <el-col :span='24' class='relicList'>
          <template v-for='(item,idx) in wenwuInfoList'>
            <el-col :span='6' :key='idx' class='relicBox'>
              <router-link :to='{name:"RelicDetails", params: {id: item.RELIC_ID}}'>
                <el-col :span='24' class='content'>
                  <el-col :span='24' class='title'>{{ item.RELIC_NAME }}</el-col>
                  <el-col :span='24'>
                    <el-col :span='14' class='relicImgCon'>
                      <div class='wenwuImgCont'>
                        <img :src="item.RELICIM_PATH" alt="">
                      </div>
                      
                    </el-col>
                    <el-col :span='10' class='wenwuControl' >
                      <span class='controlName'>{{item.Ch1Name}}</span>
                      <span :style='{color:item.Ch1Color}'>{{item.Ch1}}{{item.Ch1Unit}}</span>
                      <span class='controlName'>{{item.Ch2Name}}</span>
                      <span :style='{color:item.Ch2Color}'>{{item.Ch2}}{{item.Ch2Unit}}</span>
                      <span class='controlName'>{{item.Ch3Name}}</span>
                      <span :style='{color:item.Ch3Color}'>{{item.Ch3}}{{item.Ch3Unit}}</span>
                      <span class='controlName'>{{item.Ch4Name}}</span>
                      <span :style='{color:item.Ch4Color}'>{{item.Ch4}}{{item.Ch4Unit}}</span>
                      <div v-if='item.State == "异常"' class='state'>
                        <i class="stateYichang"></i>
                      </div>
                    </el-col>
                  </el-col>
                </el-col>
                
              </router-link>
              

            </el-col>
          </template>
        </el-col>
        <el-col :span='24' class='myPagination' v-if='!isQuery' >
          <el-pagination
            layout='prev, pager, next'
            :page-size='pageSize'
            @current-change='ChangePageIndex'
            :background='true'
            :total='pageNum'>

          </el-pagination>
        </el-col>
        <el-col :span='24' class='myPagination' v-if='isQuery' >
          <el-pagination
            layout='prev, pager, next'
            :page-size='queryPageSize'
            @current-change='queryChangePageIndex'
            :background='true'
            :total='queryPageNum'>

          </el-pagination>
        </el-col>
      </el-col>
  </el-row>
</template>
<script>
import { wenwuList, wenwuListPage } from './api'
export default {
  data () {
    return {
      relicName: '',
      isQuery: false,
      wenwuInfoList: [],
      pageIndex: 0,
      pageSize: 10,
      pageNum: null,
      queryPageIndex: 0,
      queryPageSize: 10,
      queryPageNum: null
    }
  },
  methods:{
    getRelicData () {
      let params = { Name: '', Type: '', pageSize: this.pageSize, pageIndex: this.pageIndex }
      wenwuList(params).then(res => {
        console.log(res)
        for(let key of Object.keys(res)) {
          // console.log(key)
          this.pageNum = Number(key)
          this.wenwuInfoList = res[key]
        }
      })
    },
    queryRelicData () {
      console.log(this.relicName)
      if(this.relicName == '' ) {
        this.isQuery = false
        this.pageIndex = 0
        this.getRelicData()
      } else {
        String.prototype.trim = function () {
          var str = this,
					  whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
					  for (var i = 0,len = str.length; i < len; i++) {
					    if (whitespace.indexOf(str.charAt(i)) === -1) {
					      str = str.substring(i);
					      break;
					    }
					  }
					  for (i = str.length - 1; i >= 0; i--) {
					    if (whitespace.indexOf(str.charAt(i)) === -1) {
					      str = str.substring(0, i + 1);
					      break;
					    }
					  }
					  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
        }
        this.queryPageNum = 0
        this.relicName = this.relicName.trim()
        var params = { Name: this.relicName, type:'', pageSize: this.queryPageSize, pageIndex: this.queryPageIndex }
        wenwuList(params).then(res => {
          this.isQuery = true
          
          for(let key of Object.keys(res)) {
          // console.log(key)
          this.queryPageNum = Number(key)
          this.wenwuInfoList = res[key]
        }
        })
      }
    },
    ChangePageIndex (index) {
      this.pageIndex = index -1
      this.getRelicData()
    },
    queryChangePageIndex (index) {
      this.queryPageIndex = index - 1
      this.queryRelicData()
    }
  },
  mounted () {
    this.getRelicData()
  }
} 
</script>
<style lang="scss" scoped>
.cultualRelicContainer {
  .relicContainer .wenwuTitle {
    height: 38px;
    line-height: 38px;
    padding-left: 5px;
    background: #f4f4f4;
    border: 1px solid #ccc;
    border-bottom: none;
    .wenwuIcon {
      display: inline-block;
      width: 23px;
      height: 23px;
      background: url(../../assets/img/icon1.png);
      background-position: -19px -675px;
      vertical-align: middle;
      margin: 0 10px 0 54px;
    }
  }
  .relicContainer .relicList {
    .relicBox {
      display: inline-block;
      padding: 10px 4px 0;
      min-height: 196px;
      
      .content {
        background: #fff;
        color: #666;
        border: 1px solid #ddd;
        .title {
          height: 24px;
          line-height: 24px;
          background: #e9f6ff;
          padding-left: 10px;
        }
        .relicImgCon .wenwuImgCont {
          width: 85%;
          padding: 10px;
          img {
            width: 100%;
          }
        }
        .wenwuControl {
          padding: 4px 0 0 ;
          span {
            display: inline-block;
            width: 45%;
            min-width: 60px;
            height: 18px;
          }
          .controlName {
            width: 27%;
            min-width: 32px;
          }
          .state .stateYichang {
            display: inline-block;
            width: 73px;
            height: 51px;
            background: url(../../assets/img/icon1.png);
            background-position: 13px -707px;
            float: right;
            margin: 0 12px 0 0;
          }
        }
      }
      
    }
  }
}

</style>


