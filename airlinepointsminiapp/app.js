/*
 * @Description: app.js
 * @Author: rcq
 * @Date: 2019-10-09 10:55:07
 * @LastEditTime: 2019-10-09 10:56:53
 */
//app.js
import wxValidate from '/utils/WxValidate'
import request from './utils/request.js'
import storageData from './utils/storageData.js'
import api from './utils/api.js'
import { on, remove, emit } from './utils/eventBus.js'

const { store } = storageData;
const { apiPath } = api;

//网络
wx.ajax = request;
wx.apiPath = apiPath;
//本地存储
wx.store = store;
//全局消息订阅
wx.eventAddListener = on;
wx.eventRemoveListener = remove;
wx.eventEmit = emit;


//登陆 信息
var loginInfo = null
Object.defineProperty(wx, 'loginInfo', {
  get: function () {
    if (loginInfo) {
      return loginInfo
    }
    let storeInfo = wx.store.get("userLoginInfo")
    return storeInfo
  },
  set: function (data) {
    loginInfo = data
    wx.store.set("userLoginInfo", data)
  }
})



App({
  onLaunch: function () {
    //如果有本地信息，加载，没有调用登陆
    console.log('onLunch', wx.loginInfo)
    if (!wx.loginInfo || !wx.loginInfo.id) {
      // this.wxLogin()
    }
  },

  onGotUserInfo(e) {
    console.log(e)
  },


  /**
   * 调用微信登陆， 并保存用户 OpenId， UserId
   *
   */
  wxLogin() {
    var self = this
    wx.login({
      success(res) {
        if (res.code) {
          wx.ajax.get(wx.apiPath.login, { jscode: res.code })
            .then((res) => {
              console.log("登陆成功！")
              wx.loginInfo = res
            })
            .catch((err) => {
              self.loginFaildToast( err.status ? ("Code: " + err.status) : "" + " " + err.error)
            })
        } else {
          self.loginFaildToast(res.errMsg)
        }
      },
      fail() {
        self.loginFaildToast('微信登录调起失败！')
      }
    })
  },


  /**
   * 登陆失败尝试重新登录
   *
   * @param {*} msg
   */
  loginFaildToast(msg) {
    var self = this
    wx.showModal({
      title: '登录失败',
      content: msg,
      showCancel: false,
      confirmText: '重试',
      success(res) {
        // self.wxLogin()
      }
    })
  }
})



