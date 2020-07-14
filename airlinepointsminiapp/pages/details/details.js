// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileBaseUrl: wx.apiPath.fileBaseUrl,
    detailsTitle: [
      '课程介绍','主讲嘉宾'
    ],
    applyText: '立即报名', // 按钮状态文本
    currentIndex: 0,// 当前选中

    htmlTitle: '',
    htmlContent: '',
    datas: {
      signUp: true
    },// 详情信息
    teachers: '', // 授课人信息
    code: 0 // 是否已经赋值完成
    
  },
  openLocation() { // 地图
    let location = this.data.datas.coordinate.split(',');
    const latitude = location[0]*1;
    const longitude =  location[1]*1;
    console.log(this.data.datas)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: '',
      address: this.data.datas.addr,
      scale: 18
    })
  },
  segmentedBarDidSelectedAt: function (e) {
    this.setData({
      currentIndex: e.detail.index
    })
  },
  /**
   * 请求详情数据
   */
  handleData(id) {
    var _this = this;
    wx.showNavigationBarLoading()
    wx.ajax.get(wx.apiPath.courseSchedule,{},id).then(res=>{
      wx.hideNavigationBarLoading()
      wx.store.set('goodsInfo', res)
      let data = res;
      data.content = data.content.replace(/<section/g, '<div').replace(/\/section>/g, '/div>')
      data.content = data.content.replace(/<img/g,'<img style="max-width:100%;height:auto" ') //防止富文本图片过大
      if (data.signUpStatus == 'NOT_START') {
        this.setData({
          applyText: '报名未开始'
        })
      } else if (data.signUpStatus == 'DOING'){
        this.setData({
          applyText: '立即报名'
        })
      } else if (data.signUpStatus == 'REGISTERED') {
        this.setData({
          applyText: '已报名'
        })
      } else if (data.signUpStatus == 'FULL_AMOUNT') {
        this.setData({
          applyText: '已售罄'
        })
      } else if (data.signUpStatus == 'END') {
        this.setData({
          applyText: '已结束'
        })
      }
      this.setData({
        datas: data,
        code: 1
      })
    }).catch(err=>{
      // TODU 请求失败信息
    })
     // 请求授课人信息
    wx.ajax.get(wx.apiPath.teacher,{},id).then(res=>{
      // wx.hideNavigationBarLoading({})
      let data = res;
      for (var i = 0;i<res.length; i++) {
        data[i].teacherDesc = data[i].teacherDesc.replace(/<section/g, '<div').replace(/\/section>/g, '/div>')
        data[i].teacherDesc = data[i].teacherDesc.replace(/<img/g, '<img style="max-width:100% !important;height:auto "')
      }
      this.setData({
        teachers: data
      })
    }).catch(err=>{
      // TODU 请求失败信息
    })
  },

  /**
   * 点击报名
   */
  handleApply() {
    // TODU判断是否有个人信息，有TO，否TO2
    var isLogin = wx.loginInfo && wx.loginInfo.id
    if (!isLogin) {
      wx.navigateTo({ url: '/pages/loginPage/loginPage' });
      return;
    }
    wx.navigateTo({
      url: '../payAccount/payAccount',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // this.tapSelect();
    this.handleData(options.id);


    
    // wx.getSystemInfo({
    //   success: function(res) {
    //     _this.setData({
    //       winHeight: res.windowHeight-(res.windowHeight*90/750)+'px'
    //     })
    //   },
    // })
    // wx.createSelectorQuery().select('.staticTop').boundingClientRect(function (rect) {
    //   console.log(rect)
    //   _this.setData({
    //     fixTop: rect.top,
    //   })
    // }).exec()
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