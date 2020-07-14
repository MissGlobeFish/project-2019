// components/common/segmentedBar/segmentedBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //标题数据源
    titles: {
      type: Array,
      value: ['a', 'b']
    },
    //选中第几个
    defaultIndex: {
      type: Number,
      value: 0
    },
    //是否中间对齐
    centerDisplay: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectIndex: 0,// 当前选择值
    
    transform: '',
    barViewWidth: 16,
    defaultLeft: 0, //默认距离左边距离
  },

  /**
   * 组件的声明周期方法
   */
  lifetimes: {
    attached() {
      // this.setData({
      //   selectIndex: this.properties.defaultIndex
      // })
    },
    ready() {
      this.setData({
        selectIndex: this.properties.defaultIndex
      })
      wx.createSelectorQuery().in(this).selectAll('.segmentedBarButton').boundingClientRect((rect) => {  
        let defaultRect = rect[this.properties.defaultIndex]
        var startx = defaultRect.left
        var selectWidth = defaultRect.width / 2 - this.data.barViewWidth / 2
        this.setData({
          defaultLeft: startx + selectWidth
        })
      }).exec()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    didSelectedAtIndex(event) {
      //配置数据
      let dataset = event.currentTarget.dataset
      this.setData({
        selectIndex: dataset.index
      })
      //调整指示调位置
      let startx = event.currentTarget.offsetLeft;
      let selectWidth = 0;
      wx.createSelectorQuery().in(this).selectAll('.segmentedBarButton').boundingClientRect((rect) => {    
        selectWidth = rect[dataset.index].width / 2 - this.data.barViewWidth / 2;
        this.setData({
          transform: `translateX(${startx + selectWidth - this.data.defaultLeft }px)`
        })
      }).exec()
      //调用回调
      const myEventDetail = { index: dataset.index }
      const myEventOption = {}
      this.triggerEvent('segmentedBarDidSelected', myEventDetail, myEventOption)
    }
  },



})
