<template>
	<div class="SectionHeader">
		<label class= "title">{{ title }}</label>
		<!-- <el-button class="detaileBtn" type="text" v-show="!disabled" @click="detaileTapped" >{{ rightIterm }}</el-button> -->
	</div>
</template>

<script>
export default {
	// name: 'NavBar',
	props: {
		title: "",
		rightIterm: {
			type: String,
			default: " ",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data () {
		return {
			
		}
	},
	created(){
		

	},
	methods:{
		detaileTapped(){
			this.$emit('detaile');
		}
	}

}

</script>

<style lang="less">

.SectionHeader{
	color: @titleColor ;
	font-size: @textCommonFont;
	overflow: hidden;
	padding: 5px 15px;
	background: #fff;
	margin-bottom: 0px;
	display: flex;
    // justify-content:center;
    align-items: center;
	min-height: 40px;
	border-bottom: 0.5px solid #dcdfe6;
	.title{
		display: inline-block;
		float: left;
		width: 69%;
		text-align: left;
	}
	.detaileBtn{
		color: @mian_blueColor;
		float: right;
		width: 30%;
		text-align: right;
	}

}

</style>