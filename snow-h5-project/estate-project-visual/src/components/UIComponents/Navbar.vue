<template>
	<div class="navbar">
		<div class="goBack el-icon-arrow-left" @click= 'leftTapped'></div>
		<h1 class="navTitle">{{ title }}</h1>
		<!-- <el-button v-if="rightEnable" id="saveBtn" type="text" @click="rightTapped" >{{ rightIterm }}</el-button> -->
	</div>
</template>

<script>
export default {
	// name: 'NavBar',
	props:{title: {
			type: String,
			default: ""
		},
		rightIterm: {
			type: String,
			default: ""
		},
		//右键可否点击
		rightEnable: {
			type: Boolean,
			default: true
		}
		},
	data () {
		return {
			
		}
	},
	created(){

	},
	methods:{
		leftTapped(){
			this.$emit('leftBtnTapped');
		},
		rightTapped(){
			this.$emit('rightBtnTapped');
		}

	}

}

</script>

<style lang="less">


.navbar{
	width: 100%;
	height: 44px;
	font-family: PingFangSC-Regular;
	font-size: @textNavFont;
	color: #000000;
	letter-spacing: -0.87px;
	background: #fff;
	line-height: 44px;
	text-align: center;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	border-bottom: 0.1px solid @borderColor;

	.goBack{
		z-index:999;
		float: left;
		height: 44px;
		line-height: 44px;
		position: absolute;
		left: 20px;
		bottom: 0;
	}

	.navTitle{
		line-height: 44px;
		position: absolute;
		height: 44px;
		bottom: 0;
		text-align: center;
		width: 100%;
		font-family: @textstyle;
		font-size: @textNavFont;
		font-weight: 400;
	}

	#saveBtn{
		width: 20%;
		height: 44px;
		float: right;
		position: absolute;
		bottom: 0px;
		left: 80%;
		font-family: @textstyle;
		font-size: @textCommonFont;
		color: @mian_blueColor;
	}
}
</style>