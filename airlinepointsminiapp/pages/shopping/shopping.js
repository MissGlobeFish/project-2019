// pages/shopping/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,//当前页面可用高度

    showMask: false,

    sheetVisible: false,
    sheetSelectIndex: null,
    //商品列表
    storeDatas: [],
    //购物车
    trolleyDatas: {},
    //现金总额
    priceAmount: 0,
    //研值总额
    scoreAmount: 0,
    //总个数
    count: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {
      const res = wx.getSystemInfoSync()
      this.setData({
        windowHeight: res.windowHeight
      })
    } catch (e) { }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadProductList()
    //添加事件监听，刷新商品信息
    wx.eventAddListener('ShoppingPageNeedRefresh', self, (data) => {
      console.log("收到消息", data)
      if (data.clear) {
        //清空购物车
        this.setData({
          trolleyDatas: {},
          amount: 0,
          count: 0,
          showMask: false
        })
      }
      this.loadProductList()
    })
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
    wx.eventRemoveListener('ShoppingPageNeedRefresh', self)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadProductList()
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


  //ActionHandler && CallBack

  /**
   * 分段控制器选择回调
   * @param {*} event 
   */
  segmentedBarDidSelectedAt: function (event) {
    let index = event.detail.index
    console.log(index == 0 ? "点击课程" : "点击活动")
  },

  /**
   * 商品数量改变回调
   * @param {*} event 
   */
  trolleyNumberDidChanged: function (event) {
    let goodsId = event.detail.productId
    let number = event.detail.number
    let goodsData = event.detail.itemData

    var changeDatas = {}
    this.data.trolleyDatas[goodsId] = { number: number, data: goodsData }
    changeDatas[`trolleyDatas.${goodsId}.number`] = number
    changeDatas[`trolleyDatas.${goodsId}.data`] = goodsData

    var count = 0
    var priceAmount = 0
    var scoreAmount = 0
    for (const key in this.data.trolleyDatas) {
      if (this.data.trolleyDatas.hasOwnProperty(key)) {
        const element = this.data.trolleyDatas[key];
        count += element.number
        priceAmount += element.number * element.data.currentPrice
        scoreAmount += element.number * element.data.currentScore
      }
    }
    changeDatas.count = count
    changeDatas.priceAmount = priceAmount
    changeDatas.scoreAmount = scoreAmount

    this.setData(changeDatas, () => {
      if (number == 0) {
        //移除数量为 0 的商品
        delete this.data.trolleyDatas[goodsId]
        this.setData({
          trolleyDatas: this.data.trolleyDatas,
          showMask: Object.keys(this.data.trolleyDatas).length != 0
        })
      }
    })
  },

  /**
   * 购物车点击背景
   * @param {*} event 
   */
  blackMaskDidTapped: function (event) {
    this.setData({
      showMask: false
    })
  },

  /**
   * Sheet 点击背景
   * @param {*} event 
   */
  handleSheetCancel(event) {
    this.setData({
      sheetVisible: false
    })
  },
  /**
   * Sheet 点击某一项
   * @param {*} event 
   */
  handleSheetClickItem(event) {
    const { trolleyDatas } = this.data
    console.log(event.detail)
    var selectedValue = event.detail
    //选择的付款方式
    let selectChargeWay = selectedValue.value.code
    var isSupport = true
    //遍历查看是否所有都支持
    for (const key in trolleyDatas) {
      if (trolleyDatas.hasOwnProperty(key)) {
        const product = trolleyDatas[key];
        let priceType = product.data.priceType
        //支付方式验证
        var priceTypeSupport = priceType == 3 || (selectChargeWay == 'POINTS' && priceType == 1) || (selectChargeWay == 'CASH' && priceType == 0)
        if (!priceTypeSupport) {
          isSupport = false
          wx.showToast({ title: '有商品不支持该方式结算', icon: 'none' });
          break;
        }
      }
    }

    if (isSupport) {
      this.setData({
        sheetSelectIndex: selectedValue.index
      })
    }


  },
  /**
   * Sheet 点击确定
   * @param {*} event 
   */
  handleSheetClickSubmit(event) {
    var selectedValue = event.detail
    console.log(selectedValue)
    if (selectedValue == null) {
      wx.showToast({ title: '请选择结算方式', icon: 'none' });
      return
    } else {
      this.setData({
        sheetVisible: false
      }, () => {
        wx.navigateTo({
          url: `/pages/pointsPay/pointsPay?dataObj=${JSON.stringify(this.data.trolleyDatas)}&chargeWay=${selectedValue.value.code}`
        })
      })

    }
  },

  /**
   * 购物车点击清空
   *
   * @param {*} event
   */
  cleanBtnDidTapped(event) {
    this.setData({
      trolleyDatas: {},
      showMask: false,
      count: 0,
      amount: 0
    })
  },

  /**
   * 购物车点击详情
   * @param {*} event 
   */
  trolleyDetailBtnDidTapped: function (event) {
    this.setData({
      showMask: !this.data.showMask
    })
  },

  /**
   * 购物车点击结算
   * @param {*} event 
   */
  trolleyGoPayBtnDidTapped: function (event) {

    var isLogin = wx.loginInfo && wx.loginInfo.id
    if (!isLogin) {
      wx.navigateTo({ url: '/pages/loginPage/loginPage' });
      return;
    }


    this.setData({
      showMask: false,
      sheetVisible: true,
      sheetSelectIndex: null
    })

    // wx.navigateTo({ 
    //   url: '/pages/pointsPay/pointsPay?dataObj='+JSON.stringify(this.data.trolleyDatas) 
    //  }) 
  },


  //UserFunction



  //Networks

  loadProductList: function () {

    wx.showNavigationBarLoading()

    var showError = function () {
      wx.showToast({
        title: '加载失败',
        image: '/images/icon/toast_error.png',
      })
    }

    wx.ajax.get(wx.apiPath.productList, { pageNum: 1, pageSize: 100 })
      .then((res) => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        console.log(res.list)
        this.setData({
          storeDatas: res.list
        })
      })
      .catch((e) => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        showError()
      })
  }

})