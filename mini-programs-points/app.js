/*
 * @Description: app.js
 * @Author: rcq
 * @Date: 2019-10-15 15:10:16
 * @LastEditTime: 2019-10-15 16:40:04
 */

// import request from '/utils/request.js'
import ajax from '/utils/ajax.js'
import storageData from './utils/storageData.js'
import api from './utils/api.js'

const { store } = storageData;
const { apiPath } = api;
//网络
// wx.ajax = request;
wx.ajax = ajax;
wx.apiPath = apiPath;
//本地存储
wx.store = store;

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})