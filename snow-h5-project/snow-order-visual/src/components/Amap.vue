<template>
	<div id="amap">
		<div class="top">
		    <i class="goBack el-icon-arrow-left" @click="handlegoBack"></i>
		    选择地址
		    <span id="set_up" @click="handleClick" ref="set_up">确定</span>
		</div>
    	<div class="amap-page-container">
    		<el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
	      	<el-amap vid="amapDemo" :plugin="plugin" class="amap-demo" :center="mapCenter" :zoom="12" :events="events">
	      		<el-amap-marker v-for="marker in markers" :key="marker.lng" :position="marker" :event="handleEvent"></el-amap-marker>
	      	</el-amap>
    	</div>
  	</div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';

export default {
	name: 'amap',
	data () {
		let self = this;
		return {
			markers: [],
			address: '',
			provinceName: '',
			cityName: '',
			areaName: '',
			searchOption: {
	            city: '全国',
	            citylimit: false
          	},
          	mapCenter: [104.06, 30.67],
			events: {
				click(e) {//点击地图添加标签并获取地址信息
					let { lng, lat } = e.lnglat;
					self.mapCenter = [lng, lat];
					self.markers = [];
					self.markers.push([lng, lat]);
					// 这里通过高德 SDK 完成。
					var geocoder = new AMap.Geocoder({
						radius: 1000,
						extensions: "all"
					});        
					geocoder.getAddress([lng ,lat], function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							if (result && result.regeocode) {
								let info = result.regeocode.addressComponent;
								self.address = result.regeocode.formattedAddress;
								self.provinceName = info.province;
								if (info.city) {
									self.cityName = info.city;
								}else{
									self.cityName = info.province;
								};
								self.areaName = info.district;
								self.$nextTick();
								const h = self.$createElement;
						        self.$notify({
						          	title: '经纬度:'+ self.mapCenter ,
						         	message: '地址:'+ self.address ,
						          	duration: 2000
						        });
							}
						}
					});
				}
			},
			plugin: [{
	            pName: 'ToolBar',
	            position: 'LB',
	            locate: true,
	            noIpLocate: true,
	            ruler: true,
	            autoPosition: true,
	            useNative:true,
	            liteStyle:true,
	            events: {
	              	init(instance) {
	              	}
	            }
          	}]
		}
	},
	mounted() {
		const loadPromise = lazyAMapApiLoaderInstance.load()
		loadPromise.then(() => {
			this.map = new AMap.Map('amap-demo1', {
				center: [104.06, 30.67],
				zoom: 12
			})
			AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
				const marker = new SimpleMarker({
					iconLabel: 'A',
					iconStyle: 'red',
					map: this.map,
					position: this.map.getCenter()
				});
			});
		})
	},
	created(){
		
	},
    methods: { 
    	handlegoBack(){//退回商品页面
    		this.$emit('goSetup',false);
    	},
    	handleClick(){//确定
    		if (this.mapCenter[0] === 104.06 && this.mapCenter[1] === 30.67) {
    			this.$message('请点击选择您的地理位置！');
    		}else{
    			this.$emit('goSetup',false,this.mapCenter,this.address,this.provinceName,this.cityName,this.areaName);
    		};
    	},
	    handleIconClick(ev) {//点击搜索
	      	let address = this.$refs.address.value;
	    },
	    addMarker() {
          	let lng = 104.06 + Math.round(Math.random() * 1000) / 10000;
          	let lat = 30.67 + Math.round(Math.random() * 500) / 10000;
          	this.markers.push([lng, lat]);
        },
        onSearchResult(pois) {//搜索地址信息
			let latSum = 0;
			let lngSum = 0;
			if (pois.length > 0) {
				pois.forEach(poi => {
					let {lng, lat} = poi;
					lngSum += lng;
					latSum += lat;
					this.markers.push([poi.lng, poi.lat]);
				});
				let center = {
					lng: lngSum / pois.length,
					lat: latSum / pois.length
				};
				this.mapCenter = [center.lng, center.lat];
			}
        },
        handleEvent(){

        }
	}
}
</script>

<style lang="less">
	#amap{
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999; 

		.top{
		    width: 100%;
		    height: 50px;
		    color: #fff;
		    background: #20A0FF;
		    line-height: 50px;

		    #set_up{
		      float: right;
		      margin-right: 20px;
		    }
		}
		.amap-demo {
	      	height: 100%;
	      	width: 100%;
	    }

	    .search-box {
	    	width: 90%;
	    	color: #666;
	    	font-size: 14px;
	      	position: absolute;
	      	top: 60px;
	      	left: 20px;
	    }

	    .amap-page-container {
	    	width: 100%;
	    	height: 100%;
	      	position: relative;

	      	.toolbar{
	      		width: 100%;
	      		background: #fff;
	      		position: fixed;
	      		bottom: 20px;
	      		left: 0;
	      	}
	      	.prompt {
		      	background: white;
		      	width: 100px;
		      	height: 30px;
		      	text-align: center;
		    }
	    }
	}
</style>
