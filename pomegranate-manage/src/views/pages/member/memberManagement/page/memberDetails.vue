<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员详情</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
      <div class="containerBox">

        <!-- 基本信息 -->
        <h3>基本信息</h3>
        <div class="basicBox">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="basicItem">
                        <span>姓名：</span>
                        <i>{{details.name}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>手机：</span>
                        <i>{{details.phoneNum}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>性别：</span>
                        <i>{{details.sex == 1 ? '男' : '女'}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>城市：</span>
                        <i>{{details.cityName}}</i>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="basicItem">
                        <span>用户编码：</span>
                        <i>{{details.memberNo}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>会员类型：</span>
                        <i>{{details.cardType}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>用户等级：</span>
                        <i>{{details.level}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>用户名称：</span>
                        <i>{{details.wxName}}</i>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="basicItem">
                        <span>会员到期时间：</span>
                        <i>{{details.expireDate}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>微信OPENID：</span>
                        <i>{{details.openid}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>创建时间：</span>
                        <i>{{details.lastCreateTime}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>谁介绍入会的：</span>
                        <i>{{details.inviterMemberNo}}</i>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="basicItem">
                        <span>行业：</span>
                        <i>{{details.business}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>职务：</span>
                        <i>{{details.post}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span>公司名称：</span>
                        <i>{{details.company}}</i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="basicItem">
                        <span></span>
                        <i></i>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 调整研值 dialog -->
        <el-dialog class="researchDialog" title="调整研值" :append-to-body="true" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

          <!-- dialog-body -->
          <el-form :model="researchForm" ref="researchForm" label-width="80px" class="demo-ruleForm">

            <el-form-item label="调整：" prop="score" :rules="{ required: true, message: '研值不能为空', trigger: 'blur' }">
              <el-input-number v-model="researchForm.score" label="研值"></el-input-number>
            </el-form-item>
            <el-form-item label="备注：" prop="desc" :rules="{ required: true, message: '备注不能为空', trigger: 'blur' }">
              <el-input v-model="researchForm.desc" type="textarea" resize="none" :autosize="{ minRows: 10, maxRows: 20}" placeholder="请输入内容">
                </el-input>
            </el-form-item>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleDialogSave('researchForm')">保 存</el-button>
          </span>

        </el-dialog>

        <!-- Tab标签页 -->
        <div class="tabBox">
            <el-tabs type="border-card" @tab-click="handleClick">
                <el-tab-pane>
                    <span slot="label"> 研值</span>
                    <div class="title">
                        <div>
                            <span>现有研值：</span>
                            <i style="margin-right:15px;">{{score}} 分</i>
                            <el-button type="primary" plain size="mini" @click="handleAdjust">调 整</el-button>
                        </div>
                    </div>
                    <!-- 研值表格 -->
                    <el-table :data="researchData" v-loading="researchLoading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="300" style="width: 100%;">
                        <el-table-column type="index" fixed width="100" align="center"></el-table-column>
                        <el-table-column prop="scoreProject" label="增减项" align="center"></el-table-column>
                        <el-table-column prop="score" label="增减值" align="center"></el-table-column>
                        <el-table-column prop="scoreDesc" label="备注" align="center"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"> 课程</span>
                    <div class="title">
                        <div>
                            <span>已报课程：</span>
                            <i>{{signRate.signCount}} 次</i>
                        </div>
                        <div>
                            <span>签到次数：</span>
                            <i>{{signRate.signNum}} 次</i>
                        </div>
                        <div>
                            <span>出勤率：</span>
                            <i>{{signRate.signRate * 100}} %</i>
                        </div>
                    </div>
                    <!-- 课程表格 -->
                    <el-table :data="courseData" v-loading="courseLoading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="300" style="width: 100%;">
                        <el-table-column type="index" fixed width="100" align="center"></el-table-column>
                        <el-table-column prop="scheduleNo" label="课程编号" align="center"></el-table-column>
                        <el-table-column prop="title" label="课程名称" align="center"></el-table-column>
                        <el-table-column prop="courseDate" label="授课日期" align="center"></el-table-column>
                        <el-table-column prop="courseTime" label="授课时间" align="center"></el-table-column>
                        <el-table-column prop="signFlag" label="是否签到" align="center"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div class="pagination">
                        <el-pagination 
                            style="margin: 20px 0;text-align: right;"
                            @size-change="handleSizeChange" 
                            @current-change="handleCurrentChange" 
                            :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
                            :page-size="pageSize" 
                            layout="total, sizes, prev, pager, next" 
                            :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"> 卡券</span>
                    <div class="title">
                        <span>剩余券：</span>
                        <i>{{ticketData.length}} 张</i>
                    </div>
                    <!-- 券表格 -->
                    <el-table :data="ticketData" v-loading="ticketLoading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="300" style="width: 100%;">
                        <el-table-column type="index" fixed width="100" align="center"></el-table-column>
                        <el-table-column prop="ticketName" label="名称" align="center"></el-table-column>
                        <el-table-column prop="ticketNo" label="券号" align="center"></el-table-column>
                    </el-table>
                    
                    <div class="title">
                        <span>剩余卡：</span>
                        <i>{{memberCardData.length}} 张</i>
                    </div>
                    <!-- 卡表格 -->
                    <el-table :data="memberCardData" v-loading="memberCardLoading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="300" style="width: 100%;">
                        <el-table-column type="index" fixed width="100" align="center"></el-table-column>
                        <el-table-column prop="cardTypeName" label="名称" align="center"></el-table-column>
                        <el-table-column prop="cardKey" label="卡密" align="center"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
      </div>
    </template>
   
  </d2-container>
</template>

<script>
import https from '../../../../../https.js'
export default {
    components: {

    },
    data () {
        return {
            filename: __filename,
            researchLoading: false,// 研值表格加载
            courseLoading: false,// 课程表格加载
            ticketLoading: false,// 券表格加载
            memberCardLoading: false,// 卡表格加载
            dialogVisible: false,//调整研值弹框显示

            /* 页面详情 */
            details: {},

            /* 研值调整数据 */
            researchForm: {
                score: 1,
                desc: '',
            },

            /* 研值表格数据 */
            researchData: [],
            score: null,

            /* 课程表格数据 */
            courseData: [],
            signRate: {},

            /* 卡券表格数据 */
            ticketData: [],
            memberCardData: [],

            /* 分页 */
            total: 0,
            pageNum: 1,
            pageSize: 10,
        }
    },
    created() {
        if (JSON.parse(localStorage.getItem("memberDetails"))) {
            this.details = JSON.parse(localStorage.getItem("memberDetails"));
        }
        if (this.details.cardType == 'Y0') {
            this.details.cardType = '普通用户'
        }else if (this.details.cardType == 'Y1') {
            this.details.cardType = '研习会员'
        }else if (this.details.cardType == 'Y2') {
            this.details.cardType = '研学会员'
        }else if (this.details.cardType == 'Y3') {
            this.details.cardType = '研修会员'
        }else if (this.details.cardType == 'Y4') {
            this.details.cardType = '企业会员'
        }
        this.getResearchList();
        this.getScore();
    },
    methods: {
        // 查询研值列表
        getResearchList () {
            this.researchLoading = true;
            let self = this;
            https.fetchGet('/pomegranate/web/score/list?openid='+self.details.openid)
            .then(function(res){
                if (res.data.code) {
                    self.researchLoading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.researchLoading = false;
                    self.researchData = res.data.list;
                }
            })
            .catch(function(err){
                self.researchLoading = false;
                self.$message({
                    type: 'warning',
                    message: '研值列表查询失败！'
                });
            })
        },

        //查询研值总额
        getScore () {
            let self = this;
            https.fetchGet('/pomegranate/web/score/'+self.details.openid)
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.score = res.data.score;
                }
            })
            .catch(function(err){
                self.$message({
                    type: 'warning',
                    message: '现有研值查询失败！'
                });
            })
        },

        //查询课程人员信息
        getSign () {
            this.courseLoading = true;
            let self = this;
            https.fetchGet('/pomegranate/web/course/sign-details?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize + '&uid=' + self.details.openid)
            .then(function(res){
                if (res.data.code) {
                    self.courseLoading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.courseLoading = false;
                    self.courseData = res.data.list;
                    self.total = parseInt(res.data.total);
                    self.courseData.forEach(element => {
                        element.courseTime = element.courseStartTime + ' - ' + element.courseEndTime; 
                        if (element.signFlag == 0) {
                            element.signFlag = '否';
                        }else if(element.signFlag == 1){
                            element.signFlag = '是';
                        }
                    });
                }
            })
            .catch(function(err){
                self.courseLoading = false;
                self.$message({
                    type: 'warning',
                    message: '课程人员信息查询失败！'
                });
            })
        },

        //查询课程统计信息
        getSignRate () {
            let self = this;
            https.fetchGet('/pomegranate/web/course/sign-rate?uid=' + self.details.openid)
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.signRate = res.data;
                    console.log(typeof(self.signRate.signNum))
                    if (self.signRate.signNum == 'undefined') {
                        console.log(1)
                        self.signRate.signNum = 0;
                    }
                }
            })
            .catch(function(err){
                self.$message({
                    type: 'warning',
                    message: '课程统计查询失败！'
                });
            })
        },

        // 查询卡列表
        getMemberCardList () {
            this.memberCardLoading = true;
            let self = this;
            https.fetchGet('/pomegranate/web/member/list?openid='+self.details.openid)
            .then(function(res){
                if (res.data.code) {
                    self.memberCardLoading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.memberCardLoading = false;
                    self.memberCardData = res.data.list;
                }
            })
            .catch(function(err){
                self.memberCardLoading = false;
                self.$message({
                    type: 'warning',
                    message: '卡券列表查询失败！'
                });
            })
        },

        // 查询券列表
        getTicketList () {
            this.ticketLoading = true;
            let self = this;
            https.fetchGet('/pomegranate/web/ticket/list?openid='+self.details.openid)
            .then(function(res){
                if (res.data.code) {
                    self.ticketLoading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.ticketLoading = false;
                    self.ticketData = res.data.list;
                }
            })
            .catch(function(err){
                self.ticketLoading = false;
                self.$message({
                    type: 'warning',
                    message: '卡券列表查询失败！'
                });
            })
        },

        //调整研值
        handleAdjust(){
            this.dialogVisible = true;
            this.researchForm.score = 1;
        },

        //保存研值调整
        handleDialogSave(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let self = this;
                    var formData = new FormData();
                    formData.append("score", self.researchForm.score);
                    formData.append("desc", self.researchForm.desc);
                    formData.append("uid", self.details.openid);
                    https.fetchPut('/pomegranate/web/score', formData)
                    .then(function(res){
                        if (res.data.code) {
                            self.$message({
                                type: 'warning',
                                message: '信息提交失败，请检查后重试！'
                            });
                        }else{
                            self.$message({
                                type: 'success',
                                message: '调整研值成功！',
                            });
                            self.dialogVisible = false;
                            self.getResearchList();
                            self.getScore();
                        }
                    })
                    .catch(function(err){
                        self.$message({
                            type: 'warning',
                            message: '调整研值失败 ！'
                        });
                    })
                } else {
                    return false;
                }
            });
        },

        //切换Tab
        handleClick(tab, event){
            if (tab.index == 0) {
                this.getResearchList();
                this.getScore();
            }else if (tab.index == 1) {
                this.getSign();
                this.getSignRate();
            }else if (tab.index == 2) {
                this.getMemberCardList();
                this.getTicketList();
            }
        },

        //误操作关闭 dialog 的提示
        handleClose(done) {
            this.$confirm('确认关闭？编辑的内容将不会被保存！, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                done();
            }).catch(() => {});
        },

        //切换当页显示数据条数
        handleSizeChange(val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.getTableList({})
        },
        
        //切换页码
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getTableList({})
        },
    }
}
</script>

<style lang="scss">
    i{ font-style: normal; }
  .el-row {
    margin-bottom: 50px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .basicBox{
      padding: 20px;
      margin-bottom: 30px;
      span{
          font-size: 16px;
      }
      i{
          font-size: 14px;
          color: #666;
      }
  }
  .tabBox{
      .title{
          margin: 15px 0;
          padding-left: 15px;
          div{
              display: inline-block;
              margin-right: 80px;
          }
      }
      .el-table{
          box-shadow: none;
      }
  }
  .researchDialog{
        .el-dialog{
            .el-dialog__header{
                background: #F9F9F9;
                border-bottom: 1px solid #DDDDDD;
            }
            .el-input-number{
                width: 40%;
                .el-input{
                width: 100%;
                }
            }
        }
    }
</style>
