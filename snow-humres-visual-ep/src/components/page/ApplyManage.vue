<template>
<div class="table">
  <v-Particulars v-if="showCompile" :optionId="empId" @goBack="goBack"></v-Particulars>
  <div v-show="showTabs" class="tablebox">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-document"></i> 审批管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <div class="search">
        <el-select v-model="applyinfo.applyStatus" no-data-text="加载中" placeholder="当前状态">
          <el-option v-for="item in statusDesc" :key="item.number" :label="item.label" :value="item.number"></el-option>
        </el-select>
        <el-date-picker :editable="false" v-model="date" value-format="yyyy/MM/dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>

      </div>
      <div>
        <el-button type="primary" size="mini" class="el-icon-search" @click="search" plain> 搜索</el-button>
        <el-button type="primary" size="mini" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain> 重置</el-button>
        <el-button type="success" size="mini" class="handle-del mr10 follow el-icon-check" @click="handleBatch(1)" plain> 批量审批</el-button>
        <el-button type="success" size="mini" class="handle-del mr10 follow el-icon-close" @click="handleBatch(2)" plain> 批量驳回</el-button>
      </div>
    </div>
    <el-table ref="applyTable" :data="dataList" :header-row-class-name="tableRowClassName" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
      <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="applyPeople" label="申请人" width="130"></el-table-column>
      <el-table-column align="center" prop="applyTime" label="申请时间" width="180"></el-table-column>
      <el-table-column align="center" prop="applyStatus" label="当前状态" width="150">
        <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.applyStatus==0" size="medium">待审核</el-tag>
              <el-tag type="success" v-if="scope.row.applyStatus==1" size="medium">审核通过</el-tag>
              <el-tag type="danger" v-if="scope.row.applyStatus==2" size="medium">被驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="applyType" label="申请类型" width="150">
        <template slot-scope="scope">
              <el-tag v-if="scope.row.applyType==0" size="medium">新员工入职</el-tag>
              <el-tag v-if="scope.row.applyType==1" size="medium">员工信息修改</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="applyDesc" label="申请说明" width="200"></el-table-column>
      <el-table-column align="center" prop="fields" label="调整字段" width="260"></el-table-column>
      <el-table-column align="center" prop="approvePeopleName" label="审核人" width="150"></el-table-column>
      <el-table-column align="center" prop="approveTime" label="审核时间" width="180"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="70">
        <template slot-scope="scope">

          <el-dropdown size="mini">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.prevent="handleDetail(scope.$index, dataList)">查看详细</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.applyStatus==0" @click.native.prevent="handleApply(scope.$index, dataList)">通过申请</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.applyStatus==0 && scope.row.applyType==1" @click.native.prevent="handleReject(scope.$index, dataList)">驳回申请</el-dropdown-item>
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
</div>
</template>
<style>
.el-table .success-row {
  background: #f6faff;
}
</style>
<script>
import vParticulars from "../common/Particulars";
export default {
  data() {
    return {
      selectOption: {
        deptPath: '',
        status: false,
        org: 'WXB'
      },
      empId: {
        detailsId: "",
        manageId: "",
        applyId: {},
        buttonStatus: ''
      },
      url: global.HUMRES_URL + '/humres/common/findApplyInfos',
      tableData: [],
      bath_list: [],
      dataList: [],
      total: 0,
      pageSize: 20,
      multipleSelection: [],
      select_cate: '',
      cates: [],
      statusDesc: [{
        number: 0,
        label: '待审核'
      }, {
        number: 1,
        label: '审批通过'
      }, {
        number: 2,
        label: '被驳回'
      }],
      formalDescs: [],
      select_word: '',
      date: '',
      tableLoading: false,
      showCompile: false,
      showTabs: true,
      applyinfo: {
        isPage: true, //是否分页
        total: null, //总条数
        pages: null, //总页数
        curPage: 1, //当前页
        pageSize: 20, //当前页条数,
        beginDate: '',
        endDate: '',
        applyStatus: ''
      },
      approve : {
        id: '',
        approvePeopleCode:''
      },
      option: {
        timeout: 30 * 1000 //30秒过期
      }
    }
  },
  components: {
    vParticulars
  },
  created() {
    this.applyinfo = {
      isPage: true,
      curPage: 1, //当前页
      pageSize: this.pageSize, //当前页条数
    };
    this.getData();
  },
  methods: {
    goBack() {
      //这里接收子组件传到父组件的值
      this.showCompile = arguments[0];
      this.showTabs = true;
      this.getData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.applyinfo = {
        isPage: true,
        curPage: 1, //当前页
        pageSize: this.pageSize, //当前页条数
        applyStatus: this.applyinfo.applyStatus,
        beginDate: this.applyinfo.beginDate,
        endDate: this.applyinfo.endDate
      };
      this.getData();
    },
    handleCurrentChange(val) {
      this.applyinfo.curPage = val;
      this.applyinfo.pageSize = this.pageSize;
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
      self.$http.post(self.url, self.applyinfo, self.option).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            let info = data.body.datas;
            self.dataList = info.list;
            self.total = data.body.datas.total;
            self.tableLoading = false;
          } else {
            self.tableLoading = false;


            // self.$message({
            //   message: data.body.msg,
            //   type: "warning"
            // });
          }
        },
        function(error) { // 这里是处理错误的回调
          self.tableLoading = false;
          this._log_err('请求超时！');
        });
    },
    search() { //搜索
      if (this.date[0]) {
        this.applyinfo.beginDate = this.date[0];
        this.applyinfo.endDate = this.date[1];
      } else {
        this.applyinfo.beginDate = '';
        this.applyinfo.endDate = '';
      }
      this.getData();
      this.detailShow = true;
    },
    formatter(row, column) {
      return row.deptNamePath;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleApply(index, row) {
      if (row[index].applyType == 0) {
        this.empId.applyId.empCode = row[index].empCode;
        this.empId.applyId.applyObj = row[index].applyObj;
        this.empId.applyId.approveId = row[index].id;
        this.empId.applyId.method = row[index].method;
        this.empId.buttonStatus = '0';
        this.showCompile = true;
        this.showTabs = false;
      } else if (row[index].applyType == 1) {
        let self = this;
        self.approve.id = row[index].id;
        self.approve.approvePeopleCode = localStorage.getItem("ms_empCode");
        let updateUrl = global.HUMRES_URL + '/humres/common/apply/';
        self.$http.post(updateUrl,self.approve).then(function(data) { // 这里是处理正确的回调
            if (data.body.flag) {
              self.getData();
              this._log_success('审批成功！');
            } else {
              this._log_warn(data.body.msg);
            }
          },
          function(error) {
            this._log_err('请求超时！');
          })
      }
    },
    handleReject(index, row) {
      let self = this;
      self.approve.id = row[index].id;
      self.approve.approvePeopleCode = localStorage.getItem("ms_empCode");
      let updateUrl = global.HUMRES_URL + '/humres/common/reject/';
      self.$http.post(updateUrl,self.approve).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            self.getData();
            this._log_success('驳回成功！');
          } else {
            this._log_warn(data.body.msg);
          }
        },
        function(error) {
          this._log_err('请求超时！');
        })
    },
    handleBatch(val) {
      const self = this,
        length = self.multipleSelection.length;
      let str = '';
      let array = [];
      self.bath_list = self.bath_list.concat(self.multipleSelection);
      for (let i = 0; i < length; i++) {
        if (self.multipleSelection[i].applyStatus == 0) {
          array.push(self.multipleSelection[i].id);
        }
      }
      let param = {
        array: array,
        status: val,
        approvePeopleCode: localStorage.getItem("ms_empCode")
      };
      let updateUrl = global.HUMRES_URL + '/humres/common/batchApply';
      self.$http.post(updateUrl, param).then(function(data) { // 这里是处理正确的回调
          if (data.body.flag) {
            self.$refs.applyTable.clearSelection();
            self.multipleSelection = [];
            self.getData();
            self.$message({
              message: '审批成功！',
              type: "success"
            });
          } else {
            this._log_warn(data.body.msg);
          }
        },
        function(error) {
          this._log_err('请求超时！');
        })

    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (rowIndex === 0) {
        return 'success-row';
      }
    },
    handleDetail(index, row) {
      if(row[index].applyType == 0 && row[index].applyStatus == 1){
        this._log_warn('新员工审批成功，详情请通过员工管理查看');
        return ;
      }
      this.empId.applyId.empCode = row[index].empCode;
      this.empId.applyId.applyObj = row[index].applyObj;
      this.empId.applyId.method = row[index].method;
      this.empId.buttonStatus = '1';
      this.showCompile = true;
      this.showTabs = false;
    },
    handleReset() { //重置
      this.applyinfo = {
        isPage: true,
        curPage: 1, //当前页
        pageSize: this.pageSize, //当前页条数
      };
      this.date = '';
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
</style>
