/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-04-26 17:06:15
 * @LastEditTime: 2019-10-09 15:34:22
 */
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

    // swiperH:'',//swiper高度
    // nowIdx:0,//当前swiper索引
    // imgList:[//图片列表
    //   "https://dimg03.c-ctrip.com/images/10020q000000gajaeDB6E_C_750_420_Q90.jpg",
    //   "https://dimg04.c-ctrip.com/images/300m0z000000muk1v9BF8_C_750_420_Q90.png",
    //   "https://dimg04.c-ctrip.com/images/300o0n000000eh1vdA55E_C_750_420_Q90.png"
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取swiper高度
    // getHeight:function(e){
    //   var winWid = wx.getSystemInfoSync().windowWidth - 2*50;//获取当前屏幕的宽度
    //   var imgh = e.detail.height;//图片高度
    //   var imgw = e.detail.width;
    //   var sH = winWid * imgh / imgw + "px"
    //   this.setData({
    //     swiperH: sH//设置高度
    //   })
    // },
    //swiper滑动事件
    // swiperChange:function(e){
    //   this.setData({
    //     nowIdx: e.detail.current
    //   })
    // },
    swiperchange(e) {
      this.setData({
        currentIndex: e.detail.current
      })
    }
  }
})