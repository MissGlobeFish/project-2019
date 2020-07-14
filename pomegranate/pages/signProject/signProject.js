// pages/signProject/signProject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,//当前页面可用高度
    courseList: [],
    endcourseList:[],
    payList: [],
    orderStatus: -1,
    payDatas: {
      orderStatus: -1,
      pageNum: 1,
      pageSize: 100
    },
    datas:{
      orderStatus: 0,
      pageNum: 1,
      pageSize: 100
    },
    endDatas: {
      orderStatus: 1,
      pageNum: 1,
      pageSize: 100
    }
  },
  /**
   * 已报名项目--获取初始值
   */
  handleInit() {
    const {payDatas,datas,endDatas} = this.data;
    wx.showLoading({title: '加载中...'})
    Promise.all([wx.ajax.get(wx.apiPath.order, payDatas),wx.ajax.get(wx.apiPath.order, datas), wx.ajax.get(wx.apiPath.order,endDatas)]).then((res)=>{
      wx.hideLoading({})
      wx.stopPullDownRefresh()
      console.log(res)
      this.setData({
        payList: this.data.payList.concat(res[0].list),
        courseList: this.data.courseList.concat(res[1].list),
        endcourseList: this.data.endcourseList.concat(res[2].list)
      },()=>{
        console.log(res[0])
      })
    })
  },
    /**
   * 头部选项卡
   */
  segmentedBarDidSelectedAt:function(e) {
    console.log(e)
    if(e.detail.index == 0) {
      this.setData({
        orderStatus: -1
      })
    } else if (e.detail.index == 1) {
      this.setData({
        orderStatus: 0
      })
    } else if (e.detail.index == 2) {
      this.setData({
        orderStatus: 1
      })
    } else {
      this.setData({
        orderStatus: -1
      })
    }
  },
  
  /**
   * 点击评价（接收子组件）
   */
  myevent(e) {
    console.log(e)
    // 跳转评价
    wx.navigateTo({
      url: '../remark/remark?sid=' + e.detail.sid + '&judge=' + e.detail.judge,
    })
  },

  /**
   * 
   */

  payevent(e) {
    this.setData({
      payList: [],
      courseList: [],
      endcourseList: []
    }, () => {
      this.handleInit()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleInit()
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
      payList: [],
      courseList: [],
      endcourseList: []
    },()=>{
      this.handleInit()
    })
    
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // TODU 重新获取数据
    // let pageNum = 'datas.pageNum';
    // let endPageNum = 'endDatas.pageNum';
    // if (!this.data.isEnd) {
    //   let paginationObj = this.data.datas.pageNum + 1;
    //   this.setData({
    //     [pageNum]: paginationObj
    //   },()=>{
    //     wx.ajax.get(wx.apiPath.order, datas).then(res=>{
    //       this.setData({
    //         courseList: this.data.courseList.concat(res.list)
    //       })
    //     })
    //   })
    // } else {
    //   let paginationObj = this.data.endDatas.pageNum + 1;
    //   this.setData({
    //     [endPageNum]: paginationObj
    //   }, () => {
    //     wx.ajax.get(wx.apiPath.order, datas).then(res => {
    //       this.setData({
    //         endcourseList: this.data.endcourseList.concat(res.list)
    //       })
    //     })
    //   })
    // }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})