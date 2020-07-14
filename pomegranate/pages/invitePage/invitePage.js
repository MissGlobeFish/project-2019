// pages/invitePage/invitePage.js
import drawQrcode from '../../dist/qrCodeTool/weapp.qrcode.esm.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    qrurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.createSelectorQuery().in(this).selectAll('.myQrcode').boundingClientRect((rect) => {    
      let canvas = rect[0]
      if (canvas) {
        drawQrcode({
          width: canvas.width,
          height: canvas.height,
          canvasId: 'myQrcode',
          text: `https://16ddu.com/miniapp/invite?eventId=${wx.loginInfo.id}&eventType=invite`,
          callback:(e)=>{
            console.log('e: ', e)
            wx.getImageInfo({
              src: '../../images/icon/invite_moments_bg.png',
              success: function (res) {
                console.log(res)
                that.setData({
                  qrurl: res.path
                })
              },
              fail: function (err) {
                console.log(err)
              }
            })
            wx.canvasToTempFilePath({
              // x: 0,
              // y: 0,
              // width: 545,
              // height: 500,
              // destWidth: 545,
              // destHeight: 500,
              canvasId: 'myQrcode',
              success: function (res) {
                // console.log(that.data.qrurl)
                // console.log(res.tempFilePath);
                let winWidth = wx.getSystemInfoSync().windowWidth;
                let heightWidth = wx.getSystemInfoSync().windowHeight;
                const ctx = wx.createCanvasContext('shareImg');
                ctx.clearRect(0, 0, winWidth, heightWidth)
                ctx.drawImage('../../' + that.data.qrurl, 0, 0, winWidth, heightWidth)
                ctx.drawImage(res.tempFilePath, (winWidth - winWidth * 0.4) / 2, heightWidth*0.4, winWidth * 0.4, winWidth * 0.4)
                ctx.stroke()
                ctx.draw()
                that.shareMomentBtnTapped()
                wx.hideLoading()

              },
              fail: function (res) {
                console.log(res)
              }
            })
            
          }
        })
        
      }
    }).exec()
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
  onShareAppMessage: function (res) {
    console.log("邀请：", res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(wx.loginInfo)
      return {
        title: '你的好友邀请你成为石榴研习院会员，优惠力度很大哦～',
        path: `pages/loginPage/loginPage?eventId=${wx.loginInfo.id}`,
        imageUrl: '/images/icon/inviteTicket.png'
      }
    }
  },





  /**
   * 点击分享朋友圈
   *
   */
  shareMomentBtnTapped(){
    // 生成分享图
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    let winWidth = wx.getSystemInfoSync().windowWidth;
    let heightWidth = wx.getSystemInfoSync().windowHeight;
    wx.canvasToTempFilePath({
      destWidth: winWidth,
      destHeight: heightWidth, 
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 保存到相册
  */
  save: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res, res.authSetting['scope.writePhotosAlbum'] == undefined? 'undefined' : 123131)
        if (!res.authSetting['scope.writePhotosAlbum'] && (res.authSetting['scope.writePhotosAlbum'] != undefined)) {
          wx.showModal({
            title: '提示',
            content: '若点击不授权，将无法使用保存图片功能',
            cancelText: '不授权',
            cancelColor: '#999',
            confirmText: '授权',
            confirmColor: '#07c160',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })  
        }
      }
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        console.log(res)
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })
  }

})