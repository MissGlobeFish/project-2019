<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      max-height="700"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
      :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
      >
      <el-table-column type="index" fixed width="50" align="center"></el-table-column>
      <el-table-column prop="title" label="用户名" width="250" align="center"></el-table-column>
      <el-table-column prop="parkName" label="手机号码" width="200" align="center"></el-table-column>
      <el-table-column prop="carTypeStr" label="车牌号" width="300" align="center"></el-table-column>
      <el-table-column prop="amount" label="地址" align="center"></el-table-column>
    </el-table>

    <!-- 表格分页 -->
    <div class="pagination">
      <el-pagination 
      style="margin: 20px 0;text-align: right;"
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
      :page-size="params.pageSize" 
      layout="total, sizes, prev, pager, next" 
      :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/userStatistics'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],

      /* 列表加载动画 */
      listLoading: true,

      /* 分页 */
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.listLoading = false;
        this.total = parseInt(response.data.total);
        this.tableData = response.data.list;
      })
    },
    //表格分页
    handleSizeChange(val) {
        this.params.pageNum = 1;
        this.params.pageSize = val;
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val;
        this.fetchData()
    },
  }
}
</script>
<style lang="scss" scoped>
  
</style>
