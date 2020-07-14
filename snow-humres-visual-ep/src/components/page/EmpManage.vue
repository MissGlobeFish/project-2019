<template>
    <div class="table">
        <v-Particulars v-if="showCompile" :optionId="empId" @goBack="goBack"></v-Particulars>
        <div v-show="showTabs" class="tablebox">
            <div v-if="!conStr" class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-menu"></i> 人员组织管理</el-breadcrumb-item>
                    <el-breadcrumb-item> 员工信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div v-if="conStr" class="crumbs">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item><i class="el-icon-service"></i> HR自助</el-breadcrumb-item>
                    <el-breadcrumb-item> 我的团队</el-breadcrumb-item>
                </el-breadcrumb>
                <el-button v-if="conStr" class="back" size="small" icon="el-icon-caret-left" @click="handleBackHR"> 返回</el-button>
            </div>
            <div class="handle-box">
                <div class="search">
                  <el-select v-model="emp.accountName" @visible-change="handlMail" @change="selectOrg" no-data-text="加载中" placeholder="请选择">
									  <el-option v-for="item in cates" :value-key="item.code" :key="item.code" :label="item.codeName" :value="item"></el-option>
								  </el-select>
                    <el-input v-model="emp.empCode" placeholder="输入工号" class="handle-input mr10"></el-input>
                    <el-input v-model="emp.empName" placeholder="输入姓名" class="handle-input mr10"></el-input>
                    <div class="el-input" style="width:20%;">
                        <DeptSelectorSingle @deptSelecotrSingle="getDeptTrees" :selectOption="selectOption" ></DeptSelectorSingle>
                    </div>
                </div>
                <div class="search">
                    <el-date-picker :editable="false" v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-select class="formalSelect" v-model="emp.formalDescList" @visible-change="handleStatus" no-data-text="加载中" multiple placeholder="选择在职状态">
                      <el-option v-for="item in formalDescs" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
                    </el-select>
                    <el-select @visible-change="handleCity" v-model="emp.cityCode" no-data-text="加载中" filterable placeholder="选择驻地城市">
                        <el-option v-for="item in cityDescs" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
                    </el-select>
                </div>
                <div class="button">
                    <el-button type="primary" size="mini" class="el-icon-search" @click="search" plain> 搜索</el-button>
                    <el-button type="primary" size="mini" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain> 重置</el-button>
                    <el-button type="success" size="mini" class="handle-del mr10 follow el-icon-upload2" @click="exportFile" plain> 导出</el-button>
                    <el-button v-show="false" size="mini" type="success" class="handle-del mr10 follow el-icon-edit-outline" @click="handleAdd" plain> 新增</el-button>
                    <el-button v-if="!conStr" size="mini" type="warning" class="handle-del mr10 follow el-icon-tickets" @click="handleStatistics" plain> 统计</el-button>
                </div>
            </div>
            <el-table v-loading="loading" :header-row-class-name="tableRowClassName" :data="dataList" border style="width: 100%" height="750" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="empCode" fixed label="工号" width="100"></el-table-column>
                <el-table-column align="center" prop="accountName" label="公司" width="200"></el-table-column>
                <el-table-column align="center" prop="empName" label="姓名" width="100"></el-table-column>
                <el-table-column
                 prop="gender" label="性别" width="50"></el-table-column>
                <el-table-column align="center" prop="nationDesc" label="民族" width="80"></el-table-column>
                <el-table-column align="center" prop="lastHireDate" label="入职时间" width="150"></el-table-column>
                <el-table-column align="center" prop="lastFormalDate" label="转正时间" width="150"></el-table-column>
                <el-table-column align="center" prop="jobDesc" label="职位" width="150"></el-table-column>
                <el-table-column align="center" prop="deptLvL1Name" label="一级部门" width="150"></el-table-column>
                <el-table-column align="center" prop="deptLvL2Name" label="二级部门" width="150"></el-table-column>
                <el-table-column align="center" prop="deptLvL3Name" label="三级部门" width="150"></el-table-column>
                <el-table-column align="center" prop="cityDesc" label="驻地城市" width="150"></el-table-column>
                <el-table-column align="center" prop="formalDesc" label="在职状态" width="150">
                  <template slot-scope="scope">
                        <el-tag size="medium">{{scope.row.formalDesc}}</el-tag>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="birthmonth" label="出生月份" width="150"></el-table-column> -->
                <el-table-column align="center" prop="companyAge" label="司龄" width="150"></el-table-column>
                <el-table-column align="center" v-if="showOpreation" fixed="right" label="操作" width="70">
                    <template slot-scope="scope">

                      <el-dropdown size="mini" >
                        <el-button size="mini" type="primary">
                          <i class="el-icon-setting"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native.prevent="handleEdit(scope.$index, dataList)"><i class="el-icon-edit"></i>&nbsp;编辑</el-dropdown-item>
                          <el-dropdown-item @click.native.prevent="handleResetPWD(scope.$index, dataList)"><i class="el-icon-refresh"></i>&nbsp;重置密码</el-dropdown-item>
                          <el-dropdown-item @click.native.prevent="openEmpDoc(scope.$index, dataList)"><i class="el-icon-tickets"></i>&nbsp;档案管理</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next" :total="total">
            </el-pagination>
            </div>
        </div>

        <empDoc ref="empDoc"></empDoc>
    </div>
