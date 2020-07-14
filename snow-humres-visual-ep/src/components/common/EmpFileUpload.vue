<template>

  <div>


    <el-dialog width="38%" :title="DialogTitle" :visible.sync="EmpFileUploadVisible" height="250">



    <div class="handle-box" style="height:300px;width:100%;">

      <el-radio-group v-model="fileType" size="medium" style="margin-bottom:20px">
        <el-radio border v-for="item in doctypes" :key="item.value"  :label="item.value" :disabled="disabled">{{item.label}}</el-radio>
      </el-radio-group>

      <el-upload
        :action="uploadAction"
        list-type="picture-card"
        :data="upLoadData"
        :file-list = "fileList"
        :on-preview="handlePictureCardPreview"
        :before-upload = "beforeUpload"
        :on-success = "UploadSuccess"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>



    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="EmpFileUploadVisible = false">取 消</el-button>
      <el-button type="primary" @click="uploadFile">上 传</el-button>
    </span>


  </el-dialog>

    <el-button type="text" @click="EmpFileUploadVisible = true"></el-button>

  </div>

</template>

<script>
  export default {
    props:['name'],
    data() {
      return {
        EmpFileUploadVisible: false,
        uploadAction: global.HUMRES_URL + "/humres/common/upload",
        empCode:"",
        empName:"",
        loading: false,
        DialogTitle: "",
        fileList: [],
        file:[],
        fileType:'',
        empFileModel:{},
        fileInfoModel:{},
        upLoadData: {
          fileName: ""
        },
        dataList:[],
        doctypes: [{
          value: 'DOC-HX-RES',
          label: '简历'
        }, {
          value: 'DOC-HX-OFFER',
          label: 'Offer'
        }]
      }
    },
    watch:{
      name(){
        this.empName = this.name;
      }
    },
    created() {
      this.DialogTitle = "文件上传";
    },
    methods: {
      open(empCode,empName){
        this.empCode = empCode;
        this.empName = empName;
        this.DialogTitle = "档案管理--"+empName;
        this.fileList = [];
        this.file = [];
        this.fileType = '';
        this.EmpFileUploadVisible = true;
      },
      beforeUpload(file) {
        if(this.fileType == null || this.fileType == ''){
          this._log_warn('请选择上传文件类型！');
          return false;
        }
        this.upLoadData.fileName = file.name;
      },
      UploadSuccess(response, file) {
        let self = this;
        if (response.flag) {
          self.empFileModel = {};
          self.empFileModel.empCode = self.empCode;
          self.empFileModel.fileName = response.filename;
          self.empFileModel.filePath = response.datas;
          self.empFileModel.fileType = self.fileType;
          if(self.fileType == 'DOC-HX-RES'){
            self.empFileModel.fileDesc = '简历';
          }else if(self.fileType == 'DOC-HX-OFFER'){
            self.empFileModel.fileDesc = 'Offer';
          }
          self.file.push(self.empFileModel);
        } else {
          this.$message({
            message: "文件上传发生错误，请检查文件格式！",
            type: "warning"
          });
        }
      },
      UploadError(err, file, fileList) {
        //文件上传失败
        this.$message({
          message: "文件上传失败，请检查后重试！",
          type: "error"
        });
      },
      handleRemove(file, fileList) {
        //删除上传的文件
        let index = this.file.indexOf(file);
        this.file.splice(index, 1);
      },
      uploadFile(){
        let self = this;
        let url = global.HUMRES_URL + "/humres/recruit/upload";
        self.$http.post(url,self.file, self.option).then(function(data) {
            // 这里是处理正确的回调
            if (data.body.flag) {
              this._log_success('上传成功！');
              this.EmpFileUploadVisible = false;
            } else {
                this._log_warn(data.body.msg);
            }
        },
        function(error) {
            this._log_err('请求失败，请刷新重试！');
        });

        // EmpFileUploadVisible = false;
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
