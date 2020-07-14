// components/sign-cell/sign-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowRemark: {
      type: Boolean || String,
      value: false
    },
    list: {
      type: Array,
      value: []
    },
    showPay: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileBaseUrl: wx.apiPath.fileBaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 评论
    remarkEvent(e) { 
      console.log(e)
      this.triggerEvent('myevent', { sid: e.currentTarget.dataset.sid, judge: e.currentTarget.dataset.judge})
    },
    // 点击跳转详情
    signTap(e) { 
      console.log(e.currentTarget.dataset.id)
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../pages/details/details?id=' + id
      })
    },

    // 待支付
    goPay(e) {
      /**
       * {
          "body": "string",
          "attach": "string",
          "outTradeNo": "string",
          "totalFee": 0,
          "productId": "string"
        }
      */
      let content = e.currentTarget.dataset.content 
      if (content.orderStatus == "WAIT_PAY") {
        this.submitPay(content)
      }
    },

    submitPay(content) {
      let payObj = {
        body: content.courseName,
        // attach: 'module=COURSE&pay_id=' + content.paymentId,
        attach: content.paymentId ? `module=COURSE&pay_id=${content.paymentId}` : 'module=COURSE',
        outTradeNo: content.orderId,
        totalFee: content.amount,
        productId: content.sid
      }
     
      wx.ajax.post(wx.apiPath.payUnifiedOrder, payObj).then(res => {
        console.log(JSON.stringify(payObj),'payObj')
        var _this = this
        if (res.status == "WX_SUCCESS") {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(res) {
              console.log(res, '支付成功')
              _this.triggerEvent('payevent', true)
            },
            fail(res) {
              _this.triggerEvent('payevent', true)
              return
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
              _this.triggerEvent('payevent', true)
              console.log(res, '支付失败')
            }
          })
        } else {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })
          _this.triggerEvent('payevent', true)
        }

      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: err.error,
          icon: 'none'
        })
        _this.triggerEvent('payevent', true)
      })
    }
  }
})
