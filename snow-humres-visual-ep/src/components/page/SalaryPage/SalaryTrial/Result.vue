<template>
  <div>
    <!-- 数据结果页面 -->
    <div class="top">
      <el-input placeholder="请输入姓名" class="handle-input"></el-input>
      <el-button type="primary">查询</el-button>
    </div>
    <div class="result-content">
             <!-- <el-form-item :prop="`columns.${scope.$index}.title`" label-width="0">
                <el-input v-model="scope.row.title" placeholder="请输入字段名称" clearable class="handle-input"></el-input>
              </el-form-item> -->

      <el-table style="width: 100%" border :data="tableData" v-loading="loading">
        <template v-for="(item,index) in tableHead">
          <el-table-column :prop="item.column_name" :label="item.column_comment" :key="index" v-if="item.column_name != 'id'" width="180px">
            <template  slot-scope="scope">
              <el-input :placeholder="`${scope.row[item.column_name]}`" v-model="scope.row[item.column_name]"></el-input>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="pagination">
        <el-pagination   @current-change="handleCurrentChange"  :page-sizes="[10]" :page-size="10"   layout="total, sizes, prev, pager, next" :total="role.total">
        </el-pagination>
      </div>
      <div class="right-btn">
        <el-button @click="handleSave()">保存</el-button>
        <el-button @click="reStart()" type="primary">重新计算</el-button>
        <el-button @click="handleSubmit()">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

    },
    props: {

    },
    data() {
      return {
        editArr: {},
        id: '',
        dialogSubmitVisible: false,
        resultTable: [],
        tableHead: [],
        tableData: [],
        remark: '',// 备注
        loading: false,
        role:{
          pageNum: 1, //当前页条数
          pageSize:15, //
          total: 0
        },
      };
    },
    computed: {

    },
    mounted () {
      document.addEventListener('keydown', function(e) {
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))      {
              e.preventDefault();
              alert('saved');
            }
      });
    },
    watch: {

    },
    methods: {
      reStart() {// 重新开始
        this.$emit('reStart',0)
      },
      handleCurrentChange(val) {
        this.role.pageNum = val;
        //TODU刷新列表
        this.handleResult()
      },
      handleResult(id) { // 薪酬试算结果表(表头&&主体)
        this.id = id;
        this.loading = true;
        this.getAjax(`${SALARY_URL}/template/data/columns/${id}`).then(res=>{
          this.tableHead = res.data;
          this.loading = false;
        }).catch((error)=>{
           this.loading = false;
        });
        this.getAjax(`${SALARY_URL}/template/data/${id}`,this.role).then(res=>{
          const {list,pageNum,pageSize,total} = res.data;
          this.tableData = list;
          this.role.total = Number(total)
        }).catch((error)=>{
          this.loading = false;
        });
      },
      handleSubmit() { // 提交
        this.$confirm('是否确定提交', '提示',{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(() => {
         // TODU确定提交事件
         this.submitData()
        }).catch(() => {
          this._log_info('已取消操作')     
        });
      },
      handleSave() { // 保存
        console.log(JSON.stringify(this.tableData))
        // return
        this.putAjax(`${SALARY_URL}/template/data/${this.id}`,this.tableData).then(res => {
          if (res.code == 1) {
            this._log_success('保存成功')
          }
        })
      },
      submitData() { // 提交ajax
        this.postAjax(`${SALARY_URL}/template/data/history/${this.id}`).then(res => {
          if (res.code == 1) {
            this.$emit('reStart',0)
            this._log_success('提交成功')
          }
        })
      }
    },
};
</script>

<style scoped lang="less">
.top {
  .handle-input {
    width: 200px;
  }
}
.result-content {
  margin-top: 20px;
  .right-btn {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
