<template>
<div class="candidate">
  <div class="tablebox">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-bell"></i> 招聘管理</el-breadcrumb-item>
        <el-breadcrumb-item>候选人</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <div class="search" style="display:flex;">
        <el-input size='mini' placeholder="姓名 / 手机号 / 邮箱 / 标签" v-model="searchInfo" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button size='mini' type="primary" plain @click="dialogVisible = true"> + 添加候选人</el-button>
      </div>
    </div>

    <el-dialog title="添加候选人" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="150px">
            <div class="left-box">
                <el-form-item label="应聘职位：" prop="Jobs" :rules="{ required: true, message: '应聘职位不能为空', trigger: 'blur' }">
                    <el-select v-model="form.Jobs" placeholder="请选择应聘职位">
                        <el-option label="Web前端工程师" value="Web前端工程师"></el-option>
                        <el-option label="JAVA工程师" value="JAVA工程师"></el-option>
                        <el-option label="售后服务工程师" value="售后服务工程师"></el-option>
                        <el-option label="Android工程师" value="Android工程师"></el-option>
                        <el-option label="IOS工程师" value="IOS工程师"></el-option>
                        <el-option label="HRBP" value="HRBP"></el-option>
                        <el-option label="产品经理" value="产品经理"></el-option>
                        <el-option label="销售经理" value="销售经理"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号：" prop="cellphone" :rules="{ required: true, message: '手机号不能为空', trigger: 'blur' }">
                    <el-input v-model="form.cellphone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="gender">
                    <el-radio-group v-model="form.gender">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="工作年限：" prop="serviceYear">
                    <el-input v-model="form.serviceYear" placeholder="请输入工作年限"></el-input>
                </el-form-item>
                <el-form-item label="毕业院校：" prop="schoolTag">
                    <el-input v-model="form.schoolTag" placeholder="请输入毕业院校"></el-input>
                </el-form-item>
                <el-form-item label="招聘渠道：" prop="channel">
                    <el-select v-model="form.channel" placeholder="请选择招聘渠道">
                        <el-option label="拉勾网" value="拉勾网"></el-option>
                        <el-option label="智联招聘" value="智联招聘"></el-option>
                        <el-option label="前程无忧" value="前程无忧"></el-option>
                        <el-option label="猎聘网" value="猎聘网"></el-option>
                        <el-option label="中国人才热线" value="中国人才热线"></el-option>
                        <el-option label="58同城" value="58同城"></el-option>
                        <el-option label="BOSS直聘" value="BOSS直聘"></el-option>
                        <el-option label="赶集网" value="赶集网"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="right-box">
                <el-form-item label="姓名：" prop="candiName" :rules="{ required: true, message: '姓名不能为空', trigger: 'blur' }">
                    <el-input v-model="form.candiName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="mailbox">
                    <el-input v-model="form.mailbox" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="年龄：" prop="age">
                    <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
                </el-form-item>
                <el-form-item label="学历：" prop="education">
                    <el-select v-model="form.education" placeholder="请选择学历">
                        <el-option label="小学" value="小学"></el-option>
                        <el-option label="初中" value="初中"></el-option>
                        <el-option label="高中" value="高中"></el-option>
                        <el-option label="大专" value="大专"></el-option>
                        <el-option label="本科" value="本科"></el-option>
                        <el-option label="硕士" value="硕士"></el-option>
                        <el-option label="博士" value="博士"></el-option>
                        <el-option label="博士后" value="博士后"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最近工作单位：" prop="workUnit">
                    <el-input v-model="form.workUnit" placeholder="请输入最近工作单位"></el-input>
                </el-form-item>
                <el-form-item label="简历：" prop="resume">
                    <el-upload class="upload-demo" action="" multiple :limit="3">
                        <el-button size="small" type="primary" plain>点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </div>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" v-model="form.remark" :rows="4" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">保 存</el-button>
        </span>
    </el-dialog>
        
    <el-table ref="applyTable" :data="dataList" border style="width: 100%" size='mini' v-loading="tableLoading">
      <el-table-column type="index" fixed width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="candiName" label="姓名" width="100"></el-table-column>
      <el-table-column align="center" prop="Jobs" label="招聘职位" width="100"></el-table-column>
      <el-table-column align="center" prop="degree" label="面试轮次" width="100">
        <template slot-scope="scope">
              <el-tag v-if="scope.row.degree==0" size="medium" type="success">一轮</el-tag>
              <el-tag v-if="scope.row.degree==1" size="medium" type="warning">二轮</el-tag>
              <el-tag v-if="scope.row.degree==2" size="medium">三轮</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="branch" label="用人部门" width="100"></el-table-column>
      <el-table-column align="center" prop="HRBP" label="招聘负责人" width="100"></el-table-column>
      <el-table-column align="center" prop="gender" label="性别" width="80">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.gender==0" size="medium">男</el-tag>
              <el-tag v-if="scope.row.gender==1" size="medium" type="danger">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column align="center" prop="serviceYear" label="工作年限" width="80"></el-table-column>
      <el-table-column align="center" prop="education" label="学历" width="80"></el-table-column>
      <el-table-column align="center" prop="schoolTag" label="毕业院校" width="120"></el-table-column>
      <el-table-column align="center" prop="workUnit" label="最近工作单位" width="180"></el-table-column>
      <el-table-column align="center" prop="cellphone" label="手机号码" width="100"></el-table-column>
      <el-table-column align="center" prop="apartment" label="现居住地" width="180"></el-table-column>
      <el-table-column align="center" prop="salary" label="期望月薪" width="80"></el-table-column>
      <el-table-column align="center" prop="channel" label="招聘渠道" width="100"></el-table-column>
      <el-table-column align="center" prop="creatDate" label="添加时间" width="130"></el-table-column>
      <el-table-column align="center" prop="interviewDate" label="面试时间" width="130"></el-table-column>
      <el-table-column align="center" prop="interviewer" label="面试官"></el-table-column>
      <el-table-column align="center" prop="otherInterviewer" label="其他面试官" width="100"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="70">
        <template slot-scope="scope">

          <el-dropdown size="mini">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>人才测评</el-dropdown-item>
              <el-dropdown-item>背调TA</el-dropdown-item>
              <el-dropdown-item>移动到初选通过</el-dropdown-item>
              <el-dropdown-item>安排面试</el-dropdown-item>
              <el-dropdown-item>移动到面试通过</el-dropdown-item>
              <el-dropdown-item>移动到待入职</el-dropdown-item>
              <el-dropdown-item>淘汰/流失</el-dropdown-item>
              <el-dropdown-item>下载简历</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</div>
