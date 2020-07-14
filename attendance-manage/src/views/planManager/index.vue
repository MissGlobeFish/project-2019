<!--
 * @Description:
 * @Author: ep
 * @Date: 2019-10-28 15:35:58
 * @LastEditTime: 2019-11-15 09:50:29
 -->
<template>
  <div class="app-container plan-box">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.native.enter="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="计划类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in planTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划周期" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dateForm.dateRange[0]| parseTime('{y}-{m}-{d}') }}</span>
          <span>至</span>
          <span>{{ row.dateForm.dateRange[1]| parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate | formatTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="95">
        <template slot-scope="{row}">
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusLabFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑 && 创建 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="select-box">
        <el-input v-model="temp.title" placeholder="计划标题" class="input" clearable suffix-icon="el-icon-edit" style="width: 55%" />
        <span style="font-size: 18px; line-height:36px; font-weight: bold;">类型：</span>
        <el-select v-model="temp.type" class="filter-item" placeholder="计划类型" clearable style="width: 25%">
          <el-option v-for="item in planTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </div>

      <div class="bottom-box">
        <div class="tree-box">
          <OrganizationTree ref="orgTree" :checkedKeys="temp.planUsrs"/>
        </div>
        <div class="item-box">
          <addItems :type="temp.type" :dateProp="temp.dateForm" v-if="dialogFormVisible"></addItems>
          <!-- <addItems v-if="temp.type === 'KPI' && dialogFormVisible" :kpi-info="temp.kpiInfo" />
          <dateSelect v-if="temp.type === 'OKR'&& dialogFormVisible " :okr-inf="temp.okrInf" /> -->
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createPlan, updatePlan, deletePlan } from '@/api/plan'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import OrganizationTree from './components/OrganizationTree'
import addItems from './components/addItems'

const planTypeOptions = [
  { key: 'week', display_name: '周' },
  { key: 'month', display_name: '月' }
]

const planTypeKeyValue = planTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'PlanManager',
  components: { Pagination, OrganizationTree, addItems },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        invalid: 'danger'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        published: '已开始',
        draft: '未开始',
        invalid: '已失效'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return planTypeKeyValue[type]
    }
  },

  data() {
    return {
      lovingVue: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        status: undefined
      },
      planTypeOptions,
      statusOptions: [{key: "published", value: "已开始"}, {key: 'draft',value: "未开始"}, {key: 'invalid', value: "已结束"}],
      temp: {
        id: undefined,
        title: '',
        type: 'month',
        status: 'draft',
        creator: '',
        updateDate: undefined,
        planUsrs: [],
        dateForm: {
          dateRange: [],
          month: {
            startTime: '',
            endTime: '',
          },
          week:[{title: "周一"},{title: "周二"},{title: "周三"},{title: "周四"},{title: "周五"},{title: "周六"},{title: "周日"}]
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑计划',
        create: '新增计划'
      },
      downloadLoading: false
    }
  },
  computed: {},
  watch: {
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.75 * 1000)
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      var data = {id: row.id, status: status}
      changePlanStatus(data).then((res)=> {
        this.$message({message: '操作成功',type: 'success'})
        row.status = status
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    resetTemp() {

      this.temp = {
        id: undefined,
        title: '',
        type: 'month',
        status: 'draft',
        creator: '',
        updateDate: undefined,
        planUsrs: [],
        dateForm: {
          dateRange: [],
          month: {
            startTime: '',
            endTime: '',
          },
          week:[{title: "周一"},{title: "周二"},{title: "周三"},{title: "周四"},{title: "周五"},{title: "周六"},{title: "周日"}]
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      console.log('点击创建',this.temp)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    
    // 新增计划
    createData() {
      this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      this.temp.creator = this.$store.getters.name
      this.temp.updateDate = new Date().getTime()
       this.temp.planUsrs = this.$refs.orgTree.getCheckedKeys()
      
      // if (!this.temp.title) {
      //   this.$message.error({message: '请输入计划标题'})
      // }
      console.log(this.temp)
      createPlan(this.temp).then(() => {
        this.list.unshift(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '新建成功',
          message: '新建计划成功',
          type: 'success',
          duration: 2000
        })
      })
      console.log(this.temp)
    },

    // 点击表格单行
    handleUpdate(row) {
      this.temp =  JSON.parse(JSON.stringify(row))   //Object.assign({}, row) // copy obj
      console.log('点击编辑',this.temp)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      const tempData = this.temp //Object.assign({}, this.temp)
      tempData.timestamp = +new Date(tempData.timestamp)
      tempData.planUsrs = this.$refs.orgTree.getCheckedKeys()
      console.log(tempData)
      updatePlan(tempData).then(() => {
        for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '编辑成功',
          message: '编辑计划成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      deletePlan({id: row.id}).then((response)=>{
        this.getList()
         this.$notify({
          title: '删除成功',
          message: '删除成功',
          type: 'error',
          duration: 2000
        })
        
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}` ? 'descending' : ''
    }
  }
}
</script>
<style lang="scss">
  .plan-box{
    /* 选择框 */
    .select-box{
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      .el-select{
        width: 35%;
      }
    }
    .bottom-box{
      overflow: hidden;
      padding-top: 10px;

      /* 组织树 */
      .tree-box{
        width: 35%;
        height: 400px;
        overflow: auto;
        float: left;
        border: 1px dashed #ddd;
        position: relative;
      }
      .tree-box::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      .el-tree{
        position: absolute;
        left: 0;
        top: 10px;
        right: -17px;
        bottom: 10px;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      /* 添加项目 */
      .item-box{
        width: 60%;
        height: 400px;
        overflow: auto;
        float: right;
        position: relative;
      }
      .item-box::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      .add-box,.date-container{
        position: absolute;
        left: 0;
        top: 0;
        right: -17px;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }
    .el-dialog__header{
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
  }
</style>
