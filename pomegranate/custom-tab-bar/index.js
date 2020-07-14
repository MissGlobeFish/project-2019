Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/icon/home-icon.png",
      selectedIconPath: "/images/icon/home-icon.png",
      text: "组件123"
    }, {
      pagePath: "/pages/my/my",
      iconPath: "/images/icon/home-icon.png",
      selectedIconPath: "/images/icon/home-icon.png",
      text: "接口"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})