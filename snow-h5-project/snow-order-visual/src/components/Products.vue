<template>
	<div class="products">
		<div class="tops">
		    <i class="goBack el-icon-arrow-left" @click="handleBack"></i>
		    选购产品
		    <span id="set_up" @click="handleSave" :disabled="disabled">保存</span>
		 </div>
    	<div class="prodBox">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				
				<el-tab-pane label="服务" name="first">
					<div class="tabBox" v-for="(item, index) in serveList" :key="item.idx">
						<el-form :model="item" label-width="90px" label-position="top" class="demo-ruleForm">
							<el-button class="but" v-show="item.idx > 0" @click="handleServeRemove(index)"><i class="el-icon-close"></i></el-button>
							<el-form-item class="formItem" label="服务项目">
								<el-select v-model="item.productName" @change="serveChange($event, index)" placeholder="请选择服务项目">
									<el-option v-for="item in serveInfo" :key="item.number" :label="item.name" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="item.chargeway == '0'" class="formItem" label="服务时间 （月）">
								<el-input v-model="item.serverMonth" placeholder="请选择服务时间"></el-input>
							</el-form-item>
							<el-form-item class="formItem" label="服务费用 （元）">
								<el-input v-model="item.totalAmount" placeholder="请选择服务费用"></el-input>
							</el-form-item>
							<el-form-item class="formItem" label="续费价格 （元）">
								<el-input v-model="item.nextServerAmount" placeholder="续费价格"></el-input>
							</el-form-item>
						</el-form>
					</div>
					<el-button class="add" icon="el-icon-plus" @click="handleServe">添加更多</el-button>
				</el-tab-pane>

				<el-tab-pane label="设备" name="second">
					<div class="tabBox" v-for="(item, index) in facilityList" :key="item.idx">
						 <el-form :model="item" label-width="90px" label-position="top" class="demo-ruleForm">
							<el-button class="but" v-show="item.idx > 0" @click="handleFacilityRemove(index)"><i class="el-icon-close"></i></el-button>
							<el-form-item class="formItem" label="设备">
								<el-select v-model="item.productName" @change="facilityChange($event, index)" placeholder="请选择设备">
									<el-option v-for="item in facilityInfo" :key="item.number" :label="item.name" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<div class="inputNumber">
								<span class="quantity">设备数量</span>
								<el-input-number v-model="item.quantity" @change="handleChange" :min="1" :max="999"></el-input-number>
							</div>
							<el-form-item class="formItem" label="押金总额 （元）">
								<el-input v-model="item.depositeAmt" placeholder="押金总额"></el-input>
							</el-form-item>
						</el-form>
					</div>
					<el-button class="add" icon="el-icon-plus" @click="handleFacility">添加更多</el-button>
				</el-tab-pane>
				
			</el-tabs>
		</div>
	</div>
</template>

<script>

