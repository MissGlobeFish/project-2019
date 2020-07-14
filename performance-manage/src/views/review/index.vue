<!--
 * @Description:
 * @Author: rcq
 * @Date: 2019-10-28 15:35:58
 * @LastEditTime: 2019-10-29 22:55:22
 -->
<template>
  <div class="app-container review-box">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="考核类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in planTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="被评人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ 'employee' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ 'leader' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
          <el-button v-if=" checkEditAble(row.currentRole) " type="primary" size="mini" @click="handleUpdate(row, true)">
            编辑
          </el-button>
          <el-button v-if=" !checkEditAble(row.currentRole) " size="mini" @click="handleUpdate(row, false)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑 && 创建 -->
    <el-dialog :title="gradeLists.title" :visible.sync="dialogFormVisible">

      <div :class="[gradeLists.status == 6 ? 'left-box':'full-box']" >
        <task-list v-if="gradeLists.type === 'OKR' && dialogFormVisible " :is-leader="gradeLists" :okrInf="gradeLists"/>
        <Grade v-if="gradeLists.type === 'KPI' && dialogFormVisible " :grade-lists="gradeLists" />
      </div>
      <div v-if="gradeLists.status == 6" class="right-box">
        <p>平均分</p>
        <el-progress type="dashboard" :percentage="percentage" :format="format" :color="colors"></el-progress>
      </div>

      <div slot="footer" class="dialog-footer" v-if="dialogEditAbel">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchReviewList, updateReview } from '@/api/review'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import taskList from './components/taskList'
import Grade from './components/Grade'

const planTypeOptions = [
  { key: 'KPI', display_name: 'KPI' },
  { key: 'OKR', display_name: 'OKR' }
]

const planTypeKeyValue = planTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ReviewPage',
  components: { Pagination, taskList, Grade },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'warning',
        2: 'warning',
        3: 'info',
        4: 'warning',
        5: 'warning',
        6: 'success'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        1: '填写目标',
        2: '核定目标',
        3: '进行中',
        4: '自评',
        5: '他评',
        6: '完成'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return planTypeKeyValue[type]
    }
  },

  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      gradeLists: {},
      totalPoints: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined
      },
      planTypeOptions,
      Grade,
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'draft'
      },
      dialogFormVisible: false,
      dialogEditAbel: false,
      dialogStatus: '',
      textMap: {
        review: '进行考核',
        check: '查看考核'
      },
      downloadLoading: false,
      percentage: 87,
      colors: [
          {color: '#f56c6c', percentage: 2},
          {color: '#e6a23c', percentage: 4},
          {color: '#5cb87a', percentage: 6},
          {color: '#1989fa', percentage: 8},
          {color: '#6f7ad3', percentage: 10}
        ],
      currentRole: true // 当前角色是否是上一级领导
    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchReviewList(this.listQuery).then(response => {
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    format(percentage) {
      return percentage === 100 ? '满分' : `${percentage/10} 分`;
    },
    handleUpdate(row, isEdit) {
      this.temp = row//Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogFormVisible = true
      this.dialogEditAbel = isEdit
      this.gradeLists = row
    },
    updateData() {
      const tempData = this.temp //Object.assign({}, this.temp)
      tempData.timestamp = +new Date(tempData.timestamp)
      tempData.status += 1

      switch (tempData.status) {
        case 1:
          tempData.currentRole = 'employee'
          break;
        case 2:
          tempData.currentRole = 'leader'
          break;
        case 4:
          tempData.currentRole = 'employee'
          break;
        case 5:
          tempData.currentRole = 'leader'
          break;
        default:
          tempData.currentRole = 'none'
          break;
      }

      console.log(tempData)
      updateReview(tempData).then(() => {
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      })
 
    },
    checkEditAble: function (currentRole) {
      var editAbel = this.$store.getters.roles.findIndex((i)=>{ return i === currentRole}) != -1
      console.log(editAbel, currentRole, this.$store.getters.roles)
      return editAbel
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
.review-box{
  .el-dialog{
    .el-dialog__body{
      display: flex;
      min-height: 300px;
      .left-box{
        width: 75%;
      }
      .full-box {
        width: 100%;
      }
      .right-box{
        width: 25%;
        position: relative;
        p{
          font-size: 16px;
          text-align: center;
        }
        .el-progress{
          margin-left: 23%;
        }
      }
    }
    .el-dialog__header{
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
  }
}
</style>
