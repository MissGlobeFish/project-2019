// components/shopSheet/shopSheet.js
Component({

  /**
     * 组件的属性列表
     */
  properties: {
    //选定的 item Index
    selectedIndex: null,
    //sheet 显示隐藏
    visible: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        if (newVal == true && wx.hideTabBar) {
          wx.hideTabBar({animation: true})
        }else if (newVal == false && wx.hideTabBar) {
          wx.showTabBar({animation: true})
        }
      }
    }
  },


  /**
     * 组件的初始数据
     */
  data: {
    actions: [
      {
        label: '现金结算',
        icon: '/images/icon/pay-Cash.png',
        code: 'CASH'
      },
      {
        label: '研值结算',
        icon: '/images/icon/pay-Points.png',
        code: 'POINTS'
      },
    ]
  },
  /**
     * 组件的方法列表
     */
  methods: {
    handleClickMask() {
      this.triggerEvent('cancel');
    },

    handleClickItem({ currentTarget = {} }) {
      const dataset = currentTarget.dataset || {};
      const { index } = dataset;
      this.triggerEvent('click', {index: index, value: this.data.actions[index]} );
    },

    handleClickSubmit() {
      const { selectedIndex } = this.properties
      if (selectedIndex != null) {
        this.triggerEvent('clickSubmit', {index: selectedIndex, value: this.data.actions[selectedIndex]} );
      }else {
        this.triggerEvent('clickSubmit', null );
      }
      
    }
  }
})
