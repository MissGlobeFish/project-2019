<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addParking">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增设备</el-button>
    </div>

    <!-- 新增设备 dialog -->
    <el-dialog class="addParkingDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="facilityForm" ref="facilityForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="停车场名称：" prop="parkName" :rules="{ required: true, message: '请选择停车场', trigger: 'change' }">
          <el-select v-model="facilityForm.parkName" @visible-change="handleParkName" @change="parkNameChange" filterable value-key="id" placeholder="请选择停车场">
            <el-option v-for="item in parkNames" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：" prop="title" :rules="{ required: true, message: '设备名称不能为空', trigger: 'blur' }">
          <el-input v-model="facilityForm.title" autocomplete="off" placeholder="请输入设备名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="IPV4地址：" prop="ip" :rules="[{ required: true, message: 'IP地址不能为空', trigger: 'blur' },
        { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确的IPV4地址' }]">
          <el-input v-model="facilityForm.ip" autocomplete="off" placeholder="请输入IPV4地址" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="Mac地址：" prop="mac" :rules="{ required: true, message: 'Mac地址不能为空', trigger: 'blur' }">
          <el-input v-model="facilityForm.mac" autocomplete="off" placeholder="请输入Mac地址"></el-input>
        </el-form-item>
        <el-form-item label="端口：" prop="port" :rules="{ required: true, message: '端口不能为空', trigger: 'blur' }">
          <el-input v-model="facilityForm.port" autocomplete="off" placeholder="请输入端口" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="超时时间：" prop="timeOut" :rules="[{ required: true, message: '超时时间不能为空'},{ type: 'number', message: '超时时间必须为数字值'}]">
          <el-input v-model.number="facilityForm.timeOut" autocomplete="off" placeholder="请输入超时时间"></el-input>
        </el-form-item>
        <el-form-item label="位置：" prop="position" :rules="{ required: true, message: '请选择位置', trigger: 'change' }">
          <el-radio v-model="facilityForm.position" label="IN">入口</el-radio>
          <el-radio v-model="facilityForm.position" label="OUT">出口</el-radio>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('facilityForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('facilityForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      max-height="700"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
      :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
    >
        <el-table-column type="index" fixed width="50" align="center"></el-table-column>
        <el-table-column prop="parkName" label="停车场名称" width="250" align="center"></el-table-column>
        <el-table-column prop="title" label="设备名称" width="150" align="center"></el-table-column>
        <el-table-column prop="ip" label="IP地址" width="200" align="center"></el-table-column>
        <el-table-column prop="mac" label="Mac地址" width="150" align="center"></el-table-column>
        <el-table-column prop="port" label="端口" width="90" align="center"></el-table-column>  
        <el-table-column prop="timeOut" label="超时" width="90" align="center"></el-table-column>  
        <el-table-column prop="position" label="位置" align="center">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.position == 'IN'">入口</el-tag>
                <el-tag v-else type="success">出口</el-tag>
            </template>
        </el-table-column>  
        <!-- <el-table-column prop="deviceStatus" label="设备状态" width="120" align="center">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.deviceStatus == -1" effect="plain" type="info">未注册</el-tag>
                <el-tag v-if="scope.row.deviceStatus == 0" effect="plain">已注册</el-tag>
                <el-tag v-if="scope.row.deviceStatus == 1" effect="plain" type="success">正常联网</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="networkStatus" label="网络状态" align="center">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.networkStatus == 0" type="info">断网</el-tag>
                <el-tag v-else type="success">联网</el-tag>
            </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="70" align="center">
            <template slot-scope="scope">

            <el-dropdown size="mini" trigger="click">
                <el-button size="mini" type="primary">
                <i class="el-icon-setting"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="padding:10px;">
                    <el-button v-if="scope.row.deviceStatus == '-1'" type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
                    <!-- <el-button v-if="scope.row.deviceStatus == '-1'" type="primary" size="mini" plain class="el-icon-delete" @click="handleDelete(scope.$index, tableData)">删除</el-button> -->
                    <!-- <el-button v-if="scope.row.deviceStatus == '-1'" type="primary" size="mini" plain @click.native.prevent="handleRegister(scope.$index, tableData)">注册</el-button>
                    <el-button v-if="scope.row.deviceStatus == '0' || scope.row.networkStatus == 0" type="primary" size="mini" plain @click="handleConnect(scope.$index, tableData)">连接</el-button> -->
                    <el-button v-if="scope.row.deviceStatus == '0'" type="primary" size="mini" plain @click="handleUnregister(scope.$index, tableData)">取消注册</el-button>
                    <el-button v-if="scope.row.deviceStatus == '1'" type="primary" size="mini" plain @click="handleBreak(scope.$index, tableData)">断开</el-button>
                    <el-button v-if="scope.row.deviceStatus == '1'" type="primary" size="mini" plain @click="handleCutOff(scope.$index, tableData)">开闸</el-button>
                    <el-button v-if="scope.row.deviceStatus == '1'" type="primary" size="mini" plain @click="handleSwitchOff(scope.$index, tableData)">关闸</el-button>
                    <el-button v-if="scope.row.deviceStatus == '1'" type="primary" size="mini" plain @click="handleState(scope.$index, tableData)">状态</el-button>
                </el-dropdown-menu>
            </el-dropdown>

            </template>
        </el-table-column>
    </el-table>

    <!-- 表格分页 -->
    <div class="pagination">
      <el-pagination 
      style="margin: 20px 0;text-align: right;"
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
      :page-size="params.pageSize" 
      layout="total, sizes, prev, pager, next" 
      :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList, addFacility, modifyFacility, searchFacility, registerLink, connectCamera, getParking } from '@/api/facilityManage'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',

      facilityStatus:'',//判断当前是新增还是编辑
      parkNames: [],

      facilityForm: { // 新建/编辑初始数据
        title: '',
        ip: '',
        mac: '',
        port: '30000',
        timeOut: 60,
        position: 'IN',
        deviceStatus: -1,
        networkStatus: 0,
        parkName: '',
        parkId: '',
      },

      /* 列表加载动画 */
      listLoading: true,
      dialogVisible: false, //  新建/编辑弹框显示

      /* 分页 */
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created() {
    this.fetchData();
    this.handleParkName();
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.tableData = response.data.list;
        this.total = parseInt(response.data.total);
        this.listLoading = false;
      })
    },
    //查询停车场
    handleParkName(){
      getParking().then(response => {
        this.parkNames = response.data;
      })
    },
    //选择停车场
    parkNameChange(val){
      this.facilityForm.parkId = val.id;
      this.facilityForm.parkName = val.name;
    },
    //新增
    handleAdd(){
        this.facilityForm = { // 新建/编辑初始数据
            title: '',
            ip: '',
            mac: '',
            port: '30000',
            timeOut: 60,
            position: 'IN',
            deviceStatus: -1,
            networkStatus: 0,
            parkName: '',
            parkId: '',
        }
        this.dialogVisible = true;
        this.facilityStatus = 'add';
        this.titles = '新增设备';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.facilityForm) {
            this.$refs.facilityForm.resetFields();
        }
        this.dialogVisible = true;
        this.facilityStatus = 'edit';
        this.titles = '编辑设备';
        searchFacility(rows[index].id).then(response => {
            this.facilityForm = response.data;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除！'
            });          
        });
    },
    //注册
    handleRegister(index, rows){
        let datas = {
            ip: rows[index].ip
        }
        this.$confirm('设备 [ '+ rows[index].ip +' ] 将会被注册到服务, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            registerLink(datas).then(response => {
                this.$message({
                    type: 'success',
                    message: '注册成功！'
                });
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消注册！'
            });          
        });
    },
    //取消注册
    handleUnregister(index, rows){
        let datas = {
            ip: rows[index].ip
        }
        this.$confirm('设备 [ '+ rows[index].ip +' ] 将会永久与服务器断开连接, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            registerLink(datas).then(response => {
                this.$message({
                    type: 'success',
                    message: '取消注册成功！'
                });
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消！'
            });          
        });
    },
    //连接相机
    handleConnect(index, rows){
        let datas = {
            handle: rows[index].handle,
            port: rows[index].port,
            timeOut: rows[index].timeOut,
        }
        this.$confirm('确认连接 [ '+ rows[index].ip +' ] 服务？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            connectCamera(datas).then(response => {
                this.$message({
                    type: 'success',
                    message: '连接成功！'
                });
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消连接！'
            });          
        });
    },
    //断开
    handleBreak(index, rows){
        let datas = {
            ip: rows[index].ip
        }
        this.$confirm('此操作将断开 [ '+ rows[index].ip +' ] 与服务器的连接，并且不会再上报数据信息, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            registerLink(datas).then(response => {
                this.$message({
                    type: 'success',
                    message: '连接已断开！'
                });
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消断开！'
            });          
        });
    },
    //状态
    handleState(index, rows){
      let datas = {
            ip: rows[index].ip
        }
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            registerLink(datas).then(response => {
                
            })
        });
    },
    //开闸
    handleCutOff(index, rows){
      let datas = {
            ip: rows[index].ip
        }
        this.$confirm('此操作将开启 [ '+ rows[index].ip +' ] 对应闸机, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            registerLink(datas).then(response => {
                this.$message({
                    type: 'success',
                    message: '开闸成功！'
                });
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消开闸！'
            });          
        });
    },
    //关闸
    handleSwitchOff(index, rows){
      let datas = {
            ip: rows[index].ip
        }
        this.$confirm('此操作将关闭 [ '+ rows[index].ip +' ] 对应闸机, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            registerLink(datas).then(response => {
                this.$message({
                    type: 'success',
                    message: '关闸成功！'
                });
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消关闸！'
            });          
        });
    },
    //保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
            if (this.facilityStatus == 'add') {
                addFacility(this.facilityForm).then(response => {
                    this.$message({
                        type: 'success',
                        message: '新增设备成功！'
                    }); 
                    this.fetchData();
                    this.dialogVisible = false;
                })
            }else if(this.facilityStatus == 'edit'){
                modifyFacility(this.facilityForm).then(response => {
                    this.$message({
                        type: 'success',
                        message: '编辑设备成功！'
                    }); 
                    this.fetchData();
                    this.dialogVisible = false;
                })
            }
        } else {
          return false;
        }
      });
    },
    //取消
    handleCancel(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    //误操作关闭 dialog 的提示
    handleClose(done) {
      done();
    },
    //表格分页
    handleSizeChange(val) {
        this.params.pageNum = 1;
        this.params.pageSize = val;
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val;
        this.fetchData()
    },
  }
}
</script>
<style lang="scss" scoped>
  .addParking{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addParkingDialog{
    .el-dialog{
      .el-input{
        width: 70%;
      }
      .el-select{
        width: 70%;
        .el-input{
          width: 100%;
        }
      }
    }
  }
</style>
