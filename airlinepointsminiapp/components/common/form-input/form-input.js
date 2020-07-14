// components/common/form-input/form-input.js
Component({
  /**
   * 组件的属性列表
   */
  behaviors: ['wx://form-field'], // 各个组件通用方法
  properties: {
    placeholder:{
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    maxlength: {
      type: Number,
      value: 50
    },
    focus: {
      type: Boolean,
      value: false
    },
    name: { // 输入框唯一name
      type: String,
      value: ""
    },
    erorrStyle: { // 校验错误样式
      type: Boolean,
      value: false
    },
    constainorStyle: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    borderNone: {
      type: Boolean,
      value: false
    },
    sendCode: { // 发送验证码
      type: Boolean,
      value: false
    },
    sendCodeObj: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeInput(e) { // 输入框值改变时配合上面的behaviors使用
      console.log(e)
      this.setData({
        value: e.detail.value
      })
      this.triggerEvent('inputValueDidChange', { value: e.detail.value,inputname: e.target.dataset.inputname})
    },
    onBlurEvent(e) { // 输入框光标离开
    // 传递给父组件
      this.triggerEvent('toParent', { value: e.detail.value, inputname: e.target.dataset.inputname })
    },

    // 发送验证码
    sendCode(e) {
      this.triggerEvent('toPhone', { value: this.data.value })
    }
  }
})
