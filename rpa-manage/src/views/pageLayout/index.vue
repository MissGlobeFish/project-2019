<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addPage">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增页面</el-button>
    </div>

    <!-- 新增兑换记录 dialog -->
    <el-dialog class="addPageDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="pageForm" ref="pageForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="页面名称：" prop="title" :rules="{ required: true, message: '页面名称不能为空', trigger: 'blur' }">
          <el-input v-model="pageForm.title" autocomplete="off" placeholder="请输入页面名称"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName" :rules="{ required: true, message: '用户名不能为空', trigger: 'blur' }">
          <el-input v-model="pageForm.userName" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" prop="password" :rules="{ required: true, message: '用户密码不能为空', trigger: 'blur' }">
          <el-input v-model="pageForm.password" autocomplete="off" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="页面地址：" prop="url" :rules="{ required: true, message: '页面地址不能为空', trigger: 'blur' }">
          <el-input v-model="pageForm.url" type="textarea" :rows="2" placeholder="请输入页面地址"></el-input>
        </el-form-item>
        <el-form-item label="组织名称：" prop="org">
          <el-input v-model="pageForm.org" autocomplete="off" placeholder="请输入组织名称"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('pageForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('pageForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      max-height="600"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
      :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
      >
      <el-table-column type="index" fixed width="50" align="center"></el-table-column>
      <el-table-column prop="title" label="页面名称" width="200" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="150" align="center"></el-table-column>
      <el-table-column prop="passwordEncrypt" label="用户密码" width="150" align="center"></el-table-column>
      <el-table-column prop="org" label="组织名称" width="200" align="center"></el-table-column>
      <el-table-column prop="url" label="页面地址" align="center"></el-table-column>
      <el-table-column fixed='right' label="操作" width="180" align="center">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
            <el-button type="danger" size="mini" plain class="el-icon-delete" @click="handleDelete(scope.$index, tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getList, addPage, editPage, deletePage } from '@/api/pageLayout'

export default {
  data() {
    return {
      /* 列表 */
      tableData: null,
      titles: '',

      pageStatus:'',//判断当前是新增还是编辑

      pageForm: { // 新建/编辑初始数据
        title: '',
        userName: '',
        password: '',
        org: '',
        url: '',
      },

      /* 列表加载动画 */
      listLoading: true,
      dialogVisible: false, //  新建/编辑弹框显示
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.listLoading = false;
        this.tableData = response;
        this.tableData.forEach(e => {
          e.passwordEncrypt = '******'
        });
      })
    },
    //新增
    handleAdd(){
      this.pageForm = {
        title: '',
        userName: '',
        password: '',
        org: '',
        url: '',
      };
      this.dialogVisible = true;
      this.pageStatus = 'add';
      this.titles = '新增页面';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.pageForm) {
            this.$refs.pageForm.resetFields();
        }
        this.dialogVisible = true;
        this.pageStatus = 'edit';
        this.titles = '编辑页面';
        this.pageForm = {
          id: rows[index].id,
          title: rows[index].title,
          userName: rows[index].userName,
          password: rows[index].password,
          org: rows[index].org,
          url: rows[index].url,
        };
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deletePage(rows[index].id).then(response => {
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
          if (this.pageStatus == 'add') {
              let datas = [];
              datas.push(this.pageForm);
              addPage(datas).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.pageStatus == 'edit'){
              editPage(this.pageForm).then(response => {
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
      this.$refs.pageForm.resetFields();
    },
  }
}
</script>
<style lang="scss" scoped>
  .addPage{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addPageDialog{
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
