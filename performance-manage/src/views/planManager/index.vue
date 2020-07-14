<!--
 * @Description:
 * @Author: ep
 * @Date: 2019-10-28 15:35:58
 * @LastEditTime: 2019-10-29 20:02:03
 -->
<template>
  <div class="app-container plan-box">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="计划类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in planTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
      <el-table-column label="创建者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成情况" width="150px" align="center">
        <template slot-scope="{row}">
          <el-progress :show-text="false" :percentage="row.completeNumber / row.userNumber * 100 " status="success"></el-progress>
          <span>{{ row.completeNumber + '/' + row.userNumber }}</span>
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
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            发布
          </el-button>
          <el-button v-if="row.status!='draft' && row.status!='deleted' " size="mini" @click="handleModifyStatus(row,'draft')">
            停用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑 && 创建 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="select-box">
        <el-input v-model="temp.title" placeholder="计划标题" class="input" clearable suffix-icon="el-icon-edit" style="width: 65%" />
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
          <addItems v-if="temp.type === 'KPI' && dialogFormVisible" :kpi-info="temp.kpiInfo" />
          <dateSelect v-if="temp.type === 'OKR'&& dialogFormVisible " :okr-inf="temp.okrInf" />
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
import { fetchList, createPlan, updatePlan, changePlanStatus } from '@/api/plan'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import OrganizationTree from './components/OrganizationTree'
import addItems from './components/addItems'
import dateSelect from './components/dateSelect'

const planTypeOptions = [
  { key: 'KPI', display_name: 'KPI' },
  { key: 'OKR', display_name: 'OKR' }
]

const planTypeKeyValue = planTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'PlanManager',
  components: { Pagination, OrganizationTree, addItems, dateSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        published: '已发布',
        draft: '待发布',
        deleted: '失效'
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
        type: undefined
      },
      planTypeOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        title: '',
        type: 'KPI',
        status: 'draft',
        creator: '',
        updateDate: undefined,
        planUsrs: [],
        okrInf: {
          dateRange: [],
          reviewDate: undefined,
          submitDate: undefined
        },
        kpiInfo: {
          kpiIterms: []
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 0.75 * 1000)
      })
    },
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
        type: 'KPI',
        status: 'draft',
        creator: '',
        updateDate: undefined,
        planUsrs: [],
        okrInf: {
          dateRange: [],
          reviewDate: undefined,
          submitDate: undefined
        },
        kpiInfo: {
          kpiIterms: [{des: '', tag: ''}]
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      this.temp.creator = this.$store.getters.name
      this.temp.updateDate = new Date()
      this.temp.planUsrs = this.$refs.orgTree.getCheckedKeys()
      this.temp.userNumber = this.temp.planUsrs.length
      this.temp.completeNumber = 0
      console.log("创建数据", this.temp)
      let isStatus = 0;
      if (this.temp.type === 'KPI') {
        if (this.temp.kpiInfo.kpiIterms.length <= 0) {
          this.$message.error('任务名称不能为空！');
        }else{
          let kpiIterm = this.temp.kpiInfo.kpiIterms;
          for (const i in kpiIterm) {
            if (!kpiIterm[i].des) {
              this.$message.error('任务名称不能为空！');
              isStatus = 0;
              return;
            }else{
              isStatus = 1;
            }
          }
        }
      } else if (this.temp.type === 'OKR') {
        isStatus = 1;
      }
      if (isStatus === 1) {
        createPlan(this.temp).then(() => {
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '新建成功',
            message: '新建计划成功点击发布即可发布！',
            type: 'success',
            duration: 2000
          })
        })
      }
    },

    // 点击表格单行
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      const tempData = this.temp //Object.assign({}, this.temp)
      tempData.timestamp = +new Date(tempData.timestamp)
      tempData.planUsrs = this.$refs.orgTree.getCheckedKeys()
      tempData.userNumber = tempData.planUsrs.length
      console.log("更新数据", tempData)
      let isStatus2 = 0;
      if (tempData.type === 'KPI') {
        if (tempData.kpiInfo.kpiIterms.length <= 0) {
          this.$message.error('任务名称不能为空！');
        }else{
          let kpiIterm = tempData.kpiInfo.kpiIterms;
          for (const i in kpiIterm) {
            if (!kpiIterm[i].des) {
              this.$message.error('任务名称不能为空！');
              isStatus2 = 0;
              return;
            }else{
              isStatus2 = 1;
            }
          }
        }
      } else if (tempData.type === 'OKR') {
        isStatus = 1;
      }
      console.log(isStatus2)
      if (isStatus2 === 1) {
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
            message: '编辑计划成功点击发布即可发布！',
            type: 'success',
            duration: 2000
          })
        })
      }
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
