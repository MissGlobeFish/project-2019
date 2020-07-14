// pages/remark/remark.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    judge: false,
    datas: {
      lessonId: '',
      score: 0,
      reply: ''
    }
  },
  /**
   * 获取初始化评论
   */
  handleInit(sid) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.ajax.get(wx.apiPath.courseFeedback,{},`${sid}`)
      .then(res=>{
        wx.hideLoading({})
        // TODU 赋值并且禁用
        var reply = `datas.reply`
        var score = `datas.score`
        this.setData({
          [reply]: res.reply,
          [score]: res.score
        },()=>{
          console.log(this.data.datas)
        })
      })
      .catch(err=>{
        console.log(err)
      })
  },

  /**
   * 提交评价
   */
  submitRemark() {
    // TODU 验证是否表单填写完成
    const { lessonId, score, reply} = this.data.datas
    if (!score) {
      wx.showToast({
        title: '请打分哦～',
      })
      return
    } else if (!reply) {
      wx.showToast({
        title: '请填写评价哦～',
      })
    } else {
      wx.ajax.post(wx.apiPath.courseFeedback,this.data.datas).then(res=>{
        // 皆在结束； 弹框成功； 返回列表页面
        wx.showToast({
          title: '提交成功'
        })
        setTimeout(()=>{
          wx.redirectTo({
            url: '../signProject/signProject',
          })
        }, 1500)
        console.log(res,'评价')
      }).catch(err=>{
        wx.showToast({
          title: '提交失败', icon: 'none', mask: false
        })
        console.log(err)
        // wx.showToast({
        //   title: ''
        // })
      })
    }
  },
  /**
   * 获取多行文本框值
   */
  bindTextAreaBlur(e) {
    var reply = `datas.reply`;
    this.setData({
      [reply]: e.detail.value
    })
  },
  /**
   * 接收星星评分
   */
  starKey(e) {
    if (this.data.judge) {
      return
    }
    var score = `datas.score`
    this.setData({
      [score]: e.detail.key
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sid) {
      var sid = `datas.lessonId`
      this.setData({
        [sid]: options.sid,
        judge: options.judge=='true' ? options.judge : false
      })
      console.log(options.sid)
      //TODU接收参数是否评价过，是---请求并禁止
      if (options.judge == 'true') {
        // console.log(options,'options.judge')
        this.handleInit(options.sid)
      }
      // this.handleInit(options.sid)
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