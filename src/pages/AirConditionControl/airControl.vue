<template>
	
	<div class='listContainer'>
		<div class='myAir' v-for='(item, index) in dataList' :key='index'>
			<div class='airContainer'  v-if='item.VER_ID == 17' >
				<div class='airTitle' :style='{background: primaryColor}'>
					<p >通讯状态：{{ item.DDC }}</p>
					<span>{{ item.iName }}</span>
				</div>
				<div class='airContent type0Background'>
					<div class="airValue positonAb width16">
						新风阀开度<i>{{ item.airValueOpening}}</i>%
					</div>
					<div class="returnAir positonAb">
						<span>回风温度：<i>{{ item.returnTemp }}</i>℃</span>
						<span>回风湿度：<i>{{ item.returnHumi}} </i>%</span>
					</div>
					<div class="pressAlerm positonAb width16">
						压差报警<i class='airIcon pressAlermIcon' :style='{background: item.differentialIcon }'></i>
					</div>
					<div class="refrigeration positonAb width16">
						制冷阀
					</div>
					<div class="coldValue positonAb">
						阀门开度 <br/>
						<span class='kaiValue'> {{item.cooling}} </span>%
					</div>
					<div class="heatingUp positonAb width16">
						加热阀
					</div>
					<div class="heatValue positonAb" @click='setValue($event, item.loggersn, index, "加热阀")'>
						阀门开度 <br/>
						<span class='kaiValue' >{{item.thermal}} </span>%
					</div>
					<div class="humidification positonAb width16">
						加湿阀
					</div>
					<div class="wetValue positonAb" @click='setValue($event, item.loggersn, index, "加湿阀")'>
						阀门开度 <br/>
						<span class='kaiValue' >{{item.hcation}} </span>%
					</div>
					<div class="airSupply positonAb width16">
						送风机段<i class='airIcon' :style='{background: item.blower }'></i>
					</div>
					<div class="returnAirSeg positonAb width16">
						回风机段<i class='airIcon' :style='{background: item.return }'></i>
					</div>
					<div class="pressureSeg positonAb width16">
						压差报警<i class='airIcon' :style='{background: item.differentialIcon }'></i>
					</div>
					<div class='freshAirValueSet'>
						<div class='freshAirValue' @click='setValue($event, item.loggersn, index, "新风阀设定")'>
							<span class='name'>新风阀设定：{{item.fresh}}</span>%
						</div>
						<div class='temp' @click='setValue($event, item.loggersn, index, "温度设定")'>
							<span class="name">温度设定：{{item.temp}}</span> ℃
						</div>
						<div class='humi' @click='setValue($event, item.loggersn, index, "湿度设定")'>
							<span class="name">湿度设定：{{item.humi}}</span>%RH
						</div>
					</div>
					<div class="alermBtn positonAb" >
						<div class='myAlermBtn airSupplyAlerm' :style='{background: item.compress == "正常" ? primaryColor : item.compress}'>
							送风阀报警
						</div>
						<div class='myAlermBtn returnAirSegAlerm' :style='{background: item.mainBlower == "正常" ? primaryColor : item.mainBlower}'>
							回风阀报警
						</div>
						<div class='myAlermBtn pressureSegAlerm' :style='{background: item.differential == "正常" ? primaryColor : item.differential}'>
							压差报警
						</div>
						<div class='myAlermBtn fanFailureAlerm' :style='{background: item.HWater == "正常" ? primaryColor : item.HWater}'>
							风机故障报警
						</div>
						<div class='myAlermBtn airValueAlerm' :style='{background: item.freshPolice == "正常" ? primaryColor : item.freshPolice}'>
							新风阀报警
						</div >

						<div class='switch'>
							开关机： <el-switch
									v-model="item.switch"
									size='mini'
									:width='50'
									@change='switchChange($event, item.loggersn, index)'
									>
									</el-switch>	
						</div>
					</div>
				</div>
				<div class='airFooter '>
					<span class='data'>{{item.iTime}}</span>
				</div>
			</div><div class='airContainer typeContainer' v-if='item.VER_ID == 18'  >
				<div class='airTitle' :style='{background: primaryColor}'>
					<span class='type' >调控模式：{{item.Freshair}}</span><span class='name' >{{item.iName}}</span>
				</div>
				<div class='airContent type1Background'>
					<div class='humidifier positonAb'>加湿器 </div>
					<!-- <div class='humidiferHumi positonAb'>25%</div> -->
					<div class='blower positonAb'>送风机</div>
					<div class='realTemp positonAb'>{{item.ReturnT}}℃</div>
					<div class='realHumi positonAb'>{{item.ReturnH}}%</div>
					<div class='clickSetContainer positonAb'>
						<div class='backFanTemp'  @click='setValue($event, item.loggersn, index, "回风机温度")' >
							<span class='name' >回风机温度设定：{{ item.Temp }}</span><span>℃</span>
						</div>
						<div class='backFanHumi' @click='setValue($event, item.loggersn, index, "回风机湿度")' >
							<span class='name'>回风机湿度设定：{{item.Humi}}</span>%
						</div>
					</div>
					<div class="alermBtn positonAb" >
						<!-- <div class='myAlermBtn airSupplyAlerm' :style='{background: item.compress}'>
							IO状态
						</div>
						<div class='myAlermBtn returnAirSegAlerm' :style='{background: item.mainBlower}'>
							参数设定
						</div>
						<div class='myAlermBtn pressureSegAlerm' :style='{background: item.differential}'>
							工厂设定
						</div>
						<div class='myAlermBtn fanFailureAlerm' :style='{background: item.HWater}'>
							历史数据
						</div> -->
						<div :style='{background: primaryColor}' class='myAlermBtn airValueAlerm alermInfo' @click='showAlermInfo(item)'>
							故障信息
						</div >
						<div class='switch'>
							开关机： <el-switch
									v-model="item.switch"
									size='mini'
									:width='50'
									@change='switchChange($event, item.loggersn, index)'
									>
									</el-switch>	
						</div>
					</div>
				</div>
				<div class='airFooter '>
					<span class='data'> {{item.iTime}}</span>
				</div>
			</div>
		</div>
		
		<el-dialog
			class='airAlermDialog'
			:visible.sync="alermInfoDialog"
			width='800px'
			v-if='airInfo !== []'
			title='故障信息'>
			<div class='infoContainer'>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >送风机过载:</span><i class='alermIcon' :style='{background: airInfo.differential == 1 ? airInfoAlerm : airInfoNormal}' ></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机1过载:</span><i class='alermIcon' :style='{background: airInfo.State1 == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >送风机控制:</span><i class='alermIcon' :style='{background: airInfo.State4 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >送风风压保护:</span><i class='alermIcon' :style='{background: airInfo.cooling == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >冷凝风机1过载:</span><i class='alermIcon' :style='{background: airInfo.State2 == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机1控制:</span><i class='alermIcon' :style='{background: airInfo.State5 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >火灾信号连锁保护:</span><i class='alermIcon' :style='{background: airInfo.thermal == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机1高压保护:</span><i class='alermIcon' :style='{background: airInfo.compress == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机2控制:</span><i class='alermIcon' :style='{background: airInfo.State6 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >电加热过热保护:</span><i class='alermIcon' :style='{background: airInfo.hcation == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机1低压保护:</span><i class='alermIcon' :style='{background: airInfo.mainBlower == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >系统2能量阀控制:</span><i class='alermIcon' :style='{background: airInfo.State7 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >加湿器故障:</span><i class='alermIcon' :style='{background: airInfo.blower == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机2过载:</span><i class='alermIcon' :style='{background: airInfo.HWater == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >电加热1控制:</span><i class='alermIcon' :style='{background: airInfo.State8 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >水泵及水流量连锁输入:</span><i class='alermIcon' :style='{background: airInfo.return == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >冷凝风机2过载:</span><i class='alermIcon' :style='{background: airInfo.freshPolice == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >电加热2控制:</span><i class='alermIcon' :style='{background: airInfo.State9 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >送风机过滤压差开关:</span><i class='alermIcon' :style='{background: airInfo.fresh == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机2高压保护:</span><i class='alermIcon' :style='{background: airInfo.DiffPolice == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >加湿器控制:</span><i class='alermIcon' :style='{background: airInfo.State10 == 0 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
				<div class='loggerAlermInfoContainer'>
					<span class='loggerName' >压缩机2低压保护:</span><i class='alermIcon' :style='{background: airInfo.State3 == 1 ? airInfoAlerm : airInfoNormal}'></i>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="alermInfoDialog = false">返 回</el-button>
			</span>
		</el-dialog>
	</div>
	
</template>

<script>
  import { GetAirControlDetails, ControlsSet } from './api'
  import { mapGetters } from 'vuex'
	export default {
		data () {
			return {
				dataList: [
					{
						'airValueOpening': '', // 新风阀开度
						'returnTemp': '',       // 回风温度
						'returnHumi': '',       // 回风湿度
						'differential': '', // 压差报警
						'differentialIcon': '',
						'cooling': '',           // 制冷阀开度
						'thermal': '',           // 加热阀开度
						'hcation': '',           // 加湿阀开度
						'blower': '',             // 送风机段
						'return': '',             // 回风机段
						'loggersn': '',         // sn
						'iName': '',               // 名称
						'iTime': '',                // 时间
						'DDC': '',
						'temp': '',                 // 设定温度
						'humi': '',                  // 设定湿度
						'fresh': '',                // 新风阀设定值
						'compress': '',          // 送风机报警
						'mainBlower': '',      // 回风机报警
						'HWater': '',              // 风机故障报警
						'freshPolice': ''           // 新风阀报警
					}
				],
				airNomal: "url(../../../static/img/airNprmal.png) no-repeat",    // 正常图片
				airAlerm: "url(../../../static/img/airAlerm.png) no-repeat",     // 报警图片
				alermInfoDialog: false,
				airInfo: {
					differential: '',
					cooling:'',
					blower:'',
					return:'',
					temp:'',
					humi:'',
					fresh:'',
					compress:'',
					mainBlower:'',
					HWater:'',
					freshPolice:'',
					DiffPolice:'',
					Freshair:'',
					State1:'',
					State2:'',
					State4:'',
					State5:'',
					State6:'',
					State7:'',
					State8:'',
					State9:'',
					State10:''
				},
				airInfoAlerm: 'url(../../../static/img/airInfoAlerm.png) no-repeat',
				airInfoNormal: 'url(../../../static/img/airInfoNormal.png) no-repeat'
			}
		},
		computed: {
			...mapGetters(['primaryColor'])
		},
		methods: {
			switchBtn(switchNum, switchState){
				if(switchNum == 0){
					if(switchState == 0){
						return false;
					}else{
						return false;
					}
				}else if(switchNum == 1){
					if(switchState == 0){
						return true;
					}else{
						return true;
					}
				}
			},
			setValue(ev, sn, idx, type) {
				console.log(type)
				// let el = ev.target;
				// console.log($(el).parent().children('.name'))
				var text = type;
				var _this = this;
				let user = JSON.parse(sessionStorage.getItem('user'));
				console.log(user)
				if(user.level == 120){
					if(text == '新风阀设定'){
						console.log('新风阀');
						
						this.$prompt('请输入新风阀设定值', '提示', {
							confirmButtonText: '确定',
	          				cancelButtonText: '取消',
	          				inputPattern: /^\d+(\.\d+)?$/,
	          				inputErrorMessage: '请输入正确的数字',
	          				inputValue: _this.dataList[idx].fresh
						}).then(({value}) => {
							console.log(value);
							var params = {
								type:'Airs',
								sn: sn,
								strVal1: value,
								strVal2: '',
								strVal3: '',
								strVal4:'',
								strVal5:'',
								strVal6:''
							};
							ControlsSet(params).then(res => {
								console.log(res);
								if(res == 201) {
									this.$message({
										type: 'success',
										message: '设定成功！！'
									});
									this.dataList[idx].fresh = value;
								}else {
									this.$message({
										type: 'error',
										message: '设定失败！！'
									})
								}
							})


						}).catch(() => { console.log('取消输入')})
					} else if (text == '温度设定') {
						console.log('温度');
						this.$prompt('请输温度设定值', '提示', {
							confirmButtonText: '确定',
	          				cancelButtonText: '取消',
	          				inputPattern: /^\d+(\.\d+)?$/,
	          				inputErrorMessage: '请输入正确的数字',
	          				inputValue: _this.dataList[idx].temp
						}).then(({value}) => {
							console.log(value);
							var params = {
								type:'AirT',
								sn: sn,
								strVal1: value,
								strVal2: '',
								strVal3: '',
								strVal4:'',
								strVal5:'',
								strVal6:''
							};
							ControlsSet(params).then(res => {
								console.log(res);
								if(res == 201) {
									this.$message({
										type: 'success',
										message: '设定成功！！'
									});
									this.dataList[idx].temp = value;
								}else {
									this.$message({
										type: 'error',
										message: '设定失败！！'
									});

								}
							})
						}).catch(() => { console.log('取消输入')})
					} else if (text == '湿度设定') {
						console.log('湿度');
						this.$prompt('请输入湿度设定值', '提示', {
							confirmButtonText: '确定',
	          				cancelButtonText: '取消',
	          				inputPattern: /^\d+(\.\d+)?$/,
	          				inputErrorMessage: '请输入正确的数字',
	          				inputValue: _this.dataList[idx].humi
						}).then(({value}) => {
							console.log(value);
							var params = {
								type:'AirH',
								sn: sn,
								strVal1: value,
								strVal2: '',
								strVal3: '',
								strVal4:'',
								strVal5:'',
								strVal6:''
							};
							ControlsSet(params).then(res => {
								console.log(res);
								if(res == 201) {
									this.$message({
										type: 'success',
										message: '设定成功！！'
									});
									this.dataList[idx].humi = value;
								}else {
									this.$message({
										type: 'error',
										message: '设定失败！！'
									})
								}
							})
						}).catch(() => { console.log('取消输入')})
					} else if (text == '加热阀') {
						this.$prompt('请输入加热阀设定值', '提示', {
							confirmButtonText: '确定',
	          				cancelButtonText: '取消',
	          				inputPattern: /^\d+(\.\d+)?$/,
	          				inputErrorMessage: '请输入正确的数字',
	          				inputValue: _this.dataList[idx].thermal
						}).then(({value}) => {
							console.log(value);
							var params = {
								type:'Jw',
								sn: sn,
								strVal1: value,
								strVal2: '',
								strVal3: '',
								strVal4:'',
								strVal5:'',
								strVal6:''
							};
							ControlsSet(params).then(res => {
								console.log(res);
								if(res == 201) {
									this.$message({
										type: 'success',
										message: '设定成功！！'
									});
									this.dataList[idx].thermal = value;
								}else {
									this.$message({
										type: 'error',
										message: '设定失败！！'
									})
								}
							})
						}).catch(() => { console.log('取消输入')})
					} else if (text == '加湿阀') {
						this.$prompt('请输入加湿阀设定值', '提示', {
							confirmButtonText: '确定',
	          				cancelButtonText: '取消',
	          				inputPattern: /^\d+(\.\d+)?$/,
	          				inputErrorMessage: '请输入正确的数字',
	          				inputValue: _this.dataList[idx].hcation
						}).then(({value}) => {
							console.log(value);
							var params = {
								type:'Js',
								sn: sn,
								strVal1: value,
								strVal2: '',
								strVal3: '',
								strVal4:'',
								strVal5:'',
								strVal6:''
							};
							ControlsSet(params).then(res => {
								console.log(res);
								if(res == 201) {
									this.$message({
										type: 'success',
										message: '设定成功！！'
									});
									this.dataList[idx].hcation = value;
								}else {
									this.$message({
										type: 'error',
										message: '设定失败！！'
									})
								}
							})
						}).catch(() => { console.log('取消输入')})
					} else if (text == '回风机温度') {
						if(this.dataList[idx].Freshair == '远控状态') {
							this.$prompt('请输入回风机温度设定值', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								inputPattern: /^\d+(\.\d+)?$/,
								inputErrorMessage: '请输入正确的数字',
								inputValue: _this.dataList[idx].Temp
							}).then(({value}) => {
								var params = {
									type:'Temp',
									sn: sn,
									strVal1: value,
									strVal2: '',
									strVal3: '',
									strVal4:'',
									strVal5:'',
									strVal6:''
								};
								ControlsSet(params).then(res => {
									console.log(res);
									if(res == 200) {
										this.$message({
											type: 'success',
											message: '设定成功！！'
										});
										this.dataList[idx].Temp = value;
									}else {
										this.$message({
											type: 'error',
											message: '设定失败！！'
										})
									}
								})
							}).catch(() => { console.log('取消')})
						} else {
							return false;
						}
						
					} else if (text == '回风机湿度') {
						if(this.dataList[idx].Freshair == '远控状态') {
							this.$prompt('请输入回风机湿度设定值', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								inputPattern: /^\d+(\.\d+)?$/,
								inputErrorMessage: '请输入正确的数字',
								inputValue: _this.dataList[idx].Humi
							}).then(({value}) => {
								var params = {
									type:'One',
									sn: sn,
									strVal1: value,
									strVal2: '',
									strVal3: '',
									strVal4:'',
									strVal5:'',
									strVal6:''
								};
								ControlsSet(params).then(res => {
									console.log(res);
									if(res == 200) {
										this.$message({
											type: 'success',
											message: '设定成功！！'
										});
										this.dataList[idx].Humi = value;
									}else {
										this.$message({
											type: 'error',
											message: '设定失败！！'
										})
									}
								})
							}).catch(() => { console.log('取消')})
						} else {
							return false;
						}
					}
				}
				
				// console.log(text);
				console.log(sn);
			},
			switchChange(ev, sn, idx){
				console.log(ev);
				console.log(sn);
				if(ev){
					this.$confirm('是否开机', {
						type: 'warning'
					}).then(() => {
						var params = {type: 'KJ', sn: sn, strVal1: 1,strVal2:'',strVal3:'',strVal4:'',strVal5:'',strVal6:''};
						ControlsSet(params).then(res => {
							console.log(res);
							
							if(res == 200) {
								this.$message({
									type: 'success',
									message: '开机成功！！'
								})
							}else {
								this.$message({
									type: 'error',
									message: '开机失败！！'
								});
								this.dataList[idx].switch = !this.dataList[idx].switch;
							}
							
						})
					}).catch(() => {
						this.dataList[idx].switch = !this.dataList[idx].switch;
					})
					
				}else{
					this.$confirm('是否关机', {
						type: 'warning'
					}).then(() => {
						var params = {type: 'GJ', sn: sn, strVal1: 0,strVal2:'',strVal3:'',strVal4:'',strVal5:'',strVal6:''};
						ControlsSet(params).then(res => {
							console.log(res);
							if(res == 200) {
									this.$message({
										type: 'success',
										message: '关机成功！！'
									})
								}else {
									this.$message({
										type: 'error',
										message: '关机失败！！'
									});
									this.dataList[idx].switch = !this.dataList[idx].switch;
								}
						})
					}).catch(() => {
						this.dataList[idx].switch = !this.dataList[idx].switch;
					})
					
				}
				
			},
			getDataList() {
				GetAirControlDetails().then(res =>{
					console.log(res);
					this.dataList = [];
					// this.dataList = res;
					for(let idx = 0; idx < res.length; idx ++) {

						this.dataList.push({
							VER_ID: res[idx].VER_ID,
							airValueOpening: res[idx].Freshair, // 新风阀开度
							returnTemp: res[idx].ReturnT,       // 回风温度
							returnHumi: res[idx].ReturnH,       // 回风湿度
							differential: res[idx].VER_ID == 17 ? (res[idx].Differential  == '正常' ? '正常' : '#a63830') : res[idx].Differential, // 压差报警   18送风机过载
							differentialIcon: res[idx].Differential  == '正常' ? this.airNomal : this.airAlerm,
							cooling: res[idx].Cooling,           // 制冷阀开度   18 送风机风压保护
							thermal: res[idx].Thermal,           // 加热阀开度   18 火灾信号连锁保护
							hcation: res[idx].Hcation,           // 加湿阀开度    18 电加热过热保护
							blower: res[idx].VER_ID ==17 ? (res[idx].Blower == '正常' ? this.airNomal : this.airAlerm) : res[idx].Blower,             // 送风机段  18 加湿器故障
							return: res[idx].VER_ID ==17 ? (res[idx].Return == '正常' ? this.airNomal : this.airAlerm) : res[idx].Return ,             // 回风机段  18 水泵及水流量
							loggersn: res[idx].LOGGERSN,         // sn
							iName: res[idx].IName,               // 名称
							iTime: res[idx].Time,                // 时间
							DDC: res[idx].DDC,                   // 通讯状态
							temp: res[idx].Temp,                 // 设定温度
							humi: res[idx].Humi,                  // 设定湿度
							fresh: res[idx].Fresh,                // 新风阀设定值  18 送风机过滤压差开关
							compress: res[idx].VER_ID == 17 ? (res[idx].CompressO == '正常' ? '正常' : '#a63830') : res[idx].CompressO,          // 送风阀报警   18 压缩机1高压保护
							mainBlower: res[idx].VER_ID == 17 ? (res[idx].MainBlowerO == '正常' ? '正常' : '#a63830') : res[idx].MainBlowerO,      // 回风阀报警   18 压缩机1低压保护
							HWater: res[idx].VER_ID ==17 ? (res[idx].HWater == '正常' ? '正常' : '#a63830') : res[idx].HWater,              // 风机故障报警   18 压缩机2 过载
							freshPolice: res[idx].VER_ID ==17 ? (res[idx].FreshPolice == '正常' ? '正常' : '#a63830') : res[idx].FreshPolice,    // 新风阀报警 18 冷凝风2过载
							switch: this.switchBtn(res[idx].Switch, res[idx].SwitchState),
							  
							DiffPolice: res[idx].DiffPolice,    // 压差机段  18 压缩机2高压保护
							
							Freshair: res[idx].Freshair,       // 新风阀开度   18 远近空状态
							State1: res[idx].State1,    // 18 压缩机1过载
							State2: res[idx].State2,    // 18 冷凝风1过载
							State3: res[idx].State3,    // 18压缩机2低压保护
							State4: res[idx].State4,   // 送风机控制
							State5: res[idx].State5,  // 压缩机1控制
							State6: res[idx].State6,  // 压缩机2控制
							State7: res[idx].State7,  // 系统2能量
							State8: res[idx].State8,  // 电加热1控制
							State9: res[idx].State9, // 电加热2控制
							State10: res[idx].State10, // 加湿器控制
							ReturnT: res[idx].ReturnT,  // 回风温度
							ReturnH: res[idx].ReturnH,
							Temp:res[idx].Temp,
							Humi: res[idx].Humi


						})
					}
					console.log(this.dataList)
				})
			},
			showAlermInfo(item) {
				console.log(item);
				this.airInfo = item;
				this.alermInfoDialog = true;
				
			}

		},
		mounted() {
			this.getDataList();
			var _this = this;
			setInterval(function() {
				_this.getDataList();
			}, 60000); // 一分钟刷新一次
			
		}

	}
</script>
<style lang="scss" scoped>
	.listContainer {
		padding: 20px 0px 20px 10px;
		.airContainer {
			width: 520px;
			height: 305px;
			border-radius: 10px;
			border: 1px solid #d7d7d7;
			display: inline-block;
			margin-right: 10px;
			margin-bottom: 10px;
			background: #fff;
			.airTitle {
				height: 40px;
				border-radius: 10px 10px 0 0;
				line-height: 40px;
				width: 100%;
				color: #fff;
				font-size: 20px;
				background: #428fb9;
				p{
					width: 36%;
					display: inline-block;
					padding-left: 20px;
					font-size: 14px;
				}
				span {
					display: inline-block;

				}
			}
			.type0Background {
				background: url('../../../static/img/airControl.png') no-repeat;
				background-size: 95%;
				background-position: 50% 40%;
			}
			
			.airContent {
				width: 100%;
				position: relative;
				height: 245px;
				
				color: #333;
				font-size: 12px;
				.airIcon {
					display: inline-block;
					width: 18px;
					height: 14px;
					// background-position: 0px 10px;
					margin-top: 11px;
					margin-left: -3px;

				}
				.kaiValue{
					margin-left: 13px;
				}
				.positonAb {
					position: absolute;
				}
				.width16 {
					width: 16px;
				}
				.airValue{  // 新风阀开度
					
				    top: 28px;
				    left: 18px;
				}
				.returnAir {// 回风 温湿度
					
					width: 120px;
					top: 3px;
					left: 48px;
					span{
						display: block;
					}
					i {
						color: #666;
					}
				}
				.pressAlerm { // 压差报警
					top: 42px;
					left: 136px;
				}
				.refrigeration {    // 制冷阀
					
					top: 70px;
					left: 172px;
				}
				.coldValue {//  阀门开度
					top: 42px;
					left: 188px;
				}
				.heatingUp {  // 加热阀门
					top: 71px;
					left: 241px;
				}
				.heatValue {  // 阀门开度
					top: 42px;
					left: 252px;
					cursor: pointer;

				}
				.humidification {  // 加湿阀门
					top: 71px;
					left: 302px;
				
				}
				.wetValue {
					top: 42px;
					left: 323px;
					cursor: pointer;
				}
				.airSupply {
					top: 42px;
					left: 378px;
				}
				.returnAirSeg {
					top: 42px;
					left: 403px;
				}
				.pressureSeg {
					top: 42px;
					left: 429px;
				}
				.freshAirValueSet {  // 设定
					// width: 100%;
					height: 20px;
					position: absolute;
					top: 190px;
					left: 20px;
					div {
						width: 130px;
						display: inline-block;
						cursor: pointer;

					}
				}
				.alermBtn {  // 报警按钮
					top: 215px;
					left: 0px;
					.myAlermBtn {
						width: 80px;
						height: 25px;
						line-height: 25px;
						color:#fff;
						font-size: 10px;
						text-align: center;
						// border: 1px solid #d7d7d7;
						border-radius: 5px;
						display: inline-block;
						// margin-left: 5px;

					}
					.switch {
						display: inline-block;
					}
					.alermInfo {
						background: #438eb9;
						cursor: pointer;
					}
				}
			}
			.airFooter {
				width: 100%;
				height: 20px;
				border-top: 1px solid #d7d7d7;
				span {
					float: right;
					margin-right: 20px;
					color:#666;
				}
			}
		}
		.myAir {
			display: inline-block;
		}
		.typeContainer {
			.airTitle {
				position: relative;
				.name{
					width: 100%;
					text-align: center;
				}
				.type{
					position: absolute;
					font-size: 14px;
					padding-left: 5px;
					
				}
			} 
			.type1Background {
				background: url('../../../static/img/airTypeBack.png') no-repeat;
				background-size: 90% 67%;
				background-position: 70% 15%;
				.humidifier {
					top: 10px;
					left: 305px;
				}
				.humidiferHumi {
					top: 83px;
					left: 367px;
				}
				.blower {
					top: 10px;
					left: 393px;
				}
				.realTemp {
					top: 82px;
					left: 4px;
				}
				.realHumi {
					top: 111px;
					left: 4px;
				}
				.clickSetContainer {
					top: 185px;
					left: 10px;
					font-size: 16px;
					div{
						display: inline-block;
						margin-right: 15px;
						cursor: pointer;
					}
				}
				.alermBtn {
					width: 100%;
					.switch {
						float: right;
						margin-right: 15px;

					}
				} 
			}
		}
		.el-dialog {
			width: 800px;
			.infoContainer {
				.loggerAlermInfoContainer {
					display: inline-block;
					width: 240px;
					height: 30px;
					line-height: 30px;
					.loggerName {
						display: inline-block;
						text-align: right;
						width: 150px;
					}
					.alermIcon {
						width: 20px;
						height: 20px;
						display: inline-block;
						vertical-align: middle;
						margin-left: 20px;
					}
				}
			}
		}
		
	}
</style>
<style lang='scss'>
	.listContainer {
		.airAlermDialog {
			.el-dialog {
				width: 800px;
				
			}
		}
	}
</style>
