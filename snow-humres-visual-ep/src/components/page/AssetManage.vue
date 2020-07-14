<template>
<div class="table">
  <v-Particulars v-if="showCompile" :optionId="empId" @goBack="goBack"></v-Particulars>
  <div v-show="showTabs" class="tablebox">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-sold-out"></i> 行政资产</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dialog width="60%" title="资产明细" :visible.sync="dialogFormVisible">
      <el-form :model="assetMainModel" :inline=true label-width="100px" :rules="assetRules" ref="assetMainModelForm" class="demo-ruleForm">
        <el-form-item label="资产编码" prop="assetNo">
          <el-input type="text" v-model="operation" style="display:none;"></el-input>
          <el-input type="text" v-model="assetMainModel.assetNo" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-select v-model="assetMainModel.area" no-data-text="加载中" filterable placeholder="区域" :disabled="disabled">
            <el-option v-for="item in citys" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用人" prop="value">
          <el-input placeholder="请输入内容" v-model="assetMainModel.userName" :disabled="disabled">
            <el-button slot="append" @click="openEmpDialog('DETAIL')" icon="el-icon-search"></el-button>
          </el-input>
          <el-input type="text" v-model="assetMainModel.user" style="display:none;"></el-input>
        </el-form-item>
        <el-form-item label="归属" prop="accountCode">
          <el-select v-model="assetMainModel.accountCode" no-data-text="加载中" filterable placeholder="归属" :disabled="disabled">
            <el-option v-for="item in accounts" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="operation != 'add'" label="使用部门" prop="deptPath">
          <el-input type="text" v-model="assetMainModel.deptPath" :disabled="true"></el-input>
        </el-form-item>

        <hr/>
        <el-form-item label="资产名称" prop="assetName">
          <el-select v-model="assetMainModel.assetName" no-data-text="加载中" filterable placeholder="资产名称/类别" :disabled="disabled">
            <el-option v-for="item in assetClasses" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input type="text" v-model="assetMainModel.supplier" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="资产型号" prop="assetModel">
          <el-input type="textarea" v-model="assetMainModel.assetModel" auto-complete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input-number v-model="assetMainModel.num" :disabled="disabled"></el-input-number>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input type="text" v-model="assetMainModel.unit" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="总价值" prop="value">
          <el-input type="text" v-model="assetMainModel.value" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="购置时间" prop="purchaseTime">
          <el-date-picker v-model="assetMainModel.purchaseTime" type="date" value-format="yyyy/MM/dd" placeholder="选择日期时间" :disabled="disabled">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用情况" prop="useState">
          <el-radio-group v-model="assetMainModel.useState" size="medium">
            <el-radio border v-for="item in useStateDesc" :key="item.code"  :label="item.code" :disabled="disabled">{{item.codeName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <br/>
        <el-form-item label="设备情况" prop="assetState">
          <el-radio-group v-model="assetMainModel.assetState" size="medium">
            <el-radio border v-for="item in assetStateDesc" :key="item.code"  :label="item.code" :disabled="disabled">{{item.codeName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <hr/>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="assetMainModel.remark" :disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button v-if="operation == 'modify' || operation == 'add'" type="primary" @click="handleSave('assetMainModelForm')">确 定</el-button>
      </div>
    </el-dialog>


    <div class="handle-box">
      <div class="search">
        <el-select v-model="searchForm.accountCode" no-data-text="加载中" filterable placeholder="归属">
          <el-option v-for="item in accounts" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
        </el-select>
        <el-input v-model="searchForm.assetNo" placeholder="资产编码" class="handle-input mr10"></el-input>
        <el-select v-model="searchForm.assetName" no-data-text="加载中" filterable placeholder="资产名称/类别">
          <el-option v-for="item in assetClasses" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
        </el-select>
        <el-input v-model="searchForm.assetModel" placeholder="资产型号" class="handle-input mr10"></el-input>

      </div>
      <div class="search">
        <el-input v-model="searchForm.user" placeholder="用户" class="handle-input mr10"></el-input>
        <el-select v-model="searchForm.area" no-data-text="加载中" filterable placeholder="区域">
          <el-option v-for="item in citys" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
        </el-select>
        <el-select v-model="searchForm.useState" no-data-text="加载中" placeholder="使用情况">
          <el-option v-for="item in useStateDesc" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
        </el-select>
        <el-select v-model="searchForm.assetState" no-data-text="加载中" placeholder="资产情况">
          <el-option v-for="item in assetStateDesc" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
        </el-select>
      </div>
      <div class="search">

      </div>
      <!-- <div class="search">
          <el-date-picker :editable="false" v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div> -->
      <div>
      <el-button type="primary" size="mini" class="el-icon-search" @click="search" plain> 搜索</el-button>
      <el-button type="primary" size="mini" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain> 重置</el-button>
      <el-button type="success" size="mini" class="handle-del mr10 follow el-icon-document" @click="handleCreat()" plain> 新增资产</el-button>
      <el-button type="warning" size="mini" class="handle-del mr10 follow el-icon-document" @click="handleExport()" plain> 导出</el-button>
      </div>
    </div>
    <el-table ref="applyTable" :data="dataList" :header-row-class-name="tableRowClassName" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
      <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="accountCode" label="归属" width="200"></el-table-column>
      <el-table-column align="center" prop="assetNo" label="资产编码" width="150"></el-table-column>
      <el-table-column align="center" prop="assetName" label="资产名称" width="180"></el-table-column>
      <el-table-column header-align="center" prop="assetModel" label="资产型号" width="500" ></el-table-column>
      <el-table-column align="center" prop="useState" label="使用情况" width="100"></el-table-column>
      <el-table-column align="center" prop="assetState" label="资产状态" width="100"></el-table-column>
      <el-table-column align="center" prop="userName" label="使用人" width="150"></el-table-column>
      <el-table-column align="center" prop="deptPath" label="使用部门" width="150"></el-table-column>
      <el-table-column align="center" prop="lastCreateTime" label="创建时间" width="160"></el-table-column>
      <el-table-column align="center" prop="lastUpdateTime" label="更新时间" width="160"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="70">
        <template slot-scope="scope">

          <el-dropdown size="mini" >
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.prevent="handleDetail(scope.$index, dataList)">查看详细</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="handleEdit(scope.$index, dataList)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="handleDel(scope.$index, dataList)">删除</el-dropdown-item>
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
  <empDiaLog ref="child" v-on:getEmpCode="doEmpCodeHandler"></empDiaLog>
</div>
</template>
<style>
  .el-table .success-row {
    background: #f6faff;
  }
</style>
<script>
import empDiaLog from "../common/EmpDiaLog";
export default {
  data() {
    return {
      operation: '',
      tableData: [],
      dialogFormVisible : false,
      bath_list: [],
      dataList: [],
      total: 0,
      pageSize: 10,
      disabled: false,
      multipleSelection: [],
      select_cate: '',
      cates: [],
      useStateDesc: [],
      assetStateDesc: [],
      storageStateDesc: [{
        number: 0,
        label: '否'
      }, {
        number: 1,
        label: '是'
      }],
      assetClasses: [],
      accounts: [],
      formalDescs: [],
      citys: [],
      select_word: '',
      date: '',
      editFlag: '',
      tableLoading: false,
      showCompile: false,
      showTabs: true,
      assetMainModel: {
        assetNo: '',
        useState: null,
        area: '',
        user: '',
        assetName: '',
        assetModel: '',
        storageState : null,
        assetState: null,
        num:1
      },
      searchForm: {
        isPage: true, //是否分页
        curPage: 1, //当前页
        pageSize: 10, //当前页条数,
        assetNo: '',
        useState: null,
        area: '',
        user: '',
        assetName: '',
        assetModel: '',
        assetState: null
      },
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      assetRules: {
        assetNo: [
          { required: true, message: '请输入资产编码', trigger: 'blur' }
          // { max: 40, message: '输入长度不可超过50个字符', trigger: 'blur' },
          // { pattern: /^[^ ]+$/, message: '系统名称不能包含空格' }
        ]
      }
    }
  },
  components: {
    empDiaLog
  },
  created() {
    this.searchForm = {
      isPage: true,
      curPage: 1, //当前页
      pageSize: this.pageSize, //当前页条数
    };
    this.init();
    this.getData();
  },
  methods: {
    openEmpDialog(operate) {
      this.operate = operate;
      this.$refs.child.open();
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
            if (type == "ASSETCLASS") {
              self.assetClasses = dataText;
            } else if (type == "ACCOUNT-P") {
              self.accounts = dataText;
            } else if (type == "CITY") {
              self.citys = dataText;
            } else if (type == "USESTATE") {
              self.useStateDesc = dataText;
            } else if (type == "ASSETSTATE") {
              self.assetStateDesc = dataText;
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
    doEmpCodeHandler(data) {
      let self = this;
      if ("SEARCH" == this.operate) {
        self.searchForm.user = data.empCode;
        self.userName = data.empName;
      } else if ("DETAIL" == this.operate) {
        self.assetMainModel.user = data.empCode;
        self.assetMainModel.userName = data.empName;
      }
      this.$forceUpdate();
    },
    init() {
      this.getMain('ASSETCLASS');
      this.getMain('ACCOUNT-P');
      this.getMain('CITY');
      this.getMain('USESTATE');
      this.getMain('ASSETSTATE');
    },
    handleCreat() {
      this.assetMainModel = {
        num:1
      };
      this.operation = 'add'
      this.dialogFormVisible = true;

    },
    handleCancel() {
      this.dialogFormVisible = false;
    },
    handleSave() {
      //确定系统
      let self = this;
      this.formLoading = true;
      self.assetMainModel.creator = localStorage.getItem("ms_empCode");
      self.assetMainModel.udpater = localStorage.getItem("ms_empCode");
      this.$refs['assetMainModelForm'].validate((valid) => {
          if (valid) {
            if('add' == self.operation){
              let _create_url = global.HUMRES_URL + '/humres/asset/create';
              self.$http.post(_create_url, self.assetMainModel, self.option).then(function(data) { // 这里是处理正确的回调
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
            }else if('modify' == self.operation){
              let _create_url = global.HUMRES_URL + '/humres/asset/modify';
              self.$http.post(_create_url, self.assetMainModel, self.option).then(function(data) { // 这里是处理正确的回调
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
                this._log_error("请求失败！");
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
      let _url =  global.HUMRES_URL + '/humres/asset/list';
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
          this._log_error("请求超时！");
        });
    },
    search() { //搜索
      // if (this.date[0]) {
      //   this.applyinfo.beginDate = this.date[0];
      //   this.applyinfo.endDate = this.date[1];
      // } else {
      //   this.applyinfo.beginDate = '';
      //   this.applyinfo.endDate = '';
      // }
      this.getData();
      this.detailShow = true;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    tableRowClassName({row, rowIndex}){
      if (rowIndex === 0) {
        return 'success-row';
      }
    },
    handleDetail(index, row) {
      let self = this;
      this.disabled = true;
      this.operation = 'view';
      let _view_url = global.HUMRES_URL + '/humres/asset/'+row[index].assetNo+'/detail';
      self.$http.get(_view_url,).then(function(data) { // 这里是处理正确的回调
        if (data.body.flag) {
          self.assetMainModel = data.body.datas;
          console.log(self.assetMainModel);
          this.dialogFormVisible = true;
        } else {
          this._log_warn(data.body.msg);
          // this.dialogFormVisible = false;
        }
      },
      function(error) {
        this._log_error("请求超时！");
      })
    },
    handleEdit(index, row) {
      let self = this;
      self.operation = 'modify';
      self.disabled = false;
      let _view_url = global.HUMRES_URL + '/humres/asset/'+row[index].assetNo+'/detail';
      self.$http.get(_view_url,).then(function(data) { // 这里是处理正确的回调
        if (data.body.flag) {
          self.assetMainModel = data.body.datas;
          self.dialogFormVisible = true;
        } else {
          this._log_warn(data.body.msg);
          // this.dialogFormVisible = false;
        }
      },
      function(error) {
        this._log_error("请求超时！");
      })
    },
    handleReset() { //重置
      this.searchForm = {
        isPage: true, //是否分页
        curPage: 1, //当前页
        pageSize: 20, //当前页条数,
        assetNo: '',
        useState: null,
        area: '',
        user: '',
        assetName: '',
        assetModel: '',
        storageState : null,
        assetState: null,
        beginDate: '',
        endDate: ''
      };
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDel(index, row) {
      let self = this;
      self.tableLoading = true;
      let _url = global.HUMRES_URL + '/humres/asset/' + row[index].assetNo + '/drop';
      self.$http.delete(_url).then(function(data) { // 这里是处理正确的回调
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
    handleExport() {
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
          self.searchForm.isPage=false;
          self.searchForm.localOperater = localStorage.getItem("ms_empCode");
          let url = global.HUMRES_URL + "/humres/asset/generate";
          self.$http.post(url, self.searchForm).then(function(data) {
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
}
</script>
<style lang="less">
    .table {
      background: #fff;
      box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
      padding: 20px;
    }

    .demo-ruleForm {

      height:400px;
      overflow: auto;

      .el-input,.el-input-number {
        width:250px;
      }

      textarea {
        width:615px;
      }

      hr {
        border-top:1px;
        margin-bottom:15px;
      }

    }
</style>
