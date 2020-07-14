// pages/rights/rights.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelName: "研学会员",
    memberDate: '0000-00-00',
    rightDetailes: [
      // {name: '《商业奇议》', info: "全年免费报名"},
      // {name: '《每日阅读》', info: "全年免费报名"},
      // {name: '《每日阅读》', info: "优先报名，门票5折优惠"},
      // {name: '研习院所组织的其它公益类活动的参与资格', info: '有'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let datas = JSON.parse(options.dataObj)
    console.log(datas)
    this.setData({
      levelName: datas.cardTypeName,
      memberDate: datas.expireDate,
      rightDetailes: JSON.parse(datas.cardAuthorityDesc)
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

  }
})