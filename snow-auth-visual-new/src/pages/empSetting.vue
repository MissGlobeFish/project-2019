<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-05 14:50:58
 * @LastEditTime: 2019-09-19 17:35:09
 -->
<template>
<div v-loading="loading">
  <!-- 内容头部 -->
    <div class="content-head">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-location-outline breadcrumb-icon"></i>账号管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-head-right">
        <el-button type="primary" size="small" plain icon="el-icon-edit-outline" @click="handleCreat">创建员工</el-button>
      </div>
    </div>
    <!-- 内容主体 -->
    <div class="content-body">
      <div class="search">
          <el-input v-model="role.param" placeholder="条件查询" clearable class="handle-input margin-bottom-20 margin-right-10" @change="findEmpInfos"></el-input>
          <el-button type="primary" class="el-icon-search" @click="findEmpInfos" plain> 搜索</el-button>
          <el-button type="primary" class="margin-right-10" @click="handleReset" plain> 重置</el-button>
      </div>
      <el-table header-row-class-name="success-row" :data="empData" style="width: 100%" height="479" border>
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="empCode" label="员工工号"></el-table-column>
        <el-table-column prop="empName" label="员工名称"></el-table-column> 
        <el-table-column prop="userName" label="员工账号" ></el-table-column> 
        <el-table-column prop="deptName" label="员工部门"></el-table-column> 
        <el-table-column label="状态" >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isValid" @change="handleSwitch(scope.$index, empData)" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope.$index, empData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="handleDelete(scope.$index, empData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出框-->
      <el-dialog :title="empInfo.roleTitle" :visible.sync="dialogFormVisible"  :before-close="handleClose">
        <el-form :model="empInfo" ref="empInfoForm" class="demo-ruleForm">
          <el-form-item label="员工名称" prop="empName" :rules="[{ required: true, message: '请输入员工名称', trigger: 'blur' }]">
            <el-input v-model="empInfo.empName" auto-complete="off"></el-input>
          </el-form-item> 
          <el-form-item label="员工账号" prop="userName" :rules="[{ required: true, message: '请输入员工账号', trigger: 'blur' }]">
            <el-input v-model="empInfo.userName" auto-complete="off"></el-input>
          </el-form-item> 
          <el-form-item label="员工工号" prop="empCode" :rules="[{ required: true, message: '请输入员工工号', trigger: 'blur' }]">
            <el-input v-model="empInfo.empCode" auto-complete="off"></el-input>
          </el-form-item> 
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="empInfo.deptName" auto-complete="off"></el-input>
          </el-form-item> 
            <el-form-item label="是否启用" >
            <el-radio-group v-model="empInfo.isValid">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button> 
          <el-button type="primary" @click="handleCreatrole('empInfoForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="role.pageSize" layout="total, sizes, prev, pager, next" :total="role.total">
      </el-pagination>
    </div>
</div>
</template>

<script>
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      empInfo: { },
      userVer :{},
      empData: [],
      role:{
        isPage: true, //是否分页
        total: null, //总条数
        pages: null, //总页数
        curPage: 1, //当前页
        pageSize:10, //当前页条数
        param:null, // 搜索参数
      }
    };
  },
  mounted () {
     if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){ 
        this.userVer =  JSON.parse(localStorage.getItem("userVer"));
      }; 
    this.findEmpInfos();
  },
  methods: {
    //查询人员信息
    findEmpInfos() { 
      this.loading = true;
      let url = global.AUTH_URL + "/auth/userInfo/findUserInfos";
      this.$http.post(url, this.role).then((data)=> {
          this.empData = data.list; 
          this.role.total = data.total;
        })
        .catch(error=>{
          this.$msg._log_warn(error.msg || "列表请求失败，请刷新重试！")
        })
        .finally(()=>{this.loading = false})
    },

    // 确定创建/修改员工信息
    handleCreatrole(formName) { 
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let sym = this.empInfo.symbol;
            let user = this.userVer.empName;
            this.empInfo.creator = user;
            this.empInfo.updater = user; 
            if (sym == "creat") {
              this.addEmpInfo(this.empInfo); 
            } else if (sym == "edit") { 
              this.updateEmpInfo(this.empInfo); 
            } 
            this.dialogFormVisible = false; 
          } else {
            return false;
          }
      });
    },
    
    // 创建员工信息
    addEmpInfo(object) {
      let url = global.AUTH_URL + "/auth/userInfo/addUserInfo";
      this.$http.post(url, object).then(data=>{
        this.$msg._log_success("创建员工信息成功")
         this.findEmpInfos()
      })
      .catch(error=>{
        this.$msg._log_warn(error || "创建员工信息失败")
      })
    },

    // 编辑员工信息 
    updateEmpInfo(object) {
      let url = global.AUTH_URL + "/auth/userInfo/updateUserInfo";
      this.$http.put(url, object, self.option).then((data)=> {
          this.$msg._log_success(object.roleTitle + "成功！")
          this.findEmpInfos()
        })
        .catch(error=>{
          this.$msg._log_warn(error.msg || "删除员工信息失败")
        })
    },

    //删除员工信息
    deleteEmpInfo(val) {   
      let url = global.AUTH_URL + "/auth/userInfo/deleteUserInfo/" + val;
      this.$http.delete(url).then((data)=> {
        this.$msg._log_success("删除成功")
        this.findEmpInfos()
      })
      .catch(error=>{
        this.$msg._log_warn(error.msg || "删除失败")
      })
    },
    
    // 点击创建员工 信息
    handleCreat() {  
      this.dialogFormVisible = true;
      this.empInfo = {
        roleTitle: "创建员工",
        symbol: "creat"
      };
    },
    
    // 点击编辑员工信息
    handleEdit(index, rows) {
      this.dialogFormVisible = true;
      this.empInfo = {
        index: index,
        roleTitle: "编辑员工",
        empName: rows[index].empName,
        empCode: rows[index].empCode,
        userName: rows[index].userName,
        deptName: rows[index].deptName, 
        isValid: rows[index].isValid  * 1, 
        // createTime: null,
        roleStatus: "1",
        symbol: "edit"
      }; 
    },

    // 点击删除员工信息
    handleDelete(index, rows) { //删除按钮 
      this.$confirm('确认删除人员名称 ['+ rows[index].empName +'] ？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEmpInfo(rows[index].userName);
      }).catch(() => {
        this.$msg._log_info("已取消删除")          
      });
    },

    // 切换状态
    handleSwitch(index, rows){ 
      this.empInfo = {
        empName: rows[index].empName,
        roleCode: rows[index].roleCode,
        deptName: rows[index].deptName,
        empCode: rows[index].empCode,
        userName: rows[index].userName,
        isValid: rows[index].isValid 
      };
      let commadText = rows[index].isValid == '0' ? "禁用" : "启用";
      this.empInfo.roleTitle =  `${commadText}[${this.empInfo.empName}]`
      this.updateEmpInfo(this.empInfo);
    },
    
    // 点击取消
    handleCancel() {
      this.dialogFormVisible = false;
      this.$refs['empInfoForm'].resetFields();
    },

    // 点击重置
    handleReset() {
      this.role.param = "";
      this.findEmpInfos()
    },

    handleSizeChange(val) {   //切换显示列表行数切换显示列表行数
      this.role.curPage = 1;
      this.role.pageSize = val;
      this.findEmpInfos();
    },
    handleCurrentChange(val){       //列表分页  
      this.role.curPage = val;
      this.findEmpInfos();
    },
    
    // 遮罩增关闭前
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs['empInfoForm'].resetFields();
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped lang="scss">
.handle-input {
  width: 25%;
  max-width: 200px;
}
</style>
