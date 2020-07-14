<template>
	<div class="setup">
		<Products v-if='showProduct' @goBack='goBack'></Products>
		<Amap v-show="showAmap" :options="options" @goSetup='goSetup'></Amap>
		<div v-show="showSetup" class="showSetup" style="padding: 50px 0 36px 0;">
			<div class="top">
				<i class="goBack el-icon-arrow-left" onclick="window.history.go(-1)"></i>
				新建订单
				<el-button id="set_up" type="primary" @click="handleClick" ref="set_up" v-loading="loading" :disabled="disabled">保存</el-button>
			</div>
			<div class="box">
				<p>基本信息</p>
				<input ref="proName" placeholder="新项目 / 门店名称" :class="[proActive ? errorClass : '']">
				<input ref="cusName" placeholder="公司名称" :class="[cusActive ? errorClass : '']">
			</div>
			<div class="box">
				<div class="title">
					<span>地址信息</span>
					<i class="redact" @click="handleAmap">编辑</i>
				</div>
				<input ref="provinceName" placeholder="省" :class="[provinceActive ? errorClass : '']">
				<input ref="cityName" placeholder="市" :class="[cityActive ? errorClass : '']">
				<input ref="areaName" placeholder="区" :class="[areaActive ? errorClass : '']">
				<input ref="address" placeholder="详细地址" :class="[addressActive ? errorClass : '']"><br/>
				<input ref="longitude" placeholder="经度">
				<input ref="latitude" placeholder="纬度"> 
				<input ref="serTel" placeholder="电话号码" @input="serTel" :class="[serTelActive ? errorClass : '']">
			</div>
			<div class="box">
				<p>联系人信息</p>
				<input ref="linker" placeholder="联系人" :class="[linkerActive ? errorClass : '']">
				<input ref="position" placeholder="职务" :class="[positionActive ? errorClass : '']">
				<input ref="telephone" placeholder="手机" @input="telephone" :class="[telephoneActive ? errorClass : '']">
			</div>
			<div class="box">
				<p>银行账户</p>
				<input ref="openBank" placeholder="开户行名称   如: 中国建设银行成都市高新支行">
				<input ref="bankAcct" placeholder="银行账户" @input="bankAcct" :class="[bankActive ? errorClass : '']">
				<input ref="acctName" placeholder="账号名称   如：**公司**人">
			</div>
			<div class="box">
				<div class="title">
					<span>选购产品</span>
					<i class="choice" @click="handleProducts">选择</i>
				</div>
				<div class="productBox" v-show="showProductBox">
					<ul class="serve" v-show="showServe">
						<b>服务</b>
						<li v-for="item in serveInfo" :key="item.productId">
							<p>
								<i>{{item.productName}}</i>
								<span>{{item.totalAmount}}元 {{item.serverMonth}}个月</span>
							</p>
							<p v-show="item.nextServerAmount">
								<i>续费价格</i>
								<span>{{item.nextServerAmount}}元 12个月</span>
							</p>
						</li>
						<strong>服务总价：{{serveTotalAmount}}元</strong>
					</ul>
					<ul class="facility" v-show="showFacility">
						<b>设备</b>
						<li v-for="item in facilityInfo" :key="item.productId">
							<p>
								<i>{{item.productName}}</i>
								<span>{{item.quantity}}台</span>
							</p>
						</li>
						<strong>押金总价：{{facilityTotalAmount}}元</strong>
					</ul>
				</div>
				<br>
				<div class="foot" v-show="showProductBox">
					<strong>总计：{{allTotalAmount}}元</strong>
				</div>	
			</div>
			<div class="card">
				<h3>桌牌设置</h3>
				<div class="checkeBox">
					<span>是否已对接点餐系统</span>
					<el-checkbox v-model="checked" disabled>是</el-checkbox>
					<el-checkbox v-model="checked1" disabled>否</el-checkbox>
				</div>
				<div class="drop">
					<p style="text-align:left;margin-left:10px;">商家系统：</p>
					<div class="dropBox">
						<p ref="caterSystemName" @click="handleSystem" :class="[caterActive ? borderClass : '']">
							{{caterSystemName}}
						</p>
						<ul v-show="showSystem">
							<li v-for="(system, index) in systems" :key="system.label" @click="handleEvent($event, index)">{{system.label}}</li>
						</ul>
					</div>
					<input ref="caterMerchantId" placeholder="餐饮系统ID" v-model="caterMerchantId" :class="[IdActive ? errorClass : '']">
				</div>
			</div>
			<div class="box">
				<p>其他信息</p>
				<span class="span">是否开通支付服务</span>
				<el-radio-group v-model="radio1" @change="handlePay">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="2">否</el-radio>
				</el-radio-group><br/>
				<span class="span">是否需要安装服务</span>
				<el-radio-group v-model="radio2" @change="handleRadio">
					<el-radio :label="3">是</el-radio>
					<el-radio :label="4">否</el-radio>
				</el-radio-group>
				<div class="install" v-if="handleInstall">
					<template>
						<div class="block">
							<el-date-picker :editable="false" v-model="value1" type="date" placeholder="预装日期" :picker-options="pickerOptions"></el-date-picker>
						</div>
					</template>
					<input ref="installLinker" v-model="installLinker" placeholder="安装对接人" :class="[installLinkerActive ? errorClass : '']">
					<input ref="linkerTel" v-model="linkerTel" placeholder="对接人电话" @input="linkerTelephone" :class="[linkerTelActive ? errorClass : '']">
					<textarea placeholder="其他环境描述" v-model="textarea1"></textarea>
				</div>
			</div>
			<div class="box">
				<p>备注</p>
				<textarea placeholder="请输入内容" v-model="textarea2"></textarea>
			</div>
			<div class="box">
				<p>附件上传</p>
				<el-upload
					list-type="picture-card"
					action="/erp-api/erp/file/upload"
					:data="upLoadData"
					:before-upload="beforeUpload"
					:on-remove="handleRemove"
					:on-error="UploadError"
					:on-success="UploadSuccess">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-model="dialogVisible" size="tiny">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
			<el-button type="primary" @click="handlePrimary" v-loading="primaryLoading" :disabled="disabled">提 交</el-button>
		</div>
	</div>
