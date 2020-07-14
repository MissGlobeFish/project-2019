// components/card-cell/card-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ticketList: {
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
    ticetFreeModal: false,
    messageStatus: false,
    showFooter: true,
    messageText: '赠送成功',
    messageUrl: {
      successUrl: '../../images/icon/success-icon.png',
      errorUrl: '../../images/icon/error-icon.png'
    }
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
      console.log("送！")
    },
    ticketPwd() { // 卡券
      this.myModal = this.selectComponent('#myModal');
      this.myModal.showDialogBtn()
    },

    handleConfirm() {
      console.log('赠送确定按钮')
      // TODU刷新页面
    },
    handleCancle() {
      console.log('取消')
    }
  }
})
