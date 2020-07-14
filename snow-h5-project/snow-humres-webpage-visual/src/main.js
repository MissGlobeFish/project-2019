import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
//全局常量池
import './components/common/constant.js'

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
