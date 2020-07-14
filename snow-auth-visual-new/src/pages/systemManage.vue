<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-17 11:25:15
 * @LastEditTime: 2019-09-20 10:05:01
 -->
<template>
<div v-loading="loading">
    <div class="content-head">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-location-outline breadcrumb-icon"></i>系统管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-head-right">
        <el-button type="primary" size="small" plain icon="el-icon-edit-outline" @click="handleCreat">创建</el-button>
      </div>
    </div>
    <div class="content-body">
      <el-dialog :title="redirectModel.roleTitle" :visible.sync="dialogFormVisible"  :before-close="handleClose">
        <el-form :model="redirectModel" :rules="roleRules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="系统名称" prop="sysDesc">
            <el-input v-model="redirectModel.sysDesc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="owner">
            <el-input v-model="redirectModel.owner" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="回调地址" prop="systemPath">
            <el-input v-model="redirectModel.systemPath" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否使用默认回调规则" prop="flag">
            <el-radio-group v-model="redirectModel.flag">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否全员可见" prop="isAll">
            <el-radio-group v-model="redirectModel.isAll">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel()">取 消</el-button>
          <el-button type="primary" @click="handleCreatrole('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-table header-row-class-name="success-row" :data="manageData" style="width: 100%" height="479" border>
        <el-table-column type="index" prop="number" label="序号" width="150"></el-table-column>
        <el-table-column prop="sysDesc" label="系统名称"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.lastCreateTime | lastCreateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isValid" @change="handleSwitch(scope.$index, manageData)" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope.$index, manageData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="handleDelete(scope.$index, manageData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      dialogFormVisible: false,
      roleTitle: "",
      redirectModel: {
        owner: ""
      },
      // redirectModel: {},
      userVer :{},
      manageData: [],
      systemInfo:{
        isPage: true, //是否分页
        total: null, //总条数
        pages: null, //总页数
        curPage: 1, //当前页
        pageSize: 10, //当前页条数
      },
      roleRules: {
        sysDesc: [
          { required: true, message: '请输入系统名称再确认提交！', trigger: 'blur' },
          { max: 40, message: '输入长度不可超过50个字符', trigger: 'blur' },
          { pattern: /^[^ ]+$/, message: '系统名称不能包含空格' }
        ],
        owner: [
          { required: true, message: '请输入负责人再确认提交！', trigger: 'blur' },
          { pattern:/^(?:[\u4e00-\u9fa5·]{2,4})$/, message: '请输入2-4位中文名' }
        ],
        systemPath: [
          {required: true, message: '请输入回调地址再确认提交！', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){
      this.userVer =  JSON.parse(localStorage.getItem("userVer"));
    };
    this.findRoleInfos();
  },
  filters: {
    lastCreateTime(val) {
      return `${val[0]}/${val[1]}/${val[2]}`
    }
  },
  methods: {
    //查询系统信息
    findRoleInfos() {
      this.loading = true;
      let url = global.AUTH_URL + "/auth/menu/findSysMains";
      this.$http.post(url, this.systemInfo, this.option).then((data)=> {
            this.manageData = data.list;
            this.total = data.total;

            // for (var i = 0; i < this.manageData.length; i++) {
            //   let t = this.manageData[i].lastCreateTime;
            //   this.manageData[i].number = i < 9 ? "0"+(i+1) : (i+1);
            //   this.manageData[i].lastCreateTime = t[0] + '/' + t[1] + '/' + t[2];
            // }
        })
        .catch(error=>{
          this.$msg._log_warn("系统列表请求失败，请刷新重试！")
        })
        .finally(()=>{this.loading = false})
    },   

    //点击确定创建系统
    handleCreatrole(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let sym = this.redirectModel.symbol;
            let user = this.userVer.empName;
            this.redirectModel.creator = user;
            this.redirectModel.updater = user; 

            if (sym == "creat") {

              this.addRoleMainInfo(this.redirectModel);

            } else if (sym == "edit") {

              this.updateRoleInfo(this.redirectModel);

            }
            this.dialogFormVisible = false;
          } else {
            return false;
          }
      });
    },

    //创建系统信息
    addRoleMainInfo(object) {
      let url = global.AUTH_URL + "/auth/menu/addSysMain";
      let redirectModel_url = global.AUTH_URL + "/auth/redirect/addRedirect";
      this.$http.post(url, object).then((data)=> {
        let obj = {
          systemCode: data.sysCode,
          systemDesc: object.sysDesc,
          owner: object.owner,
          systemPath: object.systemPath
        }
        this.$http.post(redirectModel_url, obj).then((data)=> {
            this.$msg._log_success("创建系统成功！")
            this.findRoleInfos();
          })
          .catch(error=>{
            this.$msg._log_warn("新增系统失败，请刷新重试！")
          })
      })
      .catch(error=>{
        this.$msg._log_warn("新增系统失败，请刷新重试！")
      })
    },

    //修改系统信息
    updateRoleInfo(object) {
      let url = global.AUTH_URL + "/auth/menu/updateSysMain";
      let _redirect_url =  global.AUTH_URL + "/auth/redirect/updateRedirect";
      this.$http.post(url, object).then((data)=> {
  
      this.redirectModel.systemCode = object.sysCode;
      this.$http.put(_redirect_url, this.redirectModel).then((data)=> {
          this.$msg._log_success(object.roleTitle + "成功！")
          this.findRoleInfos();
        });
        // this.findRoleInfos();
        })
        .catch(error=>{
          this.$msg._log_warn(object.roleTitle + "失败，请刷新重试！")
        })
    },

    // 删除系统信息
    deleteRoleInfo(val) {
      let url = global.AUTH_URL + "/auth/menu/deleteSysMain/" + val;
      this.$http.delete(url, self.option).then((data)=> {
            this.$msg._log_success("删除系统成功！")
            this.findRoleInfos();
        })
        .catch(error=>{
          this.$msg._log_warn(error.msg || "删除系统失败，请刷新重试！")
        })
    },
    
    //切换信息系统状态按钮
    handleSwitch(index, rows){
      let user = this.userVer.empName; 
      this.redirectModel = {
        sysDesc: rows[index].sysDesc,
        sysCode: rows[index].sysCode,
        isValid: rows[index].isValid,
        creator: user,
        updater: user 
      };
      if (rows[index].isValid == '0') {
        this.redirectModel.roleTitle = '禁用 [ ' + this.redirectModel.sysDesc + ' ] ';
      }else{
        this.redirectModel.roleTitle = '启用 [ ' + this.redirectModel.sysDesc + ' ] ';
      }
      this.updateRoleInfo(this.redirectModel);
    },

    // 点击创建
    handleCreat() {
      // this.redirectModel = {};
      this.dialogFormVisible = true;
      this.redirectModel = {
        roleTitle: "创建系统",
        // number: "",
        sysDesc: "",
        createTime: null,
        isValid: "1",
        flag: 1,
        symbol: "creat",
        isAll:1
      };
    },

    // 点击修改
    handleEdit(index, rows) {
      this.redirectModel = {};
      let _url = global.AUTH_URL + "/auth/redirect/findRedirect/" + rows[index].sysCode;
      //编辑系统信息
      this.dialogFormVisible = true;
      console.log(rows[index])
      this.redirectModel = {
        index: index,
        roleTitle: "编辑系统",
        sysDesc: rows[index].sysDesc,
        sysCode: rows[index].sysCode,
        isValid: rows[index].isValid,
        symbol: "edit",
        isAll:1
      };
      console.log("111111",this.redirectModel)
      this.$http.get(_url).then((data)=> {
          console.log(data);
          this.$set(this.redirectModel, 'owner', data.owner)
          this.$set(this.redirectModel, 'systemPath', data.systemPath)
          this.$set(this.redirectModel, 'flag', data.flag)
          this.$set(this.redirectModel, 'isAll', data.isAll)
        })
        .catch((error)=>{
          this.$msg._log_warn(error.msg)
          console.log("加载失败")
        })
    },
    
    // 点击删除
    handleDelete(index, rows) {
      this.$confirm('确认删除角色名称 ['+ rows[index].sysDesc +'] ？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRoleInfo(rows[index].sysCode);
      }).catch(() => {
        this.$msg._log_info("已取消删除")
      });
    },
    
    // 点击取消
    handleCancel() {
      this.dialogFormVisible = false;
      this.$refs['ruleForm'].resetFields();
    },

    handleSizeChange(val) {
      //切换显示列表行数
      this.systemInfo.pageSize = val;
      this.findRoleInfos();
    },
    handleCurrentChange(val){
      //列表分页
      this.systemInfo.curPage = val;
      this.findRoleInfos();
    },
    
    // 遮罩层关闭之前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs['ruleForm'].resetFields();
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>
<style lang="scss">
</style>
