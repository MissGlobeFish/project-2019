// pages/payAccount/payAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileBaseUrl: wx.apiPath.fileBaseUrl,
    goodsInfo: {},// 商品信息
    infoData: '', //报名信息
    ticketUsed: '', // 可优惠券信息
    ticketUsedNum: 0,// 优惠券数量
    ticketDesc: '',// 优惠描述
    actualPayPrice: 0, // 实付
    reducePrice: -1,// 已经减少价格（优惠券）
    mebReducePrice: 0,//会员权益减少价格
    ticketSelect:  '', // 选中的
    memberName: '' // 会员等级名称
  },

  // 请求初始化数据
  handleInit() {
    this.setData({
      goodsInfo: wx.store.get('goodsInfo'),
      actualPayPrice: wx.store.get('goodsInfo').currentPrice
    })
    this.handleUserInfo();
    this.handleDiscountTicket();
    this.handleMerberShip();
  },

  // 获取报名信息
  handleUserInfo() {
    wx.ajax.get(wx.apiPath.memberFind, {}, wx.loginInfo.openid).then(res => {
      this.setData({
        infoData: res
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取优惠券信息
  handleDiscountTicket() {
    wx.ajax.get(wx.apiPath.ticketUsed, {}, wx.store.get('goodsInfo').courseId).then(res => {
      this.setData({
        ticketUsedNum: res.length,
        ticketUsed: res,
        ticketDesc: res.length < 1 ? '无可用优惠券' : res.length + '张可用'
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 会员权益价格
  handleMerberShip() {
    wx.ajax.get(wx.apiPath.courseAuthority, {}, wx.store.get('goodsInfo').courseId)
      .then(res => {
        if (!res.memberName) {
          return
        }
        let price = res.preferentialPrice;
        let memberName = res.memberName;
        if (price > 0) {
          let actualPayPrice = this.data.actualPayPrice - price; // 原价-会员优惠价格
          if (actualPayPrice <= 0) {
            actualPayPrice = 0
          }
          this.setData({ mebReducePrice: price, actualPayPrice: actualPayPrice, memberName: memberName })
        }
      })
      .catch(err => {
        wx.showToast({ title: '请求失败', icon: 'none', duration: 2000 })
      })
  },

  // 选择优惠券
  handelCard() {
    if (this.data.ticketUsedNum < 1) {
      return
    } else {
      wx.navigateTo({
        url: `../cardSelect/cardSelect?ticketUsed=${JSON.stringify(this.data.ticketUsed)}
        &currentPrice=${this.data.goodsInfo.currentPrice}
        &ticketSelect=${JSON.stringify(this.data.ticketSelect)}
        &mebReducePrice=${this.data.mebReducePrice}
        `,
      })
    }

  },
  
  /**
   * wxPay 微信支付
   * @parma body {String} 课程名称
   * @parma productId {String} 课程id
   * @parma totalFee {Number} 实付价格
   */
  wxPay() {
    const { goodsInfo, actualPayPrice, ticketSelect} = this.data
    let payObj = {
      body: goodsInfo.courseName,
      productId: goodsInfo.lessonId,
      totalFee: actualPayPrice 
    };
    if (ticketSelect.ticketId) { // 是否有使用优惠券
      payObj.attach = 'module=COURSE&pay_id=' + this.data.ticketSelect.ticketId
    } else {
      payObj.attach = 'module=COURSE'
    }
    
    wx.ajax.post(wx.apiPath.payUnifiedOrder, payObj).then(res=>{
      if (res.status == "WX_SUCCESS") { // 付费购买
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1500)
          },
          fail(err) {
            wx.showModal({
              title: '提示',
              content: '支付失败,前往[我的-课程活动]查看',
              cancelColor: '#000',
              confirmColor: '#FF564C',
              success(res) {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }
            })
            console.log(err, '支付失败')
          }
        })
      } else { // 免费购买
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/index/index',
          })
        },1500)
      }

    }).catch(err=>{
      console.log(err)
      wx.showToast({
        title: err.error,
        icon: 'none'
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.handleInit()
  },

  
})