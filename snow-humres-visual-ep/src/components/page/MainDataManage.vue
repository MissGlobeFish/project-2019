<template>
<div class="table">
  <v-Particulars v-if="showCompile" :optionId="empId" @goBack="goBack"></v-Particulars>
  <div v-show="showTabs" class="tablebox">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-sold-out"></i> 基础配置</el-breadcrumb-item>
        <el-breadcrumb-item>主数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dialog width="40%" title="配置信息" :visible.sync="dialogFormVisible">
      <el-form :model="mainDataModel" label-width="100px" :rules="mainDataRules" ref="mainDataModelForm" class="demo-ruleForm">
        <el-form-item label="编码" prop="code">
          <el-input type="text" v-model="mainDataModel.id" style="display:none;"></el-input>
          <el-input type="text" v-model="mainDataModel.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="codeName">
          <el-input type="text" v-model="mainDataModel.codeName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="codeType">
          <el-select v-model="mainDataModel.codeType" no-data-text="加载中" placeholder="请选择">
            <el-option v-for="item in types" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有效">
            <el-switch on-text="1" off-text="0" v-model="isValidSelect"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleSave('mainDataModelForm')">确 定</el-button>
      </div>
    </el-dialog>


    <div class="handle-box">
      <div class="search">
        <el-input v-model="searchForm.code" placeholder="编码" class="handle-input mr10"></el-input>
        <el-input v-model="searchForm.codeName" placeholder="名称" class="handle-input mr10"></el-input>
        <el-select v-model="searchForm.codeType" no-data-text="加载中" placeholder="类型">
          <el-option v-for="item in types" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
        </el-select>
      </div>
      <div>
      <el-button type="primary" size="mini" class="el-icon-search" @click="search" plain> 搜索</el-button>
      <el-button type="primary" size="mini" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain> 重置</el-button>
      <el-button type="success" size="mini" class="handle-del mr10 follow el-icon-document" @click="handleCreat()" plain> 创建主数据</el-button>
      </div>
    </div>
    <el-table ref="mainDataTable" :data="dataList" :header-row-class-name="tableRowClassName" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
      <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="code" label="编码" width="250"></el-table-column>
      <el-table-column align="center" prop="codeName" label="名称" width="300"></el-table-column>
      <el-table-column align="center" prop="codeTypeName" label="类型" width="200" ></el-table-column>
      <el-table-column align="center" prop="isValid" label="是否有效" width="120">
        <template slot-scope="scope">
              <el-tag v-if="scope.row.isValid==0" size="medium">否</el-tag>
              <el-tag v-if="scope.row.isValid==1" size="medium">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="creator" label="创建人" width="130"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" width="200"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="70">
        <template slot-scope="scope">
            <el-dropdown size="mini" >
              <el-button size="mini" type="primary">
                <i class="el-icon-setting"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item @click.native.prevent="handleDetail(scope.$index, dataList)">查看详细</el-dropdown-item> -->
                <el-dropdown-item @click.native.prevent="handleEdit(scope.$index, dataList)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native.prevent="handleDelete(scope.$index, dataList)">删除</el-dropdown-item>
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
      operation: '',
      tableData: [],
      isValidSelect: true,
      dialogFormVisible : false,
      bath_list: [],
      dataList: [],
      total: 0,
      pageSize: 10,
      multipleSelection: [],
      select_cate: '',
      types: [],
      tableLoading: false,
      showCompile: false,
      showTabs: true,
      mainDataModel: {},
      searchForm: {
        isPage: true, //是否分页
        curPage: 1, //当前页
        pageSize: 10, //当前页条数,
        codeType:'',
        code:'',
        codeName:''
      },
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      mainDataRules: {
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        codeName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        codeType: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init();
    this.searchForm = {
      isPage: true,
      curPage: 1, //当前页
      pageSize: this.pageSize, //当前页条数
    };
    this.getData();
  },
  methods: {
    init(){
      let self = this;
      let mainDataModel = {
        codeType : 'BASE',
        isPage: false
      };
      let _url = global.HUMRES_URL + '/humres/config/main/list';
      self.$http.post(_url, mainDataModel, self.option).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            self.types = data.body.datas.list;
            self.tableLoading = false;
          } else {
            self.tableLoading = false;
            this._log_warn(data.body.msg);
          }
        },
        function(error) { // 这里是处理错误的回调
          self.tableLoading = false;
          this._log_err('请求超时！');
        });
    },
    handleCreat() {
      this.operation = 'add';
      this.mainDataModel = {
        isValid : true
      };
      this.dialogFormVisible = true;
    },
    handleCancel() {
      this.dialogFormVisible = false;
    },
    handleSave() {
      //确定系统
      let self = this;
        self.tableLoading = true;
      this.$refs['mainDataModelForm'].validate((valid) => {
          if (valid) {
            if(self.isValidSelect){
              self.mainDataModel.isValid = 1;
            }else {
              self.mainDataModel.isValid = 0;
            }
            if('add' == self.operation){
              self.mainDataModel.creator = localStorage.getItem("ms_empCode");
              let _create_url = global.HUMRES_URL + '/humres/config/main/create';
              self.$http.post(_create_url, self.mainDataModel, self.option).then(function(data) { // 这里是处理正确的回调
                if (data.body.flag) {
                  this.getData();
                  this._log_success('成功！');
                  this.dialogFormVisible = false;
                  self.tableLoading = false;
                } else {
                  this._log_warn(data.body.msg);
                  self.tableLoading = false;
                }
              },
              function(error) {
                // 这里是处理错误的回调
                this._log_err('请求超时！');
                self.tableLoading = false;
              })
            }else if('modify' == self.operation){
              let _create_url = global.HUMRES_URL + '/humres/config/main/modify';
              self.mainDataModel.updater = localStorage.getItem("ms_empCode");
              self.$http.post(_create_url, self.mainDataModel, self.option).then(function(data) { // 这里是处理正确的回调
                if (data.body.flag) {
                  this.getData();
                  this._log_success('成功！');
                  this.dialogFormVisible = false;
                  self.tableLoading = false;
                } else {
                  this._log_warn(data.body.msg);
                  self.tableLoading = false;
                }
              },
              function(error) {
                this._log_err('请求超时！');
                self.tableLoading = false;
              })
            }
          } else {
          self.tableLoading = false;
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
      let _url =  global.HUMRES_URL + '/humres/config/main/list';
      self.$http.post(_url, self.searchForm, self.option).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            let info = data.body.datas;
            self.dataList = info.list;
            self.total = data.body.datas.total;
            self.tableLoading = false;
            this.init();
          } else {
            self.tableLoading = false;
            this._log_warn(data.body.msg);
          }
        },
        function(error) { // 这里是处理错误的回调
          self.tableLoading = false;
          this._log_err('请求超时！');
        });
    },
    search() { //搜索
      let self = this;
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
    tableRowClassName({row, rowIndex}){
      if (rowIndex === 0) {
        return 'success-row';
      }
    },
    handleEdit(index, rows) {
      this.dialogFormVisible = true;
      this.operation = "modify";
      if(1 == rows[index].isValid){
        this.isValidSelect = true;
      }else{
        this.isValidSelect = false;
      }
      this.mainDataModel = {
        id: rows[index].id,
        code: rows[index].code,
        codeName: rows[index].codeName,
        isValid: rows[index].isValid,
        codeType: rows[index].codeType
      };
      // this.family.index = index;
      console.log(mainDataModel);
    },
    handleDelete(index, rows) {
      let self = this;
        self.tableLoading = true;
      self.mainDataModel = {
        id: rows[index].id
      };
      let _url =  global.HUMRES_URL + '/humres/config/main/delete';
      self.$http.post(_url, self.mainDataModel, self.option).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
              this._log_success('删除成功！');
              this.getData();
          } else {
              self.tableLoading = false;
            this._log_warn(data.body.msg);
          }
        },
        function(error) { // 这里是处理错误的回调
          self.tableLoading = false;
          this._log_err('请求超时！');
        });
    },
    handleDetail(index, row) {
      let self = this;
      this.operation = 'view';
      this.dialogFormVisible = true;
      let _view_url = global.HUMRES_URL + '/humres/asset/'+row[index].assetNo+'/detail';
      self.$http.get(_view_url,).then(function(data) { // 这里是处理正确的回调
        if (data.body.flag) {
          self.assetMainModel = data.body.datas;
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
      })
    },
    handleReset() { //重置
      this.searchForm = {
        isPage: true, //是否分页
        curPage: 1, //当前页
        pageSize: 20, //当前页条数
        codeType:'',
        code:'',
        codeName:''
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

    .demo-ruleForm {

      .el-input,.el-input-number {
        width:250px;
      }

    }
</style>
