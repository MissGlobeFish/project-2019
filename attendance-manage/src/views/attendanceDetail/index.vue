<!--
 * @Description: 打卡记录
 * @Author: ep
 * @Date: 2019-11-05 16:24:35
 * @LastEditTime: 2019-11-06 17:34:33
 -->
<template>
  <div class="app-container attendance">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.native.enter="handleFilter" />
       <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-date-picker
        class="filter-item"
        style="height: 36px;"
        size="small"
        v-model="listQuery.dateRange"
        value-format="timestamp"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column prop="id" label="ID"  width="80" align="center"></el-table-column>
      <el-table-column prop="date" label="日期"align="center"></el-table-column>
      <el-table-column prop="name"  width="110px" label="用户" align="center"></el-table-column>
      <el-table-column prop="department" width="110px" label="部门"align="center"></el-table-column>
      <el-table-column prop="startTime"label="上班"align="center">
        <template slot-scope="{row}">
          <p class="work">{{row.startTime}}</p>
          <p class="work device">{{row.startDevice}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="下班"align="center">
        <template slot-scope="{row}"align="center">
          <p class="work">{{row.endTime}}</p>
          <p class="work device">{{row.startDevice}}</p>
        </template>
      </el-table-column>
      <el-table-column  label=" 工时" align="center" width="100">
       <template slot-scope="{row}">
            <span>{{ row.workHour }}</span> 小时
          </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusLabFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="操作" align="center">
        <template slot-scope="{row}" >
          <el-button type="primary" size="mini" @click="handlException(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />



    <!-- dialog -->
    <el-dialog
      class="attendanceDialog"
      title="考勤信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="content">
        <p class="name item">用户：&emsp;&emsp; {{rowDialog.name}}</p>
        <p class="department item">所在部门：{{rowDialog.department}}</p>
        <p class="attendance-date item">考勤日期：{{rowDialog.date}}</p>
        <div class="date-wrap">
          <div class="date-item item">上班时间：
            <el-time-select  placeholder="上班时间" v-model="rowDialog.startTime" :picker-options="{
                start: '00:00',
                step: '00:1',
                end: '24:00'
              }">
            </el-time-select>
          </div>
          <div class="date-item item">下班时间：
            <el-time-select  placeholder=" 下班时间" v-model="rowDialog.endTime" :picker-options="{
                start: '00:00',
                step: '00:1',
                end: '24:00',
                minTime: rowDialog.startTime
              }">
            </el-time-select>
          </div>
        </div>
        <div class="changeStatus item">
          考勤状态：
          <el-radio v-model="rowDialog.status" label="success">正常</el-radio>
          <el-radio  v-model="rowDialog.status" label="exception">异常</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateAttendance} from '@/api/attendance'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
export default {
  components: {
    Pagination
  },
  props: {

  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        exception: 'warning'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        success: '正常',
        exception: '异常'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return planTypeKeyValue[type]
    }
  },
  directives: { waves },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      statusOptions: [
        {key: "success", value: "正常"},
        {key: "exception", value: "异常"}
      ],
      tableList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        status: undefined,
        dateRange: [],
        currentUsr: this.$store.getters.roles[0]
      },
      rowDialog: {} // 表格单行值
    };
  },
  computed: {

  },
  mounted () {
    this.getList()
  },
  watch: {

  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.tableList = response.data.items
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
    // 处理异常
    handlException(row) {
      console.log(row)
      this.dialogVisible = true
      this.rowDialog = Object.assign({},row);
    },
    //  关闭弹框
    handleClose(done) {
      done();
    },

    // 确定编辑
    updateData() {
      updateAttendance(this.rowDialog).then(() => {
        for (const v of this.tableList) {
            if (v.id === this.rowDialog.id) {
              const index = this.tableList.indexOf(v)
              this.tableList.splice(index, 1, this.rowDialog)
              break
            }
        }
        this.dialogVisible = false
        this.$notify({
          title: '编辑成功',
          message: '编辑计划成功点击发布即可发布！',
          type: 'success',
          duration: 2000
        })
      })
    }
  },
};
</script>

<style lang="scss">
.attendance {
  title {
    color: #495060;
    margin-bottom: 20px;
  }
  .attendanceDialog .el-dialog__header{
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  }
  .item {
    font-weight: bold;
    margin-bottom: 25px;
  }
  .normal {
    background-color: transparent;
    border: none;
    color: #606266;
    outline: none
  }
  .warn {
    // color: #fff;
    border-radius: 5px;
    background: #E6A23C
  }
  .work {
    margin: 0 auto;
  }
  .device {
    font-size: 12px;
  }
  // .date-wrap {
  //   .date-item {
  //     margin-bottom: 10px;
  //   }
  // }
}

</style>
