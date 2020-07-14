<template>
	<el-form-item :label="title" :prop="prop" class="selectIterm" >
		<el-select 
		v-model="currValue"
		:placeholder="disabled ? '无' : placeholder" 
		:disabled="disabled"
		:value-key="valuekey"
		:loading="loading"
		:filterable="filterable"
		:remote="remote"
		:remote-method="remoteMethod"
		@change="valueChanged"
		@focus="focus">
		<el-option
		v-for="item in filtedOptions"
		:key="item.key ? item.key : item.value"
		:label="item.label"
		:value="item.value"
		:disabled="item.disabled">
		<slot name="customOptions" :data="item"></slot>
	</el-option>
</el-select>
</el-form-item>
</template>

<script>
export default {
	// name: 'NavBar',
	props:{
		//form 类目
		title: String,
		//form 验证项
		prop: String,

		//选项信息 [{label:<string>,value:<string>,disabled: <bool>}]
		options: Array,
		//值
		value:{
			type: [String, Object, Number, Boolean],
			default: ""
		},
		//提示语
		placeholder:{
			type: String,
			default: "请选择"
		},
		//是否可编辑
		disabled: {
			type: Boolean,
			default: false
		},
		//当 option 的 Value 是 Object 的时候需要这个字段作为唯一标示
		valuekey:{
			type: String,
			default:""
		},
		//是否加载中
		loading: {
			type: Boolean,
			default: false
		},
		//筛选
		filterable:{
			type: Boolean,
			default: false
		},
		// 远程搜索
		remote: {
			type: Boolean,
			default: false
		},
		'remote-method': {
			type: Function,
			default: (_) => {}
		}
	},
	data () {
		return {
			currValue: this.value,
			filtedOptions: this.options,
		}
	},
	watch: {
		value(val) {
            this.currValue = val;//新增value的watch，监听变更并同步到currValue上
		},
		options(val) {
			this.filtedOptions = val;
		}
    },
    created(){

    },
    methods:{
		// remoteMethod(query) {
        // 	if (query !== '') {
        //     	this.filtedOptions = this.options.filter(item => {
        //       	return item.label.toLowerCase()
        //         	.indexOf(query.toLowerCase()) > -1;
		// 		});
		// 	}else {
		// 		this.filtedOptions = this.options 
		// 	}
      	// },
    	valueChanged(){
    		this.$emit('input', this.currValue)
			this.$emit('valueChanged', this.currValue);
    	},
    	focus(event){
			this.$emit('focus', event);
    	}

    }

}

</script>

<style lang="less">

.selectIterm{
	box-sizing: border-box;
	// min-height: 45px;
	// height: 45px;
	display: flex;
	margin-bottom: 0px;
	padding: 0px 10px;
	background-color: #FFF;
	border-bottom: 0.5px solid @borderColor;
	flex-wrap: wrap;

	.el-form-item__label{
		line-height: 44px;
		text-align: left;
		width: 100px;//30%;
		padding-right: 0px;
	}

	.el-form-item__content{
		// width: 70%;
		flex: 1;
	}

	.el-select{
		display: block;
	}

	.el-input__inner {
		border: none;
		border-bottom: 0.5px solid @borderColor;
		border-radius: 0;
		height: 44.5px;		
    }
    .el-input.is-disabled .el-input__inner {
    	background-color: #fff; 
    	color: @disabelText;
    }
}

</style>