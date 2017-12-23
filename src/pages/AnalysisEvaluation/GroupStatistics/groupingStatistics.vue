<template>
	<el-row >
		<el-col :span="24" class='groupTitle' v-loading="loading" element-loading-text="加载中">
			<el-col :span='24'>
				<el-form class="from_hei" :inline='true'>
					<el-form-item  class="cj_data_Pic myLabel" label='采集时间:'>
						<el-date-picker
              type='daterange'
              format='yyyy-MM-dd HH:mm:ss'
              size='mini'
              @change='chooseDate'
              v-model='startEndDate'
              :clearable='false'
              :picker-options='disabledDate'
              range-separator="到">
            </el-date-picker>
					</el-form-item>
          <el-form-item >
	          <el-button type="primary" @click='queryGroupFn' size='mini'>查询</el-button>       
	        </el-form-item>
          <el-form-item style='float: right;'>
            <el-button type="primary" @click="addGroup" size='mini'>自定义分组</el-button>
          </el-form-item>
				</el-form>
			</el-col>
			<el-col :span='24' v-if='isTitltShow' class='titltShow'> <span>当前时间没有数据或者没有分组！</span> </el-col>
			<div v-bar style='width: 100%'> 
        <div>
          <el-col :span='24' v-for='(item, idx) in dataArr' :key='idx' v-if='dataArr != null'>
            <el-col :span='12' class='TextLeft' v-if='item.id != null'>
              <span style='color:#6fb3e0'>分组：{{item.name}}</span>
              <!-- <span>{{item.id}}</span> -->
            </el-col>
            <el-col :span='12' class='TextRight' v-if='item.id != null'>
              <div class='spanCont'><span :data-groupId='item.id' @click='complieGroup($event,item.name)'>编辑</span></div>
              <div class='spanCont'><span :data-groupId='item.id' @click='delateTab(item)'>删除</span></div>
              <div class='spanCont quxian'>
                  <span :data-sn='item.allSn' @click='jumpMulti($event)'>曲线图</span>
                  <!-- (
                  <span :data-sn='item.allSn' @click='shortcutJump($event)'>一天</span>、
                  <span :data-sn='item.allSn' @click='shortcutJump($event)'>一周</span>、
                  <span :data-sn='item.allSn' @click='shortcutJump($event)'>一月</span>) -->
                </div>
              
              
              <div class='spanCont mean'><span :data-sn='item.allSn' @click='jumpMeanValue($event)'>平均值曲线</span></div>
            </el-col>
            
            <el-table :data="item.data" border style="width: 100%" @header-click='rowClick' data-show='false' v-if='item.id != null' class='myfenzuTable'>
                <el-table-column prop="LoggerName" label="仪器名称"  width="180" v-if='item.data[0].LoggerName != null'>
                </el-table-column>
                <el-table-column  prop="Ch1" :label="item.data[0].Ch1Name" v-if='item.data[0].Ch1Name != ""'>
                </el-table-column>
                <el-table-column prop="Ch2" :label="item.data[0].Ch2Name" v-if='item.data[0].Ch2Name != ""'>
                </el-table-column>
                <el-table-column prop="Ch3" :label="item.data[0].Ch3Name" v-if='item.data[0].Ch3Name != ""'>
                </el-table-column>
                <el-table-column prop="Ch4" :label="item.data[0].Ch4Name" v-if='item.data[0].Ch4Name != ""'>
                </el-table-column>
            </el-table>
          </el-col>
        </div>
      </div>
      
      <el-dialog
        title="分组"
        :visible.sync="dialogVisible"
        class='groupDialog'
        top='8%'
        width='567px'
        >
				  <span>分组名称：</span><el-input size='small' type='text' class='groupName'  placeholder="请输入分组名称" v-model='groupName'></el-input>
				  <el-transfer v-model='groupDevice' :data='data' @change='chooseRightData' class='myTransfer'
				  	:titles='["展厅设备","分组设备"]'>
				  	
				  </el-transfer>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
				    <el-button type="primary" @click="complieFinish" size='small'>确 定</el-button>
				  </span>
			</el-dialog>
		</el-col>
	</el-row>
</template>


