<template>
<el-row class='changPassCont'>
 <el-form :model='form' class='changePwdCont' label-width='90px' :rules='pwdForm'>
	<el-form-item label='原始密码' prop='oldPwd'>
		<el-input v-model='form.oldPwd' class='pwdInput'></el-input>
	</el-form-item>
	<el-form-item label='新密码' prop='newPwd' >
		<el-input v-model='form.newPwd' class='pwdInput' type='password' onpaste="return false"></el-input>
	</el-form-item>
	<el-form-item label='确认密码' prop='affirmPwd'>
		<el-input v-model='form.affirmPwd' class='pwdInput' type='password' onpaste="return false"></el-input>
	</el-form-item>
	<el-form-item>
		<el-button type="primary" size='small' @click='onSubmit'>保存</el-button>
	</el-form-item>
 </el-form>
</el-row>


</template>
<script>
import { pwdChange } from './api'
import qs from 'qs'

	export default {
		data(){
			return {
				form: {
					oldPwd: '',
					newPwd: '',
					affirmPwd: ''
				},
				pwdForm:{
					oldPwd:[
						{ required: true, message: '请输入原始密码', trigger: 'blur' },
					],
					newPwd:[
						{ required: true, message: '请输入新密码', trigger: 'blur' },
					],
					affirmPwd:[
						{ required: true, message: '请确认密码', trigger: 'blur' },
					]
				}
			}
		},
		methods: {
			onSubmit() {
				var user = JSON.parse(sessionStorage.getItem('user'));
				if(this.form.newPwd !== this.form.affirmPwd){
					this.$message.error('两次输入的密码不一样');
				}else{
					var params = qs.stringify({ Name: user.name, usedPWd:this.form.oldPwd, NewPWd: this.form.newPwd });
					// console.log(user.name);
					pwdChange(params).then(res => {
						// console.log(res);
						if(res == 'ok'){
							this.$message({
								message:'密码修改成功',
								type: 'success'
							});
							this.form.oldPwd = '';
							this.form.newPwd = '';
							this.form.affirmPwd = '';
						}else{
							this.$message.error('原密码错误！');
						}
					})
				}
				
			},
		},
		mounted() {

		}
	}

</script>
<style lang='scss' scoped>
.changPassCont {
  position: relative;
  width: 100%;
  height: 100%;
  .changePwdCont {
    width: 410px;
    height: 260px;
    position: absolute;
    margin: -130px 0 0 -200px;
    top: 50%;
    left: 50%;
}
.changePwdCont .el-form-item__content .el-input {
    width: 320px;
}

.pwdInput input {
    height: 40px;
    background: #fff;
    border: 1px solid #ddd;
}
.changePwdCont input{
	text-indent: 0;
}
}

</style>


