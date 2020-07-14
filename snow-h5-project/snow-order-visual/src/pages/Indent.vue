<template>
	<div class="indent">
		<div class="top">
		    <i class="goBack el-icon-arrow-left" onclick="window.history.go(-1)"></i>
		    订单详情
		</div>
		<div class="box">
			<h3>订单信息</h3>
			<p>
				<i>订单号：</i>
				<span>{{detail.billNo}}</span>
			</p>
			<p>
				<i>初始账号：</i>
				<span>{{detail.loginName}}</span>
			</p>
			<p>
				<i>初始密码：</i>
				<span>{{detail.password}}</span>
			</p>
			<p>
				<i>所属销售：</i>
				<span>{{detail.salerMan}}</span>
			</p>
		</div>
		<div class="box">
			<h3>基本信息</h3>
			<p>
				<i>项目 / 门店：</i>
				<span>{{detail.proName}}</span>
			</p>
			<p>
				<i>公司名称：</i>
				<span>{{detail.cusName}}</span>
			</p>
		</div>
		<div class="box">
			<h3>地址信息</h3>
			<p>
				<i>省 / 市 / 区：</i>
				<span>{{detail.provinceName}} / {{detail.cityName}} / {{detail.areaName}}</span>
			</p>
			<p>
				<i>详细地址：</i>
				<span>{{detail.address}}</span>
			</p>
			<p>
				<i>经度：</i>
				<span>{{detail.longitude}}</span>
				<i>纬度：</i>
				<span>{{detail.latitude}}</span>
			</p>
			<p>
				<i>电话：</i>
				<span>{{detail.serTel}}</span>
			</p>
		</div>
		<div class="box">
			<h3>联系人信息</h3>
			<p>
				<i>联系人：</i>
				<span>{{detail.linker}}</span>
			</p>
			<p>
				<i>职务：</i>
				<span>{{detail.position}}</span>
			</p>
			<p>
				<i>手机：</i>
				<span>{{detail.telephone}}</span>
			</p>
		</div>	
		<div class="box">
			<h3>银行账户</h3>
			<p>
				<i>开户行名称：</i>
				<span>{{detail.openBank}}</span>
			</p>
			<p>
				<i>银行账户：</i>
				<span>{{detail.bankAcct}}</span>
			</p>
			<p>
				<i>账号名称：</i>
				<span>{{detail.acctName}}</span>
			</p>
		</div>
		<div class="product">
			<h3>选购产品</h3>
			<div class="productBox">
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
			<div class="foot">
				<strong>总计：{{allTotalAmount}}元</strong>
			</div>		
		</div>
		<div class="card">
			<h3>桌牌设置</h3>
			<p>是否已对接点餐系统</p>
			<el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="是" name="first">
					<p>商家系统：</p>
					<span>{{detail.caterSystemName}}</span>
					<p>餐饮系统ID：</p>
					<span>{{detail.caterMerchantId}}</span>
			    </el-tab-pane>
			    <el-tab-pane label="否" name="second">
			    </el-tab-pane>
			</el-tabs>
		</div>
		<div class="rest">
			<h3>其他信息</h3>
			<div class="div">
				<span class="span">是否开通支付服务</span>
				<el-radio-group v-model="radio1" :disabled="true">
				    <el-radio :label="1">是</el-radio>
	  				<el-radio :label="2">否</el-radio>
				</el-radio-group>
			</div>
			<div class="div">
				<span class="span">是否需要安装服务</span>
				<el-radio-group v-model="radio2" :disabled="true">
				    <el-radio :label="3">是</el-radio>
	  				<el-radio :label="4">否</el-radio>
				</el-radio-group>
				<div class="install" v-show="handleInstall">
					<p>预装日期：</p>
					<span>{{detail.installDate}}</span>
					<p>安装对接人：</p>
					<span>{{detail.installLinker}}</span>
					<p>对接人电话：</p>
					<span>{{detail.linkerTel}}</span>
					<p>其他环境描述：</p>
					<span id="remark1">{{detail.environmentDesc}}</span>
	  			</div>
			</div>
		</div>
		<div class="box">
			<h3>备注</h3>
			<span id="remark2">{{detail.description}}</span>
		</div>
		<div class="box" style="margin:0;">
			<h3>附件上传</h3>
			<div class="imgbox" v-for="file in files" :key="file.url">
				<img :src="file.url">
			</div>
		</div>
	</div>
