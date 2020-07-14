import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource'
import axios from 'axios';
import store from 'store/store';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import ElementUI, { Header } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import './assets/font/iconfont.css';    // 默认主题
import './assets/font/iconfont.js';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
//全局常量池
import './components/common/constant.js';
import './components/common/js/globalObj.js';
import {getAjax,postAjax,deleteAjax,putAjax} from  './components/common/js/ajax.js';
import {_log_err,_log_info,_log_warn,_log_success} from './components/common/js/alert.js';

import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(VueQuillEditor);

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.prototype.$axios = axios;
Vue.prototype.getAjax = getAjax;
Vue.prototype.postAjax = postAjax;
Vue.prototype.deleteAjax = deleteAjax;
Vue.prototype.putAjax = putAjax;

Vue.prototype._log_err = _log_err;
Vue.prototype._log_info = _log_info;
Vue.prototype._log_warn = _log_warn;
Vue.prototype._log_success = _log_success;
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

// Vue.http.interceptors.push((request, next) => {

//     let userVer =localStorage.getItem("userVer");
//     if(userVer && userVer !='undefined' ){
//         request.headers.set('Authorization',JSON.parse(userVer).token)
//     }

//     if(request.url.indexOf('login') > 0){
//       return;
//     }

//     //当localstorage中用户信息丢失时候，重新登录
//     if(userVer == 'undefined' || userVer == null){
//       Vue.prototype.$alert('您的账户登录已过期，请重新登录，点击确定回到登录界面', '提示', {
//         confirmButtonText: '确定',
//         callback: action => {
//           window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
//         }
//       });
//       // App.methods.open(App);
//       return;
//     }

// 　  next((response) => {
//   // console.log(response.status);
//     //当第三方校验不通过的时候，重新登录，203在snow中代表用户权限校验失败
//     if(response.status == 203){
//       Vue.prototype.$alert('您的账户登录已过期，请重新登录，点击确定回到登录界面', '提示', {
//         confirmButtonText: '确定',
//         callback: action => {
//           window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
//         }
//       });
//       return response;
//     }
//       // console.log(global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE);

// 　　
//     });
// });
console.log(global,'global.SWITCH_CODE ')
if (global.SWITCH_CODE == 'true') {
  let data = {
    userName: 'yanglin',
    password: '888888',
    systemCode: global.SYS_CODE
  };
  $.ajax({
      type: "POST",
      async: false,
      url: global.AUTH_URL +"/auth/sso/login",
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
      success: function(data){
        console.log(data,'data')
         window.localStorage.setItem('userVer', JSON.stringify(data.data));
          //获取员工信息
          $.ajax({
              type:"GET",
              async:false,
              url : global.AUTH_URL +"/auth/userInfo/findUserInfo/"+ JSON.parse(window.localStorage.getItem('userVer')).userName,
              success: function(data){
                  localStorage.setItem('ms_empCode',data.userInfo.empCode);
                  localStorage.setItem('ms_deptCode',data.userInfo.deptCode);
                  console.log(localStorage.getItem('ms_empCode'));
                  Vue.http.headers.common['uid'] =  localStorage.getItem('ms_empCode');
              }
          })
      },
      error: function(error){
      }
  });

}
else{
  Vue.http.interceptors.push((request, next) => {
      let userVer =localStorage.getItem("userVer");
      if(userVer && userVer !='undefined' ){
          request.headers.set('Authorization',JSON.parse(userVer).token)
          request.headers.set('uid',localStorage.getItem('ms_empCode'))
      }

      if(request.url.indexOf('login') > 0){
        return;
      }

      //当localstorage中用户信息丢失时候，重新登录
      if(userVer == 'undefined' || userVer == null){
        Vue.prototype.$alert('您的账户登录已过期，请重新登录，点击确定回到登录界面', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
          }
        });
        // App.methods.open(App);
        return;
      }

  　  next((response) => {

    // console.log(response.status);
      //当第三方校验不通过的时候，重新登录，203在snow中代表用户权限校验失败
      if(response.status == 203){
        Vue.prototype.$alert('您的账户登录已过期，请重新登录，点击确定回到登录界面', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
          }
        });
        return response;
      }
        // console.log(global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE);

  　　
      });
  });
}
