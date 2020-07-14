// pages/loginPage/loginPage.js
import WxValidate from '../../utils/WxValidate';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    phoneNumber: '',
    time: 60,
    verifyCode: '',
    hasVerify: false,
    sendCodeObj: {
      text: '发送验证码',
      disabled: false
    },
    errorStaut: null,
    //邀请者 ID
    inviterId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //如果已注册用户进入该页面直接返回首页
    setTimeout(() => {
      this.checkUserInfo()
    }, 1500);
    


    if (options.eventId && options.eventId.length > 1) {
      //分享链接点击进入
      this.data.inviterId = options.eventId
    } else if (options.q != undefined) {
      //扫码进入
      var qrObject = this.getQueryObject(decodeURIComponent(options.q))
      this.data.inviterId = qrObject.eventId
    }
    

    const rules = {
      tel: { required: true, tel: true }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkAuthor()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  checkUserInfo() {
    var isLogin = wx.loginInfo && wx.loginInfo.id
    console.log('新用户检测',isLogin)
    if (isLogin) {
      wx.reLaunch({url: '/pages/index/index'})
      wx.showToast({ icon: 'none', title: '已注册用户无需邀请~',duration: 2000,})
      return;
    }
  },
  

  //解析参数
  getQueryObject(url) {
    url = url == null ? '' : url;
    var search = url.substring(url.lastIndexOf("?") + 1);
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, function (rs, $1, $2) {
      var name = decodeURIComponent($1);
      var val = decodeURIComponent($2);
      val = String(val);
      obj[name] = val;
      return rs;
    });
    return obj;
  },


  /**
   * 输入手机号
   *
   * @param {*} e
   */
  onGetValue(e) {
    this.setData({
      phoneNumber: e.detail.value,
      validCheck: e.detail.value.length == 11
    })
  },


  /**
   * 检查权限
   *
   */
  checkAuthor() {
    // 查看是否授权
    var self = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              self.setData({
                userInfo: res.userInfo
              })
            },
            fail() {
              wx.showToast({ title: '微信登陆失败', icon: 'none' });
            }
          })
        }
      }
    })
  },

  /**
   * 点击授权
   *
   * @param {*} e
   */
  bindGetUserInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo
    })
  },



  //Networks

  /**
   * 提交电话信息，通过电话查找用户信息
   *
   */
  submit() {
    wx.ajax.get(wx.apiPath.checkVerifyCode, { phone: this.data.phoneNumber, code: this.data.verifyCode})
      .then(res=>{
        console.log(res)
        if (res) {
          this.setData({time: 0})
          this.checkPhone()
        } else {
          wx.showToast({ icon: 'none', title: '抱歉~验证失败', duration: 2000, })
        }
      })
      .catch(error=> {
        console.log(error)
      })

    return;




  },

  // 根据电话号码校验用户信息
  checkPhone() {
    const { inviterId, userInfo } = this.data
    var phoneNum = this.data.phoneNumber


    wx.showNavigationBarLoading();
    wx.showLoading({ title: '提交中', mask: true });

    wx.ajax.get(wx.apiPath.checkPhoneNum, {}, phoneNum)
      .then((res) => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        console.log(JSON.stringify(res))
        //更新电话
        res.phoneNum = phoneNum
        //更新邀请者 ID
        res.inviterId = inviterId
        //更新微信信息
        res.wxName = userInfo.nickName
        res.sex = userInfo.gender
        res.cityName = userInfo.city
        let value = encodeURIComponent(JSON.stringify(res))
        wx.navigateTo({ 
          url: `/pages/loginUserInfo/loginUserInfo?dataObj=${value}`});
      })
      .catch((e) => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.showToast({ title: e.error ? e.error : '查询失败！', icon: 'none', mask: false });
      })
  },

  // 获取手机号
  onGetPhone(e) {
    let phone = e.detail.value;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({ icon: 'none', title: '手机号码有误，请重填~', duration: 2000, })
      return false;
    } 
    wx.ajax.get(wx.apiPath.verifyCode, {phone: phone} )
      .then(res=>{
        console.log(res)
        wx.showToast({ icon: 'none', title: '验证码已发送~', duration: 2000})
        this.countdown()
      }).catch(error=>{
        wx.showToast({ icon: 'none', title: error.msg || '验证码发送失败～', duration: 2000 })
      })
  },

  //  获取验证码
  onGetVerifyCode (e) {
    let verifyCode  = e.detail.value;
    if (verifyCode ) {
      this.setData({ hasVerify: true, verifyCode : verifyCode })
    }
  },

  //倒计时
  countdown() {
    let text = 'sendCodeObj.text'
    let disabled = 'sendCodeObj.disabled'
    this.setData({
      [disabled]: true
    })
    let timer = setInterval(() => {
      this.data.time--;
      // console.log(123123)
      this.setData({
        [text]: `${this.data.time}秒重新获取`
      })
      if (this.data.time <= 0) {
        clearInterval(timer)
        this.setData({
          [text]: `发送验证码`,
          [disabled]: false
        })
      }
    }, 1000)
  }



})