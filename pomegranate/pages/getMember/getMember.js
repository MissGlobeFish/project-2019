// pages/getMember/getMenber.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curreLevel: 'Y0',
    memberTyps: [
      { memberName: '研习会员', des: '---', cardPrice: 199 , cardType: 'Y1' , cardId: ''},
      { memberName: '研学会员', des: '---', cardPrice: 999, cardType: 'Y2' , cardId: ''},
      { memberName: '研修会员', des: '---', cardPrice: 0, cardType: 'Y3' , cardId: ''},
    ],
    selectIndex: 0,
    rightDescriptions: [
      ["获得初始研值100分", "《每日阅读》全年免费", "《职场沙龙》优惠60元", "《石榴公开课》优惠80元", "《workshop》优惠100元", "《青年论坛》优惠100元", "《青年盛典》优惠100元", "其他研习院组织的公益活动参与资格"],
      ["获得初始研值500分", "《每日阅读》全年免费", "《职场沙龙》全年免费", "《石榴公开课》全年免费", "《workshop》全年免费", "《青年论坛》全年免费", "青年盛典》全年免费", "研习院课程课件免费获取", "其他研习院组织的公益活动参与资格", "项目路演资格" , "项目路演资格", "加入凤凰会的推荐资格"],
      ["-------"]
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCardInfo()
    var defaultIndex = 0
    if (options.curreLevel != 'Y0') {
      do {
        defaultIndex += 1
      } while (this.data.memberTyps[defaultIndex - 1].cardType != options.curreLevel);
    }
    
    this.setData({
      curreLevel: options.curreLevel,
      selectIndex: defaultIndex
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
   * 切换会员类型
   * @param {*} event 
   */
  typeBtnDidSelected(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      selectIndex: index
    })
  },

  /**
   * 点击支付
   *
   */
  submitBtnDidTapped() {
    const { memberTyps, selectIndex} = this.data
    console.log(memberTyps[selectIndex].cardType)
    wx.showLoading({mask: true});
    wx.ajax.get(wx.apiPath.memberPrice, {} , memberTyps[selectIndex].cardType)
    .then((res)=> {
      wx.hideLoading();
      var priceList = res ? res : []
      wx.navigateTo({ url: '/pages/getMemberPay/getMemberPay' + `?memberInfo=${JSON.stringify(memberTyps[selectIndex])}&priceList=${JSON.stringify(priceList)}&memberIndex=${selectIndex}`});
    }).catch((e) => {
      wx.hideLoading();
      wx.showToast({ title: '获取价格失败', icon: 'none' })
      console.log(e)
    })
    // wx.navigateTo({ url: '/pages/getMemberPay/getMemberPay' + `?memberInfo=${JSON.stringify(memberTyps[selectIndex])}&memberIndex=${selectIndex}`});
  },
  
  /**
   *  获取会员卡信息
   */
  loadCardInfo() {
    wx.showLoading({ title: '', mask: true })

    wx.ajax.get(wx.apiPath.memberCardInfo, {})
    .then((res)=> {
      wx.hideLoading();
      console.log(res)
      var rights = []
      res.map((memberInfo)=>{
        //研修会员暂未开放
        memberInfo.des = memberInfo.cardType == 'Y3' ? '暂未开放' : `¥${memberInfo.cardPrice}/年`
        rights.push( JSON.parse( memberInfo.cardAuthorityDesc ))
      })
      this.setData({
        memberTyps: res,
        rightDescriptions: rights
      })
    }).catch((e)=> {
      wx.hideLoading();
      console.log(e)
    })
  }
})