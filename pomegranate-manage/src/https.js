import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
import qs from 'qs'
import util from '@/libs/util'

axios.defaults.timeout = 5000;           //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
//axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    let token = localStorage.getItem('token');
    if(token && token !='undefined'){
        config.headers['token'] = token;
    }
    return config;
},(error) =>{
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.data.success){
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    if (error.response.status == 401) {
        router.push({
            name: 'login'
        })
        return Promise.reject(error);
    }
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(response => {
            resolve(response);
        }, err => {
            reject(err);
        })
        .catch((error) => {
            reject(error)
        })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: param})
            .then(response => {
                resolve(response);
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
//返回一个Promise(发送put请求)
export function fetchPut(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送delete请求)
export function fetchDelete(url, param) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {params: param})
            .then(response => {
                resolve(response);
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    fetchPost,
    fetchGet,
    fetchPut,
    fetchDelete
}