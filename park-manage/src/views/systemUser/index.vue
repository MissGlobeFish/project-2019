<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addSystemUser">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增系统用户</el-button>
    </div>

    <!-- 新增系统用户 dialog -->
    <el-dialog class="addSystemUserDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="systemUserForm" ref="systemUserForm" label-width="100px" class="demo-ruleForm form-box" size="small">

        <div class="formItem-box">
          <el-form-item label="登录名：" prop="loginName" :rules="{ required: true, message: '登录名不能为空', trigger: 'blur' }">
            <el-input v-model="systemUserForm.loginName" autocomplete="off" placeholder="请输入登录名"></el-input>
          </el-form-item>
          <el-form-item v-if="systemUserStatus == 'add'" label="密码：" prop="pwd" :rules="{ required: true, message: '密码不能为空', trigger: 'blur' }">
            <el-input v-model="systemUserForm.pwd" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称：" prop="userName" :rules="{ required: true, message: '用户昵称不能为空', trigger: 'blur' }">
            <el-input v-model="systemUserForm.userName" autocomplete="off" placeholder="请输入用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱：" prop="email">
            <el-input v-model="systemUserForm.email" autocomplete="off" placeholder="请输入用户邮箱"></el-input>
          </el-form-item>
          <el-form-item v-if="systemUserStatus == 'edit'" label="手机号码：" prop="tel">
            <el-input v-model="systemUserForm.tel" autocomplete="off" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </div>

        <div class="formItem-box">
          <el-form-item v-if="systemUserStatus == 'add'" label="手机号码：" prop="tel">
            <el-input v-model="systemUserForm.tel" autocomplete="off" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="用户性别：" prop="sex">
            <el-select v-model="systemUserForm.sex" autocomplete="off" placeholder="请选择用户性别">
              <el-option v-for="item in sexs" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="匹配角色：" prop="email">
            <el-select v-model="systemUserForm.roleIdList" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="roleIdLoading">
              <el-option v-for="item in roleIds" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="帐号状态：" prop="state">
              <el-radio-group v-model="systemUserForm.state">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="-1">停用</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item v-if="systemUserStatus == 'edit'" label="" prop="tel" style="opacity: 0;">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
        </div>
        
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="systemUserForm.remark" type="textarea" :rows="4" placeholder="请添加备注"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('systemUserForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('systemUserForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 重置密码 dialog -->
    <el-dialog class="addSystemUserDialog" title="重置密码" :visible.sync="resetDialogVisible" width="30%" :before-close="handleResetClose">
      <el-form :model="resetPasswordsForm" ref="resetPasswordsForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-form-item label="新密码" prop="pwd" :rules="{ required: true, message: '密码不能为空', trigger: 'blur' }">
          <el-input v-model="resetPasswordsForm.pwd" autocomplete="off" placeholder="请设置新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleResetPasswords('resetPasswordsForm')">确 定</el-button>
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
      <el-table-column prop="loginName" label="登录账号" width="120" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户昵称" width="120" align="center"></el-table-column>
      <!-- <el-table-column prop="userType" label="用户类型" width="100" align="center"></el-table-column> -->
      <el-table-column prop="email" label="用户邮箱" width="120" align="center"></el-table-column>
      <el-table-column prop="tel" label="手机号码" width="120" align="center"></el-table-column>
      <el-table-column prop="sex" label="用户性别" width="100" align="center">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.sex == 'F'">男</el-tag>
                <el-tag v-else-if="scope.row.sex == 'M'">女</el-tag>
                <el-tag v-else type="success">未知</el-tag>
            </template>
      </el-table-column>
      <el-table-column prop="state" label="帐号状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change='stateChange(scope.row)' active-color="#13ce66" :active-value="1" :inactive-value="-1"></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="avatar" label="头像" width="120" align="center">
            <template slot-scope="scope">
                <el-image 
                    style="width: 80px; height: 40px"
                    :src="scope.row.avatar"  :preview-src-list="[scope.row.avatar]">
                </el-image>
            </template>
      </el-table-column> -->
      <el-table-column prop="loginIp" label="最后登陆IP" width="120" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="最后登陆时间" width="200" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建者" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
      <el-table-column prop="updateBy" label="更新者" width="100" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="200" align="center"></el-table-column>
      
      <el-table-column fixed="right" label="操作" width="70" align="center">
        <template slot-scope="scope">

          <el-dropdown size="mini" trigger="click">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="padding:10px;">
              <el-button type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
              <el-button type="warning" size="mini" plain class="el-icon-key" @click.native.prevent="resetPasswords(scope.$index, tableData)">重置密码</el-button>
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
import { getList, addSystemUser, editSystemUser, deleteSystemUser, getItemSystemUser, editState, resetPasswords, findRoleId } from '@/api/systemUser'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',

      systemUserStatus:'',//判断当前是新增还是编辑

      systemUserForm: {},// 新建/编辑初始数据
      resetPasswordsForm: { // 重置密码初始数据
        pwd: '',//密码
      },
      userTypes: [],
      roleIds: [],
      sexs: [{
          id: 'F',
          name: '男'
        },{
          id: 'M',
          name: '女'
        },{
          id: 'U',
          name: '未知'
      }],

      /* 列表加载动画 */
      listLoading: false,
      dialogVisible: false, //  新建/编辑弹框显示
      resetDialogVisible: false, //重置密码弹框
      roleIdLoading: false,

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
    this.getRoleId();
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
    getRoleId(){
      findRoleId().then(response => {
        this.roleIds = response.data;
      })
    },
    //选择用户类型
    userTypeChange(){

    },
    //搜索角色
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        findRoleId(query).then(response => {
          setTimeout(() => {
            this.loading = false;
            this.roleIds = response.data.filter(item => {
              return item.roleName.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        })
      } else {
        this.roleIds = [];
      }
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
      this.systemUserForm = {
        id: '',
        loginName: '',//登录账号
        userName: '',//用户昵称
        userType: '00',//用户类型
        email: '',//用户邮箱
        tel: '',//手机号码
        sex: '',//用户性别
        avatar: '',//头像路径
        pwd: '',//密码
        salt: '',//盐加密
        state: 1,//帐号状态
        delFlag: '',//删除标志
        loginIp: '',//最后登陆IP
        loginTime: '',//最后登陆时间
        createBy: '',//创建者
        createTime: '',//创建时间
        updateBy: '',//更新者
        updateTime: '',//更新时间
        remark: '',//备注
        roleIdList: []//角色数组
      };
      this.dialogVisible = true;
      this.systemUserStatus = 'add';
      this.titles = '新增系统用户';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.systemUserForm) {
            this.$refs.systemUserForm.resetFields();
        }
        this.dialogVisible = true;
        this.systemUserStatus = 'edit';
        this.titles = '编辑系统用户';
        getItemSystemUser(rows[index].id).then(response => {
          this.systemUserForm = response.data;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteSystemUser(rows[index].id).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              }); 
              this.fetchData();
            })
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除！'
            });          
        });
    },
    //重置密码
    resetPasswords(index, rows){
        this.resetDialogVisible = true;
    },
    //重置密码保存
    handleResetPasswords(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPasswords(this.resetPasswordsForm).then(response => {
            this.resetDialogVisible = false;
            this.fetchData();
          })
        } else {
          return false;
        }
      });
    },
    //保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.systemUserStatus == 'add') {
              addSystemUser(this.systemUserForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.systemUserStatus == 'edit'){
              editSystemUser(this.systemUserForm).then(response => {
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
    handleResetClose(done){
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
  .addSystemUser{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addSystemUserDialog{
    .el-dialog{
      .el-input{
        width: 90%;
      }
      .el-select{
        width: 90%;
        .el-input{
          width: 100%;
        }
      }
      .el-textarea{
        width: 94%;
      }
    }
  }
  .form-box{
    .formItem-box{
      width: 49%;
      display: inline-block;
    }
  }
</style>
