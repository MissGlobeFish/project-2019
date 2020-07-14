<template>
<div>
  <v-EmpManage v-if="showCompile" :conStr="condition" @goHrBack="goHrBack"></v-EmpManage>
  <v-SalaryDetail v-if="showSalary" @goSalaryBack="goSalaryBack"></v-SalaryDetail>
  <v-LeaveOffice v-if="showLeave" :LeaveOption="LeaveOption" @goLeaveBack="goLeaveBack"></v-LeaveOffice>
  <v-RegularOffice v-if="showRegular" @goRegularBack="goRegularBack"></v-RegularOffice>
  <vSalaryDescript v-if="showDescript" @goSalaryDescriptBack="goSalaryDescriptBack"></vSalaryDescript>
    <div v-if="showContainer" class="service-container">

      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-printer"></i> HR自助</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="service-entrance-container">
      <el-collapse v-model="activeNames">
  <el-collapse-item title="组织架构相关" name="1">
      <el-row :gutter="10">
          <el-col :span="5">
            <div class="service-content" @click="handleTeam">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yonghu"></use>
                </svg>
              </p>
              <div class="desc">
                <p>我的团队</p>
                <p style="font-size:12px;color:#000;">查询团队成员，导出员工信息</p>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="service-content" @click="handleRegular">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianqianzhi"></use>
                </svg>
              </p>
              <div class="desc">
                <p>转正申请</p>
                <p style="font-size:12px;color:#000;">员工转正，提交申请</p>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="service-content">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-wenjian"></use>
                </svg>
              </p>
              <div class="desc">
                <p>晋升申请</p>
                <p style="font-size:12px;color:#000;">发起职级晋升申请</p>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="service-content" @click="handleLeave">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiaoxi"></use>
                </svg>
              </p>
              <div class="desc">
                <p>离职申请</p>
                <p style="font-size:12px;color:#000;">员工离职，提交审批</p>
              </div>
            </div>
          </el-col>
        </el-row>
  </el-collapse-item>

  <el-collapse-item title="考勤 / 绩效" name="2">
    <el-row :gutter="10">
          <el-col :span="5">
            <div class="service-content" @click="handleTeam">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shouji"></use>
                </svg>
              </p>
              <div class="desc">
                <p>考勤管理</p>
                <p style="font-size:12px;color:#000;">查询排班信息，提交/审核请假单</p>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="service-content" @click="handleRegular">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-liuyanzhi"></use>
                </svg>
              </p>
              <div class="desc">
                <p>绩效管理</p>
                <p style="font-size:12px;color:#000;">查询绩效信息，填写核定绩效结果</p>
              </div>
            </div>
          </el-col>
        </el-row>
  </el-collapse-item>

  <el-collapse-item title="薪酬福利" name="3">
    <el-row :gutter="10">
    <el-col :span="5">
        <div class="service-content" @click="handleRefer">
            <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-meijin"></use>
            </svg>
            </p>
            <div class="desc">
                <p>薪酬查询</p>
                <p style="font-size:12px;color:#000;">员工工资，福利查询</p>
            </div>
          </div>
    </el-col>
    <el-col :span="5">
            <div class="service-content" @click="handleSalary">
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinzhu"></use>
                </svg>
              </p>
              <div class="desc">
                <p>销售提存</p>
                <p style="font-size:12px;color:#000;">销售提存</p>
              </div>
            </div>
          </el-col>
        </el-row>
    
  </el-collapse-item>
</el-collapse>
</div>

      <div class="dialogBox">
        <el-dialog title="短信验证" :visible.sync="dialogCheckVerifyCode">
          <el-form :model="verifyCode" ref="verifyCode" class="demo-ruleForm-sms">
            <el-form-item prop="code" :rules="[{ required: true, message: '验证码不能为空'}]">
              <el-input class='verifyCode' v-model="verifyCode.code" type="text" placeholder="请输入短信验证码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="margin-left:20px;" @click="checkVerifyCode('verifyCode')">确 认</el-button>
              <el-button :disabled="timeDisabled" type="primary" @click="sendVerifyCode">点击获取验证码 {{time}}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

    </div>
</div>
</template>

