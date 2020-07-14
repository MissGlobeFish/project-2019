<template>
	<div class="detail">
		<div class="top">
		    餐饮订单
		    <span id="set_up" @click="handleClick" ref="set_up">创建</span>
	  	</div>
		<div class="search">
			<el-input id="input2" placeholder="项目名称 / 公司名称" icon="search" @input="handleSearch" v-model="company" :on-icon-click="handleIconClick">
			</el-input>
		</div>
		<div class="contSingleList">
	        <div class="tabItem">
	            <slot></slot>
	        </div>
	        <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
	            <ul class="listItem" style="background:#E6EFFB;">
					<li style="background:#fff;margin-bottom:8px;padding: 10px;" v-for="(item, index) in listdata">
						<div class="title">
							<span>{{item.proName}}</span>
							<i>订单号：{{item.billNo}}</i>
							<b v-if="item.status === 'A'"></b>
							<b v-if="item.status === 'B'">待审核</b>
							<b v-if="item.status === 'C'">已审核</b>
							<b v-if="item.status === 'D'">被驳回</b>
							<b v-if="item.status === 'Z'">暂存</b>
						</div>
						<ul class="product">
							<li v-for="(product, index) in item.productList">
								<span>{{product.productName}}</span>
								<i v-if="product.productName.slice(-2) === '服务'">{{product.period}}个月</i>
								<i v-if="product.productName.slice(-2) !== '服务'">{{product.qty}}</i>
							</li>
						</ul>
						<div class="state">
							<span v-if="item.payStatus === '0'">待付款</span>
							<span v-if="item.payStatus === '1'" style="color:#FF8547;">已付款</span>
							<span v-if="item.payStatus === '2'" style="color:#FF8547;">已生效</span>
							<i @click="handleDetail($event,index)" v-if="item.status === 'B' || item.status === 'C'">详情</i>
							<i @click="handleDetail($event,index)" v-if="item.status === 'D' || item.status === 'A'">提交订单</i>
						</div>
					</li>
				</ul>
			</v-scroll>
	    </div>
	</div>
