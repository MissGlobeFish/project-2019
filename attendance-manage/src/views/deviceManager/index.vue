<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-11-06 19:39:09
 * @LastEditTime: 2019-11-14 20:36:41
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input clearable v-model="listQuery.deviceName" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.native.enter="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
    </div>  
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
        <el-table-column label="名称" prop="deviceName" align="center">
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="150px">
          <template slot-scope="{row}">
            <span>{{ row.createDate |  parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="150px">
          <template slot-scope="{row}">
            <span>{{ row.updateDate |  formatTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creator" align="center" width="110px"></el-table-column>
        <el-table-column label="状态" align="center" width="100px">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusLabFilter }}
            </el-tag>
          </template>
        </el-table-column>
      
        <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    </div>


    <!-- dialog -->
    <el-dialog class="deviceDialog" :title="textMap[dialogStatus]" :visible.sync="dialogVisible" width="40%">
      <div class="device-dialog-content">
        <el-form ref="form" :model="temp" label-width="120px">
          <el-form-item label="设备名称">
            <el-input class="device-name" v-model="temp.deviceName"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="temp.status" label="open">开启</el-radio>
            <el-radio v-model="temp.status" label="close">关闭</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogStatus=='create' ? createData() : updataData()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createDevice, updateDevice, deleteDevice} from '@/api/device'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
export default {
  components: {
    Pagination
  },
  props: {

  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        open: "success",
        close: "info"
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        open: '启用',
        close: '关闭'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: "device",
      listLoading: false,
      dialogVisible: false,
      dialogStatus: 'create',
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        deviceName: undefined
      },
      temp: {
        id: undefined,
        deviceName: undefined,
        createDate: undefined,
        updateDate: undefined,
        status: "open",
        creator: undefined
      },
      textMap: {
        update: '编辑设备',
        create: '新增设备'
      }
    } 
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
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.75 * 1000)
      })
    },

    handleFilter() {
      
    },

    // 重置
    resetTemp() {
      this.temp = {
        id: undefined,
        deviceName: undefined,
        createDate: undefined,
        updateDate: undefined,
        status: "open",
        creator: undefined
      }
    },

    // 创建
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true;
    },

    // 编辑
    handleUpdate(row) {
      this.temp =  JSON.parse(JSON.stringify(row))   //Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },

    handleDelete(row) {
      deleteDevice({id: row.id}).then((response)=>{
        this.getList()
         this.$notify({
          title: '删除成功',
          message: '删除成功',
          type: 'error',
          duration: 2000
        })
        
      })
    },

    // 确定创建
    createData() {
      this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      this.temp.creator = this.$store.getters.name
      this.temp.createDate = new Date().getTime()
      this.temp.updateDate = new Date().getTime()

      createDevice(this.temp).then(()=>{
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


    // 确定编辑更新
    updataData() {
      this.temp.updateDate = new Date().getTime()
      updateDevice(this.temp).then(() => {
        for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
        }
        this.dialogVisible = false
        this.$notify({
          title: '编辑成功',
          message: '编辑计划成功！',
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
  },
};
</script>

<style lang="scss">
.deviceDialog {
  .el-dialog__header{
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  }
}

</style>