</template>

<script>
import Detailed from '../components/Detailed'

export default {
	name: 'indent',
	data () {
		return {
			userId: window.localStorage.getItem("userId"),
			token: window.localStorage.getItem("token"),
			fId: this.$route.query.fId,
			cusType: this.$route.query.cusType,
			msg: '',
			activeName: 'first',
			handleInstall: false,
			showDetail: false,
			serveTotalAmount: null,
			facilityTotalAmount: null,
			allTotalAmount: null,
			showServe: false,
			showFacility: false,
			radio1: 1,
			radio2: 3,
			install: '',
			pay: '',
			textarea: '',
			detail: [],
			serveInfo: [],
			facilityInfo: [],
			options: '',
			files: [],
			period: '',
			totalAmount: ''
		}
	},
	created() {//在实例创建完成后被立即调用
		let that = this;
		let url = '/erp-api/erp/sale/order/detail/new?userId='+ this.userId +'&fId='+ this.fId +'&cusType='+ this.cusType +'&token='+ this.token +'';
		that.$http.get(url).then(function (data) {
			let info = data.body.data;
			if (info) {
				let detail = data.body.data;
				that.detail = detail;
				that.pay = detail.payServer;
				that.install = detail.installServer;
				that.files = detail.files;
				if (detail.productEntity) {
					let p = detail.productEntity;
					that.serveTotalAmount = 0;
					that.facilityTotalAmount = 0;
					for (const i in p) {
						let code = p[i].productName.slice(-2);
						if (code == "服务") {
							let t = p[i].totalAmount;
							that.serveTotalAmount += parseInt(t);
							that.serveInfo.push(p[i]);
							that.showServe = true;
						}else{
							let m = parseInt(p[i].depositeAmt);
							that.facilityTotalAmount += m;
							that.facilityInfo.push(p[i]);
							that.showFacility = true;
						}
					}
					that.allTotalAmount = that.serveTotalAmount + that.facilityTotalAmount;
				}
				if (that.pay == '1') {
					that.radio1 = 1;
				}else{
					that.radio1 = 2;
				};
				if (that.install == '1') {
					that.radio2 = 3;
				}else{
					that.radio2 = 4;
				};
				if (that.radio2 == 3) {
					that.handleInstall = true;
				}else{
					that.handleInstall = false;
				};
			}else{
				if (data.body.msg == null) {
					that.$message('数据格式错误！');
					window.history.go(-1);
				}else{
					that.$message(data.body.msg);
				}
			};
		},
		function (error) {
			that.$message('请求超时！');
		})
    },
    methods: {
		handleClick(tab, event) {//tab切换
	        
	    },
    }
}
</script>

<style lang="less">
	.indent{
		width: 100%;
		overflow: hidden;
		background: #E6EFFB;
		padding: 50px 0 0;

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
		}

		.box,.product,.card,.rest{
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
		.box,.rest{
			p{
				width: 100%;
				line-height: 40px;

				i{
					text-align: left;
					margin-left: 10px;
					display: block;
				}
				span{
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					text-align: left;
					border-bottom: 1px solid #E6EFFB;
					display: block;
					padding: 0 10px;
				}
			}
			#remark1,#remark2{
				width: 100%;
				background: #EEF1F6;
				border:1px solid #D1DBE5;
				border-radius: 10px;
				text-align: left;
				display: block;
				overflow: hidden;
				margin-top: 10px;
				padding: 10px;
				box-sizing: border-box;
			}
			.imgbox{
				width: 40%;
				height: 150px;
				float: left;
				margin: 10px 0 0 6%;

				img{
					width: 100%;
					height: 100%;
				}
			}
		}
		.product{
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
		}
		.card{
			p{
				text-align: left;
				padding: 10px;
			}
			.el-tabs__nav{
				width: 100%;

				.el-tabs__item{
					width: 50%;
					padding: 0;
				}
				.is-active{
					border-bottom-color: #F9FAFC !important;
				}
			}
			.el-tab-pane{
				p,span{
					display: block;
					text-align: left;
					padding: 10px;
				}
				span{
					border-bottom: 1px solid #E6EFFB;
				}
			}
		}
		.rest{
			.div{
				text-align: left;
				margin-top: 10px;

				.el-radio{
					margin:10px 30px 10px 50px;
				}
			}
		}
	}
</style>
