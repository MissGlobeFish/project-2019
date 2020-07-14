/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-10-18 11:40:58
 * @LastEditTime: 2019-10-18 18:07:04
 */
// pages/points/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDateDialog: false,
    currentType: null,
    startPickDate: new Date().getTime(),
    endDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    startSelectDate: "", // 选中的开始时间
    startSelectDate: "", // 选中的结束时间
    listData: [
      {
        rankNum: 1,
        userName: "易洋千玺",
        upScore: 80,
        downScore: -25
      },
      {
        rankNum: 1,
        userName: "王源",
        upScore: 80,
        downScore: -25
      },
      {
        rankNum: 1,
        userName: "王俊凯",
        upScore: 80,
        downScore: -25
      }
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.defaultDate()
  },


  /**
   * 默认选中时间
   * @param {*} e 
   */

   defaultDate() {
     let currentDate = new Date();
     let year = currentDate.getFullYear();
     let month = currentDate.getMonth() + 1;
     let day = currentDate.getDate();
     this.setData({
       startSelectDate: `${year}.${month}.${day}`,
       endSelectDate: `${year}.${month}.${day}`
     })
   },

  // 打开选择时间弹框
  showDateDialog(e) {
    this.setData({ 
      showDateDialog: true,
      currentType:  e.currentTarget.dataset.type
    });
  },

  /**
   * 确定选择时间
   */
  confirmDate(e) {
    let {currentType} = this.data;
    this.setData({ 
      showDateDialog: false
     });
    // start 选择开始时间 end选择结束时间
    if (currentType == "start") {
      let currentDate = new Date(e.detail);
     let year = currentDate.getFullYear();
     let month = currentDate.getMonth() + 1;
     let day = currentDate.getDate();
      this.setData({
        startSelectDate: `${year}.${month}.${day}`
      })
    } else {
      this.setData({
        endSelectDate:  `${year}.${month}.${day}`
      })
    }
    
  },

  /**
   * 取消时间选择
   */

  /**
   * 关闭时间选择
   */
  onCloseDateDialog() {
    this.setData({ showDateDialog: false });
  }
})