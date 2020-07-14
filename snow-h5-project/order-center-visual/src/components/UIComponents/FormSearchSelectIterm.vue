<template>
	<el-form-item :label="title" :prop="prop" class="selectIterm" >
		<el-autocomplete
        v-model="currValue"
		:disabled="disabled"
        :fetch-suggestions="querySearch"
        :placeholder="placeholder"
		@focus="inputDidFocus"
		@blur="inputDidBlur"
        @select="handleSelect"
        >
  			<template slot-scope="{ item }">
    			<div>{{ item.label }}</div>
  			</template>
		</el-autocomplete>
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
		//显示值的 Key
		valuekey:{
			type: String
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
	},
	data () {
		return {
			currValue: this.value,
			queryString: ""
		}
	},
	watch: {
		value(val) {
			console.log('选择回调:',val)
            this.currValue = val;
		},
    },
    created(){

    },
    methods:{
        handleSelect(item) {
			console.log(item)
			this.$emit('valueChanged', item.value);
			this.currValue = item[this.valuekey];
      	},
		querySearch(queryString, cb) {
            var items = this.options;
			var results = this.currValue ? items.filter(this.createFilter(this.currValue)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.label.toLowerCase()
                	.indexOf(queryString.toLowerCase()) > -1);
            };
        },
    	valueChanged(){
			this.$emit('valueChanged', this.currValue);
    	},
    	inputDidFocus(event){
			this.currValue = "";
		},
		inputDidBlur(event) {
			this.currValue = "";
		}

    }

}

</script>

<style lang="less">

.el-autocomplete-suggestion li{
  border-bottom: 0px solid transparent;
}

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