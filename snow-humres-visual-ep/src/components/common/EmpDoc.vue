<template>

  <div>


    <el-dialog width="30%" :title="DialogTitle" :visible.sync="EmpDocVisible" height="300">

    <div class="handle-box">
        <div class="button">
            <el-button type="success" size="mini" @click="generate('DOC-ENTRY')" plain>生成入职申请表</el-button>
            <!-- <el-button type="success" size="mini" @click="generate('OTHER')" plain>生成...</el-button> -->
        </div>
    </div>

    <el-table v-loading="loading" :data="dataList" border style="width: 100%" height="200">
      <el-table-column prop="fileType" label="档案列表">
        <template slot-scope="scope">
              <span type="primary" v-if="scope.row.fileType == 'DOC-ENTRY'" size="medium">入职申请表 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>
              <span type="primary" v-if="scope.row.fileType == 'DOC-PHOTO'" size="medium">工作照 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>
              <span type="primary" v-if="scope.row.fileType == 'DOC-IDCARD'" size="medium">身份证 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>

              <span type="primary" v-if="scope.row.fileType == 'DOC-EDUCATION'" size="medium">学历 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>
              <span type="primary" v-if="scope.row.fileType == 'DOC-SALARY'" size="medium">薪酬证明 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>
              <span type="primary" v-if="scope.row.fileType == 'DOC-PE'" size="medium">体检报告 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>
              <span type="primary" v-if="scope.row.fileType == 'DOC-DIMISSION'" size="medium">离职证明 &nbsp;
                <i @click="_download(scope.row.filePath)" style="float:right;padding-top:5px;" class="el-icon-download"></i>
              </span>
        </template>
      </el-table-column>

    </el-table>
  </el-dialog>

    <el-button type="text" @click="EmpDocVisible = true"></el-button>

  </div>

</template>

<script>
  export default {
    props:['name'],
    data() {
      return {
        EmpDocVisible: false,
        empCode:"",
        empName:"",
        loading: false,
        DialogTitle: "",
        dataList:[]
      }
    },
    watch:{
      name(){
        this.empName = this.name;
      }
    },
    created() {

    },
    methods: {
      open(empCode,empName){
        this.empCode = empCode;
        this.empName = empName;
        this.DialogTitle = "员工档案【"+empName+"】";
        this.EmpDocVisible = true;
        this.getData();
      },
      generate(type){
        let self = this;
          self.loading = true;
        let empFileModel = {
          fileType : type,
          empCode : this.empCode
        }
        let _url = global.HUMRES_URL + "/humres/empmanage/doc/generate";
        self.$http.post(_url, empFileModel, self.option).then(
          function(data) {
            // 这里是处理正确的回调
            if (data.body.flag) {
              self.loading = false;
              this.getData();
            } else {
              self.loading = false;
              this._log_warn(data.body.msg);
            }
            self.curPage = data.curPage;
          },
          function(error) {
            // 这里是处理错误的回调
            self.loading = false;
            this._log_error("请求超时！");
          }
        );
      },
      _download(filePath) {
        location.href = filePath;
      },
      getData() {
        //读取列表
        console.log(123123);
        let self = this;
        self.loading = true;
        let empFileModel = {
          fileType : "DOC",
          empCode: this.empCode
        };
        let _url = global.HUMRES_URL + "/humres/empmanage/file/list";
        self.$http.post(_url, empFileModel, self.option).then(
          function(data) {
            // 这里是处理正确的回调
            if (data.body.flag) {
              self.loading = false;
              self.dataList = data.body.datas;
            } else {
              self.loading = false;
              this._log_warn(data.body.msg);
            }
            self.curPage = data.curPage;
          },
          function(error) {
            // 这里是处理错误的回调
            self.loading = false;
            this._log_error("请求超时！");
          }
        );
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
