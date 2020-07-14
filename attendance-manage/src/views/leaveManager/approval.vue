<!--
 * @Description: 请假审批
 * @Author: ep
 * @Date: 2019-11-05 16:30:23
 * @LastEditTime: 2019-11-14 11:07:47
 -->
<template>
  <div class="app-container plan-box">
    <div class="filter-container">
      <el-input clearable v-model="listQuery.name" placeholder="用户" style="width: 200px;" class="filter-item" @keyup.native.enter="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请假类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in leaveTypeOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in leaveStatus" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
        <el-table-column label="ID" prop="id" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" width="110px" prop="name" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="center" width="130px" prop="department"></el-table-column>
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
        <el-table-column label="请假类型" align="center" width="110px">
          <template slot-scope="{row}">
            <span>{{ row.type}}</span>
          </template>
        </el-table-column>
          <el-table-column label="创建时间" align="center" width="150px">
          <template slot-scope="{row}">
            <span>{{ row.updateDate |  formatTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
         <el-table-column label="审批人" align="center" width="100px" prop="approver">
          <template slot-scope="{row}">
            <span>leader</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100px">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusLabFilter }}
            </el-tag>
          </template>
        </el-table-column>
       
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-if="row.status == 'wait'" size="mini" type="primary" @click="handleUpdate(row)">审批</el-button>
            <el-button v-else size="mini"  @click="handleSee(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <!-- dialog -->
    <el-dialog class="leaveDialog" title="请假单" :visible.sync="dialogVisible" width="40%">
      <handleLeave :temp="temp" :isReadOnly="isReadOnly" :leaveTypeOptions="leaveTypeOptions" :isApproval="isApproval"></handleLeave>
      <span slot="footer" class="dialog-footer" v-if="!isReadOnly">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateData()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createLeave, updateLeave} from '@/api/leave'
import Pagination from '@/components/Pagination'
import handleLeave from './components/handleLeave'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
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
    },
    typeFilter(type) {
      return planTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: "leave",
      listLoading: false,
      list: [],
      total: 0,
      listQuery: { //  请求参数
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        status: undefined,
        isApproval: true,
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
        department: "研发部"
      },
      isReadOnly: false, // 是否可读 请假创建成功则只可读
      isApproval: true // 是否可审批状态
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
        department: "研发部"
      }
    },


    // 查看
    handleSee(row) {
      this.dialogVisible = true;
      this.temp = row;
      this.isReadOnly = true;
    },
    // 审批更新
    handleUpdate(row) {
      this.temp =  JSON.parse(JSON.stringify(row));
      this.isReadOnly = false;
      this.dialogVisible = true;
      console.log(this.temp)
    },
    updateData() {
      console.log(this.temp,"更新")
      // this.temp.updateDate = +new Date(this.temp.timestamp)
      updateLeave(this.temp).then(() => {
        for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
        }
        this.dialogVisible = false
        this.$notify({
          title: '审批成功',
          message: '审批成功',
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
