// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
Vue.use(ElementUI);
Vue.use(VueResource);

import Navigation from 'vue-navigation'
Vue.use(Navigation, {router})


//引入全局常量
import './constant.js';
import eventBus from "./utils/eventBus.js"
Vue.prototype.eventBus = eventBus;
//引入原生支持方法
//使用 this.gsNative + 方法名调用:
import {GSNative} from './utils/nativeVerify.js'
Vue.prototype.gsNative = GSNative;

//通用页面方法
import message from './utils/messageBox.js'
Vue.use(message);
//常用参数
import constOption from './utils/const.js'
Vue.use(constOption)

//加载自定义组件
import components from './components/UIComponents/ComponentsLoader.js'
Vue.use(components);
// 引入vue-amap
// import VueAMap from 'vue-amap';
// import { lazyAMapApiLoaderInstance } from 'vue-amap';
// Vue.use(VueAMap);

// // 初始化vue-amap
// VueAMap.initAMapApiLoader({
//   // 申请的高德key
//   key: '8fb9904b5e4395a431dab1202e084043',
//   // 插件集合
//   plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'Geocoder'],
//   uiVersion: '1.0' // 版本号
// });

// lazyAMapApiLoaderInstance.load().then(() => {
//   // your code ...
//   this.map = new AMap.Map('amapContainer', {
//     center: new AMap.LngLat(121.59996, 31.197646)
//   });
// });



Vue.http.options.emulateJSON = true
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
