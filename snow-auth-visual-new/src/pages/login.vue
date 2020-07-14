<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-06 15:59:02
 * @LastEditTime: 2019-09-09 14:00:14
 -->
<template>
  <div class="login-wrap">
    <div class="ms-title">登 录</div>
    <div class="ms-login">
      <el-form class="demo-ruleForm" v-if="showLogin" status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
          <el-form-item prop="userName">
              <el-input v-model="ruleForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
              <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" ></el-input>
          </el-form-item>
          <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
          </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import config from "../config/config.js";
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      showLogin: true,
      showWeChat: false, // 扫一扫登录
      dialogFormVisible: false, // 忘记密码弹框
      ruleForm: {//账号密码
          userName: '', //登录名
          password: '', //密码
          status:'0',
          systemCode: ""
      },
      rules: {//输入账号密码的表单验证
          userName: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ]
      },
    };
  },
  computed: {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    /**
      登录
     */
    submitForm(formName) {
      let systemCode = window.location.hash;
      this.ruleForm.systemCode = systemCode.substring(systemCode.indexOf('?') +1);
      if(systemCode.indexOf('?') == -1){
        this.$message({
            message: "重定向有误！",
            type: 'warning'
        });
        return
      }

      //验证并提交
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = global.AUTH_URL + config.auth.login;
            this.$http.post(url, this.ruleForm).then(data => {
                let winLocationHref = data.systemPath;
                console.log(data)
                localStorage.setItem('userVer',JSON.stringify(data))
                localStorage.setItem('ms_empCode',data.empCode);
                localStorage.setItem('ms_deptCode',data.deptCode);
                window.location.href = data.flag == 0 ? winLocationHref + "/common/redirect/add/" + data.token :  winLocationHref + data.token ;
                if(data.flag == 0){
                    //window.location.href = winLocationHref
                    window.location.href = winLocationHref +"/common/redirect/add/"+ data.token;
                }else{
                    window.location.href = winLocationHref + data.token;
                }
            },
            error=> {
                console.log(error)
                this.$msg._log_warn(error)
            })
        } else {
            return false;
        }
      });
    }
  },
};
</script>

<style scoped lang="scss">
.login-wrap{
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;//阻止文字被选中
        position: relative;
        width:100%;
        height:100%;
        background: url("../assets/images/bagimg.jpg") no-repeat center;
        background-size: 100% 100%;

        .ms-title{
            position: absolute;
            top:40%;
            width:100%;
            margin-top: -230px;
            text-align: center;
            font-size:30px;
            color: #fff;
        }
        .ms-login{
            position: absolute;
            right: 0;
            left: 0;
            top: 23%;
            margin: auto;
            width:400px;
            overflow: hidden;
            border-radius: 5px;
            background: #fff;

            .el-form{
                padding:40px;

                .login-btn{
                    text-align: center;

                    button{
                        width:100%;
                        height:36px;
                    }
                }
                .header-logo{
                    width: 60%;
                    margin: 0 auto;

                    img{
                        width: 100%;
                    }
                }
            }
        }
    }

</style>
