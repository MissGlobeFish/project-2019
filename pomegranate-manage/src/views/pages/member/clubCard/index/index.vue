<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>交易明细</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡明细</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
      <div class="containerBox">

        <!-- 查询 -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <el-input v-model="formInline.id" placeholder="订单号、用户ID"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="formInline.openid" type="datetime" placeholder="选择交易时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.name" placeholder="请选择会员卡类型">
                <el-option v-for="item in memberTypes" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button type="primary" @click="handleReset('formInline')">重置</el-button>
            <el-button type="primary" icon="el-icon-download">导出</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="tableData" v-loading="loading" border :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="600" style="width: 100%;">
          <el-table-column type="index" fixed width="100" align="center"></el-table-column>
          <el-table-column prop="id" label="订单号" width="200" align="center"></el-table-column>
          <el-table-column prop="name" label="交易类型" width="200" align="center"></el-table-column>
          <el-table-column prop="amountType" label="用户ID" width="200" align="center"></el-table-column>
          <el-table-column prop="amount" label="交易时间" width="200" align="center"></el-table-column>
          <el-table-column prop="lastCreateTime" label="应付金额" align="center"></el-table-column>
          <el-table-column prop="openid" label="扣减金额" align="center"></el-table-column>
          <el-table-column prop="amount" label="实付金额" width="200" align="center"></el-table-column>
          <el-table-column prop="lastCreateTime" label="会员卡类型" align="center"></el-table-column>
          <el-table-column prop="openid" label="扣减事项" align="center"></el-table-column>
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
                id: '',
                name: '',
                openid: '',
            },

            /* 交易列表 */
            tableData: [{
                id: 1,
                name: 'NX00001',
                amountType: '商业XXX7.5折扣券',
                amount: '研值',
                lastCreateTime: '2019.5.1  15:30',
                openid: 'SL0000055',
            }],

            /* 会员类型下拉列表 */
            memberTypes: [{
                    id: '1',
                    name: '普通会员'
                }, {
                    id: '2',
                    name: '研习会员'
            }],

            /* 分页 */
            total: 0,
            pageNum: 1,
            pageSize: 10,
        }
    },
    created() {
        this.getTableList();
    },
    methods: {
    // 查询交易列表
        getTableList (val) {
            this.loading = true;
            let self = this;
            https.fetchPost('/pomegranate/web/pay/list/find?pageNum='+ self.pageNum +'&pageSize='+ self.pageNum, val)
            .then(function(res){
              if (res.data.code) {
                  self.loading = false;
                  self.$message({
                      type: 'warning',
                      message: '会员列表查询失败，请稍后重试！'
                  });
              }else{
                self.loading = false;
              }
            })
            .catch(function(err){
              self.loading = false;
              self.$message({
                  type: 'warning',
                  message: '会员列表查询失败！'
              });
            })
        },
        
        //重置表单
        handleReset(formName){
            this.$refs[formName].resetFields();
        },

        //切换当页显示数据条数
        handleSizeChange(val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.getTableList()
        },

        //切换页码
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getTableList()
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
  .el-table{
    box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
  }
</style>
