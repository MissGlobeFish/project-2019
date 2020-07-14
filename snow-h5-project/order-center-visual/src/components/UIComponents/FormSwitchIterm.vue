<template>
	<el-form-item :label="title" :prop="prop"  class="switchIterm">

		<el-switch 
		v-model="currValue"
		:disabled="disabled"
		:width="width"
		@change="valueChanged"
		:active-value="activeValue"
		:inactive-value="inactivevalue"
		></el-switch>

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
		//form 验证项
		prop: String,
		//值
		value:{
			type: [Boolean,String,Number],
			default: "0"
		},
		//是否可编辑
		disabled: {
			type: Boolean,
			default: false
		},
		//true的值
		activeValue: {
			type: [Boolean,String,Number],
			default: "1"
		},
		inactivevalue:{
			type: [Boolean,String,Number],
			default: "0"
		}

	},
	data () {
		return {
			width:50,
			currValue: this.value
		}
	},
	watch: {
        value(val) {
            this.currValue = val;//新增value的watch，监听变更并同步到currValue上
        }
    },
	created(){

	},
	methods:{
		valueChanged(){
			this.$emit('input', this.currValue)
			this.$emit('valueChanged', this.currValue);
		}

	}

}

</script>

<style lang="less">

.switchIterm{
	display: flex;
	margin-bottom: 0px;
	padding: 0px 10px;
	background-color: #FFF;
	border-bottom: 0.5px solid @borderColor;

	.el-form-item__label{
		line-height: 44px;
		text-align: left;
		width: 50%;
	}

	.el-form-item__content{
		width: 70%;
	}

	.el-switch{
		float: right;
		height: 90%;
	}

}

</style>