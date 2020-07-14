/**
 * ajax -axios单独封装
 * @param {String} url 请求的http地址
 * @param {Object} params 需要向后台传输参数
 * @param {Object} option 请求超时 
 */
import Vue from "vue"
import axios from 'axios';
import VueResource from 'vue-resource'
const  option = {timeout: 30 * 1000} //30秒过期
function getAjax(url,params) {
  return Vue.http.get(url,{params:params},option).then((res)=>{
    console.log(res,'res')
    if (res.body.code != 1) {
      res.body.msg ? this._log_warn(res.body.msg) : this._log_warn('请求失败')
      return
    } 
    console.log(res,123123)
    return res.body
  }).catch((error)=>{
    if (error.msg) {
      this._log_err(error.msg)
    } else {
      this._log_err('请求失败')
    }
    return error
  })
}
function postAjax(url,params) {
  return Vue.http.post(url,params,option).then((res)=>{
    console.log(res)
    if (res.body.code != 1) {
      res.body.msg ? this._log_warn('操作失败') : this._log_warn('请求失败') 
      return
    }
    return res.body
  }).catch((error)=>{
    if (error.msg) {
      this._log_err(error.msg)
    } else {
      this._log_err('请求失败')
    }
    return error
  })
}

function deleteAjax(url,params) {
  return Vue.http.delete(url,{params:params},option).then((res)=>{
    if (res.body.code != 1) {
      res.body.msg ? this._log_warn(res.body.msg) : this._log_warn('请求失败') 
      return
    }
    return res.body
  }).catch((error)=>{
    if (error.msg) {
      this._log_err(error.msg)
    } else {
      this._log_err('请求失败')
    }
    return error
  })
}

function putAjax(url,params) {
  return Vue.http.put(url,params,option).then((res)=>{
    if (res.body.code != 1) {
      res.body.msg ? this._log_warn(res.body.msg) : this._log_warn('请求失败') 
      return
    }
    return res.body
  }).catch((error)=>{
    if (error.msg) {
      this._log_err(error.msg)
    } else {
      this._log_err('请求失败')
    }
    return error
  })
}
export {getAjax,postAjax,deleteAjax,putAjax};
