<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addParking">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增优惠卡规则</el-button>
    </div>

    <!-- 新增优惠卡规则 dialog -->
    <el-dialog class="addParkingDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="parkingForm" ref="parkingForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="优惠卡名称：" prop="title" :rules="{ required: true, message: '优惠卡名称不能为空', trigger: 'blur' }">
          <el-input v-model="parkingForm.title" autocomplete="off" placeholder="请输入优惠卡名称"></el-input>
        </el-form-item>
        <el-form-item label="停车场名称：" prop="parkName" :rules="{ required: true, message: '请选择停车场', trigger: 'change' }">
          <el-select v-model="parkingForm.parkName" @change="parkNameChange" filterable value-key="id" placeholder="请选择停车场">
            <el-option v-for="item in parkNames" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型：" prop="carTypeStr" :rules="{ required: true, message: '请选择车辆类型', trigger: 'change' }">
          <el-select v-model="parkingForm.carTypeStr" @change='changeCarType' value-key="code" autocomplete="off" placeholder="请选择车辆类型">
            <el-option v-for="item in carTypes" :key="item.code" :label="item.codeName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠卡金额：" prop="amount" :rules="{ required: true, message: '金额不能为空', trigger: 'blur' }">
          <el-input v-model="parkingForm.amount" autocomplete="off" placeholder="请输入优惠卡金额"></el-input>
        </el-form-item>
        <el-form-item label="类别：" prop="cardType" :rules="{ required: true, message: '请选择类别', trigger: 'change' }">
          <el-select v-model="parkingForm.cardType" autocomplete="off" placeholder="请选择类别">
            <el-option v-for="item in ruleTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序：" prop="sort" :rules="{ required: true, message: '请选择显示顺序', trigger: 'change' }">
          <el-input-number v-model="parkingForm.sort" :min="0" :max="100" label="请输入显示顺序"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠卡描述：" prop="cardDesc" :rules="{ required: true, message: '说明不能为空', trigger: 'blur' }">
          <el-input v-model="parkingForm.cardDesc" type="textarea" :rows="4" placeholder="请添加优惠卡描述"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('parkingForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('parkingForm')">保 存</el-button>
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
      <el-table-column prop="title" label="优惠卡名称" width="150" align="center"></el-table-column>
      <el-table-column prop="parkName" label="停车场名称" width="200" align="center"></el-table-column>
      <el-table-column prop="amount" label="优惠卡金额" width="150" align="center"></el-table-column>
      <el-table-column prop="carTypeStr" label="车辆类型" width="110" align="center"></el-table-column>
      <el-table-column prop="cardType" label="类别" width="110" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" align="center">
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
              <el-button type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
              <el-button type="danger" size="mini" plain class="el-icon-delete" @click="handleDelete(scope.$index, tableData)">删除</el-button>
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
import { getList, addMonthCard, editMonthCard, deleteMonthCard, getParking, getItemMonthCard, editState, getCarType } from '@/api/monthCard'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',

      parkingStatus:'',//判断当前是新增还是编辑

      parkingForm: {}, // 新建/编辑初始数据

      parkNames: [],
      carTypes: [],
      ruleTypes: [{
          name: '月卡',
          id: 'MONTH'
        },{
          name: '季度卡',
          id: 'QUARTER'
        },{
          name: '年度卡',
          id: 'YEAR'
        },{
          name:'半年卡',
          id: 'HALF_YEAR' 
      }],

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
        this.tableData.forEach(i => {
          if (i.cardType == 'MONTH') {
            i.cardType = '月卡';
          }else if (i.cardType == 'QUARTER') {
            i.cardType = '季度卡';
          }else if (i.cardType == 'YEAR') {
            i.cardType = '年度卡';
          }else if (i.cardType == 'HALF_YEAR') {
            i.cardType = '半年卡';
          }
        });
      })
    },
    //查询停车场
    handleParkName(){
      getParking().then(response => {
        this.parkNames = response.data;
      })
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
      this.parkingForm.cardType = val.code;
      this.parkingForm.carTypeStr = val.codeName;
    },
    //选择停车场
    parkNameChange(val){
      this.parkingForm.parkId = val.id;
      this.parkingForm.parkName = val.name;
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
      this.parkingForm = {
        id: '',
        title: '',
        parkId: '',
        parkName: '',
        carType: '',
        amount: '',
        cardDesc: '',
        cardType: '',
        carTypeStr: '',
        sort: 0,
        state: '',
      };
      this.dialogVisible = true;
      this.facilityStatus = 'add';
      this.titles = '新增优惠卡规则';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.parkingForm) {
            this.$refs.parkingForm.resetFields();
        }
        this.dialogVisible = true;
        this.facilityStatus = 'edit';
        this.titles = '编辑优惠卡规则';
        getItemMonthCard(rows[index].id).then(response => {
          this.parkingForm = response.data;
          if (this.parkingForm.cardType == 'MONTH') {
            this.parkingForm.cardType = '月卡';
          }else if (this.parkingForm.cardType == 'QUARTER') {
            this.parkingForm.cardType = '季度卡';
          }else if (this.parkingForm.cardType == 'YEAR') {
            this.parkingForm.cardType = '年度卡';
          }else if (this.parkingForm.cardType == 'HALF_YEAR') {
            this.parkingForm.cardType = '半年卡';
          }
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteMonthCard(rows[index].id).then(response => {
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
          if (this.parkingForm.cardType == '月卡') {
            this.parkingForm.cardType = 'MONTH';
          }else if (this.parkingForm.cardType == '季度卡') {
            this.parkingForm.cardType = 'QUARTER';
          }else if (this.parkingForm.cardType == '年度卡') {
            this.parkingForm.cardType = 'YEAR';
          }else if (this.parkingForm.cardType == '半年卡') {
            this.parkingForm.cardType = 'HALF_YEAR';
          }
          if (this.facilityStatus == 'add') {
              addMonthCard(this.parkingForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.facilityStatus == 'edit'){
              editMonthCard(this.parkingForm).then(response => {
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
