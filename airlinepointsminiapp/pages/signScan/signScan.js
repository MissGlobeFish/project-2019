// pages/signScan/signScan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeResult: null,
    signResult: null,
    qrOption: null,
    errMassage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('扫码进入链接：', decodeURIComponent(options.q))
    if (options.q != undefined) {
      this.data.qrOption = decodeURIComponent(options.q)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.qrOption) {
      //扫码进入直接调用接口
      this.doSign(true)
      return
    }
    wx.showLoading({ title: '加载中' })
    this.doCodeScan()
      .then((res) => {
        this.data.codeResult = res
        this.setData({ codeResult: res }, this.doSign(false))
      })
      .catch((e) => {
        console.log("扫码失败：", e)
        wx.navigateBack()
        wx.hideLoading()
      })
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

  /**
   * 返回首页
   */
  goback() {
    wx.switchTab({ url: '/pages/my/my' })
  },


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
   * 调起扫码操作
   *
   */
  doCodeScan() {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          resolve(res.result)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },


  /**
   * 访问签到接口
   *
   */
  doSign() {
    wx.showLoading({ title: '签到中' })

    var codeSingInfo = null
    if (this.data.codeResult) {
      //小程序内扫码
      codeSingInfo = this.getQueryObject(this.data.codeResult)
    } else {
      //微信扫码
      codeSingInfo = this.getQueryObject(this.data.qrOption)
    }

    console.log(codeSingInfo)
    if (codeSingInfo == null || !codeSingInfo.eventId) {
      wx.hideLoading();
      this.setData({ signResult: false, errMassage: '无效二维码' })
      return
    }

    wx.ajax.get(wx.apiPath.courseSign, { sid: codeSingInfo.eventId })
      .then((res) => {
        wx.hideLoading();
        this.setData({
          signResult: true
        })
      })
      .catch((e) => {
        wx.hideLoading();
        console.log(e)
        this.setData({
          signResult: false,
          errMassage: e.error
        })
      })
  }



})