export default {
	name: 'products',
	data () {
		return {
			disabled: false,
			showServerMonth: null,
			activeName: 'first',
			serveList: [],
			facilityList: [],
			serveInfo: [],
			facilityInfo: [],
			option: {
				timeout: 30 * 1000 //30秒过期
			}
		}
	},
	created() {
		this.findProduct();
		let p = window.localStorage.getItem('productEntity');
		if (p == '[]' || !p ) {
			this.serveList = [{
				idx: 0, 
				serverMonth: "0",
				productId: "",
				productName: "",
				deposite: "",
				totalAmount: "0",
				nextServerAmount: "0",
				quantity: 1,
				depositeAmt: "",
				taxPrice: null
			}];
			this.facilityList = [{
				idx: 0, 
				serverMonth: "0",
				productId: "",
				productName: "",
				depositeAmt: "0",
				nextServerAmount: "",
				quantity: null,
				taxPrice: null
			}];
		}else{
			p = JSON.parse(p);
			let idxS = -1;
			let idxF = -1;
			for (const i in p) {
				let code = p[i].productName.slice(-2);
				if (code == "服务") { 
					this.serveList.push(p[i]);
					p[i].idx = idxS + 1;
					idxS = p[i].idx;
				}else{
					this.facilityList.push(p[i]);
					p[i].idx = idxF + 1;
					idxF = p[i].idx;
				}
			}
		}
    },
    methods: {
		handleBack(){//退回到详情页面
			this.$emit('goBack', 'back', false);
		},
		handleSave(){//保存商品列表
			let productEntity = [];
			if (this.serveList) {
				for (const i in this.serveList) {
					if (this.serveList[i].productName) {
						if (!this.serveList[i].totalAmount) {
							this.serveList[i].totalAmount = '0';
						}
						this.serveList[i].quantity = 1;
						this.serveList[i].depositeAmt = '0.0';
						this.serveList[i].deposite = '0.0';
						productEntity.push(this.serveList[i])
					}
				}
			}
			if (this.facilityList) {
				for (const i in this.facilityList) {
					if (this.facilityList[i].productName) {
						if (!this.facilityList[i].depositeAmt) {
							this.facilityList[i].depositeAmt = '0';
						}
						this.facilityList[i].nextServerAmount = '0.0';
						this.facilityList[i].serverMonth = '0.0';
						productEntity.push(this.facilityList[i])
					}
				}
			}
			if (productEntity) {
				console.log(productEntity)
				window.localStorage.setItem('productEntity', JSON.stringify(productEntity));
				this.$emit("goBack", 'save', false);
			}else{
				this.$message({
					message: '请选择服务或设备！',
					type: "warning"
				});
			}
		},
		handleClick(tab, event) {},
		handleChange(value) {},
		handleServe(){//添加服务
			let serve = {
				idx: this.serveList.length + 1,
				serverMonth: "0",
				productId: "",
				productName: "",
				chargeway: "",
				deposite: "",
				totalAmount: "0",
				nextServerAmount: "",
				quantity: 1,
				depositeAmt: "",
				taxPrice: null
			}
			this.serveList.push(serve)
		},
		handleFacility(){//添加设备
			let facility = {
				idx: this.facilityList.length + 1,
				serverMonth: "0",
				productId: "",
				productName: "",
				depositeAmt: "0",
				nextServerAmount: "",
				quantity: null,
				taxPrice: null
			}
			this.facilityList.push(facility)
		},
		serveChange(event, index){//选择服务  
			if(typeof(event) =='object'){
				this.serveList[index].productName = event.name; 
				this.serveList[index].productId = event.materialId;
				this.serveList[index].chargeway = event.chargeway;
			}  
		}, 
		facilityChange(event, index){//选择设备
			if(typeof(event) =='object'){
				this.facilityList[index].productName = event.name;
				this.facilityList[index].productId = event.materialId;
			}
		},
		findProduct(){//查询服务和设备信息
			let self = this;
			let url = '/erp-api/erp/product/list?token=5a5c6c1a-435b-44b4-93a1-1de40c6af8d3&types=2,6&cusType=003';

			self.$http.get(url, self.option).then(
				function(data) {
					// 这里是处理正确的回调
					if (data.body.msg) {
						self.$message({
							message: data.body.msg,
							type: "warning"
						});
					} else {
						let info = data.body.data;
						for (const i in info) {
							let code = info[i].number.slice(0,2);
							if (code == "FW") { 
								self.serveInfo.push(info[i]);  
							}else{
								self.facilityInfo.push(info[i]);
							}
						}
					}
				},
				function(error) {
					// 这里是处理错误的回调
					self.$message({
						message: "请求失败，请刷新重试！",
						type: "error"
					});
				}
			);
		},
		handleServeRemove(index){
			this.serveList.splice(index, 1);
		},
		handleFacilityRemove(index){
			this.facilityList.splice(index, 1);
		},
    }
}
</script>

<style lang="less">
	.el-select-dropdown{
		.selected{
			background: #fff;
			color: #48576a;
		}
	}
	.products{
		width: 100%;
		height: 100%;
		color: #666;
		background: #F9FAFC;
		padding: 50px 0 36px 0;

		.tops{
		    width: 100%;
		    height: 50px;
		    color: #fff;
		    background: #20A0FF;
			line-height: 50px;
			position: fixed;
		    top: 0;
		    left: 0;
		    z-index: 9;

		    .goBack{
		        float: left;
		        height: 100%;
		        line-height: 50px;
		        margin-left: 20px;
		    }

		    #set_up{
		        float: right;
		        margin-right: 20px;
		    }
		}
		.prodBox{
			.tabBox{
				border-bottom: 8px solid #E6EFFB;
				margin: 15px 0;

				.but{
					border: none;  
					background: #F9FAFC;
					float: right;
					margin-right: 10px;
					i{
						font-size: 12px;
					}
				}
				.but:hover{
					background: #F9FAFC;
				}
			}
			.el-tabs{
				.el-tabs__nav{ 
					width: 100% !important;
					.el-tabs__item{
						width: 50% !important;
					}
				}
				.el-form{
					.formItem{
						label{
							display: block;
							padding-left: 20px;
						}
						.el-form-item__content{
							.el-select,.el-input{
								width: 90%;
								height: 40px;
								.el-input{
									width: 100%;
								}
							}
						}
						input{
							border: none;
							border-bottom: 1px solid #bfcbd9;
						}
					}
					.inputNumber{
						margin-bottom: 20px;
						padding-right: 20px;
						overflow: hidden;

						.quantity{
							font-size: 14px;
							float: left;
							padding: 0 0 10px 20px;
						}
						.el-input-number{
							float: right;

							.el-input-number__decrease{
								    left: 0;
    								border-right: 1px solid #bfcbd9;
							}
							.el-input{
								input{
									padding-left: 80px;
									padding-right: 0;
								}
							}
						}
					}
				}
			}
		}
		
	}
</style>