</template>
<script>
import Refresh from '../components/Refresh' 

	export default {
		name: 'detail',
		data () {
			return {
				userId : '',
                token : '',
                access :'',
                jsTicket: '',
                cusType : '餐饮',
                company: '',
				fId: '',
                keyWord: '',
				idx: '',
				params : {
					token: window.localStorage.getItem("token"),
					userId: window.localStorage.getItem("userId"),
					cusType: '餐饮',
					keyWord: '',
					pageNo: 1
				},
				option : {
					timeout: 30 * 1000 //30秒过期
				},
                counter : 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
				num : 15, // 一次显示多少条
				pageStart : 0, // 开始页数
				pageEnd : 0, // 结束页数
				listdata: [], // 下拉更新的数据存放数组
				downdata: []  // 上拉更多的数据存放数组
            }
		},
		components: {
            'v-scroll': Refresh
        }, 
	    created(){//在实例创建完成后被立即调用
	    	this.handleLogin();
	    },
        mounted: function() {
            this.getList();//初始化加载订单列表
        },
	    methods: { 
	    	handleLogin(){//调用登录接口，获取userId和token
	    		let that = this;
				let url = '/erp-api/erp/user/login';
				let params = {
					uid: 'WangCaiBaoApi',
	  				pwd: 'wcb1234'
				};
				that.$http.post(url, params).then(function (data) {
					let info = data.body.data;
					if (info) {
						window.localStorage.setItem("token",data.body.token);
					}else{
						that.$message(data.body.msg);
					};
				},
				function (error) {
					this.$message('请登录！');
				})
	    	},
			getList() {//加载订单列表
                let that = this;
				let url = '/erp-api/erp/sale/order/list';
				that.params.keyWord = that.company;
				that.params.pageNo = 1;
				that.$http.post(url, that.params, that.option).then(function (data) {
					let info = data.body.data;
					if (info) {
						that.listdata = info.content;
					}else{
						that.$message(data.body.msg);
					};
				},
				function (error) {
					that.$message('请求超时！');
				})
            },
			onRefresh(done) {//下拉刷新
                this.getList();
                done(); // call done
            },
			onInfinite(done) {//上拉加载更多 
				let vm = this; 
				let url = '/erp-api/erp/sale/order/list';
				vm.params.keyWord = vm.company;
				vm.params.pageNo++;
				vm.$http.post(url, vm.params, vm.option).then(function (data) {
					let info = data.body.data;
					if (info) {
						let order = info.content;  
						if (vm.params.pageNo > info.lastPageNo) {
							this.$message('没有更多内容了哦!');
							vm.$el.querySelector('.load-more').style.display = 'none';
						}else{
							for(var i = 0; i < order.length; i++){
								vm.listdata.push(order[i]); 
							}	
						}
						done() // call done
					}else{
						that.$message(data.body.msg);
					};
				},
				function (error) {
					this.$message('请求超时！');
				})
           	},
	    	handleClick() {//把userId和token通过路径传到创建订单页面
                this.$router.push({path:'/setup'});
            },
	    	handleSearch(){//搜索
				let that = this;
				let url = '/erp-api/erp/sale/order/list';
				that.params.keyWord = that.company;
				that.$http.post(url, that.params, that.option).then(function (data) {
					let info = data.body.data;
					if (info) {
						that.listdata = info.content;
					}else{
						that.$message(data.body.msg);
					};
				},
				function (error) {
					this.$message('请求超时！');
				})
			},
		    handleIconClick(ev) {//点击搜索
				let that = this;
				let url = '/erp-api/erp/sale/order/list';
				that.params.keyWord = that.company;
				that.$http.post(url, that.params, that.option).then(function (data) {
					let info = data.body.data;
					if (info) {
						that.listdata = info.content;
					}else{
						that.$message(data.body.msg);
					};
				},
				function (error) {
					this.$message('请求超时！');
				})
		    },
	    	handleDetail(event,index){//判断订单状态，进行不同页面跳转
	    		if (event.currentTarget.innerText === '详情') {
	    			let fId = this.listdata[index].fId;
	    			this.$router.push({path:'/indent',query: { fId:fId, cusType:this.cusType }});
	    		}else if(event.currentTarget.innerText === '提交订单'){
	    			let fId = this.listdata[index].fId;
	    			this.$router.push({path:'/amend',query: { fId:fId, cusType:this.cusType }});
	    		};
	    	}
        }
	}
</script>

<style lang="less">
	.detail{
		width: 100%;
		overflow: hidden;
		padding-top: 106px;

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
		    z-index: 999;

		    #set_up{
		    	position: absolute;
		    	top: 0;
		    	right: 20px;
		    }
		 }

		.search{
			width: 100%;
			background: #20A0FF;
			position: fixed;
			top: 50px;
			left: 0;
			z-index: 999;

			#input2{
				width: 90%;
				padding: 10px 0;
			}
		}

		ul{
			.title{
				width: 100%;
				height: 40px;
				border-bottom: 1px solid #E6EFFB;

				span,i{
					height: 100%;
					line-height: 40px;
					text-align: left;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: inline-block;
				}
				span{
					width: 50%;
					font-size: 16px;
				}
				i{
					width: 35%;
					font-size: 12px;
					color: #aaa;
				}
				b{
					width: 13%;
					height: 100%;
					line-height: 40px;
					font-size: 12px;
					color: #FF6600;
					float: right;
					display: inline-block;
				}
			}
			.product{
				width: 100%;
				text-align: left;
				padding: 10px 0;
				
				li{
					padding: 0 10px;
					
					span,i{
						font-size: 14px;
						line-height: 40px;
					}
					i{
						float: right;
					}
				}
			}
			.state{
				height: 40px;
				text-align: left;
				border-top: 1px solid #E6EFFB;
				padding: 0 10px;

				span{
					opacity: 0;
					font-size: 12px;
					color: #0093E2;
					line-height: 40px;
				}
				i{	
					width: 60px;
					height: 24px;
					color: #fff;
					background: #20A0FF;
					font-size: 12px;
					text-align: center;
					line-height: 24px;
					border-radius: 5px;
					float: right;
					margin-top: 12px;
				}
			}
		}
	}
</style>
