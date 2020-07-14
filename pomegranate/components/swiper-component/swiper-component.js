// components/swiper-component/swiper-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls: { // 外部属性
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    fileBaseUrl: wx.apiPath.fileBaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperchange(e) {
      this.setData({
        currentIndex: e.detail.current
      })
    }
  }
})