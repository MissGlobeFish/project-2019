<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 15:01:06
 * @LastEditTime: 2019-09-19 16:43:53
 -->
<template>
  <div>
    <div class="content-head">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-location-outline breadcrumb-icon"></i>角色与权限</el-breadcrumb-item>
        <el-breadcrumb-item>创建角色</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-head-right">
        <el-button type="primary" size="small" plain icon="el-icon-edit-outline" @click="handleCreat">创建</el-button>
      </div>
    </div>
    <div class="content-body" v-loading="loading">
      <el-table header-row-class-name="success-row" :data="manageData" style="width: 100%" height="479" border>
        <el-table-column prop="number" label="序号" width="150" fixed></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.roleStatus" @change="handleSwitch(scope.$index, manageData)" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope.$index, manageData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, manageData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <!-- 创建/编辑 -->
    <el-dialog :title="creatRole.roleTitle" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="creatRole" :rules="roleRules" ref="creatRole" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="creatRole.roleName" auto-complete="off"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle('creatRole')">取 消</el-button> 
        <el-button type="primary" @click="handleCreatrole('creatRole')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "../config/config.js";
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      loadInit: false,
      total: 0,
      pageSize: 10,
      dialogFormVisible: false,
      creatRole: {},
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      userVer :{},
      manageData: [],
      role:{
        isPage: true, //是否分页
        total: null, //总条数
        pages: null, //总页数
        curPage: 1, //当前页
        pageSize:10, //当前页条数
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称再确认提交', trigger: 'blur' },
          { max: 40, message: '输入长度不可超过50个字符', trigger: 'blur' },
          { pattern: /^[^ ]+$/, message: '角色名称不能包含空格' }
        ]
      },
      loading: false
    };
  },
  computed: {

  },
  mounted () {
    if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){ 
      this.userVer =  JSON.parse(localStorage.getItem("userVer"));   
    };
    this.findRoleInfos()
  },
  watch: {

  },
  methods: {
    handleSizeChange(val) {
      //切换显示列表行数切换显示列表行数
      console.log(val)
      this.role.curPage = 1;
      this.role.pageSize = val;
      this.findRoleInfos();
    },
    handleCurrentChange(val){
      //列表分页
      this.role.curPage = val;
      this.findRoleInfos();
    },
    /**
     * 获取角色列表
     */
    findRoleInfos() {
      this.loading = true
      let url = global.AUTH_URL + config.auth.findRoleInfos;
      this.$http.post(url, this.role).then(res=>{
        this.manageData = res.list;
        this.total = res.total;
        for (var i = 0; i < this.manageData.length; i++) {
          let t = this.manageData[i].createTime;
          this.manageData[i].number = i < 9 ? "0"+(i+1) : (i+1);
          this.manageData[i].createTime = t[0] + '/' + t[1] + '/' + t[2];
        }
      }).finally(()=>{
        this.loading = false
      });
    },
    /**
     * 创建角色
     * 
     */
    handleCreat() {
      this.dialogFormVisible = true;
      this.creatRole = {
        roleTitle: "创建角色",
        number: "",
        roleName: "",
        createTime: null,
        roleStatus: "1",
        symbol: "creat"
      };
      this.$nextTick(()=>{
        this.$refs['creatRole'].resetFields();
      })
    },

    //  确定添加/修改
    handleCreatrole(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let sym = this.creatRole.symbol;
            let user = this.userVer.empName;
            this.creatRole.creator = user;
            this.creatRole.updater = user;
            if (sym == "creat") {
              this.addRoleMainInfo(this.creatRole);
            } else if (sym == "edit") {
              this.updateRoleInfo(this.creatRole);
            } 
            this.dialogFormVisible = false;
          } else {
            return false;
          }
      });
    },
    /**
     * 创建角色信息
     */
    addRoleMainInfo(object) {
      let url = global.AUTH_URL + "/auth/role/addRoleMainInfo";
      this.$http.post(url, object).then(
        (data)=> {
          // if (data.flag) {
            this.$msg._log_success("创建角色成功");
            this.findRoleInfos();
            
          // } else {
          //   this.$msg._log_warn(data.msg);
          // }
        },
        (error)=> {
          this.$msg._log_warn( "新增角色失败，请刷新重试！");
        }
      );
    },
    /**
     * 修改角色信息
     */
    updateRoleInfo(object) {
      let self = this;
      let url = global.AUTH_URL + "/auth/role/updateRoleInfo";
      this.$http.post(url, object).then(
        (data)=> {
          // if (data.flag) {
            this.$msg._log_success(object.roleTitle + "成功！")
            this.findRoleInfos();
          // } else {
          //   this.$msg._log_warn(data.msg)
          // }
        },
        (error)=> {
          this.$msg._log_warn(object.roleTitle + "失败，请刷新重试！")
        }
      );
    },
    /**
     * 编辑
     */
    handleEdit(index, rows) {
      this.dialogFormVisible = true;
      this.creatRole = {
        index: index,
        roleTitle: "编辑角色",
        roleName: rows[index].roleName,
        roleCode: rows[index].roleCode,
        createTime: null,
        roleStatus: "1",
        symbol: "edit"
      };
    },
    /**
     * 删除
     */
    deleteRow(index, rows) {
      this.$confirm('确认删除角色名称 ['+ rows[index].roleName +'] ？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRoleInfo(rows[index].roleCode);
      }).catch(() => {
        this.$msg._log_info("已取消");          
      });
    },
    deleteRoleInfo(val) {
      //删除角色信息
      let url = global.AUTH_URL + "/auth/role/deleteRoleInfo/" + val;
      this.$http.delete(url).then(
          (data)=> {
            console.log(data)
          // if (data.flag) {
            this.$msg._log_success("删除角色成功！");
            this.findRoleInfos();
          // } else {
          //   this.$msg._log_warn(data.msg)
          // }
        }
      )
      .catch(error=>{
          console.log(error)
          this.$msg._log_warn("删除角色失败，请刷新重试！")
      });
    },
    /**
     * 取消
     */
    handleCancle(formName) {
      this.dialogFormVisible= false;
       this.$refs[formName].resetFields();
    },
    /**
     * 切换状态
     */
    handleSwitch(index, rows) {
      let user = this.userVer.empName;
      this.creatRole = {
        roleName: rows[index].roleName,
        roleCode: rows[index].roleCode,
        roleStatus: rows[index].roleStatus,
        creator: user,
        updater: user,
        createTime: null
      };
      if (rows[index].roleStatus == '0') {
        this.creatRole.roleTitle = '禁用 [ ' + this.creatRole.roleName + ' ] ';
      }else{
        this.creatRole.roleTitle = '启用 [ ' + this.creatRole.roleName + ' ] ';
      }
      this.updateRoleInfo(this.creatRole);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
};
</script>

<style scoped lang="scss">
.el-table .success-row {
  background: #f6faff;
}
.breadcrumb-icon {
  margin-right: 5px;
}
</style>
