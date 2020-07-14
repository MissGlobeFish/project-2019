// components/ticketTemp/ticketTemp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //卡券类型
    ticketType: {
      type: String,
      value: 'D0',
      observer: function (newVal, oldVal) {
        var imageUrl = ''
        switch (newVal) {
          case 'D1':
            imageUrl = '/images/icon/ticketD1.png'
            break;
          case 'D2':
            imageUrl = '/images/icon/ticketD2.png'
            break;
          case 'D4':
            imageUrl = '/images/icon/ticketD4.png'
            break;
          default:
            imageUrl = ''
            break;
        }
        this.setData({
          ticketImage: imageUrl
        })
      }
    },

    //卡券数值
    ticketNumber: {
      type: String,
      value: '--'
    }
  },



  /**
   * 组件的初始数据
   */
  data: {
    titleBoxWith: 0,
    ticketImage: ''
  },

  /**
   * 组件的声明周期方法
   */
  lifetimes: {
    ready() {
      wx.createSelectorQuery().in(this).selectAll('.ticketTitleBox').boundingClientRect((rect) => {
        if (!rect[0]) {
          return
        }
        this.setData({
          titleBoxWith: rect[0].width
        })
        // console.log(rect[0].width)
      }).exec()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

