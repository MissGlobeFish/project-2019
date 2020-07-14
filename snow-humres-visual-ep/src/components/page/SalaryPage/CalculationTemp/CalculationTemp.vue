<template>
    <div class="calculate sub-box-shadow" v-loading="loading">
      <!-- 薪酬计算 -->
      <Bread :data="breadData"/>
      <div  v-if="!this.$store.state.isShow">
        <div class="top">
          <div class="left">
            <el-input v-model="searchObj.title" placeholder="请输入模版名称" clearable class="handle-input"></el-input>
            <el-date-picker v-model="searchObj.creatTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" class="data-pick"></el-date-picker>
          </div>
          <div class="right">
            <el-button type="primary" size="small" @click.native.prevent="resetSearch()" class="el-icon-refresh">重置</el-button>
            <el-button type="primary" size="small" @click.native.prevent="handleInit()">查询</el-button>
            <el-button type="primary"  @click.native.prevent="handleEdit()" size="small">新建模板</el-button>
          </div>
        </div>
        <div class="calculate-content">
          <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="templateCode" label="模板编号" fixed="left"></el-table-column>
              <el-table-column prop="title" label="模板名称" ></el-table-column>
              <el-table-column prop="createdTime" label="建立时间"></el-table-column>
              <el-table-column label="操作"  :width="360"  fixed="right">
                <template slot-scope="scope">
                  <el-button type="success"  @click.native.prevent="creatTable(scope.$index,tableData)" size="small" :disabled="tableData[scope.$index].hasMainTable">生成实体表</el-button>
                  <el-button type="primary"  @click.native.prevent="handleEdit(scope.$index,tableData)" size="small" :disabled="tableData[scope.$index].hasMainTable">编辑</el-button>
                  <el-button type="warning" @click.native.prevent="handleResult(scope.$index,tableData)" size="small" :disabled="!tableData[scope.$index].hasMainTable">计算结果表</el-button>
                  <el-button type="danger"  @click.native.prevent="handelDel(scope.$index,tableData)" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination  @current-change="handleCurrentChange" :current-page="1"
                :page-sizes="[10]"  :page-size="role.pageSize" layout="total, sizes,prev, pager, next" :total="role.total">
              </el-pagination>
            </div>
        </div>
      </div>
      <!-- 创建模板 -->
      <creatTemp v-if="this.$store.state.isShow" v-on:backTemp="backTemp" ref="creatTemp"/>
    </div>
</template>

<script>
import Bread from '../../../common/Bread.vue'
import creatTemp from './creatTemp.vue'
export default {
    components: {
      Bread,creatTemp
    },
    props: {

    },
    data() {
      return {
        loading: false,
        breadData: ['薪酬计算','计算模板管理'],
        searchObj: {
          title: '',//  模板名称
          creatTime: '', // 创建时间
        },
        tableData: [] ,// 表格数据
        role:{
          pageNum: 1, // 当前页
          pageSize: 10,//，每页分页条数
        },
      };
    },
    computed: {

    },
    mounted () {
      this.$store.commit('newIsShow',false)
      this.handleInit()
    },
    watch: {

    },
    methods: {
      backTemp(data) {
        this.$store.commit('newIsShow',false)
      },
      handleCurrentChange(val) {
        this.role.pageNum = val;
        this.handleInit();
        //TODU刷新列表
      },
      handleEdit(index,data) { //新建&&编辑
        this.$store.commit('newIsShow',true);
        if (data) {
          this.$nextTick(()=>{
          this.$refs.creatTemp.handleDetail(data[index].id,true)
        })
        }
      },
      creatTable(index, data) { // 生成实体表(生成实体表&&生成历史实体表)
        this.postAjax(`${SALARY_URL}/template/create-table/?templateId=${data[index].id}`).then(res=>{
          console.log('shiti')
          if(res.code == 1) {
            this._log_success('生成')
            this.handleInit()
          }
        }).catch(error=>{})
        this.postAjax(`${SALARY_URL}/template/create-history-table/?templateId=${data[index].id}`).then(res=>{
          console.log('history')
          if(res.code == 1) {
            this.handleInit()
          }
        }).catch(error=>{})
      },
      handelDel(index,data) { // 删除
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',this.del_obj ).then(() => {
          this.delData(index, data);
        }).catch(() => {
          this._log_info('已取消操作')     
        });
      },
      delData(index, data) {
        this.deleteAjax(`${SALARY_URL}/template`,{templateId: data[index].id}).then(res => {
          if (res.code == 1) {
            this._log_success('删除成功');
            this.handleInit();
          }
        }).catch(error=> {console.log(error)})
      },
      handleInit() { // 获取列表
        this.loading = true;
        let obj = {
          searchKey: this.searchObj.title,
          queryBeginDate:  this.searchObj.creatTime ? this.searchObj.creatTime[0] : '',
          queryEndDate: this.searchObj.creatTime ? this.searchObj.creatTime[1] : '',
          pageNum: this.role.pageNum,
          pageSize: this.role.pageSize
        }
        this.getAjax(`${SALARY_URL}/template/salary`,obj).then((res)=>{
          if (res.code == 1) {
            const {list,total,pages} = res.data
            this.loading = false;
            this.tableData = list;
            this.role.total = Number(total);
          }   
        }).catch(error => {
          this.loading = false;
          console.log(error)
        })
      },
      handleResult(index,data) {
        this.$router.push({ path: '/salaryResult', query: { id: `${data[index].id}`}})
      },
      resetSearch() { //重置查询
        this.searchObj ={title: '',creatTime: ''};
        this.handleInit();
      }
    },
};
</script>

<style scoped lang="less">
.calculate {
  .top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: baseline;
    margin-bottom: 20px;
    .handle-input {
      width: 200px;
    }
    .date-pick {
      width: 25%;
    }
  }
  .content {

  }
}

</style>
