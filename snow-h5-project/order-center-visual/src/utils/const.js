
exports.install = function (Vue, options) {

    Vue.prototype.httpOptions = {
        timeout: 30 * 1000, //30秒过期
      };

    //使用方法：  this.showError("XX")


};