<script>
import { SevenDay } from '@/assets/js/commonFunc'
import { mapGetters } from 'vuex'
import { GetGroupLoggers, addGroup, queryGroup, delateGroup,updateGroup } from './api'
  export default {
    data() {
    	
      return {
        dialogVisible: false,
        data: [],
    	  allNoData: [],
        startEndDate: [ new Date(SevenDay(new Date())), new Date()],
        disabledDate: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },
        addOrCompile:false,    //判断是新增分组还是编辑分组
        groupName: '',     //分组名称
        groupDevice: [],   // 分组设备
        addGroupDev:[],   // 新增分组的设备 
        dataArr:[],
        allshenbeiGroup:[],  // 所有的设备
        allGroup:[],      // 存储所有的分组
        allGroupDev:[],
        group_id:'' ,    // 分组的id
        isTitltShow: false,
        loading:false,
        allGroupName:[]    // 当前展厅所有分组的名字
      }
    },
    computed: {
      ...mapGetters(['zhantingId'])
    },
    methods: {
    	shortcutJump(ev){
    		// console.log(ev.target);
    		var el = ev.target;
    		var text = $(el).text();
    		var sn = $(el).data('sn');
    		// console.log(sn);
    		// console.log(today);
    		// console.log(oneday);
    		this.$store.state.NewID = sn;

    		if(text == '一天'){
    			this.$store.commit('STARTDATE',new Date(today - oneday*1));
    			this.$store.commit('ENDDATE', new Date());
    		}else if( text == '一周'){
    			this.$store.commit('STARTDATE',new Date(today - oneday*7));
    			this.$store.commit('ENDDATE', new Date());
    		}else{
    			this.$store.commit('STARTDATE',new Date(today - oneday*30));
    			this.$store.commit('ENDDATE', new Date());
    		}
    		this.$router.push('/multiDataQuery');
    	},
    	jumpMeanValue(ev){
    		var el = ev.target;
    		// console.log(el);
    		var usn = $(el).data('sn').split(',');
    		// console.log(usn);
        var sn = [];
        for( var i = 0; i<usn.length; i++){
          sn.push(this.analysisSn(usn[i]).sn);
        }
        // console.log(sn);
        sn = sn.join(',');
        this.$router.push({name: 'MeavValue', params: { id: sn}})
    		// this.$store.commit('NEWID',sn);
    		this.$store.commit('setDate',this.startEndDate);
      		// this.$store.commit('ENDDATE',this.endDate);
      		// this.$router.push('/MeanValue');
    	},
      rowClick(col, ev){
      	// console.log( ev.target);
      	var ele = $(ev.target).parent().parent().parent().parent().parent().parent();
    		// console.log($(ele).data('show'));
    		// $(ele).attr('data-show', !$(ele).attr('data-show'));
    		if($(ele).data('show') == false ){
    			$(ele).data('show',true);
    			$(ele).children('.el-table__body-wrapper').slideUp("slow");
    		}else{
    			$(ele).data('show',false);
    			$(ele).children('.el-table__body-wrapper').slideDown("slow");
    		}
      },
      jumpMulti(ev){
      	var el = ev.target;
      	var sn = $(el).attr('data-sn');
      	// console.log($(el).attr('data-sn'));
      	// console.log(this.startDate,this.endDate);
      	this.$store.commit('STARTDATE',this.startDate);
      	this.$store.commit('ENDDATE',this.endDate);
      	this.$store.commit('NEWID',sn);
      	this.$router.push('/multiDataQuery');
      },
      addGroup(){  // 添加分组
      	this.dialogVisible = true;
      	this.addOrCompile = true;
      	this.groupName = '';
      	this.groupDevice = [];
      	this.data = [];
      	// this.data = this.allshenbeiGroup;
      	var okGroupDev = [];
      	var allgroupdev = this.allshenbeiGroup;
      	// console.log(this.allshenbeiGroup);
      	for (var i = 0; i < allgroupdev.length; i++) {
      		this.data.push({
    				'key':allgroupdev[i].LOGGER_SN + '/'+ allgroupdev[i].VER_ID,
    				'label':allgroupdev[i].LOGGER_NAME
    				// id:nowGroup[j].VER_ID
    			})
      	}

      },
      analysisSn(str){
        // console.log(str);
      	var reg = /(\w*)\/(\d*)/;
      	var sn =str.match(reg);
      	// console.log(sn);
      	return {sn:sn[1],verId: sn[2]};
      },
      complieGroup(ev,name){ // 编辑分组
      	this.dialogVisible = true;
      	this.addOrCompile = false;
      	// console.log(this.allGroup);
      	var id = $(ev.target).data('groupid');
      	// console.log(id);
      	this.group_id = id;
      	this.groupName = name;
      	// this.data = [];
      	this.groupDevice = [];
      	// console.log(this.allshenbeiGroup);
      	// this.allNoData = this.data;
      	var allNoGroup = this.allshenbeiGroup;
      	var myNoGroup = [];
      	for (var i = 0; i < allNoGroup.length; i++) {
      		myNoGroup.push({
      			'key':allNoGroup[i].LOGGER_SN+'/'+allNoGroup[i].VER_ID,
      			'label':allNoGroup[i].LOGGER_NAME
      		})
      	}
      	// console.log(myNoGroup);
      	for (var i = 0; i < this.allGroup.length; i++) {
      		if(this.allGroup[i].group[0]){
      			if(this.allGroup[i].group[0].Small_Id == id){
      				// console.log(this.allGroup[i].group);
	      			var nowGroup = this.allGroup[i].group;
	      			for (var j = 0; j < nowGroup.length; j++) {
	      				myNoGroup.push({
	      					'key':nowGroup[j].LOGGER_SN + '/'+ nowGroup[j].VER_ID,
	      					'label':nowGroup[j].LOGGER_NAME
	      					// id:nowGroup[j].VER_ID
	      				})
	      				this.groupDevice.push(
		      				nowGroup[j].LOGGER_SN + '/'+nowGroup[j].VER_ID
		      			)
	      			}
	      			// console.log(this.groupDevice);
      			}
      			
      			
      		}
      	}

      	this.data = myNoGroup;
      	// var params = {
      	// 	GroupId: this.$store.state.zhantingID,
      	// 	SmallId: ''
      	// }
      	// console.log(params);
      	// GetGroupLoggers(params).then(res => {
      	// 	console.log(res);
      		
      	// })
      	// this.groupDevice = this.rightData;

      },
      isRepleat(arr){
      	var hash = {};

    		for(var i in arr) {

    			if(hash[arr[i]])

    			return true;

    			hash[arr[i]] = true;

    		}

    		return false;
      },
      complieFinish(){
      	// this.dialogVisible = false;
      	var logger_sn = [];  //设备类型

      	var groupSn = [];  // 设备 sn
        if(this.addOrCompile){
          for (var i = 0; i < this.allGroupName.length; i++) {
            if(this.allGroupName[i] == this.groupName){
              this.$message({
                type:'warning',
                message:'分组名称不能相同，请修改！'
              })
              return false;
            }

          }
        }
        

      	for (var i = 0; i < this.groupDevice.length; i++) {
      		// console.log(this.analysisSn(this.groupDevice[i]).sn);
      		groupSn.push(this.analysisSn(this.groupDevice[i]).sn);
      		logger_sn.push(this.analysisSn(this.groupDevice[i]).verId);
      	}
      	var sn = groupSn.join(',');
      	// console.log(logger_sn);
      	// console.log(sn);
      	// for (var i = 0; i < logger_sn.length; i++) {
      		var toAjax = false;
      		for(var j = 0; j < logger_sn.length; j++){
      			// console.log(logger_sn[j]);
      			if(logger_sn[0] != logger_sn[j]){
      				this.$message({
      					type:'warning',
      					message:'选择的设备类型不一致，请重新选择！'
      				});
      				break;
      				toAjax = false;
      			}else{
      				
      				if(j == (logger_sn.length - 1)){
      					// console.log('----1---');
      					toAjax = true;
      				};
      				
      			}
      		}
      	// }
      	if(toAjax){
      		if(this.groupName != null && this.groupName != ''){
	      		if(this.groupDevice != null && this.groupDevice != ''){
	      			var params = {
	      				groupId:this.$store.state.zhantingID,
			      		Small_NAME:this.groupName,
			      		LOGGER_SN:sn
			      	}
			      	this.dialogVisible = false;
			      	if(this.addOrCompile){
			      		var params = {
		      				groupId:this.$store.state.zhantingID,
				      		Small_NAME:this.groupName,
				      		LOGGER_SN:sn
				      	}
				      	// console.log(params);
			      		addGroup(params).then(res => {
				      		// console.log(res);
				      		if(res == 200){
				      			this.$message({
				      				type:'success',
				      				message:'新增分组成功!'
				      			});
				      			this.getshebeiData();
				      			this.queryGroupFn();
				      			
				      		}
				      	})
			      	}else{
			      		var params = {
			      			Small_NAME:this.groupName,
			      			SmallId:this.group_id,
			      			LOGGER_SN:sn
			      		}
			      		updateGroup(params).then(res => {
			      			// console.log(res);
			      			if(res == 200){
			      				this.$message({
			      					type:'success',
			      					message:'编辑分组成功！'
			      				});
			      				this.getshebeiData();
			      				this.queryGroupFn();
			      			}
			      		});
			      		
			      		
			      	}
			      	
	      		}else{
	      			this.$message({
	      				type:'warning',
	      				message:'请选择分组设备！'
	      			})
	      		}
	      	}else{
	      		this.$message({
	      			type:'warning',
	      			message:'分组名称不能为空！'
	      		})
	      	}
      	}
      	
      	
      	

      },
      delateTab(idx){
      	// console.log(idx);
      	this.$confirm('是否删除该分组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	var params = { SmallId: idx.id };
        	delateGroup(params).then(res => {
        		// console.log(res);
        		if(res == 200){
        			this.$message({
			            type: 'success',
			            message: '删除成功!'
			         });
        			for (var i = 0; i < this.dataArr.length; i++) {
			      		if (this.dataArr[i] == idx) {
			      			this.dataArr.splice(i,1)
			      		}
			      		
			      	}
			      	this.getshebeiData();
			      	this.queryGroupFn();
			      	
        		}
        	})
        	
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      	
      	// console.log(idx);
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      chooseRightData(data,num){
      	// console.log(data);
      	// var dataSn=[];
      	// for (var i = 0; i < data.length; i++) {
      	// 	dataSn.push(this.analysisSn(data[i]).sn);
      	// }
      	this.groupDevice = data;
      	// this.rightData = data;
      	// console.log(this.groupDevice);
      	// console.log(data);
      	// console.log(this.groupDevice);
      },
      chooseDate (date){
        this.startEndDate = date
      },
      getshebeiData(){
      	var zhantingID = this.$store.state.zhantingID;
      	var params = { 'groupID': zhantingID, SmallId:'' };
      	GetGroupLoggers(params).then(res => {
      		console.log(res[0]);
      		this.allNoData = [];
      		var shebeiGroup = res[0];
      		var allshenbeiGroup = shebeiGroup.sn1;
      		this.allshenbeiGroup = shebeiGroup.sn1;
      		var noGroupDev = [];
      		var okGroup = shebeiGroup.sn2;
      		this.allGroup = shebeiGroup.sn2;
      		for(var i in okGroup){
      			// console.log(okGroup[i].group);
      			if(okGroup[i].group != []){
      				for (var j = 0; j < okGroup[i].group.length; j++) {
      					noGroupDev.push(okGroup[i].group[j]);
      				}
      			}
      		}
      		// console.log(allshenbeiGroup);
      		// console.log(noGroupDev);
      		for(var i = 0; i < noGroupDev.length; i++){
      			// console.log(allshenbeiGroup[i].LOGGER_SN);
      			for (var j = 0; j < allshenbeiGroup.length; j++) {

    					if(allshenbeiGroup[j].LOGGER_SN == noGroupDev[i].LOGGER_SN){
    						// console.log('--ok--');
    						// console.log(allshenbeiGroup[j].LOGGER_SN+','+noGroupDev[i].LOGGER_SN);
    						allshenbeiGroup.splice(j,1);
    						// i = i-1 < 0 ? 0 : i-1;
    						j = j-1 < 0 ? 0 : j-1;
    					}else{
    						// console.log('--no---');
    						
    					}
      				
      			}
      		}
      	
      		// console.log(allshenbeiGroup)
      		for (var i = 0; i < allshenbeiGroup.length; i++) {
      			this.allNoData.push({
      				key:allshenbeiGroup[i].LOGGER_SN + '/'+ allshenbeiGroup[i].VER_ID,
      				label:allshenbeiGroup[i].LOGGER_NAME 
      				// id:allshenbeiGroup[i].VER_ID
      			});
      		}
      		this.data = this.allNoData;
      		// console.log(this.allNoData);
      	})
      },
      hideTable(){
      	// 点击表头 隐藏表格

      	$('.myfenzuTable').click(function(ev){
      		// console.log('--1--');
      		// console.log(ev.target);
      	})
      },
      queryGroupFn(){
      	this.loading=true;
          var params = {
            GroupId: this.zhantingId,
            beginTime: this.startEndDate[0],
            endTime: this.startEndDate[1]
          }
          // if(this.$route.path == '/CustomGroup'){
            queryGroup(params).then(res => {
              // console.log(res);
              this.allGroupName =[];
              this.loading = false;

              
              if(res !== null){
                this.isTitltShow = false;
                this.dataArr = [];
                for(var i of res ){
                  // console.log(i);
                  var data = [], allSN = [];
                  this.allGroupName.push(i.SmallName);
                  // console.log(this.allGroupName);
                  this.dataArr.push({
                    'name':i.SmallName,
                    'id':i.SmallId,
                    'data':data,
                    'allSn':allSN
                    
                  });
                  i.LOGGERSNAll = i.LOGGERSNAll.sort(function(a, b){  // 按名字排序              
                    return (a.LOGGER_NAME).localeCompare(b.LOGGER_NAME, 'zh-Hans-CN', {sensitivity: 'accent'});
                  });
                  for(var j of i.LOGGERSNAll){
                    allSN.push(j.LOGGER_SN + '/' + j.VER_ID );
                    // console.log(j);
                    data.push({
                      'LoggerName':j.LOGGER_NAME,
                      'LoggerSn':j.LOGGER_SN,
                      'Ch1Name':j.CHNUMAll[0].Ch1Name == null ? '' : j.CHNUMAll[0].Ch1Name,
                      'Ch1': j.CHNUMAll[0].Ch1 == null ? '' : j.CHNUMAll[0].Ch1 + j.CHNUMAll[0].Ch1Unit,
                      // 'Ch1Unit': j.CHNUMAll[0].Ch1Unit == null ? '' : j.CHNUMAll[0].Ch1Unit,
                      'Ch2Name':j.CHNUMAll[0].Ch2Name == null ? '' : j.CHNUMAll[0].Ch2Name,
                      'Ch2': j.CHNUMAll[0].Ch2 == null ? '' : j.CHNUMAll[0].Ch2 +j.CHNUMAll[0].Ch2Unit,
                      // 'Ch2Unit': j.CHNUMAll[0].Ch2Unit == null ? '' : j.CHNUMAll[0].Ch2Unit,
                      'Ch3Name':j.CHNUMAll[0].Ch3Name == null ? '' : j.CHNUMAll[0].Ch3Name,
                      'Ch3': j.CHNUMAll[0].Ch3 == null ? '' : j.CHNUMAll[0].Ch3 + j.CHNUMAll[0].Ch3Unit,
                      // 'Ch3Unit': j.CHNUMAll[0].Ch3Unit == null ? '' : j.CHNUMAll[0].Ch3Unit,
                      'Ch4Name':j.CHNUMAll[0].Ch4Name == null ? '' : j.CHNUMAll[0].Ch4Name,
                      'Ch4': j.CHNUMAll[0].Ch4 == null ? '' : j.CHNUMAll[0].Ch4 + j.CHNUMAll[0].Ch4Unit
                      // 'Ch4Unit': j.CHNUMAll[0].Ch4Unit == null ? '' : j.CHNUMAll[0].Ch4Unit
                    })
                    
                  }
                }
                // console.log(this.dataArr);
              }else{
                this.dataArr = [];
                this.allGroupName = [];
                this.isTitltShow = true;
              }
              
            })
        
      	
      	// }
      },
      windowResize(){
        var ww = $(document).width();
        $('.content-container').width(ww - 201 );
        var hh = $(document).height();
        $('.content-wrapper').css({'height':hh - 90 - 32,'overflow-y':'auto'});
        $('#chartPie').width(320);
      }
    },
    mounted(){
    	// console.log(this.dataArr);
    	this.getshebeiData();
    	this.hideTable();
    	this.queryGroupFn();
    	var _this = this;
    	_this.windowResize();
    	this.$store.watch(
			function(state){
				return state.zhantingID;
			},function(){
				_this.getshebeiData();
				_this.queryGroupFn();
			},{
				deep:true
		});
		window.onresize = function(){  
        _this.windowResize();
    }
}
  };
</script>
<style scoped lang='scss' >
	.titltShow{
		text-align: center;
		color:#666;
	}
	.el-table__header-wrapper{
		 -webkit-user-select:none; 
		 -moz-user-select:none; 
		 -ms-user-select:none; 
		 user-select:none; 
		 cursor: pointer; 
	}
	.shebeiCont{
		border:1px solid #ddd;
		margin-bottom: 15px;
	}
	.groupDialog .el-dialog {
		width: 576px;
	}
	.groupName{
		width: 80%;
	}
	.groupName input{
		height: 30px;
		border:1px solid #ddd;
	}
	.myTransfer{
		margin-top: 15px;
	}
	.myTransfer .el-transfer-panel{
		width: 220px;
	}
	.groupTitle{
		margin-top: 10px;
	}
	.TextLeft{
		height:35px;
		line-height: 35px;
		padding-left: 15px;
	}
	.TextRight{
		text-align: right;
		padding-right: 15px;
		height:35px;
	}
	.TextRight .spanCont{
		display: inline-block;
		float: right;
		width: 50px;
		height: 30px;
		line-height: 30px;
		color:#6fb3e0;
		font-size: 14px;
		text-align: center;
	}
	.TextRight .mean span,.TextRight .mean {
		width: 70px;
	}
	.TextRight .quxian{
		width: 80px;
	}
	.spanCont span{
		display: inline-block;
		width: 45px;
		height:28px;
		border-bottom: 1px solid #6fb3e0;
		cursor: pointer;
	}
</style>
