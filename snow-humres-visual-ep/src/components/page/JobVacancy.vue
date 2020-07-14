<template>
<div class="jobVacancy">
  <div class="jobVacancy-box">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-bell"></i> 招聘管理</el-breadcrumb-item>
        <el-breadcrumb-item>招聘职位</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <div class="search" style="display:flex;">
        <el-input size='mini' placeholder="职位名称" v-model="searchInfo" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button size='mini' type="primary" plain @click="dialogVisible = true"> + 添加职位</el-button>
      </div>
    </div>

    <el-dialog title="添加职位" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="150px">
            <div class="left-box">
                <el-form-item label="职位名称：" prop="postName" :rules="{ required: true, message: '职位名称不能为空', trigger: 'blur' }">
                    <el-input v-model="form.postName" placeholder="请输入职位名称"></el-input>
                </el-form-item>
                <el-form-item label="工作性质：" prop="JobNature">
                    <el-select v-model="form.JobNature" placeholder="请选择工作性质">
                        <el-option label="全职" value="全职"></el-option>
                        <el-option label="实习生" value="实习生"></el-option>
                        <el-option label="兼职" value="兼职"></el-option>
                        <el-option label="劳务派遣" value="劳务派遣"></el-option>
                        <el-option label="外包" value="外包"></el-option>
                        <el-option label="退休返聘" value="退休返聘"></el-option>                    
                    </el-select>
                </el-form-item>
                <el-form-item label="招聘人数：" prop="inviteCount">
                    <el-input-number v-model="form.inviteCount"  :min="1" :max="100" label="请输入招聘人数"></el-input-number>
                    <!-- <el-input v-model="form.inviteCount" placeholder="请输入招聘人数"></el-input> -->
                </el-form-item>
                <el-form-item label="工作经验要求：" prop="workExperience">
                    <el-select v-model="form.workExperience" placeholder="请选择工作经验">
                        <el-option label="不限" value="不限"></el-option>
                        <el-option label="1年以下" value="1年以下"></el-option>
                        <el-option label="1-3年" value="1-3年"></el-option>
                        <el-option label="3-5年" value="3-5年"></el-option>
                        <el-option label="5-10年" value="5-10年"></el-option>
                        <el-option label="10年以上" value="10年以上"></el-option>                    
                    </el-select>
                </el-form-item>
                <el-form-item label="薪资范围：" prop="salaryRange">
                    <el-input v-model="form.salaryRange" placeholder="请录入薪资范围"></el-input>
                </el-form-item>
                <el-form-item label="负责人：" prop="principal">
                    <el-select v-model="form.principal" multiple filterable allow-create default-first-option placeholder="请选择负责人">
                        <el-option v-for="item in principals" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启动日期：" prop="activeDate">
                    <el-date-picker v-model="form.activeDate" type="date" placeholder="请选择启动日期"></el-date-picker>
                </el-form-item>
            </div>
            <div class="right-box">
                <el-form-item label="用人部门：" prop="branch">
                    <el-select v-model="form.branch" placeholder="请选择用人部门">
                        <el-option label="软件研发部" value="软件研发部"></el-option>
                        <el-option label="产品研发部" value="产品研发部"></el-option>
                        <el-option label="综合服务部" value="综合服务部"></el-option>
                        <el-option label="人力行政部" value="人力行政部"></el-option>
                        <el-option label="售后服务部" value="售后服务部"></el-option>
                        <el-option label="销售部" value="销售部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作城市：" prop="jobCity">
                    <el-select v-model="form.jobCity" placeholder="请选择工作城市">
                        <el-option label="成都" value="成都"></el-option>
                        <el-option label="北京" value="北京"></el-option>
                        <el-option label="上海" value="上海"></el-option>
                        <el-option label="深圳" value="深圳"></el-option>
                        <el-option label="湖北" value="湖北"></el-option>
                        <el-option label="武汉" value="武汉"></el-option>
                        <el-option label="长沙" value="长沙"></el-option>
                        <el-option label="广州" value="广州"></el-option>
                        <el-option label="安徽" value="安徽"></el-option>
                        <el-option label="西安" value="西安"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="招聘原因：" prop="inviteReason">
                    <el-input v-model="form.inviteReason" placeholder="请输入招聘原因"></el-input>
                </el-form-item>
                <el-form-item label="学历要求：" prop="education">
                    <el-select v-model="form.education" placeholder="请选择学历">
                        <el-option label="不限" value="不限"></el-option>
                        <el-option label="高中及以上" value="高中及以上"></el-option>
                        <el-option label="大专及以上" value="大专及以上"></el-option>
                        <el-option label="本科及以上" value="本科及以上"></el-option>
                        <el-option label="硕士及以上" value="硕士及以上"></el-option>
                        <el-option label="博士" value="博士"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最迟到岗时间：" prop="lateDates">
                    <el-date-picker v-model="form.activeDate" type="date" placeholder="选择最迟到岗日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="协作者：" prop="teamworker">
                   <el-select v-model="form.teamworker" multiple filterable allow-create default-first-option placeholder="请选择协作者">
                        <el-option v-for="item in principals" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="teamworker" style="opacity:0;">
                   <el-input v-model="form.teamworker"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="职位描述：" prop="postDesc">
                <quill-editor v-model="form.postDesc" ref="myQuillEditor" :options="editorOption" ></quill-editor>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">保 存</el-button>
        </span>
    </el-dialog>

    <el-table ref="applyTable" :data="dataList" border style="width: 100%" size='mini' v-loading="tableLoading">
      <el-table-column type="index" fixed width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="postName" label="职位名称" width="140"></el-table-column>
      <el-table-column align="center" prop="branch" label="用人部门" width="120"></el-table-column>
      <el-table-column align="center" prop="JobNature" label="工作性质" width="100"></el-table-column>
      <el-table-column align="center" prop="jobCity" label="工作城市" width="100"></el-table-column>
      <el-table-column align="center" prop="inviteCount" label="招聘人数" width="80"></el-table-column>
      <el-table-column align="center" prop="education" label="学历要求" width="80"></el-table-column>
      <el-table-column align="center" prop="workExperience" label="工作经验要求" width="120"></el-table-column>
      <el-table-column align="center" prop="salaryRange" label="薪资范围" width="100"></el-table-column>
      <el-table-column align="center" prop="lateDates" label="最迟到岗时间" width="130"></el-table-column>
      <el-table-column align="center" prop="principal" label="负责人" width="100"></el-table-column>
      <el-table-column align="center" prop="teamworker" label="协作者" width="80"></el-table-column>
      <el-table-column align="center" prop="activeDate" label="启动日期" width="130"></el-table-column>
      <el-table-column align="center" prop="inviteReason" label="招聘原因"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="70">
        <template slot-scope="scope">

          <el-dropdown size="mini">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.prevent="handleDetail(scope.$index, dataList)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="handleDetail(scope.$index, dataList)">停止招聘</el-dropdown-item>
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
import { quillEditor } from 'vue-quill-editor'

