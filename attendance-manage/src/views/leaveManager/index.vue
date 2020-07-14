<template>
  <div class="app-container plan-box">
    <div class="filter-container">
      <!-- <el-input clearable v-model="listQuery.name" placeholder="用户" style="width: 200px;" class="filter-item" @keyup.native.enter="handleFilter" /> -->
      <el-select v-model="listQuery.type" placeholder="请假类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in leaveTypeOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in leaveStatus" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
    </div>
    <!-- 请假列表 -->
    <div class="content">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        >
        <el-table-column label="ID" prop="id" align="center" width="80" :class-name="getSortClass('id')"></el-table-column>
        <el-table-column label="用户" prop="name" align="center" width="110px">
        </el-table-column>
        <el-table-column label="部门" align="center" width="130px">
          <template slot-scope="{row}">
            <span>{{ row.department}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.leaveDate[0] | parseTime('{y}-{m}-{d} {h}:{i}') }} 至 {{row.leaveDate[1] |parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
         <el-table-column label="请假时长" align="center" width="100px">
          <template slot-scope="{row}">
            <span>{{ row.leaveDay}}小时</span>
          </template>
        </el-table-column>
        <el-table-column label="请假类型" align="center" width="130px">
          <template slot-scope="{row}">
            <span>{{ row.type}}</span>
          </template>
        </el-table-column>
          <el-table-column label="创建时间" align="center" width="150px">
          <template slot-scope="{row}">
            <span>{{ row.updateDate |  formatTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批人" align="center" width="100px" prop="approver"></el-table-column>
        <el-table-column label="状态" align="center" width="100px">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusLabFilter }}
            </el-tag>
          </template>
        </el-table-column>
       
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" @click="handleSee(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <!-- dialog -->
    <el-dialog class="leaveDialog" title="请假单" :visible.sync="dialogVisible" width="40%">
      <handleLeave :temp="temp" :isReadOnly="isReadOnly" :leaveTypeOptions="leaveTypeOptions"></handleLeave>
        <span slot="footer" class="dialog-footer" v-if="!isReadOnly">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="createData()">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createLeave, updateLeave} from '@/api/leave'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import handleLeave from './components/handleLeave'
export default {
  name: 'leaveManager',
  components: {Pagination,handleLeave},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        wait: 'info',
        reject: 'danger'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        success: '通过',
        wait: '未审核',
        reject: '驳回'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: "leave",
      listLoading: false,
      // dialogStatus: "create",
      list: [],
      total: 0,
      listQuery: { //  请求参数
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        status: undefined,
        isApproval: false,
        currentUsr: this.$store.getters.roles[0]
      },
      rowDialog: {}, // 表格单行值
      dialogVisible: false,
      leaveStatus: [ // 审核类型
        {key: "success", value: "通过"},
        {key: "wait", value: "未审核"},
        {key: "reject", value: "驳回"}
      ],
      leaveTypeOptions: [ // 请假类型
        {key: "病假", value: "病假"},
        {key: "事假", value: "事假"},
        {key: "哺乳假", value: "哺乳假"},
        {key: "产假", value: "产假"},
        {key: "年假", value: "年假"}
      ],
      temp: { // 表单数据
        id: undefined,
        name: "",
        creator: "",
        leaveDate: "",
        leaveDay: "",
        type: "",
        approvalRemark: "",
        reason: "",
        status: "wait",
        updateDate: "",
        department: "研发部",
        approver: 'leader'
      },
      isReadOnly: false // 是否可读 请假创建成功则只可读
    }
  },
  computed: {},
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
      this.listQuery.page = 1;
      this.getList()
    },

    // 重置
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        creator: "",
        leaveDate: "",
        leaveDay: "",
        type:  "",
        approvalRemark: "", // 审批结果
        reason:  "",
        status: "wait",
        updateDate:  "",
        department: "研发部",
        approver: "leader"
      }
    },

    // 新建
    handleCreate() {
      this.resetTemp()
      this.isReadOnly = false;
      this.dialogVisible = true;
      // this.dialogStatus = 'create'
    },

    // 查看
    handleSee(row) {
      this.dialogVisible = true;
      this.temp = row;
      this.isReadOnly = true;
    },
    // 更新
    // handleUpdate(row) {
    //   this.temp =  JSON.parse(JSON.stringify(row));
    //   this.dialogStatus = 'update'
    //   this.dialogVisible = true;
    //   console.log(this.temp)
     
    // },

    // 确定创建 || 更新
    createData() {
      this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      this.temp.creator = this.$store.getters.name
      this.temp.name = this.$store.getters.name
      this.temp.updateDate = new Date().getTime()
      console.log(this.temp,"创建")
      createLeave(this.temp).then(() => {
        this.list.unshift(this.temp)
        this.dialogVisible = false
        this.$notify({
          title: '新建成功',
          message: '新建成功',
          type: 'success',
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
  .leaveDialog{
    .el-form{
        .el-date-editor,.el-select,.el-textarea{
            width: 80%;
        }
        .leaveDay{
            width: 22%;
        }
    }
      
    .el-dialog__header{
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
  }
</style>
