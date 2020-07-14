<template>
<div class="header">
  <div @click="reload()">
    <img class="header-logo" src="../../../static/img/logo.png">
    <div class="logo">旺小宝EHR</div>
  </div>

  <div class="user-info">

    <el-button class="commission" icon="el-icon-message" @click='pendingTask' type="text">我的待办</el-button>

    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
          <img class="user-logo" src="../../../static/img/img.jpg">
          {{name}}
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item type="text" command="download">下载中心</el-dropdown-item>
        <el-dropdown-item type="text" command="updatePwd">修改密码</el-dropdown-item>
        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>

    <el-dialog id="downLoad" title="下载中心" :visible.sync="dialogDownLoadVisible">
      <div class="search">
        <el-date-picker :editable="false" v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" class="el-icon-search" @click="search" plain> 搜索</el-button>
        <el-button type="primary" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain style="margin:0;"> 重置</el-button>
      </div>
      <el-table :header-row-class-name="tableRowClassName" height="360" :data="fileTableData" v-loading="fullscreenLoading">
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="status" label="当前状态" :formatter="formatter"></el-table-column>
        <el-table-column prop="lastCreateTime" label="操作日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="downLoadFile(scope.$index,fileTableData)"
                    type="text"
                    v-if="status=1"
                    size="small"
                    >
                    下载
                  </el-button>
                </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <a id="_center_download" :href='downloadUrl' style="display:none;">测试</a>
      </div>
    </el-dialog>

    <el-dialog id="dialog" title="修改密码" :visible.sync="dialogUpdatePasswordVisible">
      <el-input class='changepwd' v-model="loginInfo.password" type="password" placeholder="请输入原密码"></el-input>
      <el-input class="changepwd" v-model="loginInfo.newPasswordIs" type="password" placeholder="请输入新密码"></el-input>
      <el-input class="changepwd" v-model="loginInfo.newPassword" type="password" placeholder="请确认新密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdatePasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('loginInfo')">确 认 修 改</el-button>
      </span>
    </el-dialog>

  </div>
</div>
</template>
<style>
  .el-table .success-row {
    background: #f6faff;
  }
