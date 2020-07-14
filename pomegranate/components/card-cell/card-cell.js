// components/card-cell/card-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileBaseUrl: wx.apiPath.fileBaseUrl,
    showModal: false,
    // ticetFreeModal: false,
    messageStatus: false,
    showFooter: true,
    messageText: '赠送成功', // 消息提示框
    messageUrl: {
      successUrl: '../../images/icon/success-icon.png',
      errorUrl: '../../images/icon/error-icon.png'
    },
    modleValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ticketFree() { // 赠送
      //调用子组件方法
      // this.myModal = this.selectComponent('#ticketFreeModal');
      // this.myModal.showDialogBtn()
      // this.setData({
      //   ticetFreeModal: true
      // })
    },
    ticketPwd(value) { // 卡券
      this.setData({
        modleValue: value.currentTarget.dataset.cardkey
      },()=>{
        this.myModal = this.selectComponent('#myModal');
        this.myModal.showDialogBtn()
      })
     
    },

    handleConfirm(value) {
      this.setData({
        messageStatus: true,
        showFooter: false
      })
      var _this = this;
      wx.setClipboardData({
        data: _this.data.modleValue,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              console.log(res.data,'复制成功') // data
              _this.myModal.hideModal()
            }
          })
        }
      })
      // TODU刷新页面
    },
    handleCancle() {
      console.log('取消')
    }
  }
})
