<template>
  <div class="app-container plan-box">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="搜索姓名" style="width: 400px;" class="filter-item" @keyup.native.enter="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="UserID" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.gender | tagStatusFilter">
            {{ row.gender | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | tagStatusFilter">
            {{ row.status | statusLabFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部门 ID" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCheck(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 查看详情 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="dialogContainer">
        <div class="leftBox">
          <div class="itermTitle">姓名：</div>
          <el-input v-model="temp.name" placeholder="姓名" class="input" clearable disabled suffix-icon="el-icon-edit" style="width: 200px" />
          <div class="itermTitle">性别：</div>
          <el-select v-model="temp.gender" class="filter-item" placeholder="计划类型" clearable disabled style="width: 120px">
            <el-option v-for="item in genderOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </div>
        <div class="rightBox">
          <img :src="temp.avatar" alt="暂无" width="120" height="120">
        </div>
      </div>
      <div class="bottomBox">
        <div class="itermTitle">部门 ID：</div>
        <el-input v-model="temp.department" placeholder="姓名" class="input" disabled suffix-icon="el-icon-edit" style="width: 50%" />
        <div class="itermTitle">账号：</div>
        <el-input v-model="temp.userId" placeholder="姓名" class="input" disabled suffix-icon="el-icon-edit" style="width: 50%" />
        <div class="itermTitle">电话：</div>
        <el-input v-model="temp.mobile" placeholder="姓名" class="input" disabled suffix-icon="el-icon-edit" style="width: 50%" />
        <div class="itermTitle">邮箱：</div>
        <el-input v-model="temp.email" placeholder="姓名" class="input" disabled suffix-icon="el-icon-edit" style="width: 50%" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHumanList } from '@/api/humanManage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

const genderOptions = [
  { key: '0', display_name: '未知' },
  { key: '1', display_name: '男' },
  { key: '2', display_name: '女' }
]

const genderTypeKeyValue = genderOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'PlanManager',
  components: { Pagination },
  directives: { waves },
  filters: {
    tagStatusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        invalid: 'danger',
        '0': 'info',
        '1': '',
        '2': 'danger',
        '4': 'info'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        1: '已激活',
        2: '已禁用',
        4: '未激活'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return genderTypeKeyValue[type]
    }
  },

  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        name: undefined
      },
      genderOptions,
      temp: {
        userId: undefined,
        name: undefined,
        mobile: undefined,
        gender: undefined,
        email: undefined,
        avatar: undefined,
        status: undefined,
        department: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        check: '查看人员'
        // update: '编辑人员',
        // create: '新增人员'
      }
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
      getHumanList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.data
        this.total = response.data.totalRecords
        setTimeout(() => {
          this.listLoading = false
        }, 0.75 * 1000)
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: ''
      }
    },
    // 点击表格单行
    handleCheck(row) {
      this.temp = JSON.parse(JSON.stringify(row))// Object.assign({}, row) // copy obj
      this.dialogStatus = 'check'
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="scss">
  .plan-box{

    /* 编辑框 */
    .itermTitle{
      font-size: 18px;
      line-height:36px;
      font-weight: bold;
      display: block;
    }

    .dialogContainer{
      padding-right: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .leftBox{
        display: inline-block;
        justify-content: space-between;
        padding-bottom: 20px;
        .el-select{
          width: 35%;
        }
      }
      .rightBox{
        display: inline-block;
        padding-top: 20px;
        padding-left: 20px;
      }
    }
    .el-dialog__header{
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
    .el-dialog{
      max-width: 500px;
    }
  }
</style>
