// components/common/stars-cell/stars-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    judge: {
      type: Boolean,
      value: false
    },
    score: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        this.setData({
          key: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    stars: 5, // 星星个数

    normalSrc: '../../../images/icon/normal.png',

    selectedSrc: '../../../images/icon/selected.png',

    key: 0,//评分
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectStar (e) { // 点击星星评分
      console.log(this.properties)
      if (this.properties.judge) {
        return
      }
      var key = e.currentTarget.dataset.key

      console.log("得" + key + "分")

      this.setData({

        key: key

      })
      this.triggerEvent('myevent', { key: key });
    }
  },
  ready: function() {
    console.log(this.properties)
    console.log(this.properties.score)
    // this.setData({
    //   key: this.properties.score 
    // })
  }
})
