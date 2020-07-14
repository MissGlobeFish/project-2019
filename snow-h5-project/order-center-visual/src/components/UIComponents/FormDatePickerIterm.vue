<template>
	<el-form-item :label="title" :prop="prop"  class="dateIterm">
		<el-date-picker 
		:editable="false" 
		v-model="currValue" 
		:type="type" 
		:placeholder="placeholder" 
		:picker-options="pickerOptions"
		:disabled ="disabled"
		:value-format="valuefFormat"
		@change="valueChanged"
		format="yyyy 年 MM 月 dd 日"
		>

	</el-date-picker>
</el-form-item>
</template>

<script>
export default {
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
			type: [String,Date],
			default: ""
		},
		//类型
		type: {
			type: String,
			default: "date"
		},
		//是否可编辑
		disabled: {
			type: Boolean,
			default: false
		},
		//提示语
		placeholder:{
			type: String,
			default: ""
		},
		//picker 规则
		pickerOptions: Object,
		//录入格式
		valuefFormat: {
			type: String,
			default: "yyyy-MM-dd",
		},


	},
	data () {
		return {
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

.dateIterm{
	display: flex;
	margin-bottom: 0px;
	padding: 0px 10px;
	background-color: #FFF;
	border-bottom: 0.5px solid @borderColor;

	.el-form-item__label{
		line-height: 44px;
		text-align: left;
		width: 30%;
		padding: 0px;
	}

	.el-form-item__content{
		width: 70%;
	}

	.el-input__prefix{
		left: auto;
		right: 5px;
	}

	.el-input__inner{
		height: 44.5px;
		border-top: none;
		border-left: none;
		border-right: none;
		border-radius: 0px;
		border-bottom-width: 0.5px;
		padding-left: 0px;
        // border-bottom-color: #fff;
        // border-color: @borderColor;
    }

	.el-input.is-disabled .el-input__inner {
    	background-color: #fff; 
    	color: @disabelText;
    }
    .el-input-group__append{
    	background-color: #fff;
    	border: none;
    	color: #606266;
    }
}

</style>