</template>

<script>
import Products from '../components/Products'
import Detailed from '../components/Detailed'
import Amap from '../components/Amap'

export default {
	name: 'setup',
	data () {
		return {
			userId : '',
            token : '',
			msg: '',
			radio1: 1,
			radio2: 3,
		    checked: true,
		    checked1: false,
			caterSystem: '',
			textarea1: '',
			textarea2: '',
			caterSystemName: '',
			caterMerchantId: '',
        	systems: [],
        	period: '',
        	totalAmount: '',
        	options: '',
        	upLoadData: {
		        token: this.$route.query.token, 
		        fileName: ''
		    },
		    pay: '',
		    install: '',
		    id: '',
			name: '',
			productEntity: [],
			serveInfo: [],
			facilityInfo: [],
			serveTotalAmount: null,
			facilityTotalAmount: null,
			allTotalAmount: null,
			file: [],
			showServe: false,
			showFacility: false,
			showProductBox: false,
			showSetup: true,
			handleInstall: false,
			dialogImageUrl: '',
        	dialogVisible: false,
        	showProduct: false,
        	showDetail: false,
        	showSystem: false,
        	showAmap: false,
        	isProduct: false,
        	loading: false,
        	primaryLoading: false,
		    proActive: false,
		    cusActive: false,
			provinceActive: false,
			cityActive: false,
			areaActive: false,
			addressActive: false,
			serTelActive: false,
			linkerActive: false,
			positionActive: false,
			telephoneActive: false,
			bankActive: false,
			installLinkerActive:false,
			linkerTelActive: false,
			IdActive: false,
			caterActive: false,
			disabled: false,
			errorClass: 'error',
			borderClass: 'border',
	        value1: '',
			pickerOptions: {
		        disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		        }
	        },
	        installLinker: '',
			linkerTel: ''
		}
	},
	components: {
        'Products' : Products,
        'Amap' : Amap
    },
	created() {//在实例创建完成后被立即调用
		this.userId = window.localStorage.getItem("userId");
		this.token = window.localStorage.getItem("token");
		let that = this;
		let option = {
			timeout: 30 * 1000 //30秒过期
		};
		let url = '/erp-api/erp/saler/dept?userId='+ this.userId +'&token='+ this.token +'';
		that.$http.get(url).then(function (data) {//获取部门id和name
			let info = data.body.data;
			if (info) {
				that.id = info[0].id;
				that.name = info[0].name;
			}else{
				that.$message(data.body.msg); 
			}; 
		},
		function (error) {
			that.$message('请求超时！');
		});
		if (that.radio1 == 1) {
    		that.pay = '1';
    	}else{
    		that.pay = '0';
    	};
		if (that.radio2 == 3) {
			that.handleInstall = true;
			that.install = 1;
		}else{
			that.handleInstall = false;
			that.install = 0;
			that.value1 = '';
			that.installLinker = '';
			that.linkerTel = '';
			that.textarea1 = '';
		};
    },
    methods: {
		beforeUpload(file){//文件上传之前获取文件名
    		this.upLoadData.fileName = file.name;
    	},
	    UploadSuccess(response, file){//文件上传成功后
	    	this.dialogImageUrl = file.url;
			this.dialogVisible = true;
			this.file.push(response.data);
	    },
	    UploadError(err, file, fileList){//文件上传失败
			this.$message('文件上传失败，请检查文件大小是否超过500kb！');
	    },
	    handleRemove(file, fileList) {//删除上传的文件
			let index = this.file.indexOf(file)
			this.file.splice(index, 1);
		},
	    handleAmap(){//调用高德地图
	    	this.showAmap = true;
	    },
	    goSetup(){//信息获取并赋值
	    	this.showAmap = arguments[0];
    		let mapCenter = arguments[1];
    		this.$refs.longitude.value = mapCenter[0];
    		this.$refs.latitude.value = mapCenter[1];
	    	
	    	if (arguments[2]) {
	    		this.$refs.address.value = arguments[2];
	    	};
	    	if (arguments[3]) {
	    		this.$refs.provinceName.value = arguments[3];
	    	};
	    	if (arguments[4]) {
	    		this.$refs.cityName.value = arguments[4];
	    	};
	    	if (arguments[5]) {
	    		this.$refs.areaName.value = arguments[5];
	    	};
	    },
	    handleTab(value,tab,event) {//tab切换商家系统
	        
	    },
	    handleSystem() {//商家系统下拉列表
	    	let that = this;
			let option = {
				timeout: 30 * 1000 //30秒过期
			};
			let url = 'erp-api/erp/assistant/combo/list?token='+ that.token +'&grpNum=ZDY_CATER_TYPE';
			that.$http.get(url).then(function (data) {//获取获取商家系统
				let info = data.body.data;
				if (info) {
					that.systems = info;
	    			that.showSystem = true;
				}else{
					that.$message(data.body.msg);
				};
			},
			function (error) {
				that.$message('请求超时！');
			});
        },
        handleEvent(event,index){//选择商家系统
        	this.caterSystemName = event.currentTarget.innerText;
        	this.showSystem = false;
        	this.caterSystem = this.systems[index].fId;
        },
		handleProducts(){//点击选择商品
			window.localStorage.setItem('productEntity', JSON.stringify(this.productEntity));
			this.showProduct = true; 
			this.showSetup = false;
		},
		goBack(){//这里接收子组件传到父组件的值
            this.showProduct = arguments[1];
			this.showSetup = true;
			this.showProductBox = true;
			if (arguments[0] == 'save') {
				this.serveInfo = [];
				this.facilityInfo = [];
				let productEntity = window.localStorage.getItem('productEntity');
				if (productEntity) {
					let p = JSON.parse(productEntity);
					this.productEntity = p;
					this.serveTotalAmount = 0;
					this.facilityTotalAmount = 0;
					for (const i in p) {
						let code = p[i].productName.slice(-2);
						if (p[i].productName) {
							if (code == "服务") {
								let t = p[i].totalAmount;
								this.serveTotalAmount += parseInt(t);
								this.serveInfo.push(p[i]);
								this.showServe = true;
							}else{
								let m = parseInt(p[i].depositeAmt);
								this.facilityTotalAmount += m;
								this.facilityInfo.push(p[i]);
								this.showFacility = true;
							}
						}
					}
					this.allTotalAmount = this.serveTotalAmount + this.facilityTotalAmount;
				}
			}
		},
        handlePay(value){//判断是否需要支付服务
        	if (value == 1) {
        		this.pay = '1';
        	}else{
        		this.pay = '0';
        	};
        },
        handleRadio(value){//判断是否需要安装服务
			if (value == 3) {
				this.handleInstall = true;
				this.install = 1;
			}else{
				this.handleInstall = false;
				this.install = 0;
				this.value1 = '';
				this.installLinker = '';
				this.linkerTel = '';
				this.textarea1 = '';
			};
		},
		serTel(){//正则验证电话号码
			let value = this.$refs.serTel.value;
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.test(value)) {
                this.serTelActive = true;
            }else{
                this.serTelActive = false;
            };
		},
		telephone(){//正则验证电话号码
			let value = this.$refs.telephone.value;
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.test(value)) {
                this.telephoneActive = true;
            }else{
                this.telephoneActive = false;
            };
		},
		bankAcct(){//正则验证银行卡号为数字
			let value = this.$refs.bankAcct.value;
            let reg = /^\d+$/;
            if (!reg.test(value)) {
                this.bankActive = true;
            }else{
                this.bankActive = false;
            };
		},
		linkerTelephone(){//正则验证电话号码
			let value = this.$refs.linkerTel.value;
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.test(value)) {
                this.linkerTelActive = true;
            }else{
                this.linkerTelActive = false;
            };
		},
    	handleClick(){//保存订单
    		let that = this;
	    	let d = new Date(that.value1);
    		let date = '';
    		if (that.value1) {
				date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    		}else{
    			date = ' ';
    		};
			let option = {
				timeout: 30 * 1000 //30秒过期
			};
			let url = '/erp-api/erp/sale/order/submit/estate/info';
			let params = {
				"status": 0, 
				"matchData": 1,
				"userId": that.userId,  
				"token": that.token,
				"jsonString": JSON.stringify({
					"matchData": 1,
					"cusTypeNumber": "5699aa52ec7e62",
					"caterSystem": that.caterSystem,
					"caterSystemName": that.caterSystemName,
					"caterMerchantId": that.caterMerchantId,
					"cusName": that.$refs.cusName.value,
					"address": that.$refs.address.value,
					"productEntity": that.productEntity,
					"acctName": that.$refs.acctName.value,
					"dept": {
						"id": that.id,
						"name": that.name
					},
					"telephone": that.$refs.telephone.value,
					"latitude": that.$refs.latitude.value,
					"longitude": that.$refs.longitude.value,
					"position": that.$refs.position.value,
					"fId": that.fId,
					"linker": that.$refs.linker.value,
					"files": that.file,
					"isExistProject": "0",
					"openBank": that.$refs.openBank.value,
					"prjId": "",
					"proName": that.$refs.proName.value,
					"provinceName": that.$refs.provinceName.value,
					"cityName": that.$refs.cityName.value,
					"areaName": that.$refs.areaName.value,
					"serTel": that.$refs.serTel.value,
					"bankAcct": that.$refs.bankAcct.value,
					"cooperate": "",
					"saleModel": "BZ",
    				"description": that.textarea2,
					"payServer": that.pay,
					"installServer": that.install,
					"installDate": date,
    				"installLinker": that.installLinker,
					"linkerTel": that.linkerTel,
					"environmentDesc": that.textarea1,
				})
			};
			if (!that.$refs.proName.value) {
                that.proActive = true;
                that.$message('项目名称不能为空！');
            }else if(!that.$refs.cusName.value){
                that.cusActive = true;
                that.$message('公司名称不能为空！');
            }else if(!that.$refs.provinceName.value){
                that.provinceActive = true;
                that.$message('所属省份不能为空！');
            }else if(!that.$refs.cityName.value){
                that.cityActive = true;
                that.$message('所属城市不能为空！');
            }else if(!that.$refs.areaName.value){
                that.areaActive = true;
                that.$message('所属区域不能为空！');
            }else if(!that.$refs.address.value){
                that.addressActive = true;
                that.$message('详细地址不能为空！');
            }else if(!that.$refs.serTel.value){
                that.serTelActive = true;
                that.$message('固定电话不能为空！');
            }else if(!that.$refs.linker.value){
                that.linkerActive = true;
                that.$message('联系人不能为空！');
            }else if(!that.$refs.position.value){
                that.positionActive = true;
                that.$message('联系人职务不能为空！');
            }else if(!that.$refs.telephone.value){
                that.telephoneActive = true;
                that.$message('移动电话不能为空！');
            }else if(!that.caterSystemName){
                that.caterActive = true;
                that.$message('请选择商家系统！');
            }else if(!that.productEntity){
                that.$message('请选择商品！');
            }else{
            	if(that.radio2 == 3){
                	if(!that.value1){
	                	that.$message('请选择安装服务日期！');
	                	return;
	            	}else if(!that.installLinker){
	               	 	that.installLinkerActive = true;
	                	that.$message('安装对接人不能为空！');
	                	return;
	            	}else if(!that.linkerTel){
	               	 	that.linkerTelActive = true;
	                	that.$message('对接人电话不能为空！');
	                	return;
	            	}
            	}
				that.disabled = true;
            	that.loading = true;
            	that.$http.post(url, params, option).then(function (data) {
            		let info = data.body.data;
            		if (info) {
            			that.loading = false;
						that.disabled = false;
						that.$router.push({path:'/'});
            		}else{
            			that.loading = false;
						that.disabled = false;
						that.$message(data.body.msg);
            		};
				},
				function (error) {
					that.$message('保存失败！');
					that.loading = false;
					that.disabled = false;
				})
            };
    	},
		handlePrimary(){//提交订单
			let that = this;
	    		let d = new Date(that.value1);
				let date = '';
    		if (that.value1) { 
    			date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    		}else{
    			date = ' ';
    		};
			let option = {
				timeout: 30 * 1000 //30秒过期
			};
			let url = '/erp-api/erp/sale/order/submit/estate/info';
			let params = {
				"status": 1, 
				"userId": that.userId,  
				"token": that.token,
				"jsonString": JSON.stringify({
					"matchData": 1,
					"cusTypeNumber": "5699aa52ec7e62",
					"caterSystem": that.caterSystem,
					"caterSystemName": that.caterSystemName,
					"caterMerchantId": that.caterMerchantId,
					"cusName": that.$refs.cusName.value,
					"address": that.$refs.address.value,
					"productEntity": that.productEntity,
					"acctName": that.$refs.acctName.value,
					"dept": {
						"id": that.id,
						"name": that.name
					},
					"telephone": that.$refs.telephone.value,
					"latitude": that.$refs.latitude.value,
					"longitude": that.$refs.longitude.value,
					"position": that.$refs.position.value,
					"fId": that.fId,
					"linker": that.$refs.linker.value,
					"files": that.file,
					"isExistProject": "0",
					"openBank": that.$refs.openBank.value,
					"prjId": "",
					"proName": that.$refs.proName.value,
					"provinceName": that.$refs.provinceName.value,
					"cityName": that.$refs.cityName.value,
					"areaName": that.$refs.areaName.value,
					"serTel": that.$refs.serTel.value,
					"bankAcct": that.$refs.bankAcct.value,
					"cooperate": "",
					"saleModel": "BZ",
    				"description": that.textarea2,
					"payServer": that.pay,
					"installServer": that.install,
					"installDate": date,
    				"installLinker": that.installLinker,
					"linkerTel": that.linkerTel,
					"environmentDesc": that.textarea1,
				})
			};
			if (!that.$refs.proName.value) {
                that.proActive = true;
                that.$message('项目名称不能为空！');
            }else if(!that.$refs.cusName.value){
                that.cusActive = true;
                that.$message('公司名称不能为空！');
            }else if(!that.$refs.provinceName.value){
                that.provinceActive = true;
                that.$message('所属省份不能为空！');
            }else if(!that.$refs.cityName.value){
                that.cityActive = true;
                that.$message('所属城市不能为空！');
            }else if(!that.$refs.areaName.value){
                that.areaActive = true;
                that.$message('所属区域不能为空！');
            }else if(!that.$refs.address.value){
                that.addressActive = true;
                that.$message('详细地址不能为空！');
            }else if(!that.$refs.serTel.value){
                that.serTelActive = true;
                that.$message('固定电话不能为空！');
            }else if(!that.$refs.linker.value){
                that.linkerActive = true;
                that.$message('联系人不能为空！');
            }else if(!that.$refs.position.value){
                that.positionActive = true;
                that.$message('联系人职务不能为空！');
            }else if(!that.$refs.telephone.value){
                that.telephoneActive = true;
                that.$message('移动电话不能为空！');
            }else if(!that.caterSystemName){
                that.caterActive = true;
                that.$message('请选择商家系统！');
            }else if(!that.productEntity){
                that.$message('请选择商品！');
            }else{
            	if(that.radio2 == 3){
                	if(!that.value1){
	                	that.$message('请选择安装服务日期！');
	                	return;
	            	}else if(!that.installLinker){
	               	 	that.installLinkerActive = true;
	                	that.$message('安装对接人不能为空！');
	                	return;
	            	}else if(!that.linkerTel){
	               	 	that.linkerTelActive = true;
	                	that.$message('对接人电话不能为空！');
	                	return;
	            	}
            	}
				that.disabled = true;
            	that.primaryLoading = true;
            	that.$http.post(url, params, option).then(function (data) {
            		let info = data.body.data;
            		if (info) {
            			that.primaryLoading = false;
						that.disabled = false;
						that.$router.push({path:'/'});
            		}else{
            			that.primaryLoading = false;
						that.disabled = false;
						that.$message(data.body.msg);
            		};
				},
				function (error) {
					that.$message('提交失败');
					that.primaryLoading = false;
					that.disabled = false;
				})
            };
		}
    }
}
</script>

