
<template>
<!-- 数据导出 -->
    <div>
      <el-button size="small" type="info" class="el-icon-caret-left" style="margin-bottom: 20px" @click="backTemp()">返回</el-button>
      <div class="export-wrap">
        <div class="export-input-wrap">
          <el-select v-model="searchObj.version" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-date-picker v-model="creatTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="data-pick"></el-date-picker>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click.native.prevent="resetSearch()" class="el-icon-refresh">重置</el-button>
          <el-button type="success" size="small" @click="handleMerge()">合并</el-button>
          <el-button type="primary" size="small" @click="handleTable()" >查询</el-button>
          <el-button type="success" size="small" @click="exportDataEvent()">导出</el-button>
        </div>
      </div>
      <el-dialog title="合并" :visible.sync="vesionDialog" width="30%" :before-close="handleClose" >
        <el-form ref="versionForm" :model="versionForm" :rules="rules" style="display: flex;justify-content: space-evenly;">
          <el-form-item prop="mergeVersion">
            <el-select v-model="versionForm.mergeVersion" placeholder="请选择" clearable>
              <el-option
                v-for="item in newOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="targetVersion"><el-input :value="versionForm.targetVersion[0]" style="width: 200px"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="vesionDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmEvent('versionForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-table style="width: 100%" border :data="tableData" v-loading="loading">
        <template v-for="(item,index) in tableHead">
          <el-table-column :prop="item.column_name" :label="item.column_comment" :key="index" v-if="item.column_name != 'id'"></el-table-column>
        </template>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :current-page="1"
          :page-sizes="[10]"  :page-size="searchObj.pageSize" layout="total, sizes,prev, pager, next" :total="searchObj.total">
        </el-pagination>
      </div>
    </div>
</template>

<script>
export default {
  name: 'exportTempData',
  components: {

  },
  props: {
    currTemp: {
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      creatTime: '',// 搜索时间
      options: [],
      newOptions: '',
      versionForm: {
        mergeVersion: '', // 合并版本
        targetVersion: '', // 被合并的版本
      },
      vesionDialog: false,
      tableWidth: 250,
     
      searchObj:{
        version: '',
        pageNum: 1, // 当前页
        pageSize: 10,//，每页分页条数
      },
      tableHead: [],
      tableData: [],
      loading: false,
      rules: {
        mergeVersion:[{required: true, message: '请选择', trigger: 'blur'}],
        targetVersion: [{required: true, message: '请选择', trigger: 'blur'}]
      },
    };
  },
  computed: {

  },
  mounted () {
    this.handleTable();
    this.handleVesions();
  },
  watch: {

  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
      .then(_ => {
        done();
      })
      .catch(_ => {});
    },
    handleCurrentChange(val) {
      this.searchObj.pageNum = val;
      //TODU刷新列表
      this.handleTable()
    },
    backTemp() {
      this.$emit('backTemp',false)
    },
    handleTable() {// 动态表头/数据
      this.loading = true;
     let obj = this.searchObj;
     console.log(this.creatTime)
      if(this.creatTime) {
        obj.queryBeginDate = this.creatTime? this.creatTime[0] : '',
        obj.queryEndDate = this.creatTime? this.creatTime[1] : ''
      }
      this.getAjax(`${SALARY_URL}/template//data/columns/${this.currTemp.id}`).then(res=>{
        this.tableHead = res.data;
      });
      this.getAjax(`${SALARY_URL}/template//data/${this.currTemp.id}`,obj).then(res=>{
        this.loading = false;
        this.tableData = res.data.list;
        this.searchObj.total = Number(res.data.total);
      }).catch(error => {
        this.loading = false
      })
    },
    handleVesions(){ // 获取版本
      this.getAjax(`${SALARY_URL}/template/data/version/${this.currTemp.id}`).then(res=>{
        this.options = res.data;
        let options= res.data.slice();

        this.newOptions = options.slice(0,options.length-1);
        this.versionForm.targetVersion = options.splice(options.length-1,1)
      })
    },
    exportDataEvent() {// 数据导出
      this.getAjax(`${SALARY_URL}/template/data/download/${this.currTemp.id}`).then(res=> {
        if(res.code != 1){
          return
        }
        this._log_info(res.data)
      })
    },
    resetSearch() { //重置查询
      this.searchObj = {version: ''};
      this.creatTime = ''
      this.handleTable();
    },
    handleMerge() { // 合并
      this.vesionDialog = true;
      this.$nextTick(()=>{
        this.$refs['versionForm'].clearValidate();
        this.$refs['versionForm'].resetFields();
      })
    },
    confirmEvent(formName) {
      this.$refs[formName].validate((valid) =>{
        if(valid) {
          let obj = this.versionForm;
          obj.tid = this.currTemp.id;
          // TODU请求合并
          this.postAjax(`${SALARY_URL}/template/data/merge`,obj).then(res=>{
            if (res.code == 1) {
              this._log_success('合并成功')
            }
          })
        }
      })
    }
  },
};
</script>

<style lang="less">
.el-table tr {
  height: 43px !important;
}
  .export-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
  }
</style>
