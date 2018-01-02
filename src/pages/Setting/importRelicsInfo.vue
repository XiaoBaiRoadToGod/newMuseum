<template>
    <section class='uploadFileCont'>
        <form  >
	        <a href="javascript:;" class='a-upload'>
	        	<el-button type='primary' size='mini' >选择文物信息</el-button><input id='fileUploadBtn' type='file'/>
	        </a>
            <span class='uploadInfo'></span>
            <div class='el-upload_tip'>选择要导入的文物文件：（工作表名为“Sheet1”,文件后缀名为xlsx格式）<span :style='{background: primaryColor}' class='uploadTemplate' @click='uploadTemp'>点击下载模板</span><span style="color:red">文物名称不能为数字</span></div>
            <el-button type='primary' size='small' @click='submitUpload'>保存</el-button>
        </form>
    </section>
</template>
<script>
import { uploadPostFile,uploadFileTemplate } from './api'
import { mapGetters } from 'vuex'
import qs from 'qs'
	export default {
		data(){
			return {
				fileList: new FormData()
			}
    },
    computed: {
      ...mapGetters(['primaryColor'])
    },
		methods:{
			uploadTemp(){
				uploadFileTemplate().then(res => {
					console.log(res);
					// res= 'http://huato2008.eicp.net:8020/Edition/app-debug.apk';
					window.open(res);
				})
				// window.open('http://192.168.10.68:8021/Template/上传文物模板.xlsx');
			},
			submitUpload(){
				var file = document.querySelector('#fileUploadBtn').files[0];
				this.fileList.append('myFile',file);
				uploadPostFile(this.fileList,qs.stringify({'headers':{'Content-Type':'multipart/form-data'}})).then(res => {
					console.log(res);
					if(res == '200'){
						this.$message({
							type:'success',
							message:'上传文物信息成功！'
						});
						this.fileList = new FormData();
						$('.uploadInfo').html('');
						$('#fileUploadBtn').val('');
						// $('.a-upload').children('#fileUploadBtn').remove();
						// $('.a-upload').append("<input id='fileUploadBtn' type='file' style='position: absolute;font-size: 0px;width: 100%;height: 100%;right: 0;top: 0;opacity: 0;filter: alpha(opacity=0);cursor: pointer;'/>");
					}else if(res == '201'){
						this.$message({
							type:'error',
							message:'上传文物信息失败！'
						})
					}else if(res == '202'){
						this.$message({
							type:'warning',
							message:'文物名称不能为数字！'
						})
					}
					
				});
			},
			fileChange(){
				var file = document.querySelector('#fileUploadBtn').files[0];
				console.log(file);
				$('.uploadInfo').html(file.name);
			}

		},
		mounted(){
			var _this = this;
			$('#fileUploadBtn').change(function(){
				console.log('-----');
				_this.fileChange();
			})
		}
	}



</script>
<style scoped lang="scss">
.uploadTemplate{
  // color:#6fb3e0;
  display: inline-block;
  width: 90px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 8px;
}
.uploadInfo{
	display: block;
	width: 100%;
	height: 20px;
	font-size: 14px;
	color:#666;
	margin: 10px 0 0  0;
	padding-left: 15px;
}
.a-upload {
    padding: 4px 10px;
    width: 138px;
    height: 25px;
    line-height: 20px;
    position: relative;
    cursor: pointer;
    color: #fff;
    // background: #6fb3e0;
    // border: 1px solid #20a0ff;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    *display: inline;
    *zoom: 1
}
.a-upload  #fileUploadBtn {
    position: absolute;
    font-size: 0px;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
}
// .a-upload:hover {
//     color: #fff;
//     background: #20a0ff;
//     border-color: #20a0ff;
//     text-decoration: none
// }
.uploadFileCont {
    width: 400px;
    height: 300px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .el-upload {
        margin: 0 auto;
    }
    .el-button {
        width: 160px;
        font-size: 16px;
    }
}

.el-upload_tip {
    color: #666;
    ;
    font-size: 16px;
    margin: 13px 0 20px -210px;
}
</style>
