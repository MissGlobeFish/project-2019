<template>
	<el-form-item :label="title" :prop="prop" :rules="rules" :class="[type=='textarea' ? 'textareaInputIterm' : 'inputIterm']">
		<el-input 
		v-model="currValue"
		:type="type"
		:placeholder="placeholder"
		:clearable="clearable"
		:disabled="disabled"
		:autosize="{ minRows: 2, maxRows: 5}"
		@input="valueChanged"
		>
		<template slot="append"><slot name="append"></slot></template>
		<template slot="prefix"><slot name="prefix"></slot></template>
		<template slot="suffix"><slot name="suffix"></slot></template>
		<template slot="prepend"><slot name="prepend"></slot></template>
	</el-input>
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
		//form 验证规则
		rules: [Object, Array],
		//值
		value:{
			type: [String,Number],
			default: ""
		},
		//input键盘类型
		type: {
			type: String,
			default: "text"
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
		//清除按钮
		clearable:{
			type: Boolean,
			default: true
		}
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

input:disabled, textarea:disabled{
	opacity: 1;
}

.textareaInputIterm{
	margin-bottom: 0px;
	padding: 0px 10px;
	background-color: #FFF;
	border-bottom: 0.5px solid @borderColor;
	.el-form-item__label{
		line-height: 44px;
		text-align: left;
		width: 100%;
		padding: 0px;
	}
	.el-form-item__content{
		width: 100%;
	}
	.el-textarea__inner{
		border-top: none;
		border-left: none;
		border-right: none;
		border-radius: 0px;
		border-bottom-width: 0.5px;
	}
	.el-textarea.is-disabled .el-textarea__inner{
		background-color: #fff; 
    	color: @disabelText;
	}
}


.inputIterm{
	display: flex;
	margin-bottom: 0px;
	padding: 0px 10px;
	background-color: #FFF;
	border-bottom: 0.5px solid @borderColor;
	.el-form-item__label{
		line-height: 44px;
		text-align: left;
		width: 100px;//30%;
		padding: 0px;
	}
	.el-form-item__content{
		// width: 70%;
		flex: 1;
	}
	.el-textarea__inner{
		border-top: none;
		border-left: none;
		border-right: none;
		border-radius: 0px;
		border-bottom-width: 0.5px;
	}
	.el-input__inner{
		height: 44.5px;
		border-top: none;
		border-left: none;
		border-right: none;
		border-radius: 0px;
		border-bottom-width: 0.5px;
        // border-bottom-color: #fff;
        // border-color: @borderColor;
    }
    .el-input.is-disabled .el-input__inner {
    	background-color: #fff; 
    	color: @disabelText;
    }
    .el-input-group__append{
    	background-color: transparent;
    	border: none;
    	color: #606266;
    }
}

</style>