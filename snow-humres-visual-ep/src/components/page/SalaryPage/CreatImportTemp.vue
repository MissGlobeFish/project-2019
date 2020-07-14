<template>
  <div>
    <el-dialog title="输入模板" :visible.sync="dialogVisible" :before-close="handleClose" width="50%" v-loading="loading">
      <el-form ref="tempAddForm" :model="tempAddForm" label-width="90px" :rules="rules">
        <el-form-item style="text-align:right"><el-button type="primary" size="small" @click="choiceHasTemp()" v-if="dialogStatus=='add'">复制已有模板</el-button></el-form-item>
        <div class="tempAddForm">
          <el-form-item label="模板编码:" prop="templateCode">
            <el-input v-model="tempAddForm.templateCode"></el-input>
          </el-form-item>
          <el-form-item label="模板名称:" prop="title">
            <el-input v-model="tempAddForm.title"></el-input>
          </el-form-item>
          <el-form-item label="是否监控:" prop="edit">
            <el-select v-model="tempAddForm.edit" placeholder="请选择" class="handle-input">
              <el-option v-for="item in tempMonitorOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-table :data="tempAddForm.columns" style="width: 100%" border>
            <el-table-column label="字段名称" :width="200">
              <template slot-scope="scope">
                <el-form-item :prop="`columns.${scope.$index}.title`" label-width="0" :rules="rules.columnsTitle">
                  <el-input v-model="scope.row.title" placeholder="请输入字段名称" clearable class="handle-input"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="字段类型" :width="200">
              <template slot-scope="scope">
                <el-form-item :prop="`columns.${scope.$index}.data_type`" label-width="0" :rules="rules.columnsDatatype">
                  <el-select v-model="scope.row.data_type" placeholder="请选择" class="handle-input">
                    <el-option v-for="item in tempAddOptions" :key="item.data_type" :label="item.value" :value="item.data_type"></el-option>
                  </el-select>   
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger"  @click.native.prevent="delRow(scope.$index,tempAddForm.columns.tempAddTable)" size="small" class="el-icon-delete">删除</el-button>             
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" class="el-icon-circle-plus-outline" style="marginTop: 20px;" @click="tempAddRow">添加</el-button>
      </el-form >
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddTemp('tempAddForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="已有模板" :visible.sync="hasTempDialog" width="30%">
      <el-table :data="tableData" style="width: 100%" border @row-dblclick="handleCurrentRow">
        <el-table-column label="模板编码" :width="200" prop="templateCode"></el-table-column>
        <el-table-column label="模板名称" :width="200" prop="title"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 字段类型枚举
 */
let dataType = {
  string: 'STRING',
  number: 'NUMBER',
  datetime: 'DATETIME'
}
export default {
  components: {

  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: ()=> {
        return false
      }
    },
    tableData: {
      type: Array,
      default: ()=> {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      hasTempDialog: false,
      dialogStatus: 'add',
      tempAddForm: {// 新增模板表单 title:模板名字 edit:是否监控锁定
        id: '',
        title: '',
        edit: '',
        templateCode: '',
        columns: [ // 字段名称表格
          {
            title: '', data_type: ''
          }
        ],
      }, 
      tempMonitorOption: [// 是否监控选项 label看到的值，value实际选择的值
        {label: '是',value: true},
        {label: '否',value: false}
      ],
      tempAddOptions: [
        {data_type: dataType.string,value: '文本'},
        {data_type: dataType.number,value: '数值'},
        {data_type: dataType.datetime,value: '日期'}
      ],
      rules: {
        templateCode:[{required: true, message: '请输入模板名称', trigger: 'blur'}],
        title: [{required: true, message: '请输入模板名称', trigger: 'blur'}],
        edit: [{required: true, message: '请选择是否监控', trigger: 'blur'}],
        columnsTitle: [{required: true, message: '', trigger: 'blur'}],
        columnsDatatype: [{required: true, message: '', trigger: 'blur'}]
      }
    };
  },
  filters: {
  },
  computed: {
    
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    // 新增模板打开前
    openAddTemp() { 
      this.$nextTick(()=>{
        this.dialogStatus = 'add';
        this.$refs['tempAddForm'].resetFields();
        this.tempAddForm.columns = [{title: '', data_type: ''}];
      })
    },
    closeDialog() { 
      this.$confirm('确定取消?',this.del_obj ).then(()=>{
        this.$parent.dialogVisible = false
      }).catch(()=>{})
    },
    handleClose() {// 弹框关闭前
      this.$confirm('确定取消,数据将不会被保存',this.del_obj).then(()=>{
        this.$parent.dialogVisible = false
      })
    },
    tempAddRow() { // 添加行数
      let newValue =  {title: '',data_type: ''};
      this.tempAddForm.columns.push(newValue)
    },
    delRow(index,data) { // 删除行数
      if (index < 1) {return }
      this.tempAddForm.columns.splice(index, 1)
    },

    /**
     * submitAddTemp 新增模板
     */
    submitAddTemp(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODU进行提交数据请求
          this.submitTemp();
          // alert('submit!');
        } else {
          // TODU进行验证提醒
          return false;
        }
      });
    },

    /**
     * submitTemp 新增/修改模板请求
     * @param {String} title - 模板名称.
     * @param {Boolean} edit  - 模板是否可编辑.
     * @param {String} templateCode - 模板编码
     * @param {String} tableStructure - 模板表结构（需要转义过后的main_tabel）
     */
    submitTemp() {
      let tempAddForm = this.tempAddForm;
      let tableStr = {main_table: {columns: tempAddForm.columns}};
      let tableStructure = JSON.stringify(tableStr);
      let obj = {
        id: tempAddForm.id,
        title: tempAddForm.title,
        edit: tempAddForm.edit,
        // creator: JSON.parse(localStorage.getItem("userVer")).userName,
        templateCode: tempAddForm.templateCode,
        tableStructure
      }

      let currenAjax = this.dialogStatus == 'add' ? this.postAjax(`${SALARY_URL}/template`,obj) : this.putAjax(`${SALARY_URL}/template`,obj)
      currenAjax.then((res)=>{
        // TODU是否确定提交 关闭弹窗 刷新列表
        this.$parent.dialogVisible = false;
        this.$parent.handleInit();
        this._log_success('操作成功')
      }).catch((error)=>{})
    },

    /**
     * editTemp -接收修改输入模板
     */
    editTemp(data) {
      this.$nextTick(()=>{
        this.$refs['tempAddForm'].clearValidate();
        this.loading = true;
        this.dialogStatus = 'edit';
        this.findTableStructure(data)
      })
    },
    choiceHasTemp() { //复制已有模板
      this.hasTempDialog = true;
    },
    findTableStructure(data) { // 通过id查找表结构
      this.getAjax(`${SALARY_URL}/template/${data.id}`).then(res=> {
        console.log(res)
        let resData = res.data;
        this.loading = false;
        let tempAddForm = this.tempAddForm;
        let columns = JSON.parse(resData.tableStructure).main_table.columns;
        tempAddForm = {
          id: resData.id,
          title: resData.title,
          templateCode: resData.templateCode,
          edit: resData.edit,
          columns: columns
        }
        this.tempAddForm = tempAddForm;
        console.log(this.tempAddForm)
      }).catch(error => {
        this.loading = false;
        console.log(error)
      })
    },
    handleCurrentRow(data) { // 选中表格某一行
      this.$nextTick(()=>{
        this.findTableStructure(data)
        this.hasTempDialog = false
      })
    },
  },
};
</script>

<style scoped lang="less">
.el-table tr .el-form-item{
  margin-bottom: 0;
}
</style>