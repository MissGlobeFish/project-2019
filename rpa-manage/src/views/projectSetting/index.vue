<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addProject">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增项目</el-button>
    </div>

    <!-- 新增兑换记录 dialog -->
    <el-dialog class="addProjectDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="projectForm" ref="projectForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="项目名称：" prop="projectName" :rules="{ required: true, message: '项目名称不能为空', trigger: 'blur' }">
          <el-input v-model="projectForm.projectName" autocomplete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目账号：" prop="projectAccount" :rules="{ required: true, message: '项目账号不能为空', trigger: 'blur' }">
          <el-input v-model="projectForm.projectAccount" autocomplete="off" placeholder="请输入项目账号"></el-input>
        </el-form-item>
        <el-form-item label="项目ID：" prop="projectWxbId" :rules="{ required: true, message: '项目ID不能为空', trigger: 'blur' }">
          <el-input v-model="projectForm.projectWxbId" autocomplete="off" placeholder="请输入项目ID"></el-input>
        </el-form-item>
        <!-- <el-form-item label="AK：" prop="secretAk">
          <el-input v-model="projectForm.secretAk" autocomplete="off" placeholder="请输入AK"></el-input>
        </el-form-item>
        <el-form-item label="SK：" prop="secretSk">
          <el-input v-model="projectForm.secretSk" autocomplete="off" placeholder="请输入SK"></el-input>
        </el-form-item> -->

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('projectForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('projectForm')">保 存</el-button>
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
      <el-table-column prop="projectName" label="项目名称" width="400" align="center"></el-table-column>
      <el-table-column prop="projectAccount" label="项目账号" align="center"></el-table-column>
      <el-table-column prop="projectWxbId" label="项目ID" width="400" align="center"></el-table-column>
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
import { getList, addProject, editProject, deleteProject } from '@/api/projectSetting'

export default {
  data() {
    return {
      /* 列表 */
      tableData: null,
      titles: '',

      parkingStatus:'',//判断当前是新增还是编辑

      projectForm: { // 新建/编辑初始数据
        projectName: '',
        projectAccount: '',
        projectWxbId: '',
        secretAk: '',
        secretSk: ''
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
      getList().then(response => {
        this.listLoading = false;
        this.tableData = response;
      })
    },
    //新增
    handleAdd(){
      this.projectForm = {
        projectName: '',
        projectAccount: '',
        projectWxbId: '',
        secretAk: '',
        secretSk: ''
      };
      this.dialogVisible = true;
      this.facilityStatus = 'add';
      this.titles = '新增项目';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.projectForm) {
            this.$refs.projectForm.resetFields();
        }
        this.dialogVisible = true;
        this.facilityStatus = 'edit';
        this.titles = '编辑项目';
        this.projectForm = {
          id: rows[index].id,
          projectName: rows[index].projectName,
          projectAccount: rows[index].projectAccount,
          projectWxbId: rows[index].projectWxbId,
          secretAk: rows[index].secretAk,
          secretSk: rows[index].secretSk,
        };
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteProject(rows[index].id).then(response => {
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
              let datas = [];
              datas.push(this.projectForm)
              addProject(datas).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.facilityStatus == 'edit'){
              editProject(this.projectForm).then(response => {
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
      this.$refs.projectForm.resetFields();
    },
  }
}
</script>
<style lang="scss" scoped>
  .addProject{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addProjectDialog{
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
