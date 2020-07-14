// components/common/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    confirmText: {
      type: String,
      value: '确定'
    },
    showFooter: {
      type: Boolean,
      value: true
    },
    cancelStyle: {
      type: String,
      value: ''
    },
    confirmStyle: {
      type: String,
      value: ''
    },
    autoHide: {
      type: Boolean,
      value: false
    },
    onlyConfirm: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
      * 弹窗
      */
    showDialogBtn () {
      this.setData({
        showModal: true
      })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove () {
    },
    /**
     * 隐藏模态对话框
     */
    hideModal() {
      this.setData({
        showModal: false
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel() {
      this.triggerEvent('toParentCancle', 123);
      if (this.properties.autoHide) {
        this.hideModal();
      }
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm(e) {
      console.log(e)
      if (this.properties.autoHide) {
        this.hideModal();
      }
      var val = e; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('toParentConfirm', myEventDetail)
    }
  }
})
