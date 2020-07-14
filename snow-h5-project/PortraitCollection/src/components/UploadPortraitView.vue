<template>
  <div class="root">
    <div id= "CompLogo">
      <img id= "CompLogoImg" src="../assets/logo.png">
    </div>
    <h1>{{ msg }}</h1>


    <el-upload
        ref = "uploadView"
        id="uploadView"
        :action= "uploadURL"
        list-type="picture-card"
        accept="image/*"
        :data="uploadData"
        :limit="limitNumber"
        :on-change="fileUploadChange"
        :on-preview="handlePictureCardPreview"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadErr"
        :on-remove="handleRemove"
        :file-list="files">
        <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <div id= "TFuserID">
      <el-input
        placeholder="请输入员工编号"
        v-model="empCode"
       clearable>
    </el-input>
    </div>

    <el-button id="BtnSubmit" type="primary" @click="submit" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>

    <div class = "footer">
      <h5>旺小宝ERP</h5>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '旺小宝-工作照采集',
      uploadURL: global.ERP_BASE_URL + "/erp/file/oss/upload",
      limitNumber: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      empCode:"",
      imageUrl:null,
      imageName:null,
      loading: true,
      files: [],
      fullscreenLoading: false,
      option: {
                    timeout: 30 * 1000 //30秒过期
                },
      uploadData: {"fileName": Date.parse(new Date()) + ".jpg",
                    "type": "empdetail/photos"}

    }
  },
  created(){
    let home = this
    // var t;
    // clearTimeout(t)
    // t = setTimeout(function (){
      // home.turnToPCPage();
    // }, 1500);
  },
  methods: {

     turnToPCPage(){
      //如果是电脑端打开，跳到电脑引导页
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (!isiOS && !isAndroid){
          this.$router.push({path: '/PCpage'});
      }
    },

      //文件状态发生变化
      fileUploadChange(file, fileList){
        console.log("fileUploadChange");
        console.log(file, fileList);
        console.log("this . file",this.files);

        let uploadBtn = document.getElementsByClassName('el-upload--picture-card')[0];
        let fileNumber = fileList.length
        uploadBtn.style.display = fileNumber > 0 ? "none" : "inline-block";

      },
      handleRemove(file, fileList) {
        console.log("handleRemove",file,fileList);
        console.log();
        let uploadBtn = document.getElementsByClassName('el-upload--picture-card')[0];
        uploadBtn.style.display ="inline-block";
        this.removeAllfiles();
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = this.imageUrl;
        this.dialogVisible = true;
      },

      //上传接口成功，但仍需要根据返回值判断是否正确上传
      handleUploadSuccess(res, file){
        console.log("handleUploadSuccess",file);
        console.log(res);
        //文件上传成功后
        if (res.flag) {
          this.imageUrl=res.datas;
          this.imageName = res.filename;
          this.$message({
           message: "图片上传成功！",
            type: "success"
          });
        } else {
          //上传失败
          this.removeAllfiles();
          this.$message({
           message: "图片上传错误，请重试！",
           type: "error"
          });
      }
      },

      //上传失败
      handleUploadErr(err, file, fileList){
        console.log("handleUploadErr");
        this.imageUrl = null;
        this.imageName = null;
        this.$message({
          showClose: true,
          message: '上传图片失败，请重试！',
          type: 'error'
        });
      },
      

      //删除所有文件，并显示 + 按钮
      removeAllfiles(){
        console.log("removeAllfiles");
        this.$refs.uploadView.clearFiles();
        let uploadBtn = document.getElementsByClassName('el-upload--picture-card')[0];
        uploadBtn.style.display ="inline-block";
        this.imageUrl = null;
        this.imageName = null;
      },


      //提交
      submit(){
        this.fullscreenLoading = true;
        // setTimeout(() => {
        //   this.fullscreenLoading = false;
        // }, 2000);
        if (this.imageUrl && this.empCode) {
          console.log("提交！");
          console.log(this.imageUrl,this.imageName);
          this.submitData(this.empCode ,this.imageName,this.imageUrl);
        }else{
          this.fullscreenLoading = false;
          this.$message({
           message: "图片、员工编号不可为空！",
            type: "error"
          });
          console.log("有空缺！");
          console.log(this.imageUrl + this.empCode);
        }
        
      },


      //上传数据
      submitData(empCode ,name, imageUrl){

          let self = this;
          let url = global.ERP_BASE_URL + "/snow/object/post";
          // global.HUMRES_URL + "/erp-api/snow/post";
          let datas = {"serviceName":"emp_photo_add",
                        "data":{
                            "empCode":empCode,
                            "fileName":name,
                            "filePath":imageUrl
                          }
                        };

          self.$http.post(url, datas, self.option).then(                       
            function(data) {
              self.fullscreenLoading = false;
              console.log(data);
              // 这里是处理正确的回调
              if (data.data.flag) {
                console.log("提交成功");
                self.$message({
                   message: "提交成功！",
                   type: "success"
                 });
                self.$router.push({path: '/SuccessPage'});
              } else {
                console.log("提交失败");
                self.$message({
                  message: data.data.msg,
                  type: "error"
                });
                // self.$router.push({path: '/SuccessPage'});
              }
            },
            function(error) {
              self.fullscreenLoading = false;
              // 这里是处理错误的回调
              console.log("提交失败");
              self.$message({
                message: "请求失败，请刷新重试！",
                type: "error"
              });
            }
          );  
      }

  }


}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


#CompLogo{
  margin: 10px auto;
  width: 40%;
}

#CompLogo img{
  width: 100%;
  height: 100%
}

#uploadView{
  margin-top: 20px;
  margin-bottom: 10px;
}

  /*输入框*/
#TFuserID{
  width: 70%;
  margin: 30px auto;
}

#BtnSubmit{
  width: 70%;
  height: 50px;
  text-align: center;
}


.root{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  min-height: 300px;
  position: relative;
}

.footer{
  width: 100%;
  bottom: 10px;
  position: absolute;
  margin-bottom: 5px;
  text-align: center;
}



h1{
  font-size: 20px;
}

h5{
  margin: 0px;
}

</style>
