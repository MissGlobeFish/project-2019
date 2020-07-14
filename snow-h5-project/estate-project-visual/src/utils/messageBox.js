
//页面通用方法
exports.install = function (Vue, options) {
    
    /*
    ERROR MESSAGE BOX
    */
    Vue.prototype.showError = function (msg){
        this.$message({
          showClose: false,
          message: msg,
          type: 'error',
          center: true,
          duration:1500,
          customClass: "messageBox"
        });
    };

    //使用方法：  this.showError("XX")


    Vue.prototype.showSucceed = function (msg){
        this.$message({
          showClose: false,
          message: msg,
          type: 'success',
          center: true,
          duration:1500,
          customClass: "messageBox"
        });
    };

    //使用方法：  this.showSucceed("XX")


    Vue.prototype.showAlert = function (msg, title, options = {}) {
        var option = {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
            type: "warning",
            customClass: "alertBox"
          }
          for(var key in options){ 
            option[key]=options[key]; 
         }
        return this.$confirm(msg, title, option)
    }


    //使用方法：  this.showAlert("XX","XX").then().catch()

};