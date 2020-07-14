<template>
	<el-form-item :label="title" class="infoIterm">
		<div :style="'text-align:' + alignType">
		<label v-if="!isCall"  class="valueLabel">{{ value }}</label>
		<a  v-if="isCall" :href="'tel:' + value" class="valueLabel call">{{ value }}</a>
			<slot name="valueSlot"></slot>
		</div>
</el-form-item>
</template>

<script>
export default {
	// name: 'NavBar',
	props:{
		//form 类目
		title:{
			type: String,
			default: "Title"
		},
		//值
		value:{
			type: [String,Number],
			default: ""
		},
		//值对齐方式
		alignType: {
			type: String,
			default: "right"
		},
		//是否拨号
		isCall:{
			type: Boolean,
			default: false
		}
	},
	data () {
		return {}
	},
	watch: {
		
    },
    created(){

    },
    methods:{

    }

}

</script>

<style lang="less">

.infoIterm{
	display: flex;
	align-items: center;
	min-height: 45px;
	margin-bottom: 0px;
	padding: 0px 10px;
	background-color: #FFF;
	border-bottom: 0.5px solid @borderColor;
	.el-form-item__label{
		line-height: 25px;
		text-align: left;
		width: 35%;
		padding: 0px;
	}
	.el-form-item__content{
		line-height: 25px;
		flex: 1;
		text-align: right;
	}
}

.call {
    color: black;
    font-family: PingFangSC-Regular;
    font-size: @textLessFont;
  }

.valueLabel{
	// line-height: px;
	font-family: PingFangSC-Regular;
    font-size: @textLessFont;
}

</style>