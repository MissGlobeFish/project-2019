<template>
  <div class="sub-box-shadow">
    <Bread :data="breadData"/>
    <el-button size="small" type="info" class="el-icon-caret-left" style="margin-bottom: 20px" @click="backTemp()">返回</el-button>
      <div class="input-wrap">
         <el-select v-model="searchObj.version" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-date-picker v-model="searchObj.creatTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" class="data-pick"></el-date-picker>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </div>
      <div class="result-table" v-loading="loading">
        <el-table style="width: 100%" border :data="tableData">
          <template v-for="(item,index) in tableHead">
            <el-table-column :prop="item.column_name" :label="item.column_comment" :key="index" v-if="item.column_name != 'id'" width="180px" >
              <template slot-scope="scope"> 
                  <p>{{scope.row[item.column_name] | filterNum(scope.column) | filterTime(scope.column)}}</p>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :current-page="1"
            :page-sizes="[10]"  :page-size="role.pageSize" layout="total, sizes,prev, pager, next" :total="role.total">
          </el-pagination>
        </div>
      </div>
  </div>
</template>

<script>
import Bread from '../../../common/Bread.vue'
export default {
  components: {
    Bread
  },
  props: {

  },
  data() {
    return {
      loading: false,
      breadData:['薪酬管理','计算结果查询'],
      searchObj: {
        version: '',
        creatTime: []
      },
      options: [],
      tableHead: [],
      tableData: [],
      role:{
        pageNum: 1, //当前页条数
        pageSize:10, //
        total: 0
      }
    };
  },
  computed: {

  },
  mounted () {
    this.$nextTick(()=>{
      this.handleInit();
      this.handleVesions();
    })
  },
  watch: {

  },
  filters: {
    filterNum(val,data) { //数字过滤，排除特殊字符串不保留2位
      if(val) {
        if(data.property == 'filed011' || data.property == 'filed012' || data.property == 'filed072') {
            return val
        }
        if((Number(val) && (val != '')) || Number(val) == 0){
          return Number(val).toFixed(2)
        } else {
          return val
        }
      }
    },
    filterTime(val,data) { // 时间过滤
      if (val) {
          let dateVal =  new Date(val);
          let year = dateVal.getFullYear();
          let month = dateVal.getMonth()+1;
          let day = dateVal.getDate();
          month = month < 10 ?  `0${month}` : month;
          if(data.property == 'filed009' || data.property == 'filed073') {
            return `${year}-${month}-${day}`
          } else if(data.property == 'filed010') {
            return `${year}-${month}`
          } else {
            return val
          }
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.role.pageNum = val;
      //TODU刷新列表
    },
    handleVesions(){
      this.getAjax(`${SALARY_URL}/template/data/history/version/${this.$route.query.id}`).then(res=>{
        this.options = res.data
      })
    },
    handleInit(searchObj) { // 表头和主体
      this.loading = true
      let obj = this.role
      if (searchObj) {
        obj.queryBeginDate = searchObj.creatTime? searchObj.creatTime[0] : '',
        obj.queryEndDate = searchObj.creatTime? searchObj.creatTime[1] : '',
        obj.version= searchObj.version
      }
      
      if(!this.$route.query.id){
        return
      }
    
      this.getAjax(`${SALARY_URL}/template/data/history/columns/${this.$route.query.id}`).then(res=>{
        this.tableHead = res.data;
      }).catch(error => {})

      this.getAjax(`${SALARY_URL}/template/data/history/${this.$route.query.id}`,obj).then(res=>{
        const {list,pageNum,pageSize,total} = res.data;
        this.tableData = list;
        this.role.total = Number(total)
        this.loading = false
      }).catch(error=>{this.loading = false})
    },
    backTemp() {
      this.$router.go(-1)
    },
    handleFormatter(row, column, cellValue, index) {
      return row
    },
    handleSearch() {
      this.handleInit(this.searchObj)
    }
  },
};
</script>

<style scoped lang="less">
  .handle-input {
    width: 20%;
  }
  .btn-wrap {
    text-align: right;
    margin-bottom: 20px;
  }
  .result-table {
    margin-top:20px;
    .el-table {
      // margin: auto;
    }
  }
</style>
