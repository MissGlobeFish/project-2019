/*
 * @Description: 首页
 * @Author: rcq
 * @Date: 2019-10-15 15:10:16
 * @LastEditTime: 2019-10-17 10:18:25
 */
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgList: [ // banner图
      {
        url: "https://dimg03.c-ctrip.com/images/10020q000000gajaeDB6E_C_750_420_Q90.jpg",
        title: "祝全体员工节日快乐"
      },
      {
        url: "https://dimg03.c-ctrip.com/images/10020q000000gajaeDB6E_C_750_420_Q90.jpg",
        title: "关爱抑郁症"
      }
    ],
    listData: [
      {isNotice: true, title: "元旦放假通知", time: '2020-01-01', author: "人力行政部", likes: 3251},
      {isNotice: false, title: "抑郁症为什么这么可怕？", time: '2020-01-01', author: "研发部", likes: 1251},
      {isNotice: false, title: "何曾感受别人的伤", time: '2020-01-01', author: "人力行政部", likes: 3451},
      {isNotice: true, title: "端午节放假通知", time: '2020-01-01', author: "人力行政部", likes: 151}
    ]
  },
  //事件处理函数
  onLoad: function () {

  },
  goDetail: function (e) {
    let id = e.currentTarget.dataset.item.id;
    console.log(id)
    wx.navigateTo({
      url: `/pages/news-detail/news-detail?id=${id}`,
    });
      
  }
})
