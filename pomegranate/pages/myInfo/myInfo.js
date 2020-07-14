// pages/myInfo/myInfo.js
import WxValidate from '../../utils/WxValidate';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowInfo: true, // 填写信息
    validCheck: false, // 填写完成报名信息
    infoData: { // 报名信息
      name: '',// 姓名
      phoneNum: '', // 手机号
      business: '',// 行业
      post: '', // 职位
      company: '' // 公司职位
    },
    errorStatus: {}
  },
  onGetValue(e) { // 子组件的bindinput事件
    console.log(e)
    const _k1 = `infoData.${e.detail.inputname}`;
    this.setData({
      [_k1]: e.detail.value
    })
    for (var key in this.data.infoData) {
      if (!this.data.infoData[key]) {
        this.setData({
          validCheck: false
        })
      } else {
        this.setData({
          validCheck: true
        })
      }
    }
  },
  payAccount() { // 结算
    this.setData({
      validCheck: true
    })
  },
  /**
   * 表单-验证字段
   */
  initValidate() {
    const rules = {
      name: {
        required: true,
        rangelength: [2, 4]
      },
      phoneNum: {
        required: true,
        tel: true
      },
      business: {
        required: true
      },
      company: {
        required: true
      },
      post: {
        required: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请输入姓名',
        rangelength: '请输入2-4个汉字',
      },
      phoneNum: {
        required: '请输入11位手机号码',
        tel: '请输入正确的手机号码',
      },
      business: {
        required: '请输入',
      },
      company: {
        required: '请输入',
      },
      post: {
        required: '请输入'
      }
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
  formSubmit(e) {
    let params = e.detail.value;
    // 传入表单数据，调用验证方法
    this.data.errorStatus = {};
    this.setData({
      errorStatus: this.data.errorStatus
    })
    if (!this.WxValidate.checkForm(params)) {
      console.log(this.WxValidate)
      let arr = this.WxValidate.errorList;
      arr.forEach((item, index) => {
        this.data.errorStatus[item.param] = 1;
        this.setData({
          errorStatus: this.data.errorStatus
        })
        console.log(arr)
      })
      return false
    } else {
      this.setData({
        validCheck: true
      })
      // TODU验证通过后。。。跳转页面；保存个人信息；
      this.submitInfo()
      
    }
  },
  
  submitInfo() { // 提交数据
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确定修改该信息吗？',
      confirmColor: '#FF564C',
      success(res) {
        if (res.confirm) {
          wx.ajax.put(wx.apiPath.memberUpdate, _this.data.infoData).then(res => {
            // TODU 成功-提示成功 失败-提示框
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }).catch(err => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 填写个人信息
   */
  handleData() {
    this.setData({
      isShowInfo: true
    })
  },

  // 请求个人信息

  handleInit() {
    wx.showLoading({
      title: '加载中...',
    })
    // 请求数据，按钮变成修改可以在一次修改
    if(true) {
      // 如果有数据isShowInfo为false，打开信息页面
      this.setData({
        isShowInfo: false
      })
      wx.ajax.get(wx.apiPath.memberFind,{}, wx.loginInfo.openid ).then(res => {
        wx.hideLoading({})
        delete res.lastCreateTime;
        delete res.lastUpdateTime;
        this.setData({
          infoData: res
        })
      }).catch(err => {
        wx.hideLoading({})
        console.log(err)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    this.handleInit();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})