<template>
  <section class='uploadPic'>
<!--   <label for="imgUpload" class='dragImg' >将图片文件拖拽至此，或 <span class='colorRed'>点击选择文件上传</span>
  	<div  id='dragCont'></div>
  </label> -->
	<form name='uploadFile' id='uploadFile' method="post" enctype="multipart/form-data">	
		<a href="javascript:;" class='dragImg'>
			将图片文件拖拽至此，或 <span class='colorRed'>点击选择文件上传</span>
			<input @change='fileChange' type="file" id='imgUpload' multiple="multiple" >
		</a>
		<!-- <input @change='fileChange' type="file" id='imgUpload' multiple="multiple" style="position:absolute;clip:rect(0 0 0 0);" /> -->
	</form>
    <!-- <div id='previewImg' @click="deleteImg($event)"></div> -->
    <div id='previewImg'  @click="deleteImg($event)"></div>
    <div class='buttons'>
    	<el-button class='startUpload' type="primary" id='imgSubmit' @click='onSubmit'>开始上传</el-button>
    	<!-- <el-button type="primary" class='stopUpload'>停止上传</el-button>  -->
    </div>
    
  </section>
</template>

<script>
import { uploadPostImg } from './api'
import qs from 'qs'
	export default {
		data(){
			return {
				fileList: [],
				count:0,
				file:null
			}
		},
		methods: {
			fileChange(){
				// console.log('---222---')
				var fileInput = document.querySelector('#imgUpload');
				// console.log(fileInput.files[0]);
				this.file = fileInput;
				
				// this.fileList.push(fileInput.files);
				let _this = this;
				let add = true;
				if(this.fileList.length != 0){
					// console.log(1)
					for (var j = 0; j < this.fileList.length; j++) {
						console.log(i);
						for (var i = 0; i < fileInput.files.length; i++) {
							if(this.fileList[j].file.name == fileInput.files[i].name){
								add = false;
								break;
							}else{
								if(add == true && j == this.fileList.length - 1 && i == fileInput.files.length-1){
									// var newArr = [];
									// newArr.push(fileInput.files);
									_this.previewFun(fileInput.files);
								}else{
									if(!add && j == this.fileList.length - 1 && i == fileInput.files.length-1){
										this.$message({
											type:'warning',
											message:'请不要选择重复的图片！！！'
										})
									}
								}
							}
						}
					}
				}else{
					// console.log(2)
					_this.previewFun(fileInput.files);
				}
				// this.count++;
				
				var obj = document.getElementById('imgUpload') ; 
				// obj.value=''; 
				
			},
			onSubmit(){
				// console.log($('#uploadFile').file);
				// console.log(this.fileList);
				// var myUploadList = new FormData($('#weatherValue'));
				let _this = this;
				if(this.fileList.length == 0){
					this.$message({
						type:'warning',
						message:'请选择上传的图片！！！'
					})
				}else{

					for (var item of this.fileList) {
						
						var formData = new FormData();
						formData.append('file','uploadFile');
						formData.append('file'+item.num, item.file);
						uploadPostImg(formData,qs.stringify({'headers':{'Content-Type':'multipart/form-data'}})).then(function(res){
							// console.log(res);
							// console.log(_this.fileList.length);
							// console.log(item.num);

							if(item.num == _this.fileList.length){
								_this.fileList = [];
								var obj = document.getElementById('imgUpload') ; 
								obj.value=''; 
								
								if(res.errmsg == '上传成功'){
									$('#previewImg').children().remove();
									_this.count = 0;
									_this.$message({
										type:'success',
										message:'上传成功！！！'
									})
								}
							}
						})
					}
				}
				
			},
			previewFun(fileA){
				var previewImg = $('#previewImg');
				console.log(fileA);
				// this.fileList = fileA;
				var _this = this;
				for (var i = 0; i < fileA.length; i++) {
					var reader = new FileReader();
					// if(file.files.length == 1){
					// 	this.count = this.count;
					// }else{
					// 	this.count++;
					// }
					
					console.log(fileA[i]);
					if(!/\/jpeg/.test(fileA[i].type)){
						// console.log(fileA[i].type);
						this.$message({
							type:'warning',
							message:'请选择jpg格式的图片！！！'
						});
						continue;
					}
					var file = fileA[i];
					// _this.fileList.append(fileA.files[i].name, fileA.files[i]);
					// _this.fileList.append('file',file);
					reader.readAsDataURL(file);
					// 读取文件过程
					reader.onLoadstart = function(e){
						// console.log('开始读取。。。');
					}
					reader.onprogress = function(e){
						// console.log('正在读取');
					}
					reader.onabort = function(e){
						console.log('中断读取');

					}
					reader.onerror = function(e){
						console.log('读取异常');
					}
					reader.onload = (function(file, i){
						return function(e){
							// console.log('读取成功');
							_this.count++;
							// console.log(e.target);
							var imgstr = '<div id="preview'+ _this.count +'" data-id="'+ _this.count +'" class="previewPicCont" ><img data-id='+ _this.count +' class="previewPic" src="'+e.target.result+'" /><div class="imgDelete"><span class="deleteClose">'+file.name+'</span><span class="deleteIcon"></span></div></div>';
							previewImg.append(imgstr);
							_this.fileList.push({'num':_this.count,'file':file}  );
							
						};
					})(file,i);
					console.log(this.fileList);

				}
			},
			deleteImg(ev){
				// console.log(ev.target);
				// console.log(this.fileList);
				var el = ev.target;
				if($(el).attr('class') == 'deleteIcon'){
					// console.log('dianjidelete');
					var id = $(el).parent().siblings('img').data('id');
					// console.log(id);
					var oldFiles = [];
					for (var i = 0; i < this.fileList.length; i++) {
						oldFiles.push(this.fileList[i].file);

					};
					// console.log(oldFiles);
					oldFiles.splice(id-1, 1);
					// console.log(oldFiles);
					this.previewFun(oldFiles);
					this.fileList = [];
					this.count = 0;
					var previewImg = $('#previewImg');
					previewImg.children().remove();
					var obj = document.getElementById('imgUpload'); 
					obj.value=''; 
				}
				
			},
		  dragArea(){
		    	document.getElementById('imgUpload').addEventListener('drop',function(e){
		    		// console.log(e);
		    		e.preventDefault();  // 取消默认浏览器的拖拽效果
		    		var fileList = e.dataTransfer.fileList; // 获取文件对象
		    		// 监测是否是拖拽文件到页面的操作
		    		if(fileList.length == 0){
		    			return false;

		    		};
		    		let _this = this;
		    		if(this.fileList.length != 0){
						
						for (var j = 0; j < this.fileList.length; j++) {
						// console.log(i);
							for (var i = 0; i < fileList.length; i++) {
								// console.log(j);
								// console.log(this.fileList[j].file.name);
								// console.log(fileList[i].name);
								if(this.fileList[j].file.name == fileList[i].name){
									add = false;
									break;
								}else{
									if(add == true && j == this.fileList.length - 1 && i == fileList.length-1){
										// var newArr = [];
										// newArr.push(fileInput.files);
										_this.previewFun(fileList);
									}else{
										if(!add && j == this.fileList.length - 1 && i == fileList.length-1){
											this.$message({
												type:'warning',
												message:'请不要选择重复的图片！！！'
											})
										}
									}
								}
								
							}
							
						}
					}else{
						_this.previewFun(fileList);
					}
		    		
		    		var obj = document.getElementById('imgUpload') ; 
					// obj.value=''; 
		    	})
		 	}
		},
    mounted() {
      var _this = this;
      // document.querySelector('#imgUpload').addEventListener('change',function(){
      // 	var fileInput = document.querySelector('#imgUpload');
      // 	_this.previewFun(fileInput.files);
      // },false);

    }
	}
