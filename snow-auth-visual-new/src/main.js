/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 14:23:09
 * @LastEditTime: 2019-09-17 17:21:01
 */
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routers'
import store from './store/store'
import request from '../utils/request.js'
import msg from '../utils/msg.js'
import loginEvent from './login.js';


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '@/styles/index.scss' // global css

//全局常量池
import './components/common/constant.js'
Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.prototype.$http = request;
Vue.prototype.$msg = msg;
/**
 * 创建路由
 */
const router = new VueRouter({
  routes
})


 // 判断该路由是否需要登录权限 
router.beforeEach((to, from, next) => { 
  if (to.meta.requireAuth) { 
      // login();
      //TODU 跳转登陆
  } 
  next(); 

});

// 开发环境免登录
if (global.SWITCH_CODE) {
  loginEvent()
}




//解决菜单栏重复点击相同菜单选项警告
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')