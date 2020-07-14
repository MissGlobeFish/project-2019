<template>
  <div class="sub-box-shadow">
    <Bread :data="breadData"/>
    <div>
      <div class="input-wrap">
        <el-input v-on:keyup.native.13="handleInit" placeholder="请输入姓名" clearable class="handle-input" v-model="empName"></el-input>
      </div>
      <div class="head-wrap handle-box ">
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click.native.prevent="resetSearch()" class="el-icon-refresh">重置</el-button>
          <el-button type="primary" size="small" @click="handleInit()" >查询</el-button>
          <el-button type="primary" @click="addTemp()" size="small">新建模板</el-button>
        </div>
      </div>
      <el-dialog 
        :visible.sync="dialogVisible" width="50%" :before-close="handleClose" v-loading="loading">
        <div>
          <el-form ref="formRef" :model="tempAddForm" label-width="90px" :rules="rules">
            <el-table :data="tempAddForm.tableFormData" style="width: 100%" max-height="400" border>
              <el-table-column label="考核人" :width="200">
                <template slot-scope="scope">
                  <el-form-item  label-width="0" :prop="`tableFormData.${scope.$index}.assessName`" :rules="rules.assessName">
                    <el-autocomplete v-model="scope.row.assessName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"  @select="handleSelect($event,scope.$index,tempAddForm.tableFormData)"></el-autocomplete>
                    <!-- <el-input v-model="scope.row.assessName" placeholder="请输入名称" clearable class="handle-input"></el-input> -->
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="被考核人" :width="200">
                <template slot-scope="scope">
                  <el-form-item  label-width="0" :prop="`tableFormData.${scope.$index}.beingAssessedName`" :rules="rules.beingAssessedName">
                     <el-autocomplete v-model="scope.row.beingAssessedName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelectBeing($event,scope.$index,tempAddForm.tableFormData)"></el-autocomplete>
                    <!-- <el-input v-model="scope.row.beingAssessedName" placeholder="请输入名称" clearable class="handle-input"></el-input> -->
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button type="danger"  @click.native.prevent="delRow(scope.$index,tempAddForm.tableFormData)" size="small" class="el-icon-delete">删除</el-button>             
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="small" class="el-icon-circle-plus-outline" style="marginTop: 20px;" @click="tempAddRow">添加</el-button>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEvent('formRef')">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="tableData"  style="width: 100%" border>
        <el-table-column prop="assessName"  label="考核人"></el-table-column>
        <el-table-column prop="beingAssessedName"  label="被考核人"></el-table-column>
        <el-table-column prop="score"  label="比例"></el-table-column>
        <el-table-column prop="createdTime"  label="创建时间"></el-table-column>
        <el-table-column label="操作"  fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small">编辑</el-button> -->
            <el-button type="danger" size="small" @click="handelDel(scope.$index,tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination  @current-change="handleCurrentChange" :current-page="1"
          :page-sizes="[10]"  :page-size="obj.pageSize" layout="total, sizes,prev, pager, next" :total="obj.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Bread from '../../../common/Bread.vue'
import axios from 'axios';
export default {
  components: {
    Bread
  },
  props: {

  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      empName: '',
      humresInfo: [], // 人员信息库
      breadData:['薪资绩效','薪资绩效'],
      tempAddForm: { // 验证需要放在一个对象里面
        tableFormData: [
          {
            assess: '',
            beingAssessed: '',
            assessName: '',
            beingAssessedName: ''
          }
        ],
      },
      tableData: [],
      rules: {
        assessName:[{required: true, message: '请输入', trigger: 'blur'},{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: '请填写符合中文字符' }],
        beingAssessedName: [{required: true, message: '请输入', trigger: 'blur'},{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: '请填写符合中文字符' }],
      },
      obj: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  computed: {

  },
  mounted () {
    this.handleInit()
  },
  watch: {

  },
  methods: {
    handleCurrentChange(val) {
      this.obj.pageNum = val;
      this.handleInit();
      //TODU刷新列表
    },


    querySearchAsync(queryString, cb) {
      if(!queryString) { // 方便校验
        cb([])
        return
      }
      var humresInfo = this.humresInfo;
      axios.post(`${SALARY_HUMRES_URL}/ext/emp/query`,{
        "isPage":false,
        "empName" : queryString
      }).then((data)=>{
        humresInfo = data.data.datas.list;
        humresInfo.forEach((item,index)=>{
          item.value = item.empName;
        })
        this.humresInfo = humresInfo;
        var results = queryString ? humresInfo.filter(this.createStateFilter(queryString)) : humresInfo;
        cb(results);
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item,index,data) { // 远程搜索--考核人
      data[index].assess = item.empCode;
      data[index].assessName = item.value;
    },
    handleSelectBeing(item,index,data) { // 远程搜索--被考核人
      data[index].beingAssessed = item.empCode;
      data[index].beingAssessedName = item.value;
    },

    resetSearch() { // 重置
    this.empName = '';
    this.obj.searchKey = '';
      this.handleInit();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    addTemp() {
      this.dialogVisible = true;
      this.$nextTick(()=>{
        
        let newValue =  {assessName: '',beingAssessedName: ''};
        this.tempAddForm.tableFormData = [newValue];

        this.$refs['formRef'].clearValidate();
        this.$refs['formRef'].resetFields();
      })
    },
    tempAddRow() { // 添加行数
      console.log(this.tempAddForm.tableFormData.length)
      if(this.tempAddForm.tableFormData.length >= 10) {
        this._log_info('一次不能批量超过10个')
        return
      }
      let newValue =  {assessName: '',beingAssessedName: ''};
      this.tempAddForm.tableFormData.push(newValue)
    },
    delRow(index,data) { // 删除行数
      if (index < 1) {return }
      this.tempAddForm.tableFormData.splice(index, 1)
    },
    handleInit(){
      this.loading = true;
      if (this.empName) {
        this.obj.searchKey = this.empName
      } else {
        this.obj.searchKey = ''
      }
      this.getAjax(`${SALARY_URL}/performance`,this.obj).then((res)=>{
        this.loading = false;
        if (res.code == 1) {
          this.tableData = res.data.list;
          this.obj.total = Number(res.data.total);
        }
      }).catch((error)=>{
        this.loading = false;
      })
    },
    handelDel(index,data) { // 删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',this.del_obj ).then(() => {
        this.delData(index, data);
      }).catch(() => {
        this._log_info('已取消操作')     
      });
    },
    delData(index, data) {
      this.deleteAjax(`${SALARY_URL}/performance/${data[index].id}`).then(res => {
        if (res.code == 1) {
          this._log_success('删除成功');
          this.handleInit();
        }
      }).catch(error=> {console.log(error)})
    },
    confirmEvent(formName) {
      this.$refs[formName].validate((valid) =>{
        if(valid) {
          this.postAjax(`${SALARY_URL}/performance`,this.tempAddForm.tableFormData).then((res)=>{
            console.log(res,'res')
            if (res.code != 1) {
              this._log_error('添加失败')
            } else {
              this.dialogVisible = false;
              this.handleInit();
              this._log_success('添加成功')
            }
          })
        } else {
          return
        }
      })
    }
  },
};
</script>

<style  scoped lang="less">
  .el-table tr .el-form-item{
    margin-bottom: 0;
  }
  .input-wrap {
    width: 200px;
    float: left;
  }
  .btn-wrap {
    text-align: right;
    margin-bottom: 20px;
  }
</style>