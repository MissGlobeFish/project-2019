<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addSystemRole">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增角色</el-button>
    </div>

    <!-- 新增角色 dialog -->
    <el-dialog class="addSystemRoleDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="systemRoleForm" ref="systemRoleForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="角色名称：" prop="roleName" :rules="{ required: true, message: '角色名称不能为空', trigger: 'blur' }">
          <el-input v-model="systemRoleForm.roleName" autocomplete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色权限：" prop="roleKey" :rules="{ required: true, message: '角色权限不能为空', trigger: 'blur' }">
          <el-input v-model="systemRoleForm.roleKey" autocomplete="off" placeholder="请输入角色权限"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序：" prop="roleSort" :rules="{ required: true, message: '请选择显示顺序', trigger: 'change' }">
          <el-input-number v-model="systemRoleForm.roleSort" :min="0" :max="100" label="请输入显示顺序"></el-input-number>
        </el-form-item>
        <el-form-item label="角色状态：" prop="state">
            <el-radio-group v-model="systemRoleForm.state">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="-1">停用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限：" prop="menuIdList">
            <el-tree ref="tree" :data="allNodeList" :default-checked-keys="checkedKeys" node-key="id" :props="props" @check-change="handleCheckChange" show-checkbox></el-tree>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="systemRoleForm.remark" type="textarea" :rows="4" placeholder="请添加备注"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('systemRoleForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('systemRoleForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 数据权限 dialog -->
    <el-dialog class="addSystemRoleDialog" title="数据权限" :visible.sync="dataDialogVisible" width="30%" :before-close="handleDataClose">
      <el-form :model="dataPermissionForm" ref="dataPermissionForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="dataPermissionForm.roleName" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限字符：" prop="roleKey">
          <el-input v-model="dataPermissionForm.roleKey" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限范围：" prop="menuIdList">
          <el-select v-model="dataPermissionForm.menuIdList" placeholder="请选择权限范围">
            <el-option
              v-for="item in limitsScope"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限：" prop="menuIdList">
            <el-tree :data="allNodeList" :props="props" show-checkbox></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dataDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleResetPasswords('dataPermissionForm')">确 定</el-button>
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
      <el-table-column prop="roleName" label="角色名称" width="120" align="center"></el-table-column>
      <el-table-column prop="roleKey" label="权限字符" width="120" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建者" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
      <el-table-column prop="updateBy" label="更新者" width="100" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="200" align="center"></el-table-column>
      <el-table-column prop="state" label="角色状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change='stateChange(scope.row)' active-color="#13ce66" :active-value="1" :inactive-value="-1"></el-switch>
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
              <el-button type="warning" size="mini" plain class="el-icon-key" @click.native.prevent="dataPermission(scope.$index, tableData)">数据权限</el-button>
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
import { getList, addSystemRole, editSystemRole, deleteSystemRole, getItemSystemRole, editState, getTreeList } from '@/api/systemRole'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',
      allNodeList: [],
      labelCheckedList:[],
      checkedKeys: [],
      parentIdList: [],

      systemRoleStatus:'',//判断当前是新增还是编辑

      systemRoleForm: {},// 新建/编辑初始数据
      dataPermissionForm: {},
      props: {
        children: 'children',
        label: 'menuName'
      },
      limitsScope: [{//权限范围
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
      }],

      /* 列表加载动画 */
      listLoading: false,
      dialogVisible: false, //  新建/编辑弹框显示
      dataDialogVisible: false,

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
    this.getParentTreeData();
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
    //获取所有树节点
    getParentTreeData(){
      getTreeList().then(response => {
        this.allNodeList = response.data;
      })
    },
    // 接收被勾选的数据
    handleCheckChange(data, node, bool){
      this.systemRoleForm.menuIdList = [];
      this.systemRoleForm.menuIdList = this.$refs.tree.getCheckedKeys();
      this.systemRoleForm.menuIdList.push.apply(this.systemRoleForm.menuIdList, this.$refs.tree.getHalfCheckedKeys());
    },
    //修改状态
    stateChange(val){
      this.$confirm('确认要修改 [ '+ val.title +' ] 的状态？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          editState({ pid: val.id, state: val.state }).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            }); 
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
      this.systemRoleForm = {
        id: '',
        roleName: '',//角色名称
        roleKey: '',//角色权限字符串
        roleSort: 0,//显示顺序
        state: 1,//角色状态
        createBy: '',//创建者
        createTime: '',//创建时间
        updateBy: '',//更新者
        updateTime: '',//更新时间
        remark: '',//备注
        menuIdList: []//菜单ID
      };
      this.dialogVisible = true;
      this.systemRoleStatus = 'add';
      this.titles = '新增角色';
      this.getParentTreeData();
      this.checkedKeys = [];
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.systemRoleForm) {
            this.$refs.systemRoleForm.resetFields();
        }
        this.dialogVisible = true;
        this.systemRoleStatus = 'edit';
        this.titles = '编辑角色';
        this.getParentTreeData();
        getItemSystemRole(rows[index].id).then(response => {
          this.systemRoleForm = response.data;
          this.checkedKeys = this.systemRoleForm.menuIdList;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteSystemRole(rows[index].id).then(response => {
              this.fetchData();
            })
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除！'
            });          
        });
    },
    //配置数据权限
    dataPermission(index, rows){
      this.dataDialogVisible = true;
      this.getParentTreeData();
      getItemSystemRole(rows[index].id).then(response => {
        this.dataPermissionForm = response.data;
      })
    },
    //数据权限保存
    handleResetPasswords(formName){
      this.resetDialogVisible = false;
      this.fetchData();
    },
    //保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.systemRoleStatus == 'add') {
              addSystemRole(this.systemRoleForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.systemRoleStatus == 'edit'){
              editSystemRole(this.systemRoleForm).then(response => {
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
    handleDataClose(done){
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
<style lang="scss">
  .addSystemRole{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addSystemRoleDialog{
    .el-dialog{
      .el-input,.el-textarea,.el-tree{
        width: 70%;
      }
      .el-select{
        width: 70%;
        .el-input{
          width: 100%;
        }
      }
      .el-input-number{
        .el-input{
          width: 100%;
        }
      }
      .el-tree{
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        padding: 10px;
        .el-checkbox{
          margin-right: 5px;
        }
      }
    }
  }
</style>
