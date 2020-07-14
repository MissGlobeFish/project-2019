// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userLevel: '-', //用户等级
    memberLv: 'Y0', //会员等级
    memberName: "普通用户",//会员等级名称
    userId: '****',//用户 ID
    memberRightDes: null,

    innerBtnDatas: [
      { label: "会员卡", value: '-', pagePath: '/pages/cardDiscount/cardDiscount?type=card' },
      { label: "福利券", value: '-', pagePath: '/pages/cardDiscount/cardDiscount?type=ticket' },
      { label: "研值", value: '-', pagePath: '/pages/pointsHistory/pointsHistory' }
    ],
    inner2ndBtnDatas: [
      { label: "扫码签到", image:'/images/icon/my-scan.png', pagePath: '/pages/signScan/signScan' },
      { label: "会员权益", image: '/images/icon/my-right.png', pagePath: '/pages/rights/rights', flag: 'right' },
    ],
    listFunctionDatas: [
      { label: "课程活动", value: 0, image: '/images/icon/my-project.png', pagePath: '/pages/signProject/signProject' },
      { label: "个人信息", value: 0, image: '/images/icon/my-userInfo.png', pagePath: '/pages/myInfo/myInfo' },
      { label: "研值中心", value: 0, image: '/images/icon/my-points.png', pagePath: '/pages/pointsHistory/pointsHistory' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.updateMemberInfo()
    // //添加事件监听，购买会员后刷新会员信息
    // wx.eventAddListener('MyPageNeedUpdateUserInfo', self, (data) => {
    //   console.log("收到消息", data)
    //   this.updateMemberInfo()
    // })
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

  /**
   * 点击成为会员
   *
   */
  getMemberBtnDidTapped() {
    var isLogin = wx.loginInfo && wx.loginInfo.id
    if (!isLogin) {
      wx.navigateTo({ url: '/pages/loginPage/loginPage' });
      return;
    }
    wx.navigateTo({ url: `/pages/getMember/getMember?curreLevel=${this.data.memberLv}` })
  },

  /**
   * 点击报名分享
   *
   */
  shareBtnDidTapped() {
    wx.navigateTo({ url: '/pages/applyInfo/applyInfo' })
  },

  /**
   * 点击邀请朋友
   *
   */
  inviteBtnDidTapped() {
    wx.navigateTo({ url: '/pages/invitePage/invitePage'})
  },


  /**
   * 点击某一项
   *
   * @param {*} event
   */
  didSelectCell(event) {
    let selectData = event.currentTarget.dataset.celldata
    console.log("点击", event)

    var isLogin = wx.loginInfo && wx.loginInfo.id
    if (!isLogin) {
      wx.navigateTo({ url: '/pages/loginPage/loginPage' });
      return;
    }

    var paramData = {}
    switch (selectData.flag) {
      case 'right':
        if (this.data.memberRightDes && this.data.memberRightDes.cardAuthorityDesc) {
          paramData = this.data.memberRightDes
        } else {
          wx.showToast({ title: '暂无权益信息', icon: 'none' });
          return;
        }
        break;

      default:
        break;
    }


    wx.navigateTo({
      url: selectData.pagePath + '?dataObj=' + JSON.stringify(paramData)
    })
  },









  //Networks

  /**
   *  加载 / 更新 会员信息
   *
   */
  updateMemberInfo() {
    var isLogin = wx.loginInfo && wx.loginInfo.id
    console.log(wx.loginInfo)

    wx.ajax.get(wx.apiPath.memberInfo, {})
      .then((res) => {
        console.log("MyPageData:",res)
        var memberRightDes = {
          cardTypeName: res.cardTypeName,
          expireDate: res.expireDate,
          cardAuthorityDesc: res.cardAuthorityDesc,
        }
        this.setData({
          memberName: res.cardTypeName,//会员等级名
          userLevel: res.level,//用户等级
          memberLv: res.cardType,//会员类型
          memberRightDes: memberRightDes,//权益
          userId: isLogin ? res.memberNo : '----',//用户 ID
          [`innerBtnDatas[0].value`]: res.cardQuantity,//会员卡数量
          [`innerBtnDatas[1].value`]: res.ticketQuantity,//券数量
          [`innerBtnDatas[2].value`]: res.score,//研值
          [`listFunctionDatas[0].value`]: 0 //res.courseQuantity //课程活动
        })
      })
  }


})