<template>
<div class="empupload">
  <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><i class="el-icon-menu"></i> 人员组织管理</el-breadcrumb-item>
      <el-breadcrumb-item>花名册导入</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <el-upload class="upload-demo" drag :action="uploadAction" accept=".xlsx" :before-upload="beforeUpload" :on-error = "UploadError" :on-success = "UploadSuccess">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">只能上传规定格式的.xlsx文件，<a :href="demoAddr">点击</a>下载模板</div>
  </el-upload>
</div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      demoAddr: global.HUMRES_URL + '/humres/static/demo.xlsx',
      uploadAction: global.HUMRES_URL + "/humres/empmanage/upload"
    }
  },
  methods: {
    UploadError(err, file, fileList) {
      //文件上传失败
      this.$message({
        message: "文件上传失败，请检查后重试！",
        type: "error"
      });
    },
    UploadSuccess(response, file) {
      console.log(response);
      if(response.flag){
        this._log_success(response.msg);
      }else{
        this._log_err(response.msg);
      }
    },
    beforeUpload(file){
      let self = this;
      let suffix = file.name;
      if(suffix.indexOf('.xlsx') == -1){
        self.$message({
          message: '上传文件格式不正确，只能上传.xlsx后缀的文件！',
          type: "error"
        });
        return false;
      }
      return true;
    },
  }
}
</script>

<style lang="less">
.empupload {
  background: #fff;
  box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
  padding: 20px;

  .upload-demo {
    .el-upload,.el-upload-dragger {
      width:100% !important;
      height:300px;
    }
    .el-upload-dragger .el-icon-upload {
      margin:100px 0 16px;
    }
  }

}
</style>
