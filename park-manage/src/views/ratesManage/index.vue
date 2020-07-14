<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addParking">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增收费标准</el-button>
    </div>

    <!-- 新增收费标准 dialog -->
    <el-dialog class="addParkingDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="ratesForm" ref="ratesForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="费用类型：" prop="costTitle" :rules="{ required: true, message: '费用类型不能为空', trigger: 'blur' }">
          <el-input v-model="ratesForm.costTitle" autocomplete="off" placeholder="请输入费用类型"></el-input>
        </el-form-item>
        <el-form-item label="停车场名称：" prop="parkName" :rules="{ required: true, message: '请选择停车场', trigger: 'change' }">
          <el-select v-model="ratesForm.parkName" @change="parkNameChange" filterable value-key="id" placeholder="请选择停车场">
            <el-option v-for="item in parkNames" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型：" prop="carTypeStr" :rules="{ required: true, message: '请选择车辆类型', trigger: 'change' }">
          <el-select v-model="ratesForm.carTypeStr" @change='changeCarType' value-key="code" autocomplete="off" placeholder="请选择车辆类型">
            <el-option v-for="item in carTypes" :key="item.code" :label="item.codeName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="按小时收费（元/时）：" prop="hourCharge" :rules="{ required: true, message: '费用不能为空', trigger: 'blur' }">
          <el-input v-model="ratesForm.hourCharge" autocomplete="off" placeholder="请输入费用"></el-input>
        </el-form-item>
        <el-form-item label="按天收费（天/时）：" prop="dayCharge" :rules="{ required: true, message: '费用不能为空', trigger: 'blur' }">
          <el-input v-model="ratesForm.dayCharge" autocomplete="off" placeholder="请输入费用"></el-input>
        </el-form-item>
        <el-form-item label="免费时长（min）：" prop="freeTime" :rules="{ required: true, message: '时长不能为空', trigger: 'blur' }">
          <el-input v-model="ratesForm.freeTime" autocomplete="off" placeholder="请输入时长"></el-input>
        </el-form-item>
        <el-form-item label="免费出场时长（min）：" prop="freeOutTime" :rules="{ required: true, message: '时长不能为空', trigger: 'blur' }">
          <el-input v-model="ratesForm.freeOutTime" autocomplete="off" placeholder="请输入时长"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('ratesForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('ratesForm')">保 存</el-button>
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
      <el-table-column prop="costTitle" label="费用类型（单次）" width="90" align="center"></el-table-column>
      <el-table-column prop="parkName" label="停车场名称" width="200" align="center"></el-table-column>
      <el-table-column prop="carTypeStr" label="车辆类型" width="100" align="center"></el-table-column>
      <el-table-column prop="hourCharge" label="按小时收费（元/时）" width="90" align="center"></el-table-column>
      <el-table-column prop="dayCharge" label="按天收费（天/时）" width="90" align="center"></el-table-column>
      <el-table-column prop="freeTime" label="免费时长（min）" width="90" align="center"></el-table-column>
      <el-table-column prop="freeOutTime" label="免费出场时长（min）" width="100" align="center"></el-table-column>
      <el-table-column prop="state" label="是否启用" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change='stateChange(scope.row)' active-color="#13ce66" active-value="ON" inactive-value="OFF"></el-switch>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="70" align="center">
        <template slot-scope="scope">

          <el-dropdown size="mini" trigger="click">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="padding:10px;">
              <el-button type="primary" size="mini" class="el-icon-edit" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
              <el-button type="danger" size="mini" class="el-icon-delete" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
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
import { getList, getParking, getCarType, getItemRates, editState, deleteRates, editRates, addRates } from '@/api/ratesManage'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',

      ratesStatus:'',//判断当前是新增还是编辑

      ratesForm: { // 新建/编辑初始数据
        id: '',
        costTitle: '',
        parkName: '',
        parkId: '',
        carType: '',
        carTypeStr: '',
        hourCharge: '',
        dayCharge: '',
        freeTime: '',
        freeOutTime: '',
        state: '',
      },

      parkNames: [],
      carTypes: [],

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
    this.findParkName();
    this.findCarType();
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.listLoading = false;
        this.total = parseInt(response.data.total);
        this.tableData = response.data.list;
      })
    },
    //查询停车场
    findParkName(){
      getParking().then(response => {
        this.parkNames = response.data;
      })
    },
    //选择停车场
    parkNameChange(val){
      this.ratesForm.parkId = val.id;
      this.ratesForm.parkName = val.name;
    },
    //查询车辆类型
    findCarType(){
      let datas = {
        parentCode: 'CAR_TYPE'
      };
      getCarType(datas).then(response => {
        this.carTypes = response.data;
      })
    },
    //选择车辆类型
    changeCarType(val){
      this.ratesForm.carType = val.code;
      this.ratesForm.carTypeStr = val.codeName;
    },
    //修改状态
    stateChange(val){
      this.$confirm('确认要修改 [ '+ val.title +' ] 的状态？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          editState({ pid: val.id, state: val.state }).then(response => {
            this.fetchData();
          })
      }).catch(() => {
          this.$message({
          type: 'info',
          message: '已取消修改！'
          });          
      });
    },
    //新增
    handleAdd(){
      this.ratesForm = {
        id: '',
        costTitle: '',
        parkId: '',
        parkName: '',
        carType: '',
        carTypeStr: '',
        hourCharge: '',
        dayCharge: '',
        freeTime: '',
        freeOutTime: '',
        state: '',
      };
      this.dialogVisible = true;
      this.ratesStatus = 'add';
      this.titles = '新增收费标准';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.ratesForm) {
            this.$refs.ratesForm.resetFields();
        }
        this.dialogVisible = true;
        this.ratesStatus = 'edit';
        this.titles = '编辑收费标准';
        getItemRates(rows[index].id).then(response => {
          this.ratesForm = response.data;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteRates(rows[index].id).then(response => {
              this.fetchData();
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除！'
            });          
        });
    },
    //保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ratesStatus == 'add') {
              addRates(this.ratesForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.ratesStatus == 'edit'){
              editRates(this.ratesForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
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
      .el-input,.el-textarea{
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
