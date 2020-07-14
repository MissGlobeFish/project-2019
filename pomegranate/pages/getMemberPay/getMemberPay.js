// pages/getMemberPay/getMemberPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: { cardId: null, memberName: '', des: '', cardPrice: 0, cardType: '' },
    memberIndex: 0,
    chargeWay: 'weChat',//支付方式
    cardKey: '',
    priceList: [],//优惠 {value: -88, desc: "会员推荐优惠"}}
    totalPrice: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var memberInfo =  JSON.parse(options.memberInfo)
    var priceList = JSON.parse(options.priceList)
    var totalPrice = memberInfo.cardPrice
    priceList.map((item)=> {
      if (item.type == 0) {
        totalPrice += item.value
      } else {
        totalPrice -= item.value
      }
    })
    if (totalPrice <= 0) { totalPrice = 0 }

    this.setData({
      memberIndex: options.memberIndex,
      memberInfo: memberInfo,
      chargeWay: memberInfo.cardType == 'Y3' ? 'card' : 'weChat',
      priceList: priceList,
      totalPrice: totalPrice
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
   * 切换支付方式
   * @param {*} event 
   */
  chargeWayBtnDidSelected(event) {
    console.log(event.currentTarget.dataset)
    let chargeWay = event.currentTarget.dataset.chargeway
    this.setData({
      chargeWay: chargeWay
    })
  },


  /**
   *输入框值改变
   *
   * @param {*} event
   */
  inputValueDidChanged(event) {
    if (event.detail.inputname == 'cardKey') {
      this.data.cardKey = event.detail.value
    }
  },



  /**
   * 点击支付
   *
   */
  submitBtnDidTapped() {
    const { memberInfo, chargeWay, cardKey, totalPrice } = this.data
    var self = this
    if (chargeWay == 'card') {
      //卡密
      if (!cardKey || cardKey.length == 0) {
        this.showError('请填写卡密信息')
        return
      }
      wx.showLoading({ title: '提交中', mask: true });
      var payDto = { cardType: memberInfo.cardType, cardKey: cardKey }
      console.log({ payDto: payDto })
      wx.ajax.post(wx.apiPath.getMemberCard, payDto)
        .then((res) => {
          console.log(res)
          wx.hideLoading();
          self.getMemberSuccess()
        })
        .catch((err) => {
          this.showError(err.error)
        })

    } if (chargeWay == 'weChat') {
      //微信
      if (memberInfo.cardType == "Y3") {
        this.showError("仅支持卡密激活！")
        return
      } else if (!memberInfo.cardId) {
        this.showError("类型获取错误")
        return
      }

      let payObj = {
        body: memberInfo.memberName,
        totalFee: totalPrice
      };
      payObj.attach = 'module=CARD'
      payObj.productId = memberInfo.cardId
      wx.ajax.post(wx.apiPath.payUnifiedOrder, payObj).then(res => {
        if (res.status == "WX_SUCCESS") {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(res) {
              console.log(res, '支付成功')
              self.getMemberSuccess()
            },
            fail(res) {
              console.log(res)
              self.showError('支付失败')
            }
          })
        } else {
          console.log(res, '支付成功')
          self.getMemberSuccess()
        }
      }).catch(err => {
        self.showError(err.error)
      })
    }
  },

  getMemberSuccess() {
    wx.showToast({
      title: '开启成功',
      icon: 'success',
      duration: 1500,
      mask: true,
    });
    setTimeout(() => {
      // wx.eventEmit('MyPageNeedUpdateUserInfo', {})
      wx.switchTab({
        url: '/pages/my/my',
      })
    }, 1500);
  },

  showError(msg) {
    wx.showToast({
      title: msg ? msg : '激活失败',
      image: '/images/icon/toast_error.png',
    })
  }

})