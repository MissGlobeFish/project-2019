/*
 * @Description: request请求
 * @Author: rcq
 * @Date: 2019-09-06 15:29:49
 * @LastEditTime: 2019-09-19 15:13:40
 */
import axios from 'axios'
import $qs from 'qs'
import { MessageBox, Message,Loading } from 'element-ui'


var service=axios.create({
  // baseURL:process.env.VUE_APP_BASEURL,
  // baseURL: "http://ep.wangxiaobao.com",
  timeout:5000
})

// request interceptor 请求拦截
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    let userVer =localStorage.getItem("userVer");
    if(userVer && userVer !='undefined' ){
      config.headers['Authorization']=JSON.parse(userVer).token
    }
    if(!(config.url.indexOf('login') > 0)){
      //当localstorage中用户信息丢失时候，重新登录
      if(!userVer || userVer == 'undefined'){
        MessageBox.confirm('您的账户登录已过期，请重新登录，点击确定回到登录界面', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
        })
      }
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

  //添加响应拦截器
  service.interceptors.response.use(
  response => {
    //处理接口成功与否
    if (response.data.flag) {
      //不同的接口返回值格式不同，暂时手动作区分
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.datas) {
        return response.data.datas
      } else {
        return response.data
      }
    }else {
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    console.log(error) // for debug
    if (error.response.status == 203) {
      // 登陆失效
      MessageBox.confirm('您的账户登录已过期，请重新登录，点击确定回到登录界面', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
      })
      return
    }
    Message({
      message: error.response.data.message ||  "操作失败",
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(Error(error.response.data))
  }
)


// axios请求
export default {

  get(url,params={}){
    return new Promise((resolve,reject) => {
      service.get(url,{
        params:params
      })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  post(url,data={},contentType='application/json'){
    return new Promise((resolve,reject) => {
      if (contentType == 'application/x-www-form-urlencoded') {
        data = $qs.stringify(data)
      }
      service.post(url,data)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  delete(url,params={}){
    return new Promise((resolve,reject) => {
      service.delete(url,{
        params: params
      })
        .then(response => {
          resolve(response);
        })
        .catch(err=>{
          reject(err)
        })
    })
  },

  put(url,data={},contentType){
    return new Promise((resolve,reject) => {
      if (contentType == 'application/x-www-form-urlencoded') {
        data = $qs.stringify(data)
      }
      service.put(url,data)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}



