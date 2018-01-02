<template>
  <el-row :gutter='20' class='setLoggerHideContainer '>
  	<el-col :span='10' class='setLoggerLeft'>
		<div v-bar style='width: 100%; height:100%' >
			<div>
			<el-col class='setTitle'>请选择展厅</el-col>
			<div class='content'>
				<el-radio-group v-model='checkRadio' @change='radioChange'>
					<el-radio v-for='item in radioData' :key='item.groupId' :label='item.groupId'>{{item.name}}</el-radio>
				</el-radio-group>
			</div>
			</div>
		</div>
  	</el-col>
  	<el-col :span='13' class='setLoggerRight'>
  		<el-col class='setTitle'>请选择需要隐藏的仪器</el-col>
		
				<div class='content'>
					<el-checkbox-group v-model="checkHidden" @change="checkedHide" fill='#438eb9'>
						<el-checkbox v-for="item in allLogger" :label="item.sn" :key="item.sn">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</div>
			
  		

  		<el-button size='small' type="primary" class='myBtn' @click='AddSetLogger'>保存</el-button>
  	</el-col>
  </el-row>
</template>
<script>
import { zhantingList, setLoggerHide, AddsetLoggerHide } from './api'
import qs from 'qs'
export default {
	data() {
		return {
			checkRadio: null,   // 选中的展厅
			radioData: [],      // 全部的展厅
			checkHidden: [],	// 选中隐藏仪器
			allLogger: [],		// 全部仪器
		}
	},
	methods: {
		getZhantingList() {
			var user = JSON.parse(sessionStorage.getItem('user'));
			console.log(user);
			var params = qs.stringify({
				"" : user.ids
			})
			zhantingList(params).then(res =>{
				console.log(res);
				this.radioData = [];
				for( let key of Object.keys(res)) {
					//console.log(key);
					for(let item of res[key]) {
						this.radioData.push({
							name: item.GROUP_NAME,
							groupId: item.GROUP_ID
						})
					}
				}
				console.log(this.radioData);
			})
		},
		radioChange(value) {
			console.log(value);
			var params = { groupId: value };
			setLoggerHide(params).then(res => {
				console.log(res);
				this.allLogger = [];
				this.checkHidden = [];
				// this.allLogger = res.Show.concat(res.hide);
				for(let show of res.Show){
					this.allLogger.push(show);
				};
				if(res.hide.length !== 0) {
					for(let hide of res.hide) {
						this.allLogger.push(hide);
						this.checkHidden.push(hide.sn);
					}
				}
				
				

				console.log(this.allLogger);
			})
		},
		checkedHide(value) {
			console.log(value)
		},
		AddSetLogger() {
			console.log(this.checkHidden);
			
				let ShowLogger = [];
				let MyAll = JSON.parse(JSON.stringify(this.allLogger));
				console.log(MyAll);
				for(let i =0; i < this.checkHidden.length; i++) {
					for(let n = 0; n < MyAll.length; n++) {
						var allSN = MyAll[n].sn;
						var nm = this.checkHidden[i];
						if(MyAll[n].sn == this.checkHidden[i]) {
							console.log('----');
							MyAll.splice(n, 1);
							// i = i-1 < 0 ? 0 : i-1;
							n = -1;
						} else {

						}
						
					}
				};
				console.log(MyAll);
				for(let item of MyAll){
					ShowLogger.push(item.sn);
				};
				var params = {
					Usn1: this.checkHidden.join(','),
					Usn2: ShowLogger.join(',')
				};
				console.log(params);
				AddsetLoggerHide(params).then(res => {
					console.log(res);
					if(res == true) {
						this.$message({
							type:'success',
							message: '保存成功！！！'
						});
					} else {
						this.$message({
							type: 'error',
							message: '保存失败！！！'
						})
					}
				})
			
			
			
		}
	},
	mounted() {
		console.log('---')
		this.$emit('inSetting'); // 进入设置页面后改变左侧菜单显示
		this.getZhantingList();
		$('.setLoggerLeft').css({
			'padding-left': '0px',
			'padding-right': '0px'
		});
		$('.setLoggerRight').css({
			'padding-left': '0px',
			'padding-right': '0px'
		})
	},
	beforeDestroy(){ 
		this.$emit('outSetting'); // 离开设置页面后改变左侧菜单显示
	},
	deactivated(){
		this.$destroy(true);
	}
}
</script>
<style scoped lang='scss'>

	.setLoggerHideContainer {
		height: 100%;
		padding: 13px 21px;
		.el-radio-group {
			.el-radio {
				height: 30px;
				width: 50%;
				//text-align: center;
      }
      .el-radio+.el-radio {
        margin-left: 0;
      }
		}
		.el-checkbox-group {
			.el-checkbox {
				height: 30px;
				width: 30%;
				//text-align: center;
			}
			.el-checkbox+.el-checkbox {
			    margin-left: 0px;
			}
		}
		.setLoggerLeft, .setLoggerRight {
			height: 100%;
			margin-right: 20px;
			border: 1px solid #ccc;
      		padding: 10px ;
      		background: #fff;
			.setTitle {
				height: 30px;
				text-align: center;
				font-size: 16px;
				border-bottom: 1px solid #ccc;
				margin-bottom: 20px;
			}
			.content {
				padding: 10px 30px;
			}
			.el-button {
				margin-left: 30px;
			}
		}
	}
</style>



