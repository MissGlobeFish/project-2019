<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addSystemMenu">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增菜单</el-button>
    </div>

    <!-- 新增菜单 dialog -->
    <el-dialog class="addSystemMenuDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      
      <el-form :model="systemMenuForm" ref="systemMenuForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item v-if="systemMenuStatus == 'add'" label="上级菜单：" prop="parentName">
          <el-select v-model="systemMenuForm.parentName" placeholder="请选择上级菜单" @focus="changeParentNode"></el-select>
        </el-form-item>
        <el-form-item v-if="systemMenuStatus == 'add' || systemMenuStatus == 'addChild'" label="菜单类型：" prop="menuType" :rules="{ required: true, message: '请选择菜单类型', trigger: 'change' }">
            <el-radio-group v-model="systemMenuForm.menuType">
                <el-radio label="M" v-if="parentMenuType != 'C' && parentMenuType != 'F'">目录</el-radio>
                <el-radio label="C" v-if="parentMenuType != 'C' && parentMenuType != 'F'">菜单</el-radio>
                <el-radio label="F" v-if="parentMenuType == 'C'">按钮</el-radio>
            </el-radio-group>
        </el-form-item>      

        <div class="catalog-box" v-if="systemMenuForm.menuType == 'M'">
          <el-form-item label="目录名称：" prop="menuName" :rules="{ required: true, message: '目录名称不能为空', trigger: 'blur' }">
            <el-input v-model="systemMenuForm.menuName" autocomplete="off" placeholder="请输入目录名称"></el-input>
          </el-form-item>
          <el-form-item label="路由地址：" prop="url" :rules="{ required: true, message: '路由地址不能为空', trigger: 'blur' }">
            <el-input v-model="systemMenuForm.url" autocomplete="off" placeholder="请输入路由地址"></el-input>
          </el-form-item>
          <el-form-item label="目录图标：" prop="icon" :rules="{ required: true, message: '目录图标不能为空', trigger: 'blur' }">
            <el-select v-model="systemMenuForm.icon" placeholder="请选择目录图标">
              <el-option class="icon-box" v-for="item in icons" :key="item.value" :label="item.label" :value="item.value">
                <svg-icon :icon-class="item.value" class-name="card-panel-icon" />
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示顺序：" prop="orderNum">
            <el-input-number v-model="systemMenuForm.orderNum" :min="0" :max="100" label="请输入显示顺序"></el-input-number>
          </el-form-item>
        </div>
        <div class="menu-box" v-if="systemMenuForm.menuType == 'C'">
          <el-form-item label="菜单名称：" prop="menuName" :rules="{ required: true, message: '菜单名称不能为空', trigger: 'blur' }">
            <el-input v-model="systemMenuForm.menuName" autocomplete="off" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="路由地址：" prop="url" :rules="{ required: true, message: '路由地址不能为空', trigger: 'blur' }">
            <el-input v-model="systemMenuForm.url" autocomplete="off" placeholder="请输入路由地址"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标：" prop="icon" :rules="{ required: true, message: '菜单图标不能为空', trigger: 'blur' }">
            <el-select v-model="systemMenuForm.icon" placeholder="请选择菜单图标">
              <el-option class="icon-box" v-for="item in icons" :key="item.value" :label="item.label" :value="item.value">
                <svg-icon :icon-class="item.value" class-name="card-panel-icon" />
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="button-box" v-if="systemMenuForm.menuType == 'F'">
          <el-form-item label="按钮名称：" prop="menuName" :rules="{ required: true, message: '按钮名称不能为空', trigger: 'blur' }">
            <el-input v-model="systemMenuForm.menuName" autocomplete="off" placeholder="请输入按钮名称"></el-input>
          </el-form-item>
          <el-form-item label="权限标识：" prop="perms" :rules="{ required: true, message: '权限标识不能为空', trigger: 'blur' }">
            <el-input v-model="systemMenuForm.perms" autocomplete="off" placeholder="请添加权限标识"></el-input>
          </el-form-item>
        </div>
        
        <el-form-item label="状态：" prop="state">
            <el-radio-group v-model="systemMenuForm.state">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="-1">隐藏</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="systemMenuForm.remark" type="textarea" :rows="2" placeholder="请添加备注"></el-input>
        </el-form-item>

      </el-form>

      <!-- 内层 dialog -->
      <el-dialog width="30%" title="上级菜单" :visible.sync="innerVisible" append-to-body>
        <el-tree :data="parentNodeList" v-loading="parentNodeLoading" lazy :load="loadParentNode" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-dialog>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('systemMenuForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('systemMenuForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      max-height="700"
      element-loading-text="Loading"
      size="mini"
      row-key="id"
      lazy
      :load="load"
      fit
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
      >
      <el-table-column prop="menuName" label="菜单名称" width="200" align="center"></el-table-column>
      <el-table-column prop="icon" label="图标" width="120" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" class-name="card-panel-icon" />
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" width="200" align="center"></el-table-column>
      <el-table-column prop="url" label="组件路径" width="200" align="center"></el-table-column>
      <el-table-column prop="menuType" label="类型" width="200" align="center"></el-table-column>
      <el-table-column prop="state" label="菜单状态" width="120" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change='stateChange(scope.row)' active-color="#13ce66" :active-value="1" :inactive-value="-1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建者" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
      
      <el-table-column fixed="right" label="操作" width="70" align="center">
        <template slot-scope="scope">

          <el-dropdown size="mini" trigger="click">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="padding:10px;">
              <el-button type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(scope.row)"> 编辑</el-button>
              <el-button v-if="scope.row.menuType != '按钮'" type="success" size="mini" plain class="el-icon-circle-plus-outline" @click.native.prevent="handleMenu(scope.row)"> 新增</el-button>
              <el-button type="danger" size="mini" plain class="el-icon-delete" @click="handleDelete(scope.row)"> 删除</el-button>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, getChildList, addSystemUser, editSystemUser, deleteSystemUser, getItemSystemUser, editState, resetPasswords } from '@/api/systemMenu'
