// pages/pointsHistory.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    points: '--',
    pointsHistoryData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.startPullDownRefresh()
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
    this.loadPointsData()
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
   * 研值信息加载
   *
   */
  loadPointsData() {
    wx.showNavigationBarLoading()

    var showError = function () {
      wx.showToast({
        title: '加载失败',
        image: '/images/icon/toast_error.png',
      })
    }

    var loadAmt = wx.ajax.get(wx.apiPath.pointsAmount, {})
      .then((res) => {
        this.setData({ points: res.score })
      })
      .catch((e) => {
        showError()
      })

    var loadHis = wx.ajax.get(wx.apiPath.pointsHistory, {pageNum: 1, pageSize: 500})
      .then((res) => {
        this.setData({ pointsHistoryData: res.list })
      })
      .catch((e) => {
        showError()
      })

    Promise.all([loadAmt, loadHis]).then(function (res) {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }).catch((e) => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })

  }






})