// pages/pointsPay/pointsPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trolleyDatas: {},
    amount: 0,
    chargeWay: 1,//0现金 1研值 3都支持
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chargeWayCode = 1
    switch (options.chargeWay) {
      case 'CASH':
        chargeWayCode = 0
        break;
      case 'POINTS':
        chargeWayCode = 1
        break;
      default:
        break;
    }

    let datas = JSON.parse(options.dataObj)
    var amount = 0
    for (const id in datas) {
      if (datas.hasOwnProperty(id)) {
        const element = datas[id];
        console.log("element.number",element.number,"element.data.currentScore",element.data.currentScore,"----",element.number * (chargeWayCode == 0 ? element.data.currentPrice : element.data.currentScore))
        amount += element.number * (chargeWayCode == 0 ? element.data.currentPrice : element.data.currentScore)
      }
    }
    this.setData({
      trolleyDatas: datas,
      amount: amount,
      chargeWay: chargeWayCode
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


  showError(msg) {
    wx.showToast({
      title: msg ? msg : '请求失败',
      image: '/images/icon/toast_error.png',
    })
  },

  /**
   * 点击支付
   *
   */
  payBtnTapped() {
    const { chargeWay } = this.data
    if (chargeWay == 1) {
      //研值支付
      this.myModal = this.selectComponent('#myModal');
      this.myModal.showDialogBtn()

    } else if (chargeWay == 0) {
      //现金支付
      self = this
      this.sumbitOrder(this.data.chargeWay)
        .then(res => {
          wx.hideLoading();
          if (res.status == "WX_SUCCESS") {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success(res) {
                console.log(res, '支付成功')
                wx.eventEmit('ShoppingPageNeedRefresh', { clear: true })
                wx.navigateTo({ url: '/pages/pointsPayResult/pointsPayResult' });
              },
              fail(res) {
                console.log(res)
                self.showError('支付失败')
              }
            })
          } else {
            console.log(res, '支付成功')
            wx.eventEmit('ShoppingPageNeedRefresh', { clear: true })
            wx.navigateTo({ url: '/pages/pointsPayResult/pointsPayResult' });
          }
        }).catch(err => {
          self.showError(err.error)
        })
    } else {
      self.showError('支付方式错误')
    }

  },

  /**
   * 点击确认支付
   *
   */
  handleModeConfirm() {
    wx.showLoading({ title: '提交中', mask: true });
    //积分支付
    this.sumbitOrder(this.data.chargeWay)
      .then((res) => {
        wx.hideLoading();
        // wx.showToast({ title: '提交成功', icon: 'success'})
        wx.eventEmit('ShoppingPageNeedRefresh', { clear: true })
        wx.navigateTo({ url: '/pages/pointsPayResult/pointsPayResult' });
      })
      .catch((e) => {
        // console.log(e)
        // wx.eventEmit('ShoppingPageNeedRefresh', {clear: true} )
        wx.hideLoading();
        wx.showToast({ title: e.error ? e.error : '购买失败', image: '/images/icon/toast_error.png' })
      })
  },



  //Network 

  sumbitOrder(chargeWay) {
    var orderParam = []
    for (const productId in this.data.trolleyDatas) {
      if (this.data.trolleyDatas.hasOwnProperty(productId)) {
        const product = this.data.trolleyDatas[productId];
        console.log(product)
        var productOrder = {
          productName: product.data.productName,
          productStock: product.number,
          productType: product.data.productType,
          productId: productId,
          priceType: chargeWay,
          currentPrice: product.data.currentPrice,
          currentScore: product.data.currentScore
        }
        orderParam.push(productOrder)
      }
    }

    if (chargeWay == 0) {
      //现金
      console.log('提交商城订单： 现金', JSON.stringify({ extendFiled: orderParam }))
      let payObj = {
        body: "ShopProducts",
        productId: "0",
        totalFee: this.data.amount,
        attach: 'module=PRODUCT',
        extendFiled: JSON.stringify(orderParam)
      };
      wx.showLoading({ title: '提交中', mask: true });
      return wx.ajax.post(wx.apiPath.payUnifiedOrder, payObj)
    } else {
      //积分
      console.log('提交商城订单： 积分', JSON.stringify(orderParam))
      return wx.ajax.post(wx.apiPath.productPay, orderParam)
    }
  }


})