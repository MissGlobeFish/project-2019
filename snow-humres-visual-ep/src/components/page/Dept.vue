<template>
    <div class="dept">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 人员组织管理</el-breadcrumb-item>
                <el-breadcrumb-item> 组织架构</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-row>
                <el-col :span="8">
                    <div class="grid-content">
                        <el-tabs v-model="accountCode" @tab-click="handleClick">
                          <el-tab-pane label="国盛天丰" name="GSTF" >
                            <el-button type="primary" size="small" class="full_button" @click="addLvl1Dept">新增一级部门<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
                            <el-tree v-loading="loading" :data="tree1" :props="defaultProps" :load="loadNode" lazy show-checkbox node-key="id" :expand-on-click-node="false" :render-content="renderContent" draggable @node-drag-enter="handleDragEnter"></el-tree>
                          </el-tab-pane>
                          <el-tab-pane label="旺小宝" name="WXB" >
                            <el-button type="primary" size="small" class="full_button" @click="addLvl1Dept">新增一级部门<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
                            <el-tree v-loading="loading" :data="tree2" :props="defaultProps" :load="loadNode" lazy show-checkbox node-key="id" :expand-on-click-node="false" :render-content="renderContent" draggable @node-drag-enter="handleDragEnter"></el-tree>
                          </el-tab-pane>
                          <el-tab-pane label="旺智慧" name="WZH" >
                            <el-button type="primary" size="small" class="full_button" @click="addLvl1Dept">新增一级部门<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
                            <el-tree v-loading="loading" :data="tree3" :props="defaultProps" :load="loadNode" lazy show-checkbox node-key="id" :expand-on-click-node="false" :render-content="renderContent" draggable @node-drag-enter="handleDragEnter"></el-tree>
                          </el-tab-pane>
                           <!-- <el-tab-pane label="向源" name="XY" >
                             <el-button type="primary" size="small" class="full_button" @click="addLvl1Dept">新增一级部门<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
                            <el-tree :data="tree3" :props="defaultProps" show-checkbox node-key="id" :expand-on-click-node="false" :render-content="renderContent"></el-tree>
                          </el-tab-pane> -->
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :span="16">
                  <transition name="el-zoom-in-center">
                    <div v-if="showFormdept" class="grid-content detail">
                        <el-form ref="form" :model="form" label-width="100px">
                          <!-- <el-form-item label="状态" prop="managers">
                              <el-input v-model="managers"></el-input>
                                  <el-input v-model="managerName"></el-input>
                                      <el-input v-model="managerCode"></el-input>
                          </el-form-item> -->

                            <el-form-item label="部门编码">
                                <el-input v-model="form.deptCode" placeholder="" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="上级部门">
                                <el-input v-model="form.superiorDepartmentDesc" placeholder="上级部门为空时默认为一级部门，T0级部门不可通过前端维护" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="部门名称" prop="deptName" :rules="[{ required: true, message: '部门名称不能为空',trigger: 'blur'}]">
                                <el-input v-model="form.deptName"></el-input>
                            </el-form-item>
                            <el-form-item label="部门归属" prop="accountName" readonly>
                                <el-input v-model="form.accountName" style="width:50%;" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="部门路径">
                                <el-input v-model="form.deptNamePath" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="部门层级" prop="deptLvl">
                                <el-input v-model="form.deptLvl" style="width:50%;" readonly></el-input>
                            </el-form-item>
                             <el-form-item label="部门负责人">
                                 <EmpNameSelector  style="width:50%;" v-on:empNameSelector="getManagers" :name="managerName" ></EmpNameSelector>
                             </el-form-item>
                            <el-form-item label="分管领导">
                                <EmpNameSelector style="width:50%;" v-on:empNameSelector="getManagements" :name="leadershipName"  ></EmpNameSelector>
                            </el-form-item>
                            <el-form-item label="HRBP">
                                 <EmpNameSelector style="width:50%;" v-on:empNameSelector="getHrbps" :name="hrbpName" ></EmpNameSelector>
                            </el-form-item>
                            <el-form-item label="是否启用">
                                <el-switch on-text="1" off-text="0" v-model="isenable"></el-switch>
                            </el-form-item>
                            <el-form-item label="是否有效">
                                <el-switch on-text="1" off-text="0" v-model="isvalid"></el-switch>
                            </el-form-item>
                            <!-- <el-form-item label="描述">
                                <el-input type="textarea" v-model="form.desc"></el-input>
                            </el-form-item> -->
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                                <el-button type="primary" @click="reSetting">重置</el-button>
                          </el-form-item>
                        </el-form>
                    </div>
                  </transition>

                  <transition name="el-zoom-in-center">
                    <div v-if="showFormhumer" class="grid-content detail">
                        <el-form ref="form" :model="formHumer" label-width="100px">
                            <el-form-item label="姓名">
                                <el-input v-model="formHumer.empName"  style="width:50%;"></el-input>
                            </el-form-item>
                            <el-form-item label="所属组织" prop="accountName">
                                <el-input v-model="formHumer.accountName" style="width:50%;"></el-input>
                            </el-form-item>
                            <el-form-item label="直属上级" prop="pEmpName">
                                <el-input v-model="formHumer.pEmpName" style="width:50%;"></el-input>
                            </el-form-item>

                            <el-form-item label="直属上级" prop="pEmpName">
                              <el-input v-model="formHumer.pEmpName" style="width:50%;">
                                <el-button slot="append" @click="openEmpDialog('PEMP')" icon="el-icon-search"></el-button>
                              </el-input>
                              <el-input style="display:none;" v-model="formHumer.pEmpCode"></el-input>
                            </el-form-item>

                            <el-form-item label="所在部门" prop="deptName">
                              <div class="el-input" style="width:50%;">
                                  <DeptSelectorSingle @deptSelecotrSingle="getDeptTrees" :selectOption="selectOption" ></DeptSelectorSingle>
                              </div>
                            </el-form-item>
                            <el-form-item label="生效时间">
                                <el-date-picker v-model="formHumer.date" type="date" placeholder="选择日期" style="width:50%;" :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onPresent('formHumer')">提交</el-button>
                          </el-form-item>
                        </el-form>
                    </div>
                  </transition>
                </el-col>
            </el-row>
        </div>

        <empDiaLog ref="child" @getEmpCode="doEmpCodeHandler"></empDiaLog>

    </div>
