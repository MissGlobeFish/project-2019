// pages/cardSelect/cardSelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    fileBaseUrl: wx.apiPath.fileBaseUrl,
    ticketUsed: [],//可使用的优惠券列表
    currentPrice: '',// 原价
    ticketSelect: '',// 当前选中的优惠券
  },
  /**
   * 选择优惠券
   */
  handleClick(e) { 
    const { value, index } = e.currentTarget.dataset;
    this.setData({
      ticketSelect: value
    })
    this.computePrice(value)
  },
  /**
   * 不使用优惠券
   */
  handleClearTicket() {
    // wx.navigateTo({
    //   url: '../payAccount/payAccount',
    // })
    let pages = getCurrentPages(); 
    let prevPage = pages[pages.length - 2];  
    prevPage.setData({
      ticketSelect: '',// 选中的优惠券
      actualPayPrice: this.data.currentPrice,// 原价
      reducePrice: -1
    }, () => {
      setTimeout(() => {
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }, 500)
    }) 
  },

  /**
   * 计算使用优惠券后的价格
   * D1- 折扣券 D2-优惠券 D3-抵用券 D4-免费券
   */
  computePrice(value) {
    let { currentPrice } = this.data;
    currentPrice = currentPrice - this.data.mebReducePrice; // 商品原价-会员权益
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。-2代表上一个页面,-3代表上上个页面
    let prevPage = pages[ pages.length - 2 ];  
    let priceValue;

    switch (value.ticketType) {
      case "D1":
        priceValue = (Number(currentPrice) * value.ticketPrice).toFixed(2)*1
        if (0 < priceValue &&  priceValue <= 0.01) {
          priceValue = 0.01
        }
        if (priceValue <= 0) {
          priceValue = 0
        }
        break;
      case "D2":
        if (Number(value.ticketPrice) >= Number(currentPrice)) {
          priceValue = 0
        } else {
          priceValue = this.accMul(currentPrice, value.ticketPrice)
        }

        break;
      case "D4":
        priceValue = 0
        break;
    }
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      ticketSelect: value,// 选中的优惠券
      actualPayPrice: priceValue,// 优惠后的商品价格
      reducePrice: this.accMul(currentPrice,priceValue) // 优惠的价格
    },()=>{
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      },500)
    }) 
  },

  // 两数相减（浮点问题）
  accMul(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取高度
    const res = wx.getSystemInfoSync()
    this.setData({
      windowHeight: res.windowHeight
    })
    if (options) {
      this.setData({
        ticketSelect: options.ticketSelect ? JSON.parse(options.ticketSelect) : '',
        ticketUsed: options.ticketUsed ? JSON.parse(options.ticketUsed) : '',
        currentPrice: options.currentPrice,
        mebReducePrice: options.mebReducePrice
      })
    }
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