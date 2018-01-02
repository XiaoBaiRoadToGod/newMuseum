<template>
	<el-row :span="24"  class='my_padding' style='height:100%'>
		<el-col :span="20"  style='height:100%'>
			<section class="pos_rea"  style='height:100%'>
				<section class="pos_abs box_img"  style='height:100%'>
					<img :src="img_bg_Field" alt="">
				</section>
				<section class="wid_Siz">
					<section v-for="(item, idx) of arrYid" :key='idx' :style="{top:item.Top + '%',left:item.Left + '%'}" class="pos_abs">
						<section class="font_sIze">□</section>
						<section class="value"> {{ item.Temp + item.Until }} </section>
					</section>
				</section>
			</section>
			
		</el-col>
		<el-col :span="4" class="right_img_box">
			<img :src="right_Img" alt="">
			
		</el-col>
	</el-row>
</template>
<script>
import qs from 'qs'
import { Field } from './api'
import { mapGetters } from 'vuex'
	export default {
		data () {
			return {
				img_bg_Field: '',
				arrYid: [],
				right_Img: require('../../../assets/img/right_Img.png')
			}
    },
    computed: {
      ...mapGetters(['zhantingId'])
    },
		methods: {
			get_Field_Data () {
		      	// 将id传到后台并获取仪器数据列表
		      	//console.log(_this.zhantingID)
		      	let potDateID_arry = {'GROUP_ID': this.zhantingId};
		      	Field(potDateID_arry).then( data => {
		      		// console.log(data)
		      		this.img_bg_Field = '';
		      		this.arrYid = [];
		      		for (var i = 0; i < data.length; i++) {
		      			this.img_bg_Field = data[i].img;
		      			this.arrYid.push({
		      				"Top": (Number(data[i].POS_BOTTOM) + Number(data[i].POS_TOP)) * 50,
		      				"Left": (Number(data[i].POS_LEFT) + Number(data[i].POS_RIGHT)) * 50,
		      				"Temp": data[i].Temp,
		      				"Until": data[i].Until
		      			})
		      		}
		      		// console.log(this.img_bg_Field)
		      	})
			}
			
		},
		mounted:function(){
			this.get_Field_Data();

    },
    watch: {
      zhantingId () {
        this.get_Field_Data();
      }
    }
	}
</script>
<style lang="scss" scoped>

	.pos_rea{
		position: relative;
		width: 100%;
		.box_img{
		>img{
			width: 100%;
			height: 100%;
			}
		}
		
	}
	.wid_Siz{
	    position: absolute;
	    display: inline-block;
	    width: 100%;
	    height: 100%;
	    top: 0;
		.pos_abs{
			position: absolute;
			.value{
				display: none;
			}
		}
	}
	.font_sIze{
		font-size: 25px;
		cursor: pointer;
	}
	.font_sIze:hover +.value{
		display: block
	}
	.right_img_box{
		text-align: center;
		>img{
			width: 50%;
			margin-top: 20px;
		}
	}
</style>