<script>
import vEmpManage from '../page/EmpManage'
import vSalaryDetail from '../common/SalaryDetail'
import vLeaveOffice from '../common/LeaveOffice'
import vRegularOffice from '../common/RegularOffice'
import vSalaryDescript from '../page/SalaryDescript'
    export default {
        data() {
          return {
            activeNames: ['1', '2', '3'],
            condition:'',
            showCompile:false,
            showSalary: false,
            showLeave: false,
            showRegular: false,
            showDescript: false,
            showContainer:true,
            dialogCheckVerifyCode: false,
            verifyCode: {code:""},
            timeOut: null,
            time: "",
            timeDisabled: false,
            LeaveOption: {
                LeaveId: 'application',
                k3BillNo: ''
            },
            userVer:{},
            option: {
                timeout: 30 * 1000 //30秒过期
            },
            entry: '' // 入口标记
          }
        },
        components:{
          vEmpManage,
          vSalaryDetail,
          vLeaveOffice,
          vRegularOffice,
          vSalaryDescript
        },
        created(){
           if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){
              this.userVer = JSON.parse(localStorage.getItem("userVer"));
          }
        },
        methods:{
          goHrBack() {//我的团队
            //这里接收子组件传到父组件的值
            this.showCompile = arguments[0];
            this.showContainer = true;
          },
          goSalaryBack() {//薪酬查询
            //这里接收子组件传到父组件的值
            this.showSalary = arguments[0];
            this.showContainer = true;
          },
          goLeaveBack() {//离职申请
            //这里接收子组件传到父组件的值
            this.showLeave = arguments[0];
            this.showContainer = true;
          },
          goRegularBack() {//转正申请
            //这里接收子组件传到父组件的值
            this.showRegular = arguments[0];
            this.showContainer = true;
          },
          goSalaryDescriptBack() {//销售提存
            //这里接收子组件传到父组件的值
            this.showDescript = arguments[0];
            this.showContainer = true;
          },
          handleTeam(){//我的团队
            this.condition = localStorage.getItem("ms_empCode");
            this.showCompile = true;
            this.showContainer = false;
          },
          handleRefer(){//薪酬查询
            //弹窗
            this.entry = 'salarysearch'
            this.dialogCheckVerifyCode =true;
          },
          handleLeave(){//离职申请
            this.showLeave=true;
            this.showContainer=false;
          },
          handleRegular(){//转正申请
            this.showRegular=true;
            this.showContainer=false;
          },
          handleSalary () { // 销售提存
            this.entry = 'salarydescript'
            this.dialogCheckVerifyCode =true;
            // this.showDescript = true
            // this.showContainer = false
          },
          handleBack() {//返回
            this.showCompile=false;
            this.showContainer=true;
          },
          sendVerifyCode(){//发送验证码
            let userVer = this.userVer;
            let self = this;
            if(userVer){
              let empCode = userVer.empCode;
              let url =  global.HUMRES_URL +  "/humres/common/verify/add/"+empCode;
              self.$http.get(url, self.option).then(
                function(data) {
                  if (data.body.flag) {
                    self.$message({
                      message: "短信验证码已发送，请注意查看！",
                      type: 'success'
                    });
                    self.timeDisabled = true;
                    self.time = 60;
                    self.times();
                  } else {
                    self.$message({
                      message: data.body.msg,
                      type: 'warning'
                    });
                  }
                },
                function(error) {
                  // 这里是处理错误的回调
                  self.$message({
                    message: "请求超时！",
                    type: 'error'
                  });
                }
              );
            }
          },

          checkVerifyCode(formName){//确认验证码输入正确，查询薪酬福利
            this.$refs[formName].validate((valid) => {
              if (valid) {
                let self = this;
                let userVer = self.userVer;
                if(userVer) {
                  let empCode = userVer.empCode;
                  let url = global.HUMRES_URL +  "/humres/common/verify/check/"+ empCode;
                  let data = self.verifyCode;
                  window.localStorage.setItem("securityCode", self.verifyCode.code);
                  self.$http.post(url, data, self.option).then(function (data) {// 这里是处理正确的回调
                    if(data.body.flag) {
                        self.dialogCheckVerifyCode = false;
                        self.time = '';
                        self.timeDisabled = false;
                        if (this.entry == 'salarysearch') { // 判断是哪个入口调用的发送验证码salarysearch--薪酬查询salarydescript--销售提存
                          self.showSalary = true;
                        } else if (this.entry == 'salarydescript') {
                          self.showDescript = true;
                        }
                        // self.showSalary = true;
                        this.entry=''
                        self.showContainer=false;
                    }else{
                        self.$message({
                          message: "短信验证码错误！",
                          type: 'warning'
                        });
                    }
                  });
                }
              } else {
                return false;
              }
            });

          },
          times(){//发送验证码计时器
            var self = this;
            self.timeOut = window.setTimeout(function(){
              self.time --;
              if(self.time > 0) {
                self.times();
              }else{
                self.time ="";
                self.timeDisabled = false;
              }
            },1000);
          },
        }
    }
</script>

<style lang="less">

.el-collapse-item__header {
  font-size: large;
}
    .service-container {
      background: #fff;
      box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
      padding: 20px;

      .crumbs{
          margin-bottom: 40px;
      }
      .el-row {
        margin-bottom: 20px;

        .el-col {
          width: 20%;
          border-radius: 4px;
          cursor: pointer;
          padding: 0 !important;

          .service-content {
            padding:40px 0 0 0;
            height:130px;
            width:80%;
            box-shadow: 1px 1px 2px 1px rgba(204, 204, 204, 0.5);
            text-align:center;
            margin: 10px auto;

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
      .dialogBox{
        .el-dialog {
          width: 25%;
          border-radius: 4px;

          .el-dialog__header {
            background: #f5f5f5;
            border-radius: 4px 4px 0 0;
          }
          .el-dialog__body {
            padding: 30px;

            .el-form{
              .el-button{
                float: right;
              }
            }

            .el-form-item__content {
              margin: 0 !important;
            }
          }
        }
      }
    }
</style>
