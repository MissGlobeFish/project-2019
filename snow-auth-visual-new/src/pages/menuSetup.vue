<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-17 11:25:15
 * @LastEditTime: 2019-09-27 10:53:37
 -->
<template>
<div v-loading="loading" class="menu-setup ">
    <div class="content-head">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-location-outline breadcrumb-icon"></i>系统管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-head-right">
        <el-select v-model="sysDesc" placeholder="请选择系统" value-key="id" @change="systemChange" size="small" class="margin-right-20">
          <el-option v-for="item in systemOptions" :key="item.id" :label="item.sysDesc" :value="item"></el-option>
        </el-select>
        <el-button type="primary" size="small" plain icon="el-icon-edit-outline" @click="handleAddMenu">添加菜单</el-button>
      </div>
    </div>
    <div class="content-body">
      <!-- <div class="padding-bottom-20" style="border-bottom: 1px solid #EBEEF5">
        <span style="color: #888;font-size: 14px" class="margin-right-10">请选择系统:</span>
        <el-select v-model="sysDesc" placeholder="请选择系统" value-key="id" @change="systemChange">
          <el-option v-for="item in systemOptions" :key="item.id" :label="item.sysDesc" :value="item"></el-option>
        </el-select>
      </div> -->
      <el-table header-row-class-name="success-row" :row-class-name="getRowClassName" :data="menuData" style="width: 100%;">
        <el-table-column  type="expand">
          <template slot-scope="scope">
            <el-table class="transition-box" :data="scope.row.subMenuInfos" :show-header="false">
              <el-table-column prop="menuName" width="248"></el-table-column>
              <el-table-column prop="url" width="300"></el-table-column>
              <el-table-column label="功能" width="500" class-name="column-fun">
                <template slot-scope="menuFun">
                  <div class="column-fun-total" v-if="menuFun.row.menuFuncInfos.length > 0">共{{menuFun.row.menuFuncInfos.length}}条：</div>
                  <div v-for="(item, index) in menuFun.row.menuFuncInfos" :key="item.funcCode">
                    <div v-if="item.funcDesc.includes('/')&&index < 1" class="menu-fun menu-fun-url">{{item.funcDesc}}</div>
                    <div v-if="!item.funcDesc.includes('/')&&index < 3"  class="menu-fun menu-fun-text">{{item.funcDesc}}</div>
                 </div>
                </template>
              </el-table-column>
              <el-table-column label="状态"  ></el-table-column>
              <el-table-column min-width="200">
                <template slot-scope="scopechild">
                  <el-button :disabled="scopechild.row.menuFuncInfos.length <= 0" type="text" size="small"  @click="handleMoreFun(scopechild.row,scopechild.$index)">功能详情</el-button>
                  <el-button @click.native.prevent="handleEditchild(scopechild.$index, scope.$index, scopechild.row)" type="text" size="small">编辑</el-button>
                  <el-button @click.native.prevent="handleDelete(scopechild.row, scopechild.$index)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="menuName" label="菜单名" width="200"></el-table-column>
        <el-table-column prop="url" label="URL" width="300"></el-table-column>
        <el-table-column label="功能" width="500" class-name="column-fun">
          <template slot-scope="menuFun">
            <div class="column-fun-total" v-if="menuFun.row.menuFuncInfos.length > 0">共{{menuFun.row.menuFuncInfos.length}}条：</div>
            <div v-for="(item, index) in menuFun.row.menuFuncInfos" :key="item.funcCode">
              <div v-if="item.funcDesc.includes('/')&&index < 1" class="menu-fun menu-fun-url">{{item.funcDesc}}</div>
              <div v-if="!item.funcDesc.includes('/')&&index < 3"  class="menu-fun menu-fun-text">{{item.funcDesc}}</div>
            </div>
            <!-- <el-tag style="margin-right:4px;" type="success" v-for="item in menuFun.row.menuFuncInfos" :key="item.funcCode">{{item.funcDesc}}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="statu">
            <el-switch v-model="statu.row.menuStatus" @change="handleSwitch(statu.row,statu.$index)" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  min-width="200">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.menuFuncInfos.length <= 0" type="text" size="small" @click="handleMoreFun(scope.row,scope.$index)">功能详情</el-button>
            <el-button v-if="!menuData[scope.$index].url && menuData[scope.$index].menuFuncInfos.length == 0" @click.native.prevent="handleAddChild(menuData,scope.$index)" type="text" size="small">添加子菜单</el-button>
            <el-button v-if="menuData[scope.$index].subMenuInfos.length == 0" @click.native.prevent="handleEdit(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="handleDelete(scope.row,scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 功能详情弹框 -->
      <el-dialog :title="currentMenuData.menuName" :visible.sync="dialogFunVisible"  width="50%">
        <div class="menu-fun-dialog text-center">
          <el-tag v-for="(item, index) in currentMenuData.menuFuncInfos" :key="index" :class="{'menu-fun-url-tag': item.funcDesc.includes('/')}">{{item.funcDesc}}</el-tag>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFunVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加/编辑菜单弹框 -->
      <el-dialog :title="addMenu.title" width="40%" :visible.sync="dialogFormVisible" :before-close="handleClose">
        <el-form :model="addMenu" ref="ruleForm" class="menu-dialog" label-width="80px">
          <el-form-item label="菜单名" prop="menuName" :rules="[{required: true, message: '请输入菜单名！', trigger: 'blur' },{ pattern:/\S/, message: '请输入非空菜单名', trigger: 'blur' }]">
            <el-input v-model="addMenu.menuName" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="url">
            <el-input v-model="addMenu.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="ICON" prop="icon">
            <el-input v-model="addMenu.icon" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="添加功能">
            <div class="add-fun">
              <el-tag  v-for="(tag, index) in addMenu.menuFuncInfos" closable :disable-transitions="false" @close="handleTagClose(tag)" :key="index" class="margin-right-5">{{tag.funcDesc}}</el-tag>
            </div>
            <el-input class="input-new-tag" v-if="menuVisible" v-model="menuValue" ref="saveTag" size="small"
              @keyup.enter.native="handleTagConfirm"
              @blur="handleTagConfirm">
            </el-input>
            <el-button style="font-size:18px;" v-else class="button-new-tag" size="small" @click="handleAddTag">+</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="AddMenuSure('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 添加/编辑子菜单弹框 -->
      <el-dialog :title="addMenuchild.title" :visible.sync="dialogChildVisible"  :before-close="handleChildClose">
        <el-form :model="addMenuchild" ref="ruleFormchild" class="menu-dialog" label-width="80px"  :rules="addMenuchildRules">
          <el-form-item label="菜单名" prop="menuName">
            <el-input v-model="addMenuchild.menuName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="url">
            <el-input v-model="addMenuchild.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="ICON" prop="icon">
            <el-input v-model="addMenuchild.icon" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="添加功能">
            <div class="add-fun">
              <el-tag  v-for="(tag, index) in addMenuchild.menuFuncInfos" closable :disable-transitions="false" @close="handleChildTagClose(tag)" :key="index">{{tag.funcDesc}}</el-tag>
            </div>
             <el-input class="input-new-tag" v-if="menuChildVisible" v-model="menuChildValue" ref="saveChildTag" size="small"
                @keyup.enter.native="handleChildTagConfirm"
                @blur="handleChildTagConfirm">
              </el-input>
              <el-button style="font-size:18px;" v-else class="button-new-tag" size="small" @click="handleAddChildTag">+</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleChildCancel">取 消</el-button>
          <el-button type="primary" @click="AddChildMenu('ruleFormchild')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      total: 100,
      pageSize: 10,
      sysDesc: '',
      sysCode: '',
      systemOptions: [],// 系统列表选项
      dialogFormVisible: false,
      dialogChildVisible: false,
      menuVisible: false,
      menuChildVisible: false,
      menuValue: '',
      menuChildValue: '',
      title: '',
      titleChild: '',
      addMenu: {
      },
      addMenuchild: {},
      // option: {
      //   timeout: 30 * 1000 //30秒过期
      // },
      options: [{
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
        value: '',
      status: '1',
      menuData: [], // 系统列表表格数据
      currentMenuData: '', // 当前选择的功能列表数据
      dialogFunVisible: false, // 功能详情列表弹框
      addMenuchildRules: {
        menuName: [
          { required: true, message: '请输入菜单名！', trigger: 'blur' },
          { pattern: /^\S+$/, message: '不能输入空格' }
        ],
        url: [
          { required: true, message: '请输入URL！', trigger: 'blur' },
          { pattern: /^\S+$/, message: '不能输入空格' }
        ]
      }
    };
  },
  components: {},
  mounted() {
    //在实例创建完成后被立即调用
    this.getSystemInfo();
    if (this.sysCode) {
      this.findMenuListInfo();
    }
  },
  methods: {
    // 获取初始化数据
    getSystemInfo(){
      this.loading = true;
      let url = global.AUTH_URL + "/auth/menu/findSysMains"
      this.$http.post(url,).then((data)=>{
          this.sysCode = data.list[3].sysCode;
          // this.sysDesc = data.list[3]
          this.systemOptions = data.list;
          console.log(data.list)
          this.findMenuListInfo()
        })
        .catch(error=>{
          this.$msg._log_warn(error.msg || "获取列表失败")
        })
    },
    // 选择系统
    systemChange(value) {
      console.log(value)
      // this.sysDesc = value.sysDesc;
      this.sysCode = value.sysCode;
      this.findMenuListInfo();
    },

    // 返回系统列表数据
    findMenuListInfo() {
      this.loading = true;
      let url = global.AUTH_URL + "/auth/menu/findMenuListInfo/" + this.sysCode;
      this.$http.get(url).then((data)=> { 
          this.menuData = data;
        })
        .catch(error=>{
          console.log(error)
        })
        .finally(()=>{this.loading = false})
    },

    // 点击添加菜单
    handleAddMenu() {
      this.dialogFormVisible = true;
      this.addMenu = {
        title : '添加菜单',
        mid : "addMenu",
        menuStatus : '1',
        systemCode : this.sysCode,
        menuFuncInfos : [],
        addFunctions: [],
        deleteFunctions: []
      };
    },

    // 添加菜单请求
    handleCreatMenu(object) {
      let url = global.AUTH_URL + "/auth/menu/addMenuMain"
      this.$http.post(url, object).then((data)=>{
          this.$msg._log_success("菜单添加成功")
          this.findMenuListInfo();
        })
        .catch(error=>{
          this.$msg._log_warn("新增菜单成功，请重试！")
        })
    },

    // 确定添加/编辑菜单
    AddMenuSure(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          const {mid, index} = this.addMenu;
          if (mid == "addMenu") {
            this.handleCreatMenu(this.addMenu);
          } else if(mid == "amendMenu") {
            const { menuName, url, icon, addFunctions, deleteFunctions } = this.addMenu;
            this.menuData[index].title = '编辑菜单';
            this.menuData[index].menuName = menuName;
            this.menuData[index].url = url;
            this.menuData[index].icon = icon;
            this.menuData[index].addFunctions = addFunctions;
            this.menuData[index].deleteFunctions = deleteFunctions;
            this.updateInfo(this.menuData[index]);
          }
          this.dialogFormVisible = false;
        } else {return false}
      })
    },

    // 点击删除菜单
    handleDelete({menuCode}, index) {
      this.$confirm('当前仍有角色绑定了该菜单的使用权限，如果删除，角色将无法使用该菜单!, 是否继续?', '提示', {
        confirmButtonText: '一键删除',
        cancelButtonText: '算了，我先去取消角色的菜单权限',
        type: 'warning'
      }).then(() => {
        this.deleteInfo(menuCode);
      }).catch(() => {
        this.$msg._log_info("已取消")
      });
    },

    // 删除菜单请求
    deleteInfo(menuCode) {
      let url = global.AUTH_URL + "/auth/menu/deleteMenuMain/" + menuCode;
      this.$http.delete(url).then((data)=>{
          this.$msg._log_success("删除成功")
          this.findMenuListInfo();
        })
        .catch(error=>{
          this.$msg._log_warn("删除菜单失败，请刷新重试！")
        })
    },

    // 点击修改菜单
    handleEdit({menuName,menuCode,url,icon,menuFuncInfos},index) {
      this.addMenu = {
        title : '编辑菜单',
        mid : "amendMenu",
        index,
        menuName,
        menuCode,
        url,
        icon,
        menuStatus : '1',
        menuFuncInfos : [],
        addFunctions: [],
        deleteFunctions: []
      };
      for (const i in menuFuncInfos) {
        this.addMenu.menuFuncInfos.push(menuFuncInfos[i])
      }
      setTimeout(()=>{
        this.dialogFormVisible = true;
      }, 500)
    },

    // 修改更新菜单请求
    updateInfo(object) {
      let url = global.AUTH_URL + "/auth/menu/updateMenuMain"
      this.$http.post(url, object).then((data)=>{
          this.$msg._log_success(object.title + '成功！')
          this.findMenuListInfo();
        })
        .catch(error=>{
          this.$msg._log_warn( object.title + "失败，请刷新重试！")
        })
    },

    // 功能--点击增加功能选项
    handleAddTag() {
      this.menuVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTag.$refs.input.focus();
      });
    },
    // 功能--光标离开自动增加功能
    handleTagConfirm() {
      if (this.menuValue) {
        let menuFunObj = {
          funcDesc : this.menuValue,
          funcStatus: 1
        }
        if (this.addMenu.menuCode) {
          menuFunObj.menuCode = this.addMenu.menuCode;
        }
        this.addMenu.addFunctions.push(menuFunObj);
        this.addMenu.menuFuncInfos.push(menuFunObj);
      }
      this.menuVisible = false;
      this.menuValue = '';
    },

    // 功能--点击删除功能选项
    handleTagClose(tag) {
      this.addMenu.deleteFunctions.push(tag);
      this.addMenu.menuFuncInfos.splice(this.addMenu.menuFuncInfos.indexOf(tag), 1);
    },

    // 切换状态
    handleSwitch(row, index){
        if (row.menuStatus == '0') {
          row.title = '禁用 [ ' + row.menuName + ' ] ';
        }else{
          row.title = '启用 [ ' + row.menuName + ' ] ';
        }
        console.log(this.menuData[index])
        this.updateInfo(this.menuData[index]);
    },

    // 点击取消
    handleCancel() {
      this.dialogFormVisible = false;
      // TODU 清空表单内容
      this.$refs['ruleForm'].resetFields();
    },

    // 遮罩增关闭前
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // TODU 清空表单内容
          this.$refs['ruleForm'].resetFields();
          done();
        })
        .catch(_ => {});
    },



    // 子菜单--点击添加菜单
    handleAddChild(row, index) {
      console.log("子菜单--点击添加菜单")
      this.addMenuchild = {
        title : '添加子菜单',
        mid : "addChild",
        pId : index,
        menuStatus : '1',
        systemCode : this.sysCode,
        menuFuncInfos : [],
        addFunctions: [],
        deleteFunctions: []
      };
      setTimeout(()=>{
        this.dialogChildVisible = true;
      },100)
    },

    // 子菜单--点击编辑菜单
    handleEditchild(childindex, parentindex, {menuName,menuCode,url,icon,menuFuncInfos}) {
      this.addMenuchild = {
        title : '编辑子菜单',
        mid : "amendChild",
        cId : childindex,
        pId : parentindex,
        menuName,
        menuCode,
        url,
        icon,
        menuStatus : '1',
        menuFuncInfos : [],
        addFunctions: [],
        deleteFunctions: []
      };
      for (const i in menuFuncInfos) {
        this.addMenuchild.menuFuncInfos.push(menuFuncInfos[i])
      }
      setTimeout(()=>{
        this.dialogChildVisible = true;
      }, 500)
      console.log(this.addMenuchild)
    },

    // 子菜单--确定添加/编辑更新菜单
    AddChildMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          const {mid, cId, pId, menuName, url, icon, addFunctions, deleteFunctions } = this.addMenuchild;
          let activeMenu = this.menuData[pId].subMenuInfos;//当前的父级菜单中的子菜单数组
          if(mid == "addChild") {
            this.addMenuchild.parentMenu = this.menuData[pId].menuCode;
            this.handleCreatMenu(this.addMenuchild);
          }else if(mid == "amendChild") {
            activeMenu[cId].title = '编辑子菜单';
            activeMenu[cId].parentMenu = this.menuData[pId].menuCode;
            activeMenu[cId].menuName = menuName;
            activeMenu[cId].url = url;
            activeMenu[cId].icon = icon;
            activeMenu[cId].addFunctions = addFunctions;
            activeMenu[cId].deleteFunctions = deleteFunctions;
            this.updateInfo(activeMenu[cId]);
          }
          this.dialogChildVisible = false;
        } else {return false}
      })
    },

    // 子菜单功能--点击删除功能选项
    handleChildTagClose(tag) {
      this.addMenuchild.deleteFunctions.push(tag);
      this.addMenuchild.menuFuncInfos.splice(this.addMenuchild.menuFuncInfos.indexOf(tag), 1);
    },
    
    // 子菜单--添加功能
    handleAddChildTag() {
      this.menuChildVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveChildTag.$refs.input.focus();
      });
    },

    // 子菜单--光标移开添加功能详情
    handleChildTagConfirm() {
      const {mid, cId, pId} = this.addMenuchild;
      
      if (this.menuChildValue) {
        let m = {
          funcDesc : this.menuChildValue,
          funcStatus: 1
        }
        if (this.addMenuchild.menuCode) {
          m.menuCode = this.addMenuchild.menuCode;
        }
        this.addMenuchild.addFunctions.push(m);
        this.addMenuchild.menuFuncInfos.push(m);
      }
      this.menuChildVisible = false;
      this.menuChildValue = '';
    },

    // 点击查看功能详情
    handleMoreFun(row) {
      this.currentMenuData = row
      setTimeout(()=>{
        this.dialogFunVisible = true
      },500)
      
    },

    // 子菜单--点击取消
    handleChildCancel() {
      this.dialogChildVisible = false;
      // TODU 清空表单内容
      this.$refs['ruleFormchild'].resetFields();
    },

    // 子菜单--遮罩增关闭前
    handleChildClose(done){
      this.$confirm('确认关闭？')
      .then(_ => {
        // TODU 清空表单内容
        this.$refs['ruleFormchild'].resetFields();
        done();
      })
      .catch(_ => {});
    },

    // 表格是否显示展开行箭头
    getRowClassName({row, rowIndex}){
      // console.log(row.subMenuInfos)
      if (row.subMenuInfos.length <1) {
          return 'row-expand-cover';
      }
    }


    
  }
};
</script>
<style lang="scss" scope>
  .transition-box .el-table__row {
    td:first-child{
      padding-left: 66px !important;
    }
  }
  .row-expand-cover .el-table__expand-icon{visibility:hidden;}
  .el-table__expanded-cell {
    border: none !important;
  }
  .menu-fun-url{
    cursor: pointer;
    // border: 1px solid #eee;
    // border-radius: 5px;
    max-width: 400px;
    padding: 2px 6px;
    height: 30px;
    margin: 4px 4px 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .menu-fun {
    border-radius: 5px;
    padding: 2px 6px;
    height: 30px;
    margin: 0 4px 0 0;
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
  .menu-fun-text {
    float: left;
  }
  .el-table__expanded-cell {
    padding: 0
  }
  .column-fun .cell {
    display: -webkit-box;
    // display: flex;
    // align-items: center;
  }
  .column-fun-total {
    display: inline-block;
    width: 60px;
    vertical-align: -webkit-baseline-middle;
  }
  .menu-setup  {
    .el-table::before{
        height: 0;
    }
    .el-dialog{
      .el-dialog__header {     
        background: #F5F5F5;
        border-radius: 4px 4px 0 0;  
      }
    }

  }
  // 功能弹框
  .menu-fun-dialog {
    min-height: 100px;
    max-height: 400px;
    overflow: auto;
    .el-tag {
      margin: 0 8px 5px 0;
    }
    .menu-fun-url-tag{
      &.el-tag {
        text-align: left;
        max-width: 600px;
        display: block;
        margin: auto auto 10px auto;
      }
    }
  }

  // 菜单弹框
  .menu-dialog {
    .el-input {
      width: 60%;
    }
    .el-tag {
      margin: 0 8px 5px 0;
    }
    .add-fun {
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 8px;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #eee;
  }
    
</style>