</template>

<script>
let id = 1000;
import EmpNameSelector from "./../common/EmpNameSelector.vue";
import DeptSelectorSingle from "../common/DeptSelectorSingle.vue";
import empDiaLog from "../common/EmpDiaLog.vue";
import come from "../common/constant.js";

export default {
  data() {
    return {
      operate: '',
      loading: false,
      isenable: true,
      isvalid: true,
      showFormdept: false,
      showFormhumer: false,
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      tree1: [{ label: "加载中..." }],
      tree2: [{ label: "加载中..." }],
      tree3: [{ label: "加载中..." }],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      param:{
        grpNum:"ACCOUNT"
      },
      selectOption: {
        deptPath: "",
        status: false,
        flag: true,
        org: "WXB"
      },
      accountCode: "GSTF",//部门归属
      formHumer: [],
      leadershipName: [],
      leadershipCode:[],
      hrbpName: [],
      managerName: [],
      superiorDepartmentDesc:'',//上级部门
      superiorDepartmentCode:'',
      hrbps: [],
      managers:[],//部门负责人
      managements:[],
      companies:[],
      flag:'update',
      addDeptData:{},
      addDeptNode: {},
      removeDeptData:{},
      removeDeptNode:{},
      modifyDeptNode:{},
      deleteIndex: '',
      resolve: function (){},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
    };
  },
  components: {
    EmpNameSelector,
    DeptSelectorSingle,
    empDiaLog
  },
  created() {
    this.getTree();
  },
  methods: {
    addLvl1Dept(){//新增部门
      this.showFormhumer = false;
      setTimeout(() => {
        this.showFormdept=true;
      }, 500);
      this.form = {};
      this.form.deptLvl = 'T1';
      this.form.superiorDepartmentDesc = '总经办';
      this.form.superiorDepartmentCode = 'G00001';
      this.form.accountCode = this.accountCode;
      if('GSTF' == this.accountCode){
        this.form.accountName = '成都国盛天丰网络科技有限公司';
      } else if('WXB' == this.accountCode){
        this.form.accountName = '成都旺小宝科技有限公司';
      } else if('WZH' == this.accountCode){
        this.form.accountName = '成都旺小宝智慧商业管理有限公司';
      } else if('XY' == this.accountCode){
        this.form.accountName = '北京向源叁际信息有限公司';
      }
      this.managerName = [];
      this.leadershipName = [];
      this.hrbpName = [];
      this.flag = 'add';
    },
    getTree() {//初始化架构树
      let self = this;
      self.loading = true;
      let url =  global.HUMRES_URL +  "/humres/deptmanage/tree";
      let nodeData = {
        deptCode: null,
        accountCode: self.accountCode
      };
      self.selectOption.org = self.accountCode;
      self.$http.post(url, nodeData, self.option).then(
        function(data) {
          if (data.body.flag) {
            let trees = data.body.list;
            if (self.accountCode == "GSTF") {
              self.tree1 = trees;
            } else if (self.accountCode == "WXB") {
              self.tree2 = trees;
            } else if (self.accountCode == "WZH"){
              self.tree3 = trees;
            }
            self.loading = false;
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
            self.loading = false;
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求超时！",
            type: "error"
          });
          self.loading = false;
        }
      );
    },
    loadNode(node, resolve) {//加载子树数据的方法，仅当 lazy 属性为true 时生效
      if (resolve) {
        this.resolve = resolve;
      }
      let nodeKey = node.key;
      let child = node.data.children;
      if (node.level === 0) {}
      //if (node.level > 3) return this.resolve([]);

        if (node.key) {
            setTimeout(() => {
              let self = this;
              let url =  global.HUMRES_URL +  "/humres/deptmanage/tree";
              let nodeData = {
                deptCode: nodeKey,
                accountCode: self.accountCode
              };
              self.$http.post(url, nodeData, self.option).then(
                function(data) {
                  if (data.body.flag) {
                    let list = data.body.list;
                    var dataList = list.concat(child);
                    self.resolve(dataList);
                  } else {
                    self.$message({
                      message: data.body.msg,
                      type: "warning"
                    });
                  }
                },
                function(error) {
                  // 这里是处理错误的回调
                  self.$message({
                    message: "请求超时！",
                    type: "error"
                  });
                }
              );
            }, 500);
        }
    },
    handleDragEnter(draggingNode, dropNode, ev){//	拖拽进入其他节点时触发的事件
      console.log('tree drag enter: ', dropNode.label);
    },
    reload(node, store, data) {   //编辑
      let self = this;
      if (data.type == 2) {

        self.showFormdept = false;
        setTimeout(() => {
          self.showFormhumer = true;
        }, 500);

        let url =  global.HUMRES_URL + "/humres/empmanage/findEmpDto/"+data.id;
        self.$http.get(url, self.option).then(
        function(data) {
          if (data.body.flag) {
            self.formHumer = data.body.data.empMainModel;
            self.selectOption.deptPath = self.formHumer.deptName;
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
            self.loading = false;
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求超时！",
            type: "error"
          });
          self.loading = false;
        }
      );

      }else if(data.type == 1){

        self.flag = 'update';
        self.modifyDeptNode = node;
        self.showFormhumer = false;
        setTimeout(() => {
          self.showFormdept = true;
        }, 500);
        let url = global.HUMRES_URL + "/humres/deptmanage/findDept/" + data.id;
        self.$http.get(url, self.option).then(
          function(data) {
            if (data.body.flag) {
              self.form = data.body.list;
              localStorage.setItem('treeList',JSON.stringify(self.form));
              self.isenable = self.form.isenable == "1" ? true : false;
              self.isvalid = self.form.isvalid == "1" ? true : false;

              if(self.form.managerName != ''){
                self.managerName = self.form.managerName.split(",");
                self.managerCode = self.form.managerCode.split(",");
                for(let i = 0;i<self.managerName.length;i++){   //格式转为name(code)
                  self.managerName[i] = self.managerName[i]+'('+self.managerCode[i]+')';
                }
              }else {
                self.managerName = [];
                self.managerCode = [];
                self.managers = [];
              }
              if(self.form.leadershipName != ''){
                self.leadershipName = self.form.leadershipName.split(",");
                self.leadershipCode = self.form.leadershipCode.split(",");
                for(let i = 0;i<self.leadershipName.length;i++){   //格式转为name(code)
                  self.leadershipName[i] = self.leadershipName[i]+'('+self.leadershipCode[i]+')';
                }
              }else{
                self.leadershipName = [];
                self.leadershipCode = [];
                self.managements = [];
              }

              if(self.form.hrbps != ''){
                self.hrbpName = self.form.hrbps.split(",");
              }else {
                self.hrbpName = [];
                self.hrbps = [];
              }


            } else {
              self.$message({
                message: data.body.msg,
                type: "warning"
              });
            }
          },
          function(error) {
            // 这里是处理错误的回调
            self.$message({
              message: "请求超时！",
              type: "error"
            });
        });
      }
    },
    addDept(node,data){//添加节点
      this.showFormhumer = false;
      setTimeout(() => {
        this.showFormdept=true;
      }, 500);
      this.form={};
      this.form.superiorDepartmentDesc=data.label;
      this.form.superiorDepartmentCode=data.id;
      this.form.accountCode=this.accountCode;
      if('GSTF' == this.accountCode){
        this.form.accountName = '成都国盛天丰网络科技有限公司';
      } else if('WXB' == this.accountCode){
        this.form.accountName = '成都旺小宝科技有限公司';
      } else if('XY' == this.accountCode){
        this.form.accountName = '北京向源叁际信息有限公司';
      }
      this.form.deptLvl = 'T'+(parseInt(node.level)+1);
      this.managerName = [];
      this.leadershipName = [];
      this.hrbpName = [];
      this.flag = 'add';
      this.addDeptNode = node;
    },
    deleteDept(data,node){//删除节点
      this.$confirm('此操作将永久删除 ( '+ data.label +' ) , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parentNode = node.parent.childNodes;
        for (let i in parentNode) {
          if (parentNode[i].key == data.id) {
            this.removeDeptData = parentNode[i];
            this.deleteIndex = i;
          }
        }
        this.removeDeptNode = node.parent.childNodes;
        let self = this;
        let url = global.HUMRES_URL + "/humres/deptmanage/deleteDept/" + self.removeDeptData.key;
        self.$http.delete(url,self.option).then(
          function(data){
            if(data.body.flag){
              self.$message({
                message:"删除成功!",
                type:"success"
              });
              self.removeDeptNode.splice(self.deleteIndex, 1);
            }else{
              self.$message({
                message:data.body.msg,
                type:"warning"
              });
            }
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    onSubmit(formName) { //部门信息提交（添加节点）
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let self = this;
          let url_modify = global.HUMRES_URL + "/humres/deptmanage/updateDept";
          let url_trace = global.HUMRES_URL + "/humres/deptmanage/addDeptTrace";
          let url_add =global.HUMRES_URL+"/humres/deptmanage/addDept";
          //部门负责人
          if(self.managers != null && self.managers != '' && self.managers != 'undefined'){
            self.form.managerName = self.managers.map(manage => { return manage.value;}).join(", ");
            self.form.managerCode = self.managers.map(manage => { return manage.label;}).join(", ");
          }else{
            self.form.managerName = '';
            self.form.managerCode = '';
            self.form.managers = '';
          }
          //分管领导
          if(self.managements != null && self.managements != '' && self.managements != 'undefined'){
            self.form.leadershipName = self.managements.map(management => { return management.value; }).join(", ");
            self.form.leadershipCode = self.managements.map(management => { return management.label; }).join(", ");
          }else{
            self.form.leadershipName = '';
            self.form.leadershipCode = '';
            self.form.managements  = '';
          }
          //hrbp
          if(self.hrbps != null && self.hrbps != '' && self.hrbps != 'undefined'){
            self.form.hrbps = self.hrbps.map(hrbp => {return hrbp.value; }).join(", ");
          }else {
            self.form.hrbps = '';
            self.form.hrbpName = '';
          }

          if( self.form.isenable != self.isenable && self.isenable  ){
            var date = new Date();
            self.form.enableDate = date.getFullYear() + "/"+ (date.getMonth() + 1) + "/" + date.getDate();
          }
          self.form.isenable = self.isenable ? 1 : 0;
          self.form.isvalid = self.isvalid ? 1 : 0;
          self.form.updater = localStorage.getItem("ms_empCode");

          if( self.flag === 'add' ) {
            self.$http.post(url_add, self.form, self.option).then(
              function(data){
                if(data.body.flag){//成功

                  let newChild = {
                    children: [],
                    id: data.body.data.deptCode,
                    deptLvl: data.body.data.deptLvl,
                    deptCode: data.body.data.deptCode,
                    label: data.body.data.deptName,
                    type: 1
                  };

                  if(data.body.data.deptLvl == 'T1'){
                    if (self.accountCode == "GSTF") {
                      self.tree1.push(newChild);
                    } else if (self.accountCode == "WXB") {
                      self.tree2.push(newChild);
                    } else if (self.accountCode == "WZH") {
                      self.tree3.push(newChild);
                    }
                  }else{
                    self.loadNode(self.addDeptNode);
                  }

                  self.$message({
                    message: '保存成功！',
                    type: "success"
                  });
                }else{
                  self.$message({
                    message: data.body.msg,
                    type: "warning"
                  });
                }
              }
            )
          }else{
            this.$http.put(url_modify, self.form, self.option).then(
            function(data) {
              if (data.body.flag) {
                this.$http.post(url_trace, self.form, self.option).then(
                  function(data) {
                    if (data.body.flag) {
                      self.$message({
                        message: '提交成功！',
                        type: "success"
                      });
                      this.modifyDeptNode.data.label = self.form.deptName;
                    } else {
                      self.$message({
                        message: data.body.msg,
                        type: "warning"
                      });
                    }
                  },
                  function(error) {
                    // 这里是处理错误的回调
                    self.$message({
                      message: "请求超时！",
                      type: "error"
                    });
                  }
                );
              } else {
                self.$message({
                  message: data.body.msg,
                  type: "error"
                });
              }
            },
            function(error) {
              // 这里是处理错误的回调
              self.$message({
                message: "请求超时！",
                type: "error"
              });
            }
          );
          }

        } else {
          return false;
        }
      });
    },
    getNames(names){ //类型转化
      if (names != "undefined" && names != null && names != "") {
        return  names.map(name => {
          if(name.indexOf("(") > 0){
          return {
                value: name.substring(0, name.indexOf("(")),
                label: name.substring(name.indexOf("(") + 1, name.indexOf(")"))
              };
            }else{
              return {  value : name  }
            }
          });
      }
    },
    getManagers(names) {//部门负责人
      let self = this;
      self.managers =  this.getNames(names);
    },
    getManagements(names) {//分管领导
      let self = this;
      self.managements = this.getNames(names);
    },
    getHrbps(names) {//HRBP
      let self = this;
      self.hrbps = this.getNames(names);
    },
    getCompanies() {//获取公司信息
      let self = this;
      let url =
        global.HUMRES_URL + "/humres/config/main/list";
      self.$http.post(url, self.param, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
            let dataText = data.body.datas.list;
            self.companies = dataText;
          } else {
            self.$message({
              message: data.body.error,
              type: "warning"
            });
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求失败，请刷新重试！",
            type: "error"
          });
        }
      );
    },
    companyChange(value){//当员工归属（所属组织）被改变
      //传入组织编码
      this.form.accountName = value.label;
      this.form.accountCode = value.number;
    },
    handleClick(data) {//tab切换
      this.accountCode = data.name;
      this.getTree();
    },
    renderContent(h, { node, data, store }) {//树节点的内容区的渲染
      if (data.type == 1) {
        return (
          <span>
            <span>
              <span style="font-size:14px;font-weight:bold;">{node.label}</span>
            </span>

            <span style=" margin:10px;">
              <i class="el-icon-view" style="color:#409EFF;" on-click={() => this.reload(node, store, data)}></i>
              &nbsp;&nbsp;
              <el-button class="el-icon-circle-plus-outline" size="medium" type="text" on-click={ () => this.addDept(node,data) }></el-button>
              <el-button class="el-icon-delete" size="medium" type="text" on-click={ () => this.deleteDept(data,node) }></el-button>
            </span>
          </span>
        );
      }else{
        return (
          <span>
            <span>
              <i class="el-icon-service" style="color:#aaa;"></i>
              <span style="font-size:14px;font-weight:bold;">  {node.label}</span>
            </span>

            <span style=" margin:10px;">
              <i class="el-icon-view" style="color:#409EFF;" on-click={() => this.reload(node, store, data)}></i>
            </span>
          </span>
        );
      }
    },
    reSetting(){//重置页面
      this.form = JSON.parse(localStorage.getItem('treeList'));
      this.isenable = this.form.isenable == "1" ? true : false;
      this.isvalid = this.form.isvalid == "1" ? true : false;


      if(this.managerName != ''){
        this.managerName = this.form.managerName.split(",");
        this.managerCode = this.form.managerCode.split(",");
        for(let i = 0;i<this.managerName.length;i++){   //格式转为name(code)
          this.managerName[i] = this.managerName[i]+'('+this.managerCode[i]+')';
        }
      }else{
        this.managerName = [];
        this.managerCode = [];
        this.managers = [];
      }
      if(this.leadershipName != ''){
        this.leadershipCode = this.form.leadershipCode.split(",");
        this.leadershipName = this.form.leadershipName.split(",");
        for(let i = 0;i<this.leadershipName.length;i++){   //格式转为name(code)
          this.leadershipName[i] = this.leadershipName[i]+'('+this.leadershipCode[i]+')';
        }
      }else{
        this.leadershipCode = [];
        this.leadershipName = [];
        this.managements = [];
      }


      if(this.hrbpName != ''){
        this.hrbpName = this.form.hrbps.split(",");
      }else {
        this.hrbpName = [];
        this.hrbps = [];
      }
    },
    getDeptTrees(data) {//接收子组件传来的值（选择部门）
      console.log(data,this.selectOption)
    },
    onPresent(formName){//人员异动提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(11)
          if (!this.formHumer.date) {
            this.$alert('这是一段内容', '提示', {
              confirmButtonText: '确定',
              callback: action => {}
            });
          }
        } else {
          return false;
        }
      });
    },
    doEmpCodeHandler(data){
      if("PEMP" == this.operate){
        this.formHumer.pEmpCode = data.empCode;
        this.formHumer.pEmpName = data.empName;
      }
    },
    openEmpDialog(operate){
      this.operate = operate;
      this.$refs.child.open();
    },
  }
};
</script>

<style lang="less">
.dept {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; //阻止文字被选中
  background: #fff;
  box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
  padding: 20px;

    .plugins-tips{
      box-shadow: 1px 1px 2px 1px rgba(204, 204, 204, 0.5);
      background: #F5F7FA;
    }

    .el-tabs__nav {
      width: 100%;

      .el-tabs__active-bar{
        width: 33% !important;
      }
      .el-tabs__item {
        width: 33%;
        text-align: center;
        padding: 0;
      }
      .is-active {
        border-bottom-color: #F9FAFC;
      }
    }
    .el-tree{
      padding-top: 20px;
      .el-tree-node{
        margin-bottom: 5px;
        .el-tree-node__children{
          padding-top: 7px;
        }
      }
    }
    .detail {
      box-shadow: 1px 1px 2px 1px rgba(204, 204, 204, 0.5);
      margin-left: 10px;
      padding: 20px;
    }
    .el-form-item{
      .el-form-item__content{
        .el-select{
          width: 30%;
        }
      }
    }
    .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .full_button {
    width:100%;
  }
}
</style>
