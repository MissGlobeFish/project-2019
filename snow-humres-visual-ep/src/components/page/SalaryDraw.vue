<template>
<!--  销售提存 -->

<div class="salary-draw">
  <vSalaryDescript v-if="showDescript" @goSalaryDescriptBack="goSalaryDescriptBack" :empCode="empCode"></vSalaryDescript>
  <div class="salary-wrap" v-if="showContainer">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-service"></i> 销售提存</el-breadcrumb-item>
        </el-breadcrumb>
    </div>  
    <div v-loading="loading" class="steps"> </div>

    <!-- 表格 -->
    <el-table :data="list" style="width: 100%"  border>
      <el-table-column prop="empName" label="姓名" > </el-table-column>
      <el-table-column prop="sum" label="金额"> </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleView(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
      :page-size="pageSize" 
      layout="total, sizes, prev, pager, next" 
      :total="total">
      </el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog title="编辑--销售提存" :visible.sync="dialogFormVisible" center width="30%" :before-close="handleClose">
      <el-form :model="form" ref="salaryForm">
        <el-form-item label="金额" label-width="56px" prop="sum" :rules="[{ required: true, message: '输入为空或不合法',type: 'number',trigger: 'blur'}]">
          <el-input v-model.number="form.sum"></el-input>
        </el-form-item>
        <el-form-item label="原因" label-width="56px" prop="escrowDesc" :rules="[{ required: true, message: '输入为空或不合法',trigger: 'blur'}]">
          <el-input v-model.trim="form.escrowDesc" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle('salaryForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('salaryForm')">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</div>
</template>

<script>
import vSalaryDescript from '../page/SalaryDescript'
export default {
  data() {
    return {
      loading: false,
      showDescript: false,
      showContainer: true,
      dialogFormVisible: false,
      empCode: '',
      option: {
          timeout: 30 * 1000 //30秒过期
      },
      form: {
        sum: null,
        creator: null,
        empCode: null,
        escrowDesc: null
      },
      list: [],
      total: 0,
      pageSize: 10,
      role:{
        isPage: true, //是否分页
        total: null, //总条数
        pages: null, //总页数
        curPage: 1, //当前页
        pageSize:10 //当前页条数
      },
    }
  },
  components:{
    vSalaryDescript
  },
  created() {
  },
  mounted() {
    this.getInfo()
    this.form.creator = JSON.parse(localStorage.getItem('userVer')).empName;
  },
  methods: {
    handleSizeChange(val) {
      this.role.curPage = 1;
      this.role.pageSize = val;
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.role.curPage = val;
      this.getInfo()
    },
    goSalaryDescriptBack () { // 返回上一级
      this.showDescript = arguments[0];
      this.showContainer = true;
    },
    handleEdit(index,row) { // 编辑销售提存
      this.dialogFormVisible = true;   
      this.form.empCode = row.empCode
      console.log('123231')
    },
    handleView(index,row) { // 查看销售提存详情
      this.empCode = row.empCode
      // console.log(this.empCode)
      this.showDescript = true;
      this.showContainer = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = `${global.HUMRES_URL}/humres/escrow/add`
          this.$http.post(url, this.form, this.option)
            .then((res)=>{
              let resData = res.body;
              if (resData.flag) {
                this._log_success(resData.msg);
                this.getInfo()
              } else {
                this._log_warn(resData.msg);
              }
            },(error)=>{
              this._log_err(resData.msg);
            })
          this.$refs[formName].resetFields();
          this.$refs[formName].clearValidate();
          this.dialogFormVisible = false; 

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancle(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      this.dialogFormVisible = false; 
      this.$refs['salaryForm'].clearValidate();
      this.$refs['salaryForm'].resetFields();
    },
    getInfo() {// 获取销售提存列表
    this.loading = true
      let url = `${global.HUMRES_URL}/humres/escrow/finds`;
      this.$http.post(url, this.role)
        .then((res)=>{
          this.loading = false
          let resData = res.body;
          if (resData.flag) {
            this.list = resData.datas.list
            this.total = resData.datas.total
            // console.log(this.total)
          } else {
            this._log_warn(resData.msg);
          }
        },
        (error)=>{
          this._log_err(resData.msg);
        })
    }
  }
};
</script>

<style lang="less">
  .salary-draw {
        background: #fff;
        .salary-wrap{
            box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
            padding: 20px;

            .crumbs{
                position: relative;
                margin-bottom: 40px;

                .back{
                    position: absolute;
                    right: 0;
                    bottom: -12px;
                }
            }
        }
    } 
</style>