export default {
  data() {
    return {
        searchInfo: '',
        dialogVisible: false,
        form: {
            postName: '',
            branch: '',
            JobNature: '',
            jobCity: '',
            inviteCount: '',
            education: '',
            inviteReason: '',
            workExperience: '',
            salaryRange: '',
            lateDates: '',
            principal: '',
            teamworker: '',
            activeDate: '',
            postDesc: '',
        },
        principals: [{
          value: '黄海',
          label: '黄海'
            }, {
          value: '袁红',
          label: '袁红'
            }, {
          value: '李向媛',
          label: '李向媛'
        }],
        dataList: [{
            postName: 'Web前端工程师',
            branch: '研发部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '7-8K',
            lateDates: '2019-12-01',
            principal: '陈谦',
            teamworker: '胡骏',
            activeDate: '2019-11-26',
            },{
            postName: 'JAVA工程师',
            branch: '研发部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '1',
            education: '本科以上',
            inviteReason: '',
            workExperience: '3年以上',
            salaryRange: '10K',
            lateDates: '2019-12-01',
            principal: '李依依',
            teamworker: '袁航',
            activeDate: '2019-11-26',
            },{
            postName: '运维工程师',
            branch: '研发部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '1',
            education: '本科以上',
            inviteReason: '',
            workExperience: '5年以上',
            salaryRange: '18K',
            lateDates: '2019-12-01',
            principal: '陈谦',
            teamworker: '胡骏',
            activeDate: '2019-11-26',
            },{
            postName: '大区经理',
            branch: '地产事业部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '3',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '6K',
            lateDates: '2019-11-25',
            principal: '徐力帆',
            teamworker: '蔡强',
            activeDate: '2019-11-20',
            },{
            postName: '产品经理',
            branch: '产品部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '7-8K',
            lateDates: '2019-12-01',
            principal: '陈立勋',
            teamworker: '杨毅',
            activeDate: '2019-11-26',
            },{
            postName: '售后服务工程师',
            branch: '售后服务部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '5K',
            lateDates: '2019-12-01',
            principal: '肖玲',
            teamworker: '袁琳琳',
            activeDate: '2019-11-26',
            },{
            postName: 'HRBP',
            branch: '人力行政部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '3-5K',
            lateDates: '2019-12-01',
            principal: '杨峥',
            teamworker: '刘俊科',
            activeDate: '2019-11-26',
            },{
            postName: '仓库管理员',
            branch: '人力行政部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '3-5K',
            lateDates: '2019-11-28',
            principal: '杨峥',
            teamworker: '刘俊科',
            activeDate: '2019-11-26',
            },{
            postName: '服务工程师',
            branch: '综合部务部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '6K',
            lateDates: '2019-12-15',
            principal: '陈谦',
            teamworker: '胡骏',
            activeDate: '2019-12-10',
            },{
            postName: '渠道经理',
            branch: '渠道部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '2',
            education: '大专以上',
            inviteReason: '',
            workExperience: '3年以上',
            salaryRange: '7-8K',
            lateDates: '2019-12-10',
            principal: '刘星星',
            teamworker: '姚克茹',
            activeDate: '2019-12-05',
            },{
            postName: 'Android工程师',
            branch: '研发部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '1',
            education: '本科以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '7-8K',
            lateDates: '2019-12-05',
            principal: '徐杨丽',
            teamworker: '杨玉芝',
            activeDate: '2019-11-28',
            },{
            postName: 'IOS工程师',
            branch: '研发部',
            JobNature: '全职',
            jobCity: '成都',
            inviteCount: '1',
            education: '本科以上',
            inviteReason: '',
            workExperience: '1-3年',
            salaryRange: '7-8K',
            lateDates: '2019-12-01',
            principal: '李一涵',
            teamworker: '蔡明明',
            activeDate: '2019-11-26',
        }],
        editorOption:{
            placeholder: "请添加描述...",
        },
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
.jobVacancy {
    background: #fff;
    box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
    padding: 20px;

    .el-dialog{
        .el-form{
            .el-form-item__content{
                line-height: 0;
            }
            .left-box,.right-box{
                width: 49%;
                display: inline-block;
                .el-select, .el-input-number{
                    width: 80%;
                    .el-input{
                        width: 100%;
                    }
                }
                .el-input{
                    width: 80%;
                }
            }
            .quill-editor{
                width: 90%;
                .ql-picker-options{
                    .ql-picker-item{
                        line-height: 30px;
                    }
                }
            }
        }
    }
}
</style>
