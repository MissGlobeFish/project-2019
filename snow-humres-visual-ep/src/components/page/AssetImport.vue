<template>
      <div class="salaryImport">
          <div class="importBox">

              <div class="crumbs">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item><i class="el-icon-sold-out"></i> 行政资产</el-breadcrumb-item>
                  <el-breadcrumb-item>资产导入</el-breadcrumb-item>
                </el-breadcrumb>
              </div>

              <div class="contents">
                <el-upload class="upload-demo" drag :action="uploadAction" :data="upLoadData" accept=".xlsx" :before-upload="beforeUpload" :on-error = "UploadError" :on-success = "UploadSuccess">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传规定格式的.xlsx文件，<a :href="demoAddr">点击</a>下载模板</div>
                </el-upload>
              </div>

          </div>
      </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      salaryPayDate: '',
      upLoadData: {
        salaryPayDate: ""
      },
      demoAddr: global.HUMRES_URL + '/humres/static/asset_demo.xlsx',
      uploadAction: global.HUMRES_URL + "/humres/asset/import"
    };
  },
  created() {

  },
  methods: {
    beforeUpload(file){
      let self = this;
      let suffix = file.name;
      if(suffix.indexOf('.xlsx') == -1){
        self.$message({
          message: '上传文件格式不正确，只能上传.xlsx后缀的文件！',
          type: "warning"
        });
        return false;
      }
      return true;
    },
    UploadError(err, file, fileList) {
      //文件上传失败
      this.$message({
        message: "文件上传失败，请检查后重试！",
        type: "error"
      });
    },
    UploadSuccess(response, file) {
      //文件上传成功后
      if (response.flag) {
        this.$message({
          message: "文件上传成功！",
          type: "success"
        });
      } else {
        this.$message({
          message: "文件上传时发生错误，请检查文件格式！",
          type: "warning"
        });
      }
    },
  }
};
</script>

<style lang="less">
    .salaryImport {
      background: #fff;
        .importBox{
          box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
          padding: 20px;

          .crumbs{
              margin-bottom: 40px;
          }
          .contents{
            .topInfo{
              margin-bottom: 30px;
            }
            .upload-demo {
              .el-upload,.el-upload-dragger {
                width:100% !important;
                height:300px;
              }
              .el-upload-dragger .el-icon-upload {
                margin:100px 0 16px;
              }
            }
            .el-row {
              margin-bottom: 20px;

              .el-col {
                border-radius: 4px;
                cursor: pointer;

                .service-content {
                  padding:40px 0 0 0;
                  height:130px;
                  width:80%;
                  box-shadow: 1px 1px 2px 1px rgba(204, 204, 204, 0.5);
                  text-align:center;
                  margin: 0 auto;

                  .icon {
                    width: 1em; height: 1em;
                    vertical-align: -0.15em;
                    font-size:40px;
                  }
                  .desc{
                    line-height: 30px;
                  }
                }
                .service-content:hover{
                  background: #F5F7FA;
                }
              }
            }
          }
        }
    }
</style>
