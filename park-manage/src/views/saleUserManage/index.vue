<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addDiscounts">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增用户</el-button>
    </div>

    <!-- 新增用户 dialog -->
    <el-dialog class="addDiscountsDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="discountsForm" ref="discountsForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="用户姓名：" prop="customerName" :rules="{ required: true, message: '用户姓名不能为空', trigger: 'blur' }">
          <el-input v-model="discountsForm.customerName" autocomplete="off" placeholder="请输入用户姓名"></el-input>
        </el-form-item>

        <!-- 车牌号 -->
        <el-form-item class="carNoClass1" label="车牌号：" prop="cityConstruction" :show-message="true" :rules="{ required: true, message: '请选择城市简称', trigger: 'change' }">
          <el-select v-model="discountsForm.cityConstruction" placeholder="简称" filterable :filter-method="filter"> 
            <el-option v-for="item in cityConstructions" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="carNoClass2" prop="carNo" :show-message="true" :rules="[{ required: true, message: '车牌号不能为空', trigger: 'blur' }, { 
            validator: (rule, value, callback)=>{validateCarNo(rule, value, callback)}, trigger: ['blur','change'] }]">
          <el-input v-model="discountsForm.carNo" autocomplete="off" placeholder="请输入车牌号" maxlength="8" minlength="7"></el-input>
        </el-form-item>
        <!-- 车牌号 -->

        <el-form-item label="停车场名称：" prop="parkName" :rules="{ required: true, message: '请选择停车场', trigger: 'change' }">
          <el-select v-model="discountsForm.parkName" @change="parkNameChange" filterable value-key="id" placeholder="请选择停车场">
            <el-option v-for="item in parkNames" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型：" prop="carTypeStr" :rules="{ required: true, message: '请选择车辆类型', trigger: 'change' }">
          <el-select v-model="discountsForm.carTypeStr" @change='changeCarType' value-key="code" autocomplete="off" placeholder="请选择车辆类型">
            <el-option v-for="item in carTypes" :key="item.code" :label="item.codeName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠金额：" prop="discountPrice" :rules="{ required: true, message: '金额不能为空', trigger: 'blur' }">
          <el-input v-model="discountsForm.discountPrice" autocomplete="off" placeholder="请输入优惠金额"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="tel" :rules="{ required: true, message: '电话不能为空', trigger: 'blur' }">
          <el-input v-model="discountsForm.tel" autocomplete="off" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address" :rules="{ required: true, message: '地址不能为空', trigger: 'blur' }">
          <el-input v-model="discountsForm.address" autocomplete="off" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model="discountsForm.remarks" type="textarea" :rows="2" placeholder="请添加备注"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('discountsForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('discountsForm')">保 存</el-button>
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
      <el-table-column prop="customerName" label="用户姓名" width="200" align="center"></el-table-column>
      <el-table-column prop="carNo" label="车牌号" width="" align="center"></el-table-column>
      <el-table-column prop="carTypeStr" label="车辆类型" width="" align="center"></el-table-column>
      <el-table-column prop="discountPrice" label="优惠金额" width="" align="center"></el-table-column>
      <el-table-column prop="tel" label="电话" width="" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" width="" align="center"></el-table-column>
      <el-table-column prop="parkName" label="停车场" width="" align="center"></el-table-column>
      
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
import { getList, addDiscountsUser, editDiscountsUser, deleteDiscountsUser, getParking, itemDiscounts, getCarType } from '@/api/saleUserManage'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',

      parkingStatus:'',//判断当前是新增还是编辑
      cityConstruction: '',//城市简称
      cityConstructions: [{//城市简称
          label: '京',
          szm:'jing'
        },{
          label: '津',
          szm:'jin'
        },{
          label: '沪',
          szm:'hu'
        },{
          label: '渝',
          szm:'yu'
        },{
          label: '冀',
          szm:'ji'
        },{
          label: '晋',
          szm:'jin'
        },{
          label: '辽',
          szm:'liao'
        },{
          label: '吉',
          szm:'ji'
        },{
          label: '黑',
          szm:'hei'
        },{
          label: '苏',
          szm:'su'
        },{
          label: '浙',
          szm:'zhe'
        },{
          label: '皖',
          szm:'guan'
        },{
          label: '闽',
          szm:'min'
        },{
          label: '赣',
          szm:'gan'
        },{
          label: '鲁',
          szm:'lu'
        },{
          label: '豫',
          szm:'yu'
        },{
          label: '鄂',
          szm:'e'
        },{
          label: '湘',
          szm:'xiang'
        },{
          label: '粤',
          szm:'yue'
        },{
          label: '琼',
          szm:'qiong'
        },{
          label: '川',
          szm:'chuan'
        },{
          label: '贵',
          szm:'gui'
        },{
          label: '云',
          szm:'yun'
        },{
          label: '陕',
          szm:'shan'
        },{
          label: '甘',
          szm:'gan'
        },{
          label: '宁',
          szm:'ning'
        },{
          label: '青',
          szm:'qing'
        },{
          label: '藏',
          szm:'zang'
        },{
          label: '桂',
          szm:'gui'
        },{
          label: '蒙',
          szm:'meng'
        },{
          label: '新',
          szm:'xin'
      }],

      discountsForm: { // 新建/编辑初始数据
        id: '',
        customerName: "",
        cityConstruction: '',
        carNo: "",
        carType: "",
        carTypeStr: '',
        tel: "",
        address: "",
        discountPrice: null,
        remarks: "",
        parkId: '',
        parkName: ""
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
  mounted () {
    // 保留数据源
    this.copy = Object.assign(this.cityConstructions)
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
      this.discountsForm.carType = val.code;
      this.discountsForm.carTypeStr = val.codeName;
    },
    //选择停车场
    parkNameChange(val){
      this.discountsForm.parkId = val.id;
      this.discountsForm.parkName = val.name;
    },
    //新增
    handleAdd(){
      this.discountsForm = {
        id: '',
        customerName: "",
        cityConstruction: '',
        carNo: "",
        carType: "",
        carTypeStr: '',
        tel: "",
        address: "",
        discountPrice: null,
        remarks: "",
        parkId: '',
        parkName: ""
      };
      this.dialogVisible = true;
      this.facilityStatus = 'add';
      this.titles = '新增用户';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.discountsForm) {
            this.$refs.discountsForm.resetFields();
        }
        this.dialogVisible = true;
        this.facilityStatus = 'edit';
        this.titles = '编辑用户';
        itemDiscounts(rows[index].id).then(response => {
          this.discountsForm = response.data;
          this.discountsForm.cityConstruction = this.discountsForm.carNo.substring(0,1);
          this.discountsForm.carNo = this.discountsForm.carNo.substring(1,this.discountsForm.carNo.length);
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteDiscountsUser(rows[index].id).then(response => {
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
          this.discountsForm.carNo = this.discountsForm.cityConstruction + this.discountsForm.carNo;
          if (this.facilityStatus == 'add') {
              addDiscountsUser(this.discountsForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.facilityStatus == 'edit'){
              editDiscountsUser(this.discountsForm).then(response => {
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
    //校验车牌号
    validateCarNo(rule, value, callback){
      this.discountsForm.carNo = (value).toUpperCase();
      var text = /^(([A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      if (!text.test(this.discountsForm.carNo)) {
          callback(new Error("请输入正确的车牌号"))
      } else {
          callback();
      }
    },
    //城市简称的模糊查询
    filter(v) {
      // 对绑定数据赋值
      this.cityConstructions = this.copy.filter((item) => {
        // 如果直接包含输入值直接返回true
        const val = v.toLowerCase()
        if (item.label.indexOf(val) !== -1) return true
        if (item.szm.substring(0, 1).indexOf(val) !== -1) return true
        if (item.szm.indexOf(val) !== -1) return true
      })
    },
  }
}
</script>
<style lang="scss">
  .addDiscounts{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addDiscountsDialog{
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
  .carNoClass1{
    display: inline-block;
    width: 35%;
    .el-select{
      width: 100% !important;
      .el-input{
        width: auto !important;
      }
    } 
  }
  .carNoClass2{
    display: inline-block;
    width: 41%;
    .el-form-item__content{
      margin: 0 !important;
      .el-input{
        width: 100% !important;
      }
    }
  }
</style>
