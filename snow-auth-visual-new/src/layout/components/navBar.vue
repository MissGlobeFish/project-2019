<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 15:23:17
 * @LastEditTime: 2019-09-19 11:29:59
 -->
<template>
<div class="navbar">
  <div class="navbar-header flex fix">
    <div class="logo"><img src="../../assets/images/logo.png" alt="logo"><span>旺小宝内网权限系统</span></div>
      <el-dropdown trigger="click"  @command="handleCommand">
        <div class="right-menu"><img src="../../assets/images/img.jpg" alt="头像"><span>{{name}}</span></div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item type="text" command="updatePwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </div>

  <el-dialog title="修改密码" :visible.sync="dialogUpdatePasswordVisible" width="30%" :before-close="handleClose">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPasswordIs">
        <el-input type="password" v-model="ruleForm.newPasswordIs" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="text-align:right;">
        <el-button @click="cancelForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</div>
</template>
<script>
import * as types from '../../store/types'
import config from "../../config/config.js";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入原密码'));
      } else {
        callback();
      }
    };
    var validateNewPasswordIs = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.newPassword !== '') {
          this.$refs.ruleForm.validateField('newPassword');
        }
        callback();
      }
    };
    var validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPasswordIs) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userVer :{},
      ruleForm: {
        userName: '',
        empCode: localStorage.getItem("ms_empCode"),
        password: '',
        newPassword: '',
        newPasswordIs: ''
      },
      rules: {
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        newPasswordIs: [
          { validator: validateNewPasswordIs, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validateNewPassword, trigger: 'blur' }
        ],
      },
      empInfo:{
        spell:''
      },
      name: "加载ing...", 
      dialogUpdatePasswordVisible: false,
    };
  },
  created() {
   if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){
     this.userVer =  JSON.parse(localStorage.getItem("userVer"));
     this.ruleForm.userName =this.userVer.userName;
   };
    this.username();
  },
  computed: {
  },
  methods: {
    username() {
      let info = this.userVer;
      this.empInfo.spell = info.userName;
      let url = config.auth.findEmpMains;
      this.$http.post(url, this.empInfo).then((data)=>{
        this.name = data.list[0].empName
      })
      .catch((err)=> {
        let info = JSON.parse(localStorage.getItem("info"));
        this.name = info.empMainModel.empName;
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let self = this;
          let url = global.AUTH_URL + config.auth.userAccount;
          self.$http.put(url, self.ruleForm).then(function(data) {
              console.log(data)
            if (data.flag) {
              self.$confirm('密码修改成功，请重新登录，点击确定回到登录界面',  '提示', {
                  confirmButtonText: '重新登录',
                  cancelButtonText: '取消',
                  type: 'success'
              }).then(() => {
                  self.handleCommand("loginout");
              })
            } else {
              self.$message({
                message: data.msg,
                type: 'error'
              })
            }
          },
          function(error) {
            self.$message({
              message: error,
              type: 'error'
            })
          });
        } else {
          return false;
        }
      });
    },
    cancelForm(formName) {
      this.dialogUpdatePasswordVisible = false;
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      this.$refs.ruleForm.resetFields();
      done();
    },
    handleCommand(command) {
       let self = this;
        if (command == "loginout") {
        let url=global.AUTH_URL + config.auth.logout;
        let username = self.userVer;
        if(username){
          let data =  {"userName" : username.userName,"systemCode":global.SYS_CODE,"token":username.token};
          self.$http.post(url, data).then(
            function(data){
              if (data.flag) {
                console.log(data)
                self.$store.commit(types.LOGOUT, 'Login Out');
                localStorage.removeItem("userVer");
                localStorage.removeItem("ms_empCode");
                localStorage.removeItem("ms_deptCode");
                localStorage.removeItem("authority");
                localStorage.removeItem("info");
                // window.location.href = global.AUTH_VISUAL_URL +"/#/login?666";
                window.location.href = global.AUTH_VISUAL_URL +"/#/login?"+global.SYS_CODE;
              }else{
                self.$message({
                  message: data.msg,
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
      if (command == "updatePwd") {
        this.dialogUpdatePasswordVisible = true;
      }
    },
  }
};
</script>
<style scoped lang="scss">
  
</style>