<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>交易查询</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
      <div class="containerBox">

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;交易查询</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面查询交易情况</span>
          </div>
        </div>

        <!-- 查询 -->
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
          <el-form-item label="" prop="id">
            <el-input v-model="formInline.id" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input v-model="formInline.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="" prop="openid">
            <el-input v-model="formInline.memberNo" placeholder="用户编码"></el-input>
          </el-form-item>
          <el-form-item label="" prop="time">
            <el-date-picker
              v-model="formInline.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="handleReset('formInline')">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="tableData" v-loading="loading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="600" style="width: 100%;">
          <el-table-column type="index" fixed width="100" align="center"></el-table-column>
          <el-table-column prop="id"  label="订单号" align="center"></el-table-column>
          <el-table-column prop="name"  label="商品名称" align="center"></el-table-column>
          <el-table-column prop="amountType"  label="购买方式" align="center"></el-table-column>
          <el-table-column prop="amount"  label="价格" align="center"></el-table-column>
          <el-table-column prop="lastCreateTime"  label="交易时间" align="center"></el-table-column>
          <el-table-column prop="memberNo" label="购买人用户编码" align="center"></el-table-column>
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
      loading: false,// 表格加载

      /* 查询表单对象 */
      formInline: {
        id: null,
        name: null,
        memberNo: null,
        beginDate: null,
        endDate: null,
        time: null,
      },

      /* 交易列表 */
      tableData: [],

      /* 分页 */
      total: 0,
      pageNum: 1,
      pageSize: 10, 
    }
  },
  created() {
    this.getTableList({});
  },
  methods: {
    // 查询交易列表
    getTableList (val) {
      this.loading = true;
      let self = this;
      https.fetchPost('/pomegranate/web/pay/list/find?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize, val)
      .then(function(res){
        if (res.data.code) {
          self.loading = false;
            self.$message({
                type: 'warning',
                message: '列表查询失败，请稍后重试！'
            });
        }else{
            self.loading = false;
            self.tableData = res.data.list;
            self.total = parseInt(res.data.total);
            let list = res.data.list;
            for (const i in list) {
              if (list[i].amountType == 0) {
                list[i].amountType = '现金';
              }else if (list[i].amountType == 1) {
                list[i].amountType = '研值';
              }
            }
        }
      })
      .catch(function(err){
        self.loading = false;
        self.$message({
          type: 'warning',
          message: '查询交易列表失败！'
        });
      })
    },

    //查询交易
    onSubmit() {
      if (this.formInline.time) {
        let dateList = [];
        this.formInline.time.forEach(i => {
          let date = new Date(i);
          let y = date.getFullYear();
          let m = (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
          let d = date.getDate()<10?'0'+date.getDate():date.getDate();
          dateList.push(y + '/' + m + '/' + d);
        });
        this.formInline.beginDate = dateList[0];
        this.formInline.endDate = dateList[1];
      }
      this.getTableList(this.formInline);
    },

    //重置表单
    handleReset(formName){
        this.$refs[formName].resetFields();
        this.formInline.time = null;
        this.formInline.beginDate = null;
        this.formInline.endDate = null;
        this.getTableList({});
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
  ul,li{ 
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .top-title{
            font-size: 24px;
            color: #323232;
        }
    }
  .el-table{
    box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
  }
</style>
