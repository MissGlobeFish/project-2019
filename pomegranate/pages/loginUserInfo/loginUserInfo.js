// pages/loginUserInfo/loginUserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    userInfo: {
      id: null,
      openid: wx.loginInfo ? wx.loginInfo.openid : '',
      name: null,
      phoneNum: null,
      business: null,
      company: null,
      post: null,
      sex: null,
      cityName: null,
      wxName: null,
      inviterId: null,
    },
    validCheck: 0,
    errorStatus: {
      name: false,
      business: false,
      company: false,
      post: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let datas = JSON.parse(decodeURIComponent(options.dataObj))
    this.setData({
      userInfo: datas,
      userId: datas.id,
    },()=>{
      const userInfo = this.data.userInfo
      this.setData({
        validCheck: userInfo.name && userInfo.business && userInfo.company && userInfo.post && userInfo.phoneNum
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  * 输入值变化
  *
  * @param {*} e
  */
  onGetValue(e) {
    console.log(e)
    var key = e.detail.inputname
    var newValue = e.detail.value
    const userInfo = this.data.userInfo
    this.setData({
      [`userInfo.${key}`]: newValue.length > 0 ? newValue : null,
    }, () => {
      this.setData({
        validCheck: userInfo.name && userInfo.business && userInfo.company && userInfo.post && userInfo.phoneNum
      })
    })
  },

  /**
   * 提交
   *
   */
  submit() {
    wx.showNavigationBarLoading();
    var userInfo = this.data.userInfo
    delete userInfo.lastCreateTime
    delete userInfo.lastUpdateTime
    console.log('提交参数:', userInfo)
    wx.showLoading({ title: '提交中', mask: true });
    wx.ajax.post(wx.apiPath.bindUser, userInfo)
      .then((res) => {

        var loginInfo = wx.loginInfo
        loginInfo.id = res.id
        wx.loginInfo = loginInfo
        wx.hideLoading();
        wx.hideNavigationBarLoading();

        wx.showToast({
          title: '登陆成功',
          icon: 'success',
          duration: 1500,
          mask: true,
        });
        setTimeout(() => {
          let currentPage = getCurrentPages()
          console.log(currentPage)
          if (currentPage.length > 2) {
            //导航栈多于2个则，业务进入返回特定的业务界面
            wx.navigateBack({ delta: 2 })
          }else {
            wx.switchTab({ url: '/pages/index/index' })
          }
        }, 1500);
      })
      .catch((e) => {
        console.log(e)
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.showToast({ title: e ? e : '提交失败！', icon: 'none', mask: false });
      })


  }
})