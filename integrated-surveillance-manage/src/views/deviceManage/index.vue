<template>
  <div class="app-container plan-box">
    <div class="filter-container">
      <span style="font-size: 18px; line-height:36px; font-weight: bold;">项目：</span>
      <el-select v-model="projectId" filterable remote reserve-keyword placeholder="请输入项目名" :remote-method="remoteMethod" :loading="projectLoading" @change="projectDidSelected">
        <el-option v-for="project in projectOptions" :key="project.relationCode" :label="project.relationName" :value="project.relationCode" />
      </el-select>
      <el-button v-if="false" style="margin:0;" class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddDevice">添加设备</el-button>
      <!-- <el-input v-model="listQuery.name" placeholder="选择项目" style="width: 400px;" class="filter-item" @keyup.native.enter="handleFilter" /> -->
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="deviceList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="设备 ID" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备型号" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备序列号" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceSerial }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道ID" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.channelId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.channelStatus | tagStatusFilter">
            {{ row.channelStatus | statusLabFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="warning" plain size="mini" @click="handleCheck(row)">查看</el-button>
          <el-dropdown v-if="false" size="mini" trigger="click">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting" />
            </el-button>
            <el-dropdown-menu slot="dropdown" style="padding:10px;">
              <el-button type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(row)"> 编辑</el-button>
              <el-button type="danger" size="mini" plain class="el-icon-delete" @click="handleDelete(row)"> 删除</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看详情 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="deviceForm" :model="deviceForm" label-width="120px" class="demo-deviceForm">
        <el-form-item label="设备名称：" prop="deviceName">
          <el-input v-model="deviceForm.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备 ID：" prop="deviceId">
          <el-input v-model="deviceForm.deviceId" placeholder="请输入设备 ID" />
        </el-form-item>
        <el-form-item label="设备型号：" prop="deviceModel">
          <el-input v-model="deviceForm.deviceModel" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="设备序列号：" prop="deviceSerial">
          <el-input v-model="deviceForm.deviceSerial" placeholder="请输入设备序列号" />
        </el-form-item>
        <el-form-item label="通道 ID：" prop="channelId">
          <el-input v-model="deviceForm.channelId" placeholder="请输入通道 ID" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('deviceForm')">立即添加</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { seachProjecByName, getDeviceByProject } from '@/api/deviceManage'

export default {
  name: 'DeviceManage',
  components: { },
  directives: { },
  filters: {
    tagStatusFilter(status) {
      const statusMap = {
        '0': 'danger',
        '1': 'success'
      }
      var filterStatus = statusMap[status]
      return filterStatus === undefined ? '' : filterStatus
    },
    statusLabFilter(status) {
      const statusMap = {
        0: '离线',
        1: '在线'
      }
      var filterStatus = statusMap[status]
      return filterStatus === undefined ? '未知' : filterStatus
    }
  },
  data() {
    return {
      projectLoading: false,
      projectOptions: [],
      projectId: undefined,
      tableKey: 0,
      deviceList: null,
      total: 0,
      listLoading: false,
      temp: {
        userId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        check: '查看设备',
        add: '添加设备'
        // update: '编辑人员',
        // create: '新增人员'
      },
      deviceForm: {
        deviceName: '',
        deviceId: '',
        deviceModel: '',
        deviceSerial: '',
        channelId: ''
      }
    }
  },
  computed: {},
  watch: {
  },
  mounted() {
    // this.getList()

  },
  methods: {
    // 点击表格单行
    handleCheck(row) {
      this.temp = JSON.parse(JSON.stringify(row))// Object.assign({}, row) // copy obj
      this.dialogStatus = 'check'
      this.dialogFormVisible = true
    },
    // 点击选择项目
    projectDidSelected() {
      var projectInfo = this.projectOptions.find((item) => {
        return item.relationCode === this.projectId
      })
      const storeId = projectInfo.storeId
      if (storeId !== undefined) {
        this.getDeviceList(storeId)
      } else {
        this.$message({
          message: '该项目暂未绑定平台',
          type: 'error'
        })
      }
    },
    // 添加设备
    handleAddDevice() {
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑设备
    handleEdit() {

    },
    // 删除设备
    handleDelete() {

    },
    // 通过项目 ID 获取项目下设备列表
    getDeviceList(projectId) {
      this.listLoading = true
      getDeviceByProject(projectId).then((res) => {
        console.log(res)
        this.listLoading = false
        this.deviceList = res.data
      }).catch((e) => {
        this.listLoading = false
      })
    },
    // 搜索项目
    remoteMethod(query) {
      if (query !== '') {
        this.projectLoading = true
        seachProjecByName(query).then(response => {
          console.log(response)
          this.projectLoading = false
          this.projectOptions = response.data
        }).catch((e) => {
          this.projectLoading = false
        })
      } else {
        this.projectOptions = []
      }
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
    .el-dialog__header{
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
    .el-dialog{
      max-width: 500px;
    }
  }
</style>
