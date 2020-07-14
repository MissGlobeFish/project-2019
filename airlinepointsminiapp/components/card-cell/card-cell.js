/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-10-11 10:17:09
 * @LastEditTime: 2019-10-11 15:04:58
 */
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
    isShowDetail: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMore: function(e) {
      this.setData({
        isShowDetail: !this.data.isShowDetail
      })
    }
  }
})
