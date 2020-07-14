<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addParking">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增停车场</el-button>
    </div>

    <!-- 新增停车场 dialog -->
    <el-dialog class="addParkingDialog" :title="parkingTitle" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="parkingForm" ref="parkingForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="停车场名称：" prop="name" :rules="{ required: true, message: '停车场名称不能为空', trigger: 'blur' }">
          <el-input v-model="parkingForm.name" autocomplete="off" placeholder="请输入停车场名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address" :rules="{ required: true, message: '地址不能为空', trigger: 'blur' }">
          <el-input v-model="parkingForm.address" autocomplete="off" placeholder="请输入地址"></el-input>
        </el-form-item><!-- 
        <el-form-item label="描述：" prop="parkingDesc" :rules="{ required: true, message: '描述不能为空', trigger: 'blur' }">
          <el-input v-model="parkingForm.parkingDesc" autocomplete="off" placeholder="请输入描述" maxlength="6"></el-input>
        </el-form-item> -->

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
      <el-table-column prop="name" label="停车场名称" width="300" align="center"></el-table-column>
      <!-- <el-table-column prop="parkingDesc" label="停车场描述" width="200" align="center"></el-table-column>
      <el-table-column prop="province" label="省份" width="120" align="center"></el-table-column>  
      <el-table-column prop="city" label="城市" width="120" align="center"></el-table-column>  
      <el-table-column prop="area" label="地区" width="120" align="center"></el-table-column>
      <el-table-column prop="coordinate" label="坐标" align="center"></el-table-column>   -->
      <el-table-column prop="address" label="地址" align="center"></el-table-column>

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
import { getList, addParking, editParking, deleteParking, getItemParking } from '@/api/parkingManage'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      parkingTitle: '',

      parkingStatus:'',//判断当前是新增还是编辑

      parkingForm: { // 新建/编辑初始数据
        name: '',
        address: '',
        id: '',
        parkingDesc: '',
        province: '',
        city: '',
        area: '',
        coordinate: '',
      },

      /* 列表加载动画 */
      listLoading: false,
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
    this.fetchData()
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true;
      getList(this.params).then(response => {
        this.tableData = response.data.list;
        this.total = parseInt(response.data.total);
        this.listLoading = false;
      })
    },
    //新增
    handleAdd(){
      this.parkingForm = {
        name: '',
        address: '',
        id: '',
        parkingDesc: '',
        province: '',
        city: '',
        area: '',
        coordinate: '',
      }
      this.dialogVisible = true;
      this.facilityStatus = 'add';
      this.parkingTitle = '新增停车场';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.parkingForm) {
            this.$refs.parkingForm.resetFields();
        }
        this.dialogVisible = true;
        this.facilityStatus = 'edit';
        this.parkingTitle = '编辑停车场';
        getItemParking(rows[index].id).then(response => {
          this.parkingForm = response.data;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            deleteParking(rows[index].id).then(response => {
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
            if (this.facilityStatus == 'add') {
              addParking(this.parkingForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
            }else if(this.facilityStatus == 'edit'){
              editParking(this.parkingForm).then(response => {
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