<style lang="less">
	.setup{
		width: 100%;
		background: #E6EFFB;
		
		.error{
			background: #FFF1F1 !important;
			border: 1px solid #FF6600;
		}
		.top{
		    width: 100%;
		    height: 50px;
		    color: #fff;
		    background: #20A0FF;
		    line-height: 50px;
		    text-align: center;
		    position: fixed;
		    top: 0;
		    left: 0;
		    z-index: 9;

		    .goBack{
		      	float: left;
		      	height: 100%;
		      	line-height: 50px;
			    position: absolute;
			    top: 0;
			    left: 20px;
		    }

		    #set_up{
		    	width: 20%;
		    	height: 100%;
			    float: right;
			    position: absolute;
			    top: 0;
			    left: 80%;
		    }
		}

		.box{
			color: #aaa;
			font-size: 14px;
			overflow: hidden;
			padding: 10px;
			background: #fff;
			margin-bottom: 8px;

			.title{
				overflow: hidden;
				padding: 3px 0;
				line-height: 30px;

				span{
					color: #0093E2;
					font-size: 12px;
					float: left;
				}
				i{
					width: 50px;
					height: 24px;
					color: #fff;
					background: #20A0FF;
					font-size: 12px;
					text-align: center;
					line-height: 24px;
					border-radius: 5px;
					float: right;
					margin: 2px 10px 0 0;
				}
			}
			.install{
				.block{
					.el-date-editor{
						width: 100%;
						height: 40px;
						position: relative;
						margin-top: 10px;

						.el-input__icon{
							right: 30px;
						}
						.el-input__inner{
							margin: 0;
						}
					}
				}
			}
			.productBox{
				ul{
					b{
						text-align: left;
						line-height: 40px;
						color: #777;
						border-bottom: 1px solid #E6EFFB;
						display: block;
						padding-left: 6px;
					}
					li{
						p{
							height: 40px;
							line-height: 40px;
							color: #aaa;
							padding: 0 10px;
							display: block;
							i{
								float: left;
							}
							span{
								float: right;
							}
						}
					}
					strong{
						text-align: right;
						display: block;
					}
				}
			}
			.foot{
				height: 40px;
				line-height: 40px;
				padding: 0 10px;

				strong{
					text-align: right;
					display: block;
				}
				b{
					width: 50px;
					height: 26px;
					color: #fff;
					background: #20A0FF;
					line-height: 26px;
					border-radius: 5px;
					float: right;
					margin-top: 8px;
				}
			}
			p{
				color: #0093E2;
				font-size: 12px;
				text-align: left;
			}
			input{
				width: 88%;
				height: 40px;
				border: 1px solid #bfcbd9;
				outline:none;
				border-radius: 4px;
				padding-left: 10px;
				margin-top: 10px;
				box-sizing: border-box;
			}
			textarea{
				width: 88%;
				height: 60px;
				resize: none;
				outline:none;
				border-radius: 4px;
				margin-top: 10px;
				padding: 6px 10px;
				box-sizing: border-box;
			}
			.span{
				float: left;
				margin: 10px 0 0 14px;
			}
			.el-radio{
				margin: 10px 0 0 54px;
				cursor: auto;
			}
			.el-radio__input{
				cursor: auto;
			}
			.el-upload{
				width: 40%;
				float: left;
				margin: 10px 0 0 6%;
			}
			.el-upload-list{
				li{
					width: 40%;
					float: left;
					margin: 10px 0 0 6%;
				}
			}
			.el-dialog{
				width: 70%;
			}
		}
		.card{
			color: #aaa;
			font-size: 14px;
			overflow: hidden;
			padding: 10px;
			background: #fff;
			margin-bottom: 8px;
			
			h3{
				color: #0093E2;
				font-size: 12px;
				font-weight: normal;
				text-align: left;
				border-bottom:  2px solid #E6EFFB;
				padding-bottom: 10px;
			}
			.checkeBox{
				display: flex;
				justify-content:space-between;
				margin: 16px 4px;
			}
			.drop{
				width: 88%;
				margin: 0 auto;

				.dropBox{
					p{
						width: 88%;
						height: 40px;
						line-height: 40px;
						border-bottom: 1px solid #bfcbd9;
						margin: 0 auto;
					}
				}
			}
			input{
				width: 88%;
				height: 40px;
				border: 1px solid #bfcbd9;
				outline:none;
				border-radius: 4px;
				padding-left: 10px;
				margin-top: 10px;
			}
			.el-dropdown-menu{
				width: 100%;
			}
			.dropBox{
				position: relative;
				
				span{
					display: block;
					height: 40px;
					line-height: 40px;
					border-bottom: 1px solid #E6EFFB;
					padding: 0 15px;
				}
				.border{
					border-bottom: 1px solid #EA4335;
				}
				ul{
					width: 60%;
					overflow: hidden;
					background: #fff;
					border: 1px solid #d1dbe5;
					box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.12);
					margin: 10px auto 0;

					li{
						height: 40px;
						line-height: 36px;
					}
					li:hover{
						background: #E6E6E6;
					}
				}
			}
		}
		.showSetup{
			.el-button{
				width: 100%;
				height: 45px;
				font-size: 16px;
				border-radius: 0;
				position: fixed;
				bottom: 0;
				left: 0;
				z-index: 9;
			}
		}
	}
</style>
