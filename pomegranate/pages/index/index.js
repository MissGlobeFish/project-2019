//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    pageNum: 1,
    pageSize: 10,
    loading: false,// 是否正在加载中
    isLoadAll: false // 加载完成
  },
  onGotUserInfo(e) {
    console.log(e)
  },
  /**
   *  获取初始数据
   * @param {*} options 
   */
  handleInit() {
    this.setData({
      loading: true
    })
    wx.showNavigationBarLoading({})
    wx.ajax.get(wx.apiPath.courseSchedule,{
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(res=>{
      const { list,total } = res;
      this.setData({
        loading: false,
        total: total,
        isLoadAll: false
      })
      wx.hideNavigationBarLoading({})
      wx.stopPullDownRefresh()
      // console.table(list)
      if (list) {
        this.setData({
          courseList:  this.data.courseList.concat(list)
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleInit()
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
      courseList: [],
      pageNum: 1
    },()=>{
      console.log(this.data.courseList)
      this.handleInit()
    })
    
  },

  /**
   * 页面上拉触底事件的处理函数
   * 处理加载更多
   */
  onReachBottom: function () {
    // console.log(123123)
    const {loading,pageNum,pageSize,total} = this.data;
    if (pageNum >= Math.ceil(total / pageSize)) {
      this.setData({
        isLoadAll: true
      });
      return;
    }
    if (!loading) {
      this.setData({
        pageNum: pageNum+1
      },()=>{
        this.handleInit()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
  }
})