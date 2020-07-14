<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addNotice">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增通知人员</el-button>
    </div>

    <!-- 新增通知人员 dialog -->
    <el-dialog class="addNoticeDialog" :title="noticeTitle" :append-to-body="true" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="noticeForm" ref="noticeForm" label-width="100px" class="demo-ruleForm" size="small">

        <el-form-item label="姓名：" prop="name" :rules="{ required: true, message: '姓名不能为空', trigger: 'blur' }">
          <el-input v-model="noticeForm.name" autocomplete="off" placeholder="请输入姓名" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone" :rules="[{ required: true, message: '联系方式不能为空', trigger: 'blur' },{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的联系方式' }]">
          <el-input v-model="noticeForm.phone" autocomplete="off" placeholder="请输入联系方式"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('noticeForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('noticeForm')">保 存</el-button>
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
      <el-table-column prop="name" label="姓名" width="300" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系方式" width="120" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change='stateChange(scope.row)' active-color="#13ce66" active-value="ON" inactive-value="OFF"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed='right' label="操作" width="180" align="center">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" class="el-icon-edit" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
            <el-button type="danger" size="mini" class="el-icon-delete" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
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
import { getList, addNotice, editNotice, deleteNotice, getItemNotice } from '@/api/warningNotice'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      noticeTitle: '',

      noticeStatus:'',//判断当前是新增还是编辑

      noticeForm: { // 新建/编辑初始数据
        name: '',
        phone: '',
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
    this.fetchData()
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
    //新增
    handleAdd(){
      this.noticeForm = {
        name: '',
        phone: '',
      }
      this.dialogVisible = true;
      this.noticeStatus = 'add';
      this.noticeTitle = '新增通知人员';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.noticeForm) {
            this.$refs.noticeForm.resetFields();
        }
        this.dialogVisible = true;
        this.noticeStatus = 'edit';
        this.noticeTitle = '编辑通知人员';
        getItemNotice(rows[index].id).then(response => {
          this.noticeForm = response.data;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            deleteNotice(rows[index].id).then(response => {
              this.fetchData();
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除！'
            });          
        });
    },
    //切换状态
    stateChange(row){
      noticeState().then(response => {
        
      })
    },
    //保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
            if (this.noticeStatus == 'add') {
              addNotice(this.noticeForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
            }else if(this.noticeStatus == 'edit'){
              editNotice(this.noticeForm).then(response => {
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
  .addNotice{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addNoticeDialog{
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
