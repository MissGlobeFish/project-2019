/*
 * @Description: request 网络请求
 * @Author: rcq
 * @Date: 2019-09-05 19:45:07
 * @LastEditTime: 2019-10-15 16:28:25
 */

import api from 'api.js'


function debugLog(...values) {
  if (false) {
    console.log(...values)
  }
}


/**
 * ajax 请求
 * @parma url {String} 请求服务地址
 * @parma subUrl {String} path参数
 */
const request = (url, options, subUrl) => {
  if (subUrl) {
    url = `${api.host}${url}/${subUrl}`
  } else {
    url = `${api.host}${url}`
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'uid':  wx.loginInfo ? wx.loginInfo.openid : ''
      },
      success(response) {
        if (response.statusCode == 200) {
          debugLog("[ Request ]" + options.method  + " ----- " + url + " ---> " + " Success ", response )
          if (response.data.code && response.data.code == 1) {
            resolve (response.data.data)
            return;
          } else if (response.data.code && response.data.code != 1) {
            reject({ error: response.data.msg, status: response.data.code })
            return
          } else {
            reject({ error: "返回值格式校验失败", status: null })
          }
        } else {
          debugLog("[ Request ]" + options.method  + " ----- " + url + " ---> " + " Failed ", response )
          reject({ error: "数据加载失败", status: response.statusCode })
        }
      },
      fail(error) {
        debugLog("[ Request ]" + options.method  + " ----- " + url + " ---> " + " Failed ", error )
        reject({ error: "数据加载失败！", status: null })
      }
    })
  })
}



const methods = ['GET','POST','PUT','DELETE'];


/**
 *  GET 请求
 * @parma url {String} 请求服务地址
 * @options 参数
 */
const get = (url, options = {}, subUrl) => {
  return request(url, { method: 'GET', data: options }, subUrl)
}

/**
 *  POST 请求
 * @parma url {String} 请求服务地址
 * @options 参数
 */
const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}

/**
 *  PUT 请求
 * @parma url {String} 请求服务地址
 * @options 参数
 */
const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}

/**
 *  DELETE 请求
 * @parma url {String} 请求服务地址
 * @options 参数
 * 不能声明DELETE（关键字）
 */
const remove = (url, options) => {
  return request(url, { method: 'DELETE', data: options })
}

module.exports = {
  get,
  post,
  put,
  remove
}