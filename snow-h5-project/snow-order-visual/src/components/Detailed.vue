<template>
	<div class="detailed">
		<div class="head">
		    <i class="goBack el-icon-arrow-left" @click="handleGoAmend"></i>
		    产品明细
		 </div>
		<!-- <p>已有产品服务有效期：<span>2017.01.13</span> -- <span>2023.09.27</span></p> -->
		<div class="box">
			<div class="title_o">
				<span>设备</span>
				<span>数量</span>
				<span>押金</span>
				<span>服务金额</span>
				<span>单价</span>
			</div>
			<ul class="ul_1" v-for="item in options.productdetail">
				<li>{{item.productName}}</li>
				<li>{{item.quantity}}</li>
				<li>{{item.deposit}}</li>
				<li>{{item.amount}}</li>
				<li><i>{{item.price}}</i> / 月</li>
			</ul>
			<h5>订购服务期限：<b>{{options.period}}</b>个月</h5>
		</div>
		<div class="box">
			<p>增补明细</p>
			<div class="title_t">
				<span>设备</span>
				<span>剩余期限</span>
				<span>增补时间</span>
				<span>增补金额</span>
			</div>
			<ul class="ul_2" v-for="pro in options.augmentProduct">
				<li>{{pro.productName}}</li>
				<li>{{pro.overPeriod}}</li>
				<li>{{pro.reduePeriod}}</li>
				<li>{{pro.reduePrice}}</li>
			</ul>
		</div>
		<div class="finally">
			<ul>
				<li>服务金额：<span>{{options.serviceAmount}}</span></li>
				<li>增补金额：<span>{{options.subAmount}}</span></li>
				<li>设备押金：<span>{{options.productDeposit}}</span></li>
				<li>总计：<span style="color:#20A0FF;">{{options.totalAmount}}</span></li>
			</ul>
			<p><span>金额单位：（元）</span>  <span>时间单位：（月）</span></p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'detailed',
		props: ["options"],
		data () {
			return {
				
			}
		},
	    created() {
			
	    },
		methods: {
	    	handleGoAmend(){
	    		this.$emit('goAmend',false);
	    	}
  		}
	}
</script>

<style lang="less">
	.detailed{
		width: 100%;
		height: 100%;
		background: #E6EFFB;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;

		.head{
		    width: 100%;
		    height: 50px;
		    color: #fff;
		    background: #20A0FF;
		    line-height: 50px;
		    text-align: center;
		    position: relative;

		    .goBack{
		        height: 100%;
		        line-height: 50px;
		        position: absolute;
		      	top: 0;
		      	left: 20px;
		    }
		}
		
		p{
			width: 100%;
			height: 35px;
			font-size: 12px;
			color: #bbb;
			background: #EEF1F6;
			line-height: 35px;
			text-align: left;
			padding-left: 14px;
		}

		.box{
			background: #fff;
			margin-bottom: 8px;

			h5{
				font-size: 12px;
				color: #666;
				font-weight: normal;
				text-align: right;
				margin-right: 8px;
				padding: 12px;
				border-top: 1px solid #E6EFFB;

				b{
					color: #20A0FF;
				}
			}
			p{
				color: #F7BA2A;
				background: #fff;
				border-bottom: 1px solid #E6EFFB;
			}
		}
		.finally{
			background: #fff;

			li{
				font-size: 12px;
				color: #666;
				line-height: 35px;
				text-align: left;
				margin-left: 16px;
			}
			p{
				text-align: right;
				padding: 0;
			}
		}

		.title_o,.ul_1{
			width: 100%;
			height: 35px;
			color: #999;
			line-height: 35px;

			span,li{
				width: 20%;
				font-size: 12px;
				float: left;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			li{
				color: #666;
			}
		}
		.title_t,.ul_2{
			width: 100%;
			height: 35px;
			color: #999;
			line-height: 35px;

			span,li{
				width: 25%;
				font-size: 12px;
				float: left;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			li{
				color: #666;
			}
		}
	}
</style>