</template>
<style>
  .el-table .success-row {
    background: #f6faff;
  }
</style>
<script>
import vParticulars from "../common/Particulars";
import DeptSelectorSingle from "../common/DeptSelectorSingle.vue";
import empDoc from "../common/EmpDoc";
export default {
  props: ["conStr"],
  data() {
    return {
      selectOption: {
        deptPath: "",
        status: false,
        flag: true,
        org: "WXB"
      },
      empId: {
        detailsId: "",
        manageId: "",
        applyId: {}
      },
      total: 0,
      pageSize: 20,
      firm: "",
      cates: [],
      dataList: [],
      formalDescs: [],
      cityDescs: [],
      date: "",
      multipleSelection: [],
      showCompile: false,
      showTabs: true,
      showOpreation:true,
      loading: false,
      url: global.HUMRES_URL + "/humres/empmanage/findEmpMains",
      emp: {
        isPage: true, //是否分页
        total: null, //总条数
        pages: null, //总页数
        curPage: 1, //当前页
        pageSize: 20, //当前页条数
        empCode: "",
        empName: "",
        deptName: "",
        beginDate: "",
        accountCode: "11111111111111",
        endDate: "",
        formalCode: "",
        cityCode: "",
        formalDescList:[],
        condition:""
      },
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      param: {
        grpNum: ""
      }
    };
  },
  components: {
    vParticulars,
    DeptSelectorSingle,
    empDoc
  },
  created() {
    this.emp = {
      isPage: true,
      curPage: 1, //当前页
      pageSize: 20, //当前页条数
    };
    if (this.conStr) {
      this.emp.condition = this.conStr;
    }
    this.getData();
  },
  methods: {
    // handleDoc() {
    //   let routeData = this.$router.resolve({
    //      path: "/doc"
    //   });
    //   window.open(routeData.href, '_blank');
    // },
    openEmpDoc(index, row){
      console.log(row[index].empCode);
      this.$refs.empDoc.open(row[index].empCode,row[index].empName);
    },
    goBack() {
      //这里接收子组件传到父组件的值
      this.showCompile = arguments[0];
      this.showTabs = true;
      this.getData();
    },
    handleStatistics() {
      window.open(global.BI_URL);
    },
    handleBackHR(){
      //返回上一级（只在HR自助页面编辑跳转时才启用）
      this.$emit("goHrBack", false);
    },
    selectOrg(data) {
      this.selectOption.org = data.code;
      this.emp.accountCode = data.code;
      this.emp.accountName = data.codeName;
    },
    handleCurrentChange(val){
      this.emp.curPage = val;
      this.emp.pageSize = this.pageSize;
      this.cur_page = val;
      this.getData();
    },
    tableRowClassName({row, rowIndex}){
      if (rowIndex === 0) {
        return 'success-row';
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.emp.pageSize=this.pageSize;
      this.getData();
    },
    getData() {
      //读取列表
      let self = this;
      if(this.emp.condition){
        this.showOpreation=false;
      }
      self.loading = true;
      self.$http.post(self.url, self.emp, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
            self.loading = false;
            let info = data.body.datas;
            self.dataList = info.list;
            self.total = data.body.datas.total;
            for (var i = 0; i < info.list.length; i++) {
              let path = info.list[i].deptNamePath;
              info.list[i].deptLvL1Name = path.split(">")[0];
              info.list[i].deptLvL2Name = path.split(">")[1];
              info.list[i].deptLvL3Name = path.split(">")[2];
              if (info.list[i].gender == 'female') {
                info.list[i].gender = '女';
              }else if(info.list[i].gender == 'male'){
                info.list[i].gender = '男';
              }
            }
          } else {
            self.loading = false;
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
          self.curPage = data.curPage;
        },
        function(error) {
          // 这里是处理错误的回调
          self.loading = false;
          self.$message({
            message: "请求超时！",
            type: "error"
          });
        }
      );
    },
    findInfos() {
      //加载搜索下拉列表信息
      let self = this;
      let url =
        global.HUMRES_URL+"/humres/config/main/list";
      let grpNum = self.param.grpNum;
      let mainDataModel = {
        codeType : grpNum
      };
      self.$http.post(url, mainDataModel, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
            let dataText = data.body.datas.list;
            if (grpNum == "CITY") {
              //判断是否请求驻地城市
              self.cityDescs = dataText;
            } else if (grpNum == "JOBSTATUS") {
              //同上
              self.formalDescs = dataText;
            } else if (grpNum == "ACCOUNT") {
              //同上
              self.cates = dataText;
            }
          } else {
            self.$message({
              message: data.body.erro,
              type: "warning"
            });
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求失败，请刷新重试！",
            type: "error"
          });
        }
      );
    },
    handleCity() {
      //下拉选择驻地城市
      this.param.grpNum = "CITY";
      this.findInfos();
    },
    handleStatus() {
      //下拉选择在职状态
      this.param.grpNum = "JOBSTATUS";
      this.findInfos();
    },
    handlMail() {
      //下拉选择员工归属（所属组织）
      this.param.grpNum = "ACCOUNT";
      this.findInfos();
    },
    getDeptTrees(data) {
      //接收子组件传来的值
      this.emp.deptName = data;
    },
    search() {
      //搜索
      if (this.date[0]) {
        this.emp.beginDate = this.date[0];
        this.emp.endDate = this.date[1];
      } else {
        this.emp.beginDate = "";
        this.emp.endDate = "";
      }
      if (this.conStr) {
        this.emp.condition = this.conStr;
      }
      this.getData();
      this.detailShow = true;
    },
    handleReset() {
      //重置
      this.emp = {
        isPage: true,
        curPage: 1, //当前页
        pageSize: this.pageSize, //当前页条数
        formalDescList: []
      };
      if (this.conStr) {
        this.emp.condition = this.conStr;
      };
      this.selectOption.deptPath = '';
      this.date = "";
      this.firm = "";
      this.getData();
    },
    handleEdit(index, row) {
      //编辑
      this.empId.manageId = row[index].empCode;
      this.showCompile = true;
      this.showTabs = false;
    },
    handleResetPWD(index, row){
      let self = this;
      let _url = global.HUMRES_URL+"/humres/empmanage/pwd/reset/"+row[index].spell;
      this.$confirm('密码将被还原为初始化密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http.put(_url, self.option).then(
            function(data) {
              // 这里是处理正确的回调
              if (data.body.flag) {
                self.$message({
                  message: '重置成功',
                  type: "success"
                });
              } else {
                self.$message({
                  message: data.body.msg,
                  type: "warning"
                });
              }
            },
            function(error) {
              // 这里是处理错误的回调
              self.$message({
                message: "请求失败，请刷新重试！",
                type: "error"
              });
            }
          );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
    },
    handleAdd() {
      //新增
      this.$message("功能开发中，敬请期待！");
    },
    handleSelectionChange(val) {
      //当选择按钮被点击时会触发该事件
      this.multipleSelection = val;
    },
    exportFile() {
      //导出
      const self = this;
      this.$confirm("<p>是否按照条件导出数据<p><p>点击【确认】后请到右上角的个人下载查询进度</p>", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          let self = this;
          self.emp.isPage=false;
          let url = global.HUMRES_URL + "/humres/empmanage/generate";
          self.$http.post(url, self.emp).then(function(data) {
            if (data.body.flag) {
                self.$message({
                    message: data.body.datas + "正在生成，请到下载中心查看进度",
                    type: "success"
                });
            } else {
                self.$message({
                    message: data.body.msg,
                    type: 'error'
                });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消"
          });
        });
    }
  }
};
</script>
<style lang="less">
.table {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; //阻止文字被选中
  background: #fff;
  box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
  padding: 20px;

  .formalSelect{
    .el-input{
      width: 412px;
    }
  }
}
.crumbs {
  position: relative;

  .back {
    position: absolute;
    right: 0;
    bottom: -12px;
  }
}
</style>