</script>
<style lang='scss'>
#dragCont{
	width: 100%;
	height:100%;
	/*position: absolute;
	top: 0;
	left:0;*/
}
.previewPicCont{
	width: 180px;
	height:180px;
	margin:10px;
	float: left;
	overflow:hidden;
	position: relative;
	border:1px solid #dfdfdf;
}
.previewPicCont img{
	width: 100%;
	height:100%;
}
.previewPicCont:hover .imgDelete{
	height:30px;
}
.previewPicCont .imgDelete{
  .deleteClose {
    display: inline-block;
    width: 70%;
    overflow: hidden;
  }
	display: block;
	width: 100%;
	height: 0px;
	position: absolute;
	top: 0;
	right:0;
	/*border-radius: 15px;*/
	text-align: center;
	line-height: 30px;
	font-size: 14px;
	color: #fff;
	overflow: hidden;
	background: rgba(0,0,0,.7);
	transition: all 0.5s;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
}
.imgDelete .deleteIcon{
	display: inline-block;
	width: 30px;
	height: 100%;
	line-height: 30px;
	vertical-align: middle;
	float: right;
	cursor: pointer;
	background: url(../../assets/img/delete_white.png) no-repeat 9px 7px;
}
.imgDelete .deleteIcon:hover{
	background: url(../../assets/img/delete_blue.png) no-repeat 9px 7px;
}
.buttons .el-button:focus, .buttons .el-button:hover {
    color: #fff;
    border: none;
}

.buttons{
	height: 100px;
	width: 100%;
	background: #eff3f8;
	position: absolute;
	bottom:20px;
	margin: 0 auto;
}
.buttons .el-button{
	color:#666;
	border:none;
	margin-top: 40px;
}
.buttons .startUpload{
	margin-left: 40%;
	width: 100px;
  color: #fff;
}

.buttons .stopUpload{
	width: 100px;
	color:#fff;
} 
</style>
<style scoped lang="scss">
.el-button+.el-button {
    margin-left: 60px;
}
input{
	cursor: pointer;
}
.dragImg{
	position: relative;
	margin-top: 20px;
	width:100%;
	height:100px;
    display: inline-block;
    background: #eff3f8;
    border: none;
    border-radius: 4px;
    // padding: 4px 12px;
    overflow: hidden;
    color: #333;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    text-indent: 0;
    line-height: 100px;
    cursor: pointer;
}
.dragImg input{
	position: absolute;
	width: 100%;
	height:100%;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
.dragImg:hover{
	text-decoration: none;
}
#previewImg{
	overflow:hidden;
}

.uploadPic{
	position: relative;
	height: 100%;
}

.colorRed{
	color:#c32922;
}

</style>