import { getIcons } from './components/icos'

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      parentNodeList: [],
      titles: '',
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      parentMenuType: '',//父级菜单类型

      systemMenuStatus:'',//判断当前是新增还是编辑

      systemMenuForm: {},// 新建/编辑初始数据
      userTypes: [],
      icons: [],//图标库

      /* 列表加载动画 */
      listLoading: false,
      parentNodeLoading: false,
      dialogVisible: false, //  新建/编辑弹框显示
      innerVisible: false
    }
  },
  created() {
    this.icons = getIcons();
    this.fetchData();
  },
  methods: {
    //加载树节点
    changeParentNode(){
      this.innerVisible = true;
    },
    //获取树节点
    getTreeData(node, resolve){
      getChildList({pmid: node.data.id}).then(response => {
        resolve(response.data);
      })
    },
    // 获取下一级树节点
    loadParentNode(node, resolve){
      if (node.level === 0) {
        return resolve(this.tableData);
      }
      if (node.level > 1) return resolve([]);
      if(node.level === 1) { // 二级节点
        this.getTreeData(node, resolve);
      }
    },
    // 选择树节点
    handleNodeClick(data) {
      this.systemMenuForm.parentId = data.id;
      this.systemMenuForm.parentName = data.menuName;
      this.parentMenuType = data.menuType;
      this.innerVisible = false;
    },
    //获取菜单列表
    fetchData() {
        this.listLoading = true;
        getList().then(response => {
            this.listLoading = false;
            this.tableData = response.data;
            this.tableData.forEach(i => {
              if (i.menuType == 'M') {
                i.menuType = '目录';
              }else if (i.menuType == 'C') {
                i.menuType = '菜单';
              }else if (i.menuType == 'F') {
                i.menuType = '按钮';
              }
            });
        })
    },
    //获取菜单下一级列表
    load(tree, treeNode, resolve) {
        setTimeout(() => {
            getChildList({pmid: tree.id}).then(response => {
              let treeData = response.data;
              treeData.forEach(i => {
                if (i.menuType == 'M') {
                  i.menuType = '目录';
                }else if (i.menuType == 'C') {
                  i.menuType = '菜单';
                }else if (i.menuType == 'F') {
                  i.menuType = '按钮';
                }
              });
              resolve(treeData)
            })
        }, 500)
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
    //新增一级菜单
    handleAdd(){
      this.systemMenuForm = {
        id: '',
        menuName: '',//菜单名称
        parentId: '0',//父菜单ID
        parentName: '',//父菜单Name
        orderNum: 0,//显示顺序
        url: '',//组件地址
        menuType: 'M',//菜单类型
        state: 1,//菜单状态
        perms: '',//权限标识
        icon: '',//菜单图标
        createBy: '',//创建者
        createTime: '',//创建时间
        updateBy: '',//更新者
        updateTime: '',//更新时间
        remark: '',//备注
      };
      this.dialogVisible = true;
      this.systemMenuStatus = 'add';
      this.titles = '新增菜单';
    },
    //新增下一级菜单
    handleMenu(rows){
      this.systemMenuForm = {
        id: '',
        menuName: '',//菜单名称
        parentId: rows.id,//父菜单ID
        parentName: rows.menuName,//父菜单Name
        orderNum: 0,//显示顺序
        url: '',//组件地址
        menuType: 'M',//菜单类型
        state: 1,//菜单状态
        perms: '',//权限标识
        icon: '',//菜单图标
        createBy: '',//创建者
        createTime: '',//创建时间
        updateBy: '',//更新者
        updateTime: '',//更新时间
        remark: '',//备注
      };
      this.dialogVisible = true;
      this.systemMenuStatus = 'addChild';
      if (rows.menuType == '目录') {
        this.parentMenuType = 'M';
      }else if(rows.menuType == '菜单'){
        this.parentMenuType = 'C';
        this.systemMenuForm.menuType = 'F';
      }
      this.titles = '新增菜单';
    },
    //编辑
    handleEdit(rows){
      if (this.$refs.systemMenuForm) {
          this.$refs.systemMenuForm.resetFields();
      }
      this.dialogVisible = true;
      this.systemMenuStatus = 'edit';
      this.titles = '编辑菜单';
      getItemSystemUser(rows.id).then(response => {
        this.systemMenuForm = response.data;
      })
    },
    //删除
    handleDelete(rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteSystemUser(rows.id).then(response => {
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
    //保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.systemMenuForm.menuType == 'M') {
            this.systemMenuForm.perms = 'Layout';
          }
          if (this.systemMenuStatus == 'add' || this.systemMenuStatus == 'addChild') {
              addSystemUser(this.systemMenuForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
          }else if(this.systemMenuStatus == 'edit'){
              editSystemUser(this.systemMenuForm).then(response => {
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
  }
}
</script>
<style lang="scss">
  .addSystemMenu{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addSystemMenuDialog{
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
      .el-input-number{
        .el-input{
          width: 100%;
        }
      }
    }
  }
  .el-select-dropdown{
    max-width: 460px;
    .icon-box{
      width: 30%;
      text-align: center;
      display: inline-block;
    }
  }
</style>
