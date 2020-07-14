/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-10-09 10:55:02
 * @LastEditTime: 2019-10-09 10:55:02
 */
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userId: '****',//用户 ID
		loading: false,// 是否正在加载中
		isLoadAll: false, // 加载完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 		this.handleInit()
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
    this.updateMemberInfo()
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
    // wx.eventRemoveListener('MyPageNeedUpdateUserInfo', self)
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
    console.log("")
  },


  /**
   * 点击用户 ID
   *
   */
  userIdBtnDidTapped() {
    console.log("用户 ID", this.data.userId)
    var _this = this;
      wx.setClipboardData({
        data: _this.data.userId,
        success: function(res) {
          wx.showToast({title: '已复制',icon: 'none'});
        }
      })

  },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
	// onPullDownRefresh: function () {
	// 	this.setData({
	// 		courseList: [],
	// 		pageNum: 1
	// 	}, () => {
	// 		console.log(this.data.courseList)
	// 		this.handleInit()
	// 	})

	// },

  /**
   * 页面上拉触底事件的处理函数
   * 处理加载更多
   */
	onReachBottom: function () {
		// console.log(123123)
		// const { loading, pageNum, pageSize, total } = this.data;
		// if (pageNum >= Math.ceil(total / pageSize)) {
		// 	this.setData({
		// 		isLoadAll: true
		// 	});
		// 	return;
		// }
		// if (!loading) {
		// 	this.setData({
		// 		pageNum: pageNum + 1
		// 	}, () => {
		// 		this.handleInit()
		// 	})
		// }
	},

	/**
   * 点击查看个人信息
   *
   */
	getMemberBtnDidTapped() {
		var isLogin = wx.loginInfo && wx.loginInfo.id
		if (!isLogin) {
			wx.navigateTo({ url: '/pages/loginPage/loginPage' });
			return;
		}
		wx.navigateTo({ url: '/pages/myInfo/myInfo' })
	},

  /**
   * 点击报名分享
   *
   */
  shareBtnDidTapped() {
    wx.navigateTo({ url: '/pages/applyInfo/applyInfo' })
  },

  //Networks

  /**
   *  加载 / 更新 会员信息
   *
   */
  updateMemberInfo() {
    var isLogin = wx.loginInfo && wx.loginInfo.id

    wx.ajax.get(wx.apiPath.memberInfo, {})
      .then((res) => {
        this.setData({
          userId: isLogin ? res.memberNo : '----',//用户 ID
          [`innerBtnDatas[0].value`]: res.cardQuantity,//会员卡数量
          [`innerBtnDatas[1].value`]: res.score,//积分
        })
      })
  }


})