</template>
<style>
.el-table .success-row {
  background: #f6faff;
}
</style>
<script>
export default {
  data() {
    return {
        searchInfo: '',
        dialogVisible: false,
        form: {
            Jobs: '',
            cellphone: '',
            gender: '男',
            serviceYear: '',
            schoolTag: '',
            channel: '',
            candiName: '',
            mailbox: '',
            age: '',
            education: '',
            workUnit: '',
            resume: '',
            remark: ''
        },
        dataList: [{
            candiName: '李怡然',
            Jobs: '大区经理',
            branch: '地产成都',
            HRBP: '杨女士',
            gender: 1,
            age: '28',
            serviceYear: '6',
            education: '本科',
            schoolTag: '成都理工大学',
            workUnit: '旺小宝成都科技有限公司',
            cellphone: '17356235623',
            apartment: '成都市双流区中和街道',
            salary: '7-8K',
            channel: '拉勾网',
            creatDate: '2019-11-19 10:30',
            degree: 1,
            interviewDate: '2019-11-20 09:30',
            interviewer: '罗雄海',
            otherInterviewer: '刘琪',
            },{
            candiName: '张启立',
            Jobs: '销售经理',
            branch: '销售部',
            HRBP: '杨女士',
            gender: 0,
            age: '32',
            serviceYear: '10',
            education: '大专',
            schoolTag: '四川职业技术学院',
            workUnit: '成都哆啦A梦科技有限公司',
            cellphone: '13389568956',
            apartment: '成都市锦江区***',
            salary: '6K',
            channel: '智联招聘',
            creatDate: '2019-11-19 10:30',
            degree: 0,
            interviewDate: '2019-11-20 09:30',
            interviewer: '刘晓琴',
            otherInterviewer: '张桓',
            },{
            candiName: '姚琴',
            Jobs: 'HRBP',
            branch: '人力行政部',
            HRBP: '杨女士',
            gender: 1,
            age: '24',
            serviceYear: '3',
            education: '大专',
            schoolTag: '川北医学院',
            workUnit: '旺小宝成都科技有限公司',
            cellphone: '17356235623',
            apartment: '成都市双流区中和街道',
            salary: '3.5K',
            channel: 'BOSS直聘',
            creatDate: '2019-11-19 10:30',
            degree: 1,
            interviewDate: '2019-11-20 09:30',
            interviewer: '罗雄海',
            otherInterviewer: '刘琪',
            },{
            candiName: '杨瀚',
            Jobs: '销售经理',
            branch: '销售部',
            HRBP: '杨女士',
            gender: 0,
            age: '26',
            serviceYear: '4',
            education: '本科',
            schoolTag: '西安石油大学',
            workUnit: '成都哆啦A梦科技有限公司',
            cellphone: '13389568956',
            apartment: '成都市锦江区***',
            salary: '6K',
            channel: '智联招聘',
            creatDate: '2019-11-19 10:30',
            degree: 0,
            interviewDate: '2019-11-20 09:30',
            interviewer: '刘晓琴',
            otherInterviewer: '张桓',
            },{
            candiName: '萧何',
            Jobs: '大区经理',
            branch: '地产成都',
            HRBP: '杨女士',
            gender: 1,
            age: '28',
            serviceYear: '6',
            education: '本科',
            schoolTag: '成都理工大学',
            workUnit: '旺小宝成都科技有限公司',
            cellphone: '17356235623',
            apartment: '成都市双流区中和街道',
            salary: '6K',
            channel: '拉勾网',
            creatDate: '2019-11-19 10:30',
            degree: 2,
            interviewDate: '2019-11-20 09:30',
            interviewer: '罗雄海',
            otherInterviewer: '刘琪',
            },{
            candiName: '周友林',
            Jobs: '销售经理',
            branch: '销售部',
            HRBP: '杨女士',
            gender: 0,
            age: '32',
            serviceYear: '10',
            education: '大专',
            schoolTag: '四川职业技术学院',
            workUnit: '成都哆啦A梦科技有限公司',
            cellphone: '13389568956',
            apartment: '成都市锦江区***',
            salary: '6K',
            channel: '智联招聘',
            creatDate: '2019-11-19 10:30',
            degree: 0,
            interviewDate: '2019-11-20 09:30',
            interviewer: '刘晓琴',
            otherInterviewer: '张桓',
            },{
            candiName: '徐玉荣',
            Jobs: '大区经理',
            branch: '地产成都',
            HRBP: '杨女士',
            gender: 0,
            age: '28',
            serviceYear: '6',
            education: '本科',
            schoolTag: '成都理工大学',
            workUnit: '旺小宝成都科技有限公司',
            cellphone: '17356235623',
            apartment: '成都市双流区中和街道',
            salary: '7-8K',
            channel: '拉勾网',
            creatDate: '2019-11-19 10:30',
            degree: 1,
            interviewDate: '2019-11-20 09:30',
            interviewer: '罗雄海',
            otherInterviewer: '刘琪',
            },{
            candiName: '李南海',
            Jobs: '销售经理',
            branch: '销售部',
            HRBP: '杨女士',
            gender: 0,
            age: '32',
            serviceYear: '10',
            education: '大专',
            schoolTag: '四川职业技术学院',
            workUnit: '成都哆啦A梦科技有限公司',
            cellphone: '13389568956',
            apartment: '成都市锦江区***',
            salary: '6K',
            channel: '智联招聘',
            creatDate: '2019-11-19 10:30',
            degree: 1,
            interviewDate: '2019-11-20 09:30',
            interviewer: '刘晓琴',
            otherInterviewer: '张桓',
            },{
            candiName: '薛海',
            Jobs: '大区经理',
            branch: '地产成都',
            HRBP: '杨女士',
            gender: 0,
            age: '28',
            serviceYear: '6',
            education: '本科',
            schoolTag: '成都理工大学',
            workUnit: '旺小宝成都科技有限公司',
            cellphone: '17356235623',
            apartment: '成都市双流区中和街道',
            salary: '7-8K',
            channel: '拉勾网',
            creatDate: '2019-11-19 10:30',
            degree: 2,
            interviewDate: '2019-11-20 09:30',
            interviewer: '罗雄海',
            otherInterviewer: '刘琪',
            },{
            candiName: '龚欣桐',
            Jobs: '销售经理',
            branch: '销售部',
            HRBP: '杨女士',
            gender: 1,
            age: '32',
            serviceYear: '10',
            education: '大专',
            schoolTag: '四川职业技术学院',
            workUnit: '成都哆啦A梦科技有限公司',
            cellphone: '13389568956',
            apartment: '成都市锦江区***',
            salary: '6K',
            channel: '智联招聘',
            creatDate: '2019-11-19 10:30',
            degree: 0,
            interviewDate: '2019-11-20 09:30',
            interviewer: '刘晓琴',
            otherInterviewer: '张桓',
            },{
            candiName: '游叶',
            Jobs: '售后',
            branch: '售后服务部',
            HRBP: '杨女士',
            gender: 1,
            age: '25',
            serviceYear: '3',
            education: '本科',
            schoolTag: '成都理工大学',
            workUnit: '旺小宝成都科技有限公司',
            cellphone: '17356235623',
            apartment: '成都市双流区中和街道',
            salary: '7-8K',
            channel: '拉勾网',
            creatDate: '2019-11-19 10:30',
            degree: 2,
            interviewDate: '2019-11-20 09:30',
            interviewer: '罗雄海',
            otherInterviewer: '刘琪',
            },{
            candiName: '穆如',
            Jobs: '销售经理',
            branch: '销售部',
            HRBP: '杨女士',
            gender: 1,
            age: '32',
            serviceYear: '10',
            education: '大专',
            schoolTag: '四川职业技术学院',
            workUnit: '成都哆啦A梦科技有限公司',
            cellphone: '13389568956',
            apartment: '成都市锦江区***',
            salary: '6K',
            channel: '智联招聘',
            creatDate: '2019-11-19 10:30',
            degree: 1,
            interviewDate: '2019-11-20 09:30',
            interviewer: '刘晓琴',
            otherInterviewer: '张桓',
        }],
        total: 12,
        pageSize: 20,
        tableLoading: false,
    }
  },
  methods: {
       submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        handleClose(done) {
            done();
        }
  }
}
</script>
<style lang="less">
.candidate {
    background: #fff;
    box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
    padding: 20px;

    .el-dialog{
        .el-form{
            .left-box,.right-box{
                width: 49%;
                display: inline-block;
                .el-select{
                    width: 80%;
                    .el-input{
                        width: 100%;
                    }
                }
                .el-input{
                    width: 80%;
                }
            }
            .el-textarea{
                width: 90%;
            }
        }
    }
}
</style>
