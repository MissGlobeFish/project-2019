<template>

  <div>


    <el-dialog title="人员选择" :visible.sync="EmpDiaLogVisible" height="500">

    <div class="handle-box">
        <div class="search">
            <el-input v-model="emp.empCode" placeholder="输入工号" class="handle-input mr10"></el-input>
            <el-input v-model="emp.empName" placeholder="输入姓名" class="handle-input mr10"></el-input>
        </div>
        <div class="button">
            <el-button type="primary" size="mini" class="el-icon-search" @click="search" plain> 搜索</el-button>
            <el-button type="primary" size="mini" class="handle-del mr10 follow el-icon-refresh" @click="handleReset" plain> 重置</el-button>
        </div>
    </div>

    <el-table v-loading="loading" @row-dblclick="selectRow" :data="dataList" border style="width: 100%" height="300">
        <el-table-column fixed prop="empCode" label="工号"></el-table-column>
        <el-table-column prop="empName" label="姓名"></el-table-column>
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
  </el-dialog>

    <el-button type="text" @click="EmpDiaLogVisible = true"></el-button>

  </div>

</template>

<script>
  export default {
    props:['name'],
    data() {
      return {
        EmpDiaLogVisible: false,
        total: 0,
        pageSize: 10,
        loading: false,
        dataList:[],
        emp: {
          isPage: true, //是否分页
          total: null, //总条数
          pages: null, //总页数
          curPage: 1, //当前页
          pageSize: 10, //当前页条数
          empCode: "",
          empName: ""
        }
      }
    },
    watch:{
      name(){
        this.empName = this.name;
      }
    },
    created() {
      this.emp = {
        isPage: true,
        curPage: 1, //当前页
        pageSize: 10, //当前页条数
      };
      this.getData();
    },
    methods: {
      open(){
        this.EmpDiaLogVisible = true;
      },
      handleCurrentChange(val){
        this.emp.curPage = val;
        this.emp.pageSize = this.pageSize;
        this.cur_page = val;
        this.getData();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.emp.pageSize=this.pageSize;
        this.getData();
      },
      search() {
        this.getData();
      },
      handleReset() {
        //重置
        this.emp = {
          isPage: true,
          curPage: 1, //当前页
          pageSize: this.pageSize
        };
        this.getData();
      },
      getData() {
        //读取列表
        let self = this;
        self.loading = true;
        let _url = global.HUMRES_URL + "/humres/empmanage/findEmpMains";
        self.$http.post(_url, self.emp, self.option).then(
          function(data) {
            // 这里是处理正确的回调
            if (data.body.flag) {
              self.loading = false;
              let info = data.body.datas;
              self.dataList = info.list;
              self.total = data.body.datas.total;
            } else {
              self.loading = false;
              this._log_warn(data.body.msg);
            }
            self.curPage = data.curPage;
          },
          function(error) {
            // 这里是处理错误的回调
            self.loading = false;
            this._log_error("请求超时！");
          }
        );
      },
      selectRow(row, column){
        this.$emit("getEmpCode",row);
        this.EmpDiaLogVisible = false;
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
