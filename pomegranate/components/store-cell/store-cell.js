// components/store-cell/store-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //数据
    cellData: {
      type: Object,
      value: {
        productId: 0,
        productName: '---',
        fileUrl: '',
        priceType: '', //0现金 1研值 3都支持
        currentPrice: 0,//现金价格
        currentScore: 0,//研值价格 
        productStock: 100000,//库存
        productType: 'PRO',     //商品类型 'TIC'券 'CA'卡 'PRO'普通商品
        productRegisterType: '',//商品子类
        ticketPrice: '-',//券金额
      }
    },
    //购物车信息
    trolleyNumber: {
      type: Number,
      value: 0,
      observer: function(newValue, oldValue, changePath) {
        // console.log(newValue, "<-", oldValue, '   ' ,changePath )
        this.setData({
          currentNumber: newValue
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileBaseUrl: wx.apiPath.fileBaseUrl,
    currentNumber: 0,
  },

  /**
   * 组件的声明周期方法
   */
  lifetimes: {
    attached() {
      this.setData({
        currentNumber: this.properties.trolleyNumber
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击增加
    onTapPlusBtn() {
      if (this.data.currentNumber >= this.properties.cellData.productStock) {
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return
      }
      this.data.currentNumber += 1
      this.setData({
        currentNumber: this.data.currentNumber
      })
      this.valueChangedCallBack()
    },
    //点击减少
    onTapminusBtn() {
      this.data.currentNumber -= 1
      this.setData({
        currentNumber: this.data.currentNumber
      })
     this.valueChangedCallBack()
    },
    //数值改变的时候通知 Page
    valueChangedCallBack() {
      const myEventDetail = { productId: this.properties.cellData.productId, number: this.data.currentNumber, itemData: this.properties.cellData }
      const myEventOption = {}
      this.triggerEvent('trolleyNumberDidChanged', myEventDetail, myEventOption)
    }
  }
})
