// components/course-cell/course-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseList: { // 外部属性
      type: Array,
      value: []
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
    
  }
})