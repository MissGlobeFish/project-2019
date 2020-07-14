/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-04-26 17:06:15
 * @LastEditTime: 2019-04-26 17:06:15
 */
// components/swiper-component/swiper-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgList: { // 外部属性
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    swiperText: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperchange(e) {
      this.setData({
        currentIndex: e.detail.current,
      })
    }
  }
})