<template>
<div class="table">
  <v-Particulars v-if="showCompile" :optionId="empId" @goBack="goBack"></v-Particulars>
  <div v-show="showTabs" class="tablebox">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-sold-out"></i> 招聘管理</el-breadcrumb-item>
        <el-breadcrumb-item>面试管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dialog width="60%" :visible.sync="dialogFormVisible" v-loading="formLoading">
      <el-tabs :tab-position="top" style="height: 450px;">
        <el-tab-pane label="候选人信息">

          <el-form :model="recruitMainModel" :inline=true label-width="100px" :rules="recruitRules" ref="recruitMainModelForm" class="demo-ruleForm">
            <div class="row">
              <el-form-item label="候选人姓名" prop="pName">
                <el-input type="text" v-model="operation" style="display:none;"></el-input>
                <el-input type="text" v-model="recruitMainModel.pName" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="记录人" prop="creator">
                <el-input type="text" v-model="recruitMainModel.creator" disabled></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="电话" prop="pPhone">
                <el-input type="text" v-model="recruitMainModel.pPhone" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="pMail">
                <el-input type="text" v-model="recruitMainModel.pMail" :disabled="disabled"></el-input>
              </el-form-item>
            </div>
            <hr/>
            <div class="row">
              <el-form-item label="职位" prop="jobDesc">
                <el-input type="text" v-model="recruitMainModel.jobDesc" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="部门" prop="pMail">
                <el-input type="text" v-model="recruitMainModel.deptName" :disabled="disabled"></el-input>
              </el-form-item>
            </div>
            <div class="row">

              <el-form-item label="招聘渠道" prop="recruitSource">
                <el-select ref="recruitSource" v-model="recruitMainModel.recruitSource" no-data-text="加载中" placeholder="请选择" :disabled="disabled">
                  <el-option v-for="item in recruits" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="投递类型" prop="deliveryType">
                <el-select style="width:40%" ref="recruitSource" v-model="recruitMainModel.deliveryType" no-data-text="加载中" placeholder="请选择" :disabled="disabled">
                  <el-option v-for="item in deliveryTypes" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="推荐人" prop="value">
                <el-input placeholder="请输入内容" v-model="recommender" :disabled="disabled">
                  <el-button slot="append" @click="openEmpDialog('RECOMMENDER')" icon="el-icon-search"></el-button>
                </el-input>
                <el-input type="text" v-model="recruitMainModel.recommender" style="display:none;"></el-input>
              </el-form-item>
            </div>
            <hr/>
            <div class="row">
              <el-form-item label="初试时间" prop="preTestTime">
                <el-date-picker v-model="recruitMainModel.preTestTime" type="date" value-format="yyyy/MM/dd" placeholder="选择日期时间" :disabled="disabled">
                </el-date-picker>
                <el-select class="el-select-time" v-model="recruitMainModel.preTestHour" style="width:20%" no-data-text="加载中" placeholder="小时" :disabled="disabled">
                  <el-option v-for="item in c_hours" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <el-select class="el-select-time" style="margin-left:30px;" v-model="recruitMainModel.preTestMinutes" no-data-text="加载中" placeholder="分钟" :disabled="disabled">
                  <el-option v-for="item in c_minutes" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="初试结果" prop="preTestReuslt">
                <el-select ref="preTestReuslt" v-model="recruitMainModel.preTestResult" no-data-text="加载中" placeholder="请选择" :disabled="disabled">
                  <el-option v-for="item in testResults" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="面试官" prop="value">
                <el-input placeholder="请输入内容" v-model="preTestInterviewer" :disabled="disabled">
                  <el-button slot="append" @click="openEmpDialog('PRE')" icon="el-icon-search"></el-button>
                </el-input>
                <el-input type="text" v-model="recruitMainModel.preTestInterviewer" style="display:none;"></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="初试信息" prop="preTestInfo">
                <el-input type="textarea" v-model="recruitMainModel.preTestInfo" :disabled="disabled"></el-input>
              </el-form-item>
            </div>
            <hr/>
            <div class="row">
              <el-form-item label="复试时间" prop="reTestTime">
                <el-date-picker v-model="recruitMainModel.reTestTime" type="date" value-format="yyyy/MM/dd" placeholder="选择日期时间" :disabled="disabled">
                </el-date-picker>
                <el-select class="el-select-time" v-model="recruitMainModel.reTestHour" style="width:20%" no-data-text="加载中" placeholder="小时" :disabled="disabled">
                  <el-option v-for="item in c_hours" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <el-select class="el-select-time" style="margin-left:30px;" v-model="recruitMainModel.reTestMinutes" no-data-text="加载中" placeholder="分钟" :disabled="disabled">
                  <el-option v-for="item in c_minutes" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="复试结果" prop="reTestReuslt">
                <el-select ref="reTestReuslt" v-model="recruitMainModel.reTestResult" no-data-text="加载中" placeholder="请选择" :disabled="disabled">
                  <el-option v-for="item in testResults" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="面试官" prop="value">
                <el-input placeholder="请输入内容" v-model="reTestInterviewer" :disabled="disabled">
                  <el-button slot="append" @click="openEmpDialog('RE')" icon="el-icon-search"></el-button>
                </el-input>
                <el-input type="text" v-model="recruitMainModel.reTestInterviewer" style="display:none;"></el-input>
              </el-form-item>
              <el-form-item label="复试信息" prop="reTestInfo">
                <el-input type="textarea" v-model="recruitMainModel.reTestInfo" :disabled="disabled"></el-input>
              </el-form-item>
            </div>
            <hr/>
            <div class="row">
              <el-form-item label="是否offer" prop="isOffer">
                <el-select v-model="recruitMainModel.isOffer" placeholder="请选择" :disabled="disabled">
                  <el-option v-for="item in options" :key="item.value" :value-key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="是否入职" prop="isEntry">
                <el-select v-model="recruitMainModel.isEntry" placeholder="请选择" :disabled="disabled">
                  <el-option v-for="item in options" :key="item.value" :value-key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入职时间" prop="entryTime">
                <el-date-picker v-model="recruitMainModel.entryTime" type="date" value-format="yyyy/MM/dd" placeholder="选择日期" :disabled="disabled">
                </el-date-picker>
              </el-form-item>
            </div>
            <hr/>
            <div class="row">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="recruitMainModel.remark" :disabled="disabled"></el-input>
              </el-form-item>
            </div>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="附件">
          <el-table :header-row-class-name="tableRowClassName" height="360" :data="recruitFiles" v-loading="recruitFilesLoading">
            <el-table-column prop="fileDesc" label="文件名称"></el-table-column>
            <el-table-column prop="lastCreateTime" label="操作日期"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="downLoadFile(scope.$index,recruitFiles)"
                        type="text"
                        size="small"
                        >
                        下载
                      </el-button>
                      <el-button
                        @click.native.prevent="dropRecruitFile(scope.$index,recruitFiles)"
                        type="text"
                        size="small"
                        v-if="operation == 'modify'"
                        >
                        删除
                      </el-button>
                    </template>
            </el-table-column>
          </el-table>
            <a id="_recruit_download" :href='recruitDownloadUrl'></a>


        </el-tab-pane>
      </el-tabs>




      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleSave('recruitMainModelForm')">保 存</el-button>
      </div>
    </el-dialog>


    <div class="handle-box">
      <div class="search">
        <el-input v-model="searchForm.pName" placeholder="候选人姓名" class="handle-input mr10"></el-input>
        <el-input v-model="searchForm.pPhone" placeholder="候选人电话" class="handle-input mr10"></el-input>
        <el-input v-model="searchForm.deptName" placeholder="部门" class="handle-input mr10"></el-input>
      </div>
      <div class="search">
        <label style="color:#666;font-size:14px;">初试时间：</label>
        <el-date-picker
          v-model="searchForm.preFaceTimeZone"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy/MM/dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
        <label style="color:#666;font-size:14px;">&nbsp;&nbsp;&nbsp;&nbsp;复试时间：</label>
        <el-date-picker
          v-model="searchForm.reFaceTimeZone"
          type="daterange"
          align="right"
          value-format="yyyy/MM/dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </div>
      <!-- <div class="search">
          <el-date-picker :editable="false" v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div> -->
      <div>
        <el-button type="primary" size="mini" class="el-icon-search" @click="search" plain> 搜索</el-button>
        <el-button type="primary" size="mini" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain> 重置</el-button>
        <el-button type="success" size="mini" class="handle-del mr10 follow el-icon-document" @click="handleCreat()" plain> 创建招聘记录</el-button>
      </div>
    </div>
    <el-table ref="applyTable" :data="dataList" :header-row-class-name="tableRowClassName" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
      <el-table-column fixed type="selection" width="55"></el-table-column>
      <el-table-column v-if="show_flag == true" prop="id" label="ID" width="150"></el-table-column>
      <el-table-column v-if="show_flag == true" prop="empCode" label="候选人编号" width="150"></el-table-column>
      <el-table-column prop="pName" label="候选人姓名" width="150"></el-table-column>
      <el-table-column prop="pPhone" label="手机号码" width="150"></el-table-column>
      <el-table-column prop="pMail" label="邮箱" width="250"></el-table-column>
      <el-table-column prop="creatorName" label="记录人" width="150"></el-table-column>
      <el-table-column prop="createTime" label="记录时间" width="150"></el-table-column>
      <el-table-column prop="jobDesc" label="申请职位" width="150"></el-table-column>
      <el-table-column prop="deptName" label="部门" width="150"></el-table-column>
      <el-table-column prop="recruitSource" label="招聘渠道" width="150"></el-table-column>
      <el-table-column prop="deliveryType" label="投递类型" width="150"></el-table-column>
      <el-table-column prop="recommenderName" label="推荐人" width="150"></el-table-column>
      <el-table-column
        label="初试时间"
        width="180">
        <template slot-scope="scope">
          <span> {{ scope.row.preTestTime }} </span>
          <span v-if="scope.row.preTestHour != null && scope.row.preTestMinutes != null"> {{ scope.row.preTestHour }}:{{ scope.row.preTestMinutes }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="复试时间"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.reTestTime }} </span>
          <span v-if="scope.row.reTestHour != null && scope.row.reTestMinutes != null"> {{ scope.row.reTestHour }}:{{ scope.row.reTestMinutes }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isOffer" label="是否发放offer" width="150">
        <template slot-scope="scope">
              <el-tag class="default" v-if="scope.row.isOffer==0" size="medium">否</el-tag>
              <el-tag class="sucess" v-if="scope.row.isOffer==1" size="medium">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isEntry" label="是否入职" width="150">
        <template slot-scope="scope">
              <el-tag class="default" v-if="scope.row.isEntry==0" size="medium">否</el-tag>
              <el-tag class="sucess" v-if="scope.row.isEntry==1" size="medium">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="entryTime" label="入职时间" width="150"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="70">
        <template slot-scope="scope">
          <el-dropdown size="mini" >
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.prevent="handleDetail(scope.$index, dataList)">查看详细</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="handleEdit(scope.$index, dataList)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="handleUpload(scope.$index, dataList)">附件上传</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="handleDel(scope.$index, dataList)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>


  <empDiaLog ref="child" v-on:getEmpCode="doEmpCodeHandler"></empDiaLog>
  <empFileUpload ref="empFileUpladTool"></empFileUpload>
</div>
</template>
<style>
.el-table .success-row {
  background: #f6faff;
}
</style>
<script>
import empDiaLog from "../common/EmpDiaLog";
import empFileUpload from "../common/EmpFileUpload";
import {
  formatDate
} from '../common/js/date.js';
export default {
  data() {
    return {
      show_flag: false,
      operation: '',
      tableData: [],
      recruitDownloadUrl: '',
      recruitFilesLoading: false,
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      dialogFormVisible: false,
      bath_list: [],
      dataList: [],
      c_hours: ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      c_minutes: ['00', '10', '20', '30', '40', '50'],
      total: 0,
      pageSize: 10,
      recruitFiles: [],
      disabled: false,
      multipleSelection: [],
      select_word: '',
      date: '',
      editFlag: '',
      tableLoading: false,
      formLoading: false,
      showCompile: false,
      showTabs: true,
      preTestInterviewer: '',
      reTestInterviewer: '',
      recommender: '',
      deliveryTypes: [],
      recruits: [],
      testResults: [],
      checkFlag: false,
      recruitMainModel: {

      },
        options: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
      searchForm: {
        isPage: true, //是否分页
        curPage: 1, //当前页
        pageSize: 10, //当前页条数,
        pName: ''
      },
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      recruitRules: {
        pName: [{
            required: true,
            message: '请输入候选人姓名',
            trigger: 'blur'
          }
          // { max: 40, message: '输入长度不可超过50个字符', trigger: 'blur' },
          // { pattern: /^[^ ]+$/, message: '系统名称不能包含空格' }
        ],
        pPhone: [{
          required: true,
          message: '请输入候选人手机号',
          trigger: 'blur'
        }]
      }
    }
  },
  components: {
    empDiaLog,
    empFileUpload
  },
  filters: {
    formatDate(time, formmater) {
      var date = new Date(time);
      return formatDate(date, formmater);
    }
  },
  created() {
    this.searchForm = {
      isPage: true,
      curPage: 1, //当前页
      pageSize: this.pageSize, //当前页条数
    };
    this.getData();
    this.init();
    let _user_func = localStorage.getItem("_user_func_desc");
    if(_user_func != null && _user_func.indexOf('offer') > 0){
      this.checkFlag = true;
    }
    console.log(_user_func);
  },
  methods: {
    downLoadFile(index, rows) {
      let self = this;
      self.recruitDownloadUrl = rows[index].filePath;
      self.recruitFilesLoading = true;
      setTimeout(() => {
        self.recruitFilesLoading = false;
        document.getElementById("_recruit_download").click();
      }, 1000);
    },
    dropRecruitFile(index, rows) {
      let self = this;
      let url = global.HUMRES_URL + "/humres/recruit/file/drop";
      self.recruitFilesLoading = true;
      self.$http.post(url, rows[index].filePath , self.option).then(
        function(data) {
          if (data.body.flag) {
            this._log_success("删除成功！");
            this.loadFileData(rows[index].empCode);
          } else {
            this._log_warn(data.body.msg);
          }
        },
        function(error) {
          this._log_err("请求失败，请刷新重试！");
        }
      );
    },
    openEmpDialog(operate) {
      this.operate = operate;
      this.$refs.child.open();
    },
    handleUpload(index, row){
      this.$refs.empFileUpladTool.open(row[index].empCode,row[index].pName);
    },
    doEmpCodeHandler(data) {
      if ("PRE" == this.operate) {
        this.recruitMainModel.preTestInterviewer = data.empCode;
        this.preTestInterviewer = data.empName;
      } else if ("RE" == this.operate) {
        this.recruitMainModel.reTestInterviewer = data.empCode;
        this.reTestInterviewer = data.empName;
      } else if ("RECOMMENDER" == this.operate) {
        this.recruitMainModel.recommender = data.empCode;
        this.recommender = data.empName;
      }
    },
    getMain(type) {
      let self = this;
      let url = global.HUMRES_URL + "/humres/config/main/list";
      let mainDataModel = {
        codeType: type
      };
      self.$http.post(url, mainDataModel, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
            let dataText = data.body.datas.list;
            if (type == "DELIVERY") {
              self.deliveryTypes = dataText;
            } else if (type == "TESTRESULT") {
              self.testResults = dataText;
            } else if (type == "RECRUIT") {
              self.recruits = dataText;
            }
          } else {
            this._log_warn(data.body.msg);
          }
        },
        function(error) {
          this._log_err("请求失败，请刷新重试！");
        }
      );
    },
    init() {
      this.getMain('TESTRESULT');
      this.getMain('DELIVERY');
      this.getMain('RECRUIT');
    },
    handleCreat() {
      this.disabled = false;
      this.recruitMainModel = {};
      this.recommender = '';
      this.preTestInterviewer = '';
      this.reTestInterviewer = '';
      this.operation = 'add';
      this.recruitMainModel.creator = localStorage.getItem("ms_empCode");
      this.dialogFormVisible = true;
    },
    loadFileData(empCode) {
      let self = this;
      self.recruitFilesLoading = true;
      let url = global.HUMRES_URL + "/humres/recruit/files";
      let empFileModel = {};
      empFileModel.empCode = empCode;
      empFileModel.fileType = 'DOC-HX-RES';
      if(this.checkFlag){
        empFileModel.fileType = null;
      }
      self.$http.post(url,empFileModel,self.option).then(function(data) {
        if (data.body.flag) {
          self.recruitFiles = data.body.datas;
          self.recruitFilesLoading = false;
        } else {
          this._log_warn(data.body.msg);
          self.recruitFilesLoading = false;
        }
      },
      function(error) {
        this._log_err("请求超时，请刷新重试！");
      });
    },
    handleCancel() {
      this.dialogFormVisible = false;
    },
    handleSave() {
      //确定系统
      let self = this;
      // let a = new Date(self.recruitMainModel.preTestTime);
      // self.recruitMainModel.preTestTime = a;
      // return;
      this.formLoading = true;
      this.$refs['recruitMainModelForm'].validate((valid) => {
        if (valid) {
        if('是' == self.recruitMainModel.isOffer || 1 == self.recruitMainModel.isOffer){
          self.recruitMainModel.isOffer = 1;
        }else {
          self.recruitMainModel.isOffer = 0;
        }
        if('是' == self.recruitMainModel.isEntry || 1 == self.recruitMainModel.isEntry){
          self.recruitMainModel.isEntry = 1;
        }else {
          self.recruitMainModel.isEntry = 0;
        }
          if ('add' == self.operation) {
            let _create_url = global.HUMRES_URL + '/humres/recruit/create';
            self.$http.post(_create_url, self.recruitMainModel, self.option).then(function(data) { // 这里是处理正确的回调
                if (data.body.flag) {
                  this.formLoading = false;
                  this.dialogFormVisible = false;
                  self.recruitMainModel = {};
                  this.getData();
                  this._log_success("创建成功！");
                } else {
                  this._log_warn(data.body.msg);
                }
              },
              function(error) {
                this._log_err("请求超时！");
              })
          } else if ('modify' == self.operation) {
            let _create_url = global.HUMRES_URL + '/humres/recruit/modify';
            self.$http.post(_create_url, self.recruitMainModel, self.option).then(function(data) { // 这里是处理正确的回调
                if (data.body.flag) {
                  this.formLoading = false;
                  this.dialogFormVisible = false;
                  self.recruitMainModel = {};
                  this.getData();
                  this._log_success("编辑成功！");
                } else {
                  this._log_warn(data.body.msg);
                }
              },
              function(error) {
                this._log_err("请求超时！");
              })
          }
        } else {
          return false;
        }
      });

    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchForm = {
        isPage: true,
        curPage: 1, //当前页
        pageSize: this.pageSize //当前页条数
      };
      this.getData();
    },
    handleCurrentChange(val) {
      this.searchForm.curPage = val;
      this.searchForm.pageSize = this.pageSize;
      this.cur_page = val;
      this.getData();
    },
    selectOrg(data) {
      //传入组织编码
      this.selectOption.org = data;
    },
    getData() {
      let self = this;
      self.tableLoading = true;
      let _url = global.HUMRES_URL + '/humres/recruit/list';
      self.$http.post(_url, self.searchForm, self.option).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            let info = data.body.datas;
            self.dataList = info.list;
            self.total = data.body.datas.total;
            self.tableLoading = false;
          } else {
            self.tableLoading = false;
            this._log_warn(data.body.msg);
          }
        },
        function(error) { // 这里是处理错误的回调
          self.tableLoading = false;
          this._log_err("请求超时！");
        });
    },
    search() { //搜索
      let self = this;

      // console.log(self.searchForm.preFaceTimeZone);
      // return;

      self.searchForm.isPage = true;
      self.searchForm.curPage = 1;
      self.searchForm.pageSize = this.pageSize;
      this.getData();
      this.detailShow = true;
    },
    formatter(row, column) {
      return row.deptNamePath;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (rowIndex === 0) {
        return 'success-row';
      }
    },
    handleDel(index, row) {
      let self = this;
      self.tableLoading = true;
      let _url = global.HUMRES_URL + '/humres/recruit/drop/' + row[index].id;
      self.$http.delete(_url, ).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            self.tableLoading = false;
            this.getData();
          } else {
            self.tableLoading = false;
            this._log_warn(data.body.msg);
          }
        },
        function(error) {
          self.tableLoading = false;
          this._log_err("请求超时！");
        })
    },
    handleEdit(index, row) {
      let self = this;
      this.disabled = false;
      self.recruitMainModel = {};
      this.recommender = '';
      this.preTestInterviewer = '';
      this.reTestInterviewer = '';
      this.operation = 'modify';
      this.dialogFormVisible = true;
      this.recruitMainModel.updater = localStorage.getItem("ms_empCode");
      let _url = global.HUMRES_URL + '/humres/recruit/' + row[index].id + '/detail';
      self.$http.get(_url).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            self.recruitMainModel = data.body.datas;
            self.recommender = self.recruitMainModel.recommenderName;
            self.preTestInterviewer = self.recruitMainModel.preTestInterviewerName;
            self.reTestInterviewer = self.recruitMainModel.reTestInterviewerName;
            self.recruitMainModel.isOffer = self.recruitMainModel.isOffer == 1 ? "是" : "否";
            self.recruitMainModel.isEntry = self.recruitMainModel.isEntry == 1 ? "是" : "否";
            this.loadFileData(row[index].empCode);
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
            this.dialogFormVisible = false;
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求超时！",
            type: 'error'
          });
        });
    },
    handleDetail(index, row) {
      let self = this;
      self.disabled = true;
      self.recruitMainModel = {};
      this.recommender = '';
      this.preTestInterviewer = '';
      this.reTestInterviewer = '';
      this.operation = 'view';
      this.dialogFormVisible = true;
      let _view_url = global.HUMRES_URL + '/humres/recruit/' + row[index].id + '/detail';
      self.$http.get(_view_url).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            self.recruitMainModel = data.body.datas;
            self.recommender = self.recruitMainModel.recommenderName;
            self.preTestInterviewer = self.recruitMainModel.preTestInterviewerName;
            self.reTestInterviewer = self.recruitMainModel.reTestInterviewerName;
            self.recruitMainModel.isOffer = self.recruitMainModel.isOffer == 1 ? "是" : "否";
            self.recruitMainModel.isEntry = self.recruitMainModel.isEntry == 1 ? "是" : "否";
            this.loadFileData(row[index].empCode);
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
            this.dialogFormVisible = false;
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求超时！",
            type: 'error'
          });
        });
    },
    handleReset() { //重置
      this.searchForm = {
        isPage: true, //是否分页
        curPage: 1, //当前页
        pageSize: 20, //当前页条数,
        pName: '',
        pPhone: '',
        reFaceTimeZone: [],
        preFaceTimeZone: []
      };
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>
<style lang="less">
.table {
    background: #fff;
    box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
    padding: 20px;
}

.el-dialog__body {
    padding: 0 20px;
}

.demo-ruleForm {

    height: 400px;
    overflow: auto;

    .el-input,
    .el-input-number {
        width: 250px;
    }

    .el-select-time {
        .el-input,
        .el-input-number {
            width: 150px;
        }
    }

    textarea {
        width: 615px;
    }

    hr {
        border-top: 1px;
        margin-bottom: 15px;
    }

}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
