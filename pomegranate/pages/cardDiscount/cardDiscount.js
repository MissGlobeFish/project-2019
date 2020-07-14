// pages/cardDiscount/cardDiscount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    list: [],
    listPageInfo: {
      pageNumber: 1,
      isLoadAll: false
    },

    ticketList: [],
    ticketListPage: {
      pageNumber: 1,
      isLoadAll: false
    },

    ticket: true,
    windowHeight: ''
  },
  pageSize: 20,
  /**
   * 
   */
  handleInit: function () {
    wx.showLoading({ title: '加载中' })
    Promise.all([wx.ajax.get(wx.apiPath.ticket, {
      pageNum: 1,
      pageSize: this.pageSize
    }), wx.ajax.get(wx.apiPath.cardList, {
        pageNum: 1,
        pageSize: this.pageSize
    })])
      .then((res) => {
        console.log(res[0].list)
        console.log(res)
        wx.stopPullDownRefresh()
        this.setData({
          ticketList: res[0].list,
          [`ticketListPage.isLoadAll`]: res[0].isLastPage,
          list: res[1].list,
          [`listPageInfo.isLoadAll`]: res[1].isLastPage,
        },()=> {
          console.log((this.data.ticket && this.data.ticketListPage.isLoadAll && this.data.ticketList.length > 0) || (!this.data.ticket && this.data.listPageInfo.isLoadAll && this.data.list.length > 0))
        })

        wx.hideLoading({})
      })
      .catch((e) => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.showToast({ icon: 'none', title: e.error ? e.error : '加载失败' })
      })

  },

  /**
   * 头部选项卡
   */
  segmentedBarDidSelectedAt: function (e) {
    if (e.detail.index == 0) {
      this.setData({
        ticket: true
      })
    } else if (e.detail.index == 1) {
      this.setData({
        ticket: false
      })
    } else {
      this.setData({
        ticket: true
      })
    }
  },
  confirmEvent(value) {
    console.log(value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        ticket: options.type == 'ticket'
      })
    }
    this.handleInit();
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
    this.setData({
      list: [],
      listPageInfo: {
        pageNumber: 1,
        isLoadAll: false
      },
      ticketList: [],
      ticketListPage: {
        pageNumber: 1,
        isLoadAll: false
      },
    },()=>{
      this.handleInit(0)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var pageInfo = this.data.ticket ? this.data.ticketListPage : this.data.listPageInfo
    if (!pageInfo.isLoadAll) { 
      this.loadMoreData()
    }
  },


  /**
   * 加载更多
   *
   */
  loadMoreData() {
    wx.showNavigationBarLoading();
    var isTicket = this.data.ticket
    var pageInfo = isTicket ? this.data.ticketListPage : this.data.listPageInfo
    console.log(pageInfo)
    wx.ajax.get(isTicket ? wx.apiPath.ticket : wx.apiPath.cardList, {
      pageNum: pageInfo.pageNumber + 1,
      pageSize: this.pageSize
    }).then((res)=> {
      wx.hideNavigationBarLoading()
      console.log(res)
      var changeData = {}
      if (isTicket) {
        changeData = {
          ticketList: this.data.ticketList.concat(res.list),
          [`ticketListPage.pageNumber`]: pageInfo.pageNumber + 1,
          [`ticketListPage.isLoadAll`]: res.isLastPage
        }
      } else {
        changeData = {
          list: this.data.list.concat(res.list),
          [`listPageInfo.pageNumber`]: pageInfo.pageNumber + 1,
          [`listPageInfo.isLoadAll`]: res.isLastPage
        }
      }
      this.setData(changeData)

    }).catch((e)=> {
      wx.hideNavigationBarLoading()
      this.showError(e.error)
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("分享！！", res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target.dataset.ticketinfo)
      var infoJson = JSON.stringify(res.target.dataset.ticketinfo)
      console.log(`pages/ticketReceive/ticketReceive?ticketId=${res.target.dataset.ticketinfo.ticketId}&senderId=${wx.loginInfo.openid}&ticketInfo=${infoJson}`)
      return {
        title: '好友送你一张优惠券，领券后报名课程活动更优惠哦～',
        path: `pages/ticketReceive/ticketReceive?ticketId=${res.target.dataset.ticketinfo.ticketId}&senderId=${wx.loginInfo.openid}&ticketInfo=${infoJson}`,
        imageUrl: '/images/icon/ticketShareImage.png'
      }
    }

  },

  //错误提示
  showError(msg) {
    wx.showToast({
      title: msg ? msg : '加载失败',
      icon: 'none'
    })
  }
})