</style>
<script>
import * as types from 'store/types'
export default {
  data() {
    return {
      date: '',
      total: 0,
      pageSize: 10,
      fileinfo: {
        beginDate: '',
        endDate: '',
        fileName: ''
      },
      userVer :{},
      filestatus: [{
          1: "下载完成"
        },
        {
          0: "下载完成"
        },
        {
          3: "下载失败"
        }
      ],
      loginInfo: {
        userName: '',
        empCode: localStorage.getItem("ms_empCode"),
        password: '',
        newPassword: '',
        newPasswordIs: ''
      },
      empInfo:{
        spell:''
      },
      fileTableData: [],
      name: "加载ing...",
      downloadUrl: '',
      dialogDownLoadVisible: false,
      downLoadButtonVisible: false,
      dialogUpdatePasswordVisible: false,
      fullscreenLoading: false,
      option: {
          timeout: 30 * 1000 //30秒过期
      }
    };
  },
  created() {
   if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){
     this.userVer =  JSON.parse(localStorage.getItem("userVer"));
     this.loginInfo.userName =this.userVer.userName;
   };
    this.username();
  },
  computed: {
  },
  methods: {
    username() {
      let self=this;
      let info = self.userVer;
      self.empInfo.spell=info.userName;
      let url=global.HUMRES_URL+"/humres/empmanage/findEmpMains";
      self.$http.post(url,self.empInfo).then(function(data){
        if(data.body.flag){
          self.name = data.body.datas.list[0].empName
        }else{
          let info = JSON.parse(localStorage.getItem("info"));
          self.name = info.empMainModel.empName;
        }
      })
    },
    submitForm(formName) {
      let self = this;
      if (this.loginInfo.password && this.loginInfo.newPassword && this.loginInfo.newPasswordIs) {
        if (this.loginInfo.newPassword != this.loginInfo.newPasswordIs) {
          self.$message({
            message: '两次输入的密码不一致！',
            type: 'warning'
          })
          return;
        }
        let url = global.AUTH_URL +"/auth/userAccount/updateUserAccount";
        self.$http.put(url, self.loginInfo).then(function(data) {
          if (data.body.flag) {
            self.$message({
              message: '修改成功！',
              type: 'success'
            });
            // window.setTimeout(function(){
            //     self.handleCommand("loginout");
            // },2000);
            this.dialogUpdatePasswordVisible = false;
          } else {
            self.$message({
              message: data.body.msg,
              type: 'error'
            })
          }
        });
      } else {
        self.$message({
          message: '请输入要修改的密码！',
          type: 'warning'
        })
      }
    },
    formatter(row, column) {
      let res = "";
      switch (row.status) {
        case 1:
          res = "下载完成";
          break;
        case 0:
          res = "下载中";
          break;
        case 3:
          res = "下载失败";
          break;
        default:
          res = "";
      }
      return res;
    },
    handleCurrentChange(val) {
      this.fileinfo.curPage = val;
      this.fileinfo.pageSize = this.pageSize;
      this.fileinfo.creator=this.userVer.empCode;
      this.cur_page = val;
      this.loadFileData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fileinfo = {
        creator:this.userVer.empCode,
        beginDate:this.beginDate,
        endDate:this.endDate,
        isPage: true,
        curPage: 1, //当前页
        pageSize: this.pageSize, //当前页条数
      };
      this.loadFileData();
    },
    search() { //搜索
      if (this.date[0]) {
        this.fileinfo.beginDate = this.date[0];
        this.fileinfo.endDate = this.date[1];
      } else {
        this.fileinfo.beginDate = '';
        this.fileinfo.endDate = '';
      }
      this.loadFileData();
      this.detailShow = true;
    },
    handleReset() {
      //重置
      this.emp = {
        isPage: true,
        curPage: 1, //当前页
        pageSize: this.pageSize //当前页条数
      };
      this.date = "";
      this.loadFileData();
    },
    downLoadFile(index, rows) {
      let self = this;
      let status = rows[index].status;
      let _fileinfo = {
        fileName: rows[index].fileName
      };
      if (status == 0) {
        self.$message("下载还未完成，请稍等...");
      } else {
        self.downloadUrl = rows[index].filePath;
        self.fullscreenLoading = true;
        setTimeout(() => {
          self.fullscreenLoading = false;
          document.getElementById("_center_download").click();
        }, 1000);
      }
    },
    handleCommand(command) {
       let self = this;
        if (command == "loginout") {
        let url=global.AUTH_URL +"/auth/sso/logout";
        let username = self.userVer;
        if(username){
          let data =  {"userName" : username.userName,"systemCode":global.SYS_CODE,"token":username.token};
          self.$http.post(url, data, self.option).then(
            function(data){
              if (data.body.flag) {
                self.$store.commit(types.LOGOUT, 'Login Out');
                localStorage.removeItem("userVer");
                localStorage.removeItem("ms_empCode");
                localStorage.removeItem("ms_deptCode");
                localStorage.removeItem("authority");
                localStorage.removeItem("info");
                window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
              }else{
                
                self.$store.commit(types.LOGOUT, 'Login Out');
                window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
                
                self.$message({
                  message: data.body.msg,
                  type: "warning"
                });
              }
            },
            function(error) {
              self.$message({
                message: "退出登录失败，请刷新重试！",
                type: "error"
              });
            }
          );
        }

      }
      if (command == "download") {
        this.dialogDownLoadVisible = true;
        this.fileinfo = {
          creator: this.userVer.empCode,
          isPage: true,
          curPage: 1, //当前页
          pageSize: this.pageSize, //当前页条数
        };
        this.loadFileData();
      }
      if (command == "updatePwd") {
        this.dialogUpdatePasswordVisible = true;
      }
    },
    loadFileData() {
      let self = this;
      self.fullscreenLoading = true;
      let url = global.HUMRES_URL + "/humres/common/findFiles";

      self.$http.post(url, self.fileinfo).then(function(data) {
        console.log(data,'data')
        if (data.body.flag) {
          self.fileTableData = data.body.datas.list;
          self.total = data.body.datas.total;
          self.fullscreenLoading = false;
        } else {
          self.$message({
            message: data.body.message,
            type: "warning"
          });
          self.fullscreenLoading = false;
        }
      },
      function(error) {
        self.$message({
          message: "请求超时，请刷新重试！",
          type: "error"
        });
      });

    },
    reload() {
      this.$router.push("/readme");
    },
    tableRowClassName({row, rowIndex}){
      if (rowIndex === 0) {
        return 'success-row';
      }
    },
    pendingTask() {
      this.$router.push("/my_agent");
    },
  }
};
</script>
<style lang="less">
.header {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; //阻止文字被选中

    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;

    .logo {
        float: left;
        margin: 2px 0 0 10px;
        text-align: center;
    }

    .header-logo {
        float: left;
        text-align: center;
        margin-top: 20px;
        padding-left: 30px;
    }

    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;

        .commission{
          color: #999;
          margin-right: 15px;
        }
        .commission:hover{
          color: #fff;
        }
        .el-dropdown-link {
            position: relative;
            display: inline-block;
            padding-left: 50px;
            color: #fff;
            cursor: pointer;
            vertical-align: middle;
        }
        .user-logo {
            position: absolute;
            left: 0;
            top: 15px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }
    .el-dropdown-menu__item {
        text-align: center;
    }
    #dialog {
      .el-dialog {
        width: 25%;
        border-radius: 4px;

        .el-dialog__header {
          background: #f5f5f5;
          border-radius: 4px 4px 0 0;
          padding: 0 15px;
        }
        .el-dialog__body {
          padding: 30px;

          .changepwd {
            width: 88%;
            display: block;
            margin: 8px auto;
          }
        }
      }
    }
    #downLoad{
      .el-dialog {
        border-radius: 4px;

        .el-dialog__header {
          background: #f5f5f5;
          border-radius: 4px 4px 0 0;
          padding: 0 15px;
        }
        .el-dialog__body {
          padding: 30px;
        }
      }
    }
    .search{
      margin-bottom: 10px;
    }
}
</style>
