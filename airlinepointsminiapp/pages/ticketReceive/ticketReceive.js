// pages/ticketReceive/ticketReceive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileBaseUrl: wx.apiPath.fileBaseUrl,
    senderId: '',
    ticketId: '',
    ticketInfo: {
      ticketName: '----',
      fileUrl: '',
      ticketType: '',
      ticketPrice: ''
    },
    isViable: true,
    isSucces: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let datas = JSON.parse(options.)
    console.log(options)
    // var ticketInfoJSON =  `{"ticketId":"577953580137316352","ticketMId":"577903548017147904","ticketNo":"577953580137316353","ticketName":"50优惠券","productId":"577903548004564993","ticketUsedId":null,"ticketType":"D2","ticketPrice":50,"fileUrl":"/static/image/002d888100f2715a3f9210265445baf.png","ticketTypeName":"优惠券"}`
    this.setData({
      senderId: options.senderId,
      ticketId: options.ticketId,
      ticketInfo: JSON.parse(options.ticketInfo)
    })
    // console.log(JSON.parse(options.ticketInfo))
    this.loadTicketInfo()
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
   * 点击领取
   */
  submitBtnDidTapped() {
    console.log("点击领取")

    wx.showLoading({ title: "领取中", mask: true });
    wx.showNavigationBarLoading();
    this.myModal = this.selectComponent('#myModal');

    wx.ajax.get(wx.apiPath.receiveTicket, { sid: this.data.senderId, tid: this.data.ticketId})
      .then((res) => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        this.setData({isSucces: true},()=>{
          this.myModal.showDialogBtn()
        })
      })
      .catch((e) => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        this.setData({isSucces: false},()=>{
          this.myModal.showDialogBtn()
        })
        // wx.showToast({ icon: 'none', title: e.error ? e.error : '领取失败' })
      })
  },

  /**
   *  点击我知道了
   */
  handleModeConfirm() {
    wx.switchTab({ url: '/pages/my/my' })
  },

  /**
   * 回到首页
   *
   */
  backBtnDidTapped() {
    wx.switchTab({ url: '/pages/index/index' })
  },


  /**
   * 获取卡券信息
   *
   */
  loadTicketInfo() {
    console.log({ sid: this.data.senderId, tid: this.data.ticketId})
    wx.ajax.get(wx.apiPath.ticketCheck, { sid: this.data.senderId, tid: this.data.ticketId})
    .then((res)=> {
      console.log(res)
      this.setData({
        isViable: res
      })
    }).catch((e)=>{
      this.showError('卡券验证有误')
      this.setData({
        isViable: false
      })
    })
  },

  showError(msg) {
    wx.showToast({
      title: msg ? msg : '未知错误',
      image: '/images/icon/toast_error.png',
    })
  }

})