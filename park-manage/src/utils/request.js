import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (!res.code) {
      // 校验返回值格式
      Message({
        message: '后台很懒，他啥都没给你返回！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error('后台很懒，他啥都没给你返回！'))
    } else if (res.code !== 1) {
      // 操作失败的回调
      Message({
        message: '请求失败，请稍后重试！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error('请求失败，请稍后重试！'))
    } else {
      // 操作成功
      return res
    }
  },
  error => {
    if (error.response.status === 401) {
      // 登陆失效
      MessageBox.confirm('您的登陆已失效！', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return
    }

    Message({
      message: '账号密码有误！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
