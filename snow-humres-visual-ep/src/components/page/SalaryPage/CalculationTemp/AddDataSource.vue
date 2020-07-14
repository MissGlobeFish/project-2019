<template>
<!-- 添加数据源模块 -->
    <div>
      <el-form ref="creatForm" :model="creatForm" label-width="100px" :rules="rules">
        <el-form-item label="模板名称:" prop="title">
          <el-input v-model="creatForm.title" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板编号:" prop="templateCode">
          <el-input v-model="creatForm.templateCode" placeholder="请输入模板编号"></el-input>
        </el-form-item>
        <el-form-item label="选择数据源:">
          <span>(默认第一个模板为主数据源)</span>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="12">
            <el-col :span="4" v-for="(item,index) in creatForm.DataBaseVal" :key="index" class="card-item">
              <el-card shadow="always" body-style="text-align: center;">{{item.title}}         
                <el-button type="danger" icon="el-icon-delete" circle class="card-circle-del" @click="handelDelTag(item)"></el-button>
              </el-card>
            </el-col>
            <el-col :span="2">
              <el-card shadow="always" body-style="text-align: center;padding: 0" class="card-item" style="width: 100px">
                <div  @click="addDataBase()" class="card-add">+</div></el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button class="el-icon-caret-left" @click="cancleCreat()">取消创建</el-button>
          <el-button @click="handleNext('creatForm')">下一步</el-button>
        </el-form-item>
      </el-form>    
      <el-dialog title="选择数据源" :visible.sync="dataBaseDialog" width="30%">
          <el-table :data="tableDataBase" style="width: 100%" 
           
            :row-key="getRowKeys"
            ref="multipleTable" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"
             :reserve-selection= "true"
            ></el-table-column>
            <el-table-column label="模板编码" :width="200" prop="templateCode"></el-table-column>
            <el-table-column label="模板名称" :width="200" prop="title"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="1"
              :page-sizes="[10]"  :page-size="role.pageSize" layout="total, sizes,prev, pager, next" :total="role.total">
            </el-pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dataBaseDialog = false">取 消</el-button>
            <el-button type="primary" @click="handleComfirm()">确 定</el-button>
          </span>
      </el-dialog>  
    </div>
</template>

<script>

export default {
    components: {

    },
    props: {
    },
    data() {
      return {
        creatForm: {title: '', templateCode: '',DataBaseVal: []}, // 模板名称
        dataBaseDialog: false, // 数据源弹框开关
        tableDataBase: [], // 数据源可供选择数据
        rules: {
          title: [
            {required: true, message: '请输入模板名称',trigger: 'blur'}
          ],
          templateCode: [
            {required: true, message: '请输入模板编号',trigger: 'blur'}
          ]
        },
        role:{
          pageNum: 1, //当前页条数
          pageSize:10, //
          total: 0
        },
        currentSelection: [],
        getRowKeys(row) {
          return row.id
        },
        selectedData: []
      };
    },
    computed: {

    },
    mounted () {
      this.creatForm = this.$store.state.creatForm;
      this.handleTemp();
    },
    watch: {
    },
    methods: {
      handleCurrentChange(val) { // 当前页
        this.role.pageNum = val;
        this.handleTemp()
        //TODU刷新列表
      },
      // 获取所有输入模板
      handleTemp() {
        this.loading = true;
        this.getAjax(`${SALARY_URL}/template`,this.role).then((res)=>{
          this.loading = false;
          this.tableDataBase = res.data.list;
          this.role.total = Number(res.data.total)
        }).catch(error => {
          this.loading = false;
          console.log(error)
        })
      },
      addDataBase() {// 添加数据源
        this.dataBaseDialog = true;
        this.$nextTick(()=> {
          this.$refs.multipleTable.clearSelection();
          let rows = this.creatForm.DataBaseVal;
          if(rows) {
            if(this.$refs.multipleTable) {
              rows.forEach(row => {
                this.tableDataBase.forEach((item)=>{
                  if(row.id == item.id) {
                    this.$refs.multipleTable.toggleRowSelection(item,true);
                  }
                })
              });
            }
          }
        })
      },
      handleSelectionChange(val) {
        this.currentSelection= val;
      },
      handleComfirm() { //  添加数据源弹框确定
        this.creatForm.DataBaseVal = this.currentSelection;
        this.dataBaseDialog = false;
      },
      handelDelTag(item) { // 删除当前选中数据源
        this.creatForm.DataBaseVal.splice(this.creatForm.DataBaseVal.indexOf(item),1)
      },
      handleNext(formName) {//下一步
        this.$refs[formName].validate((valid)=> {
          if (valid) {
              let data = this.creatForm.DataBaseVal;
              if (data == null || data == '' || data == undefined) {
                this._log_warn('请选择数据源');
                return
              }
              data.forEach((item, index)=>{
                // return
                this.getAjax(`${SALARY_URL}/template/${item.id}`).then(res => {
                  this.creatForm.DataBaseVal[index].columns= JSON.parse(res.data.tableStructure).main_table.columns;
                  this.creatForm.DataBaseVal[index].mainTableName = res.data.mainTableName;
                  // console.log(this.creatForm)
                  if(index ==  data.length-1) {
                    this.$confirm(" 是否确认选择", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(()=>{
                      let arr = this.creatForm.DataBaseVal;
                      arr.forEach((item, subindex)=>{
                        item.columns.forEach((colItem,colIndex) => {
                          colItem.mainTableName = item.mainTableName;
                          colItem.mainTitle = item.title;
                        })
                      })
                      this.$store.commit('newCreatForm', this.creatForm);
                      this.$emit('handleNext',1);
                    }).catch(()=>{})
                  }
                })
              })
          } else {
            return false
          }
        })
      },
      cancleCreat() {
        this.$store.commit('newCreatForm', {})
        this.$store.commit('newIsShow', false)
      },
      // 接收父组件的值
      parentProp(val) {
        let source_table = JSON.parse(val.tableStructure).main_table.source_table;
        this.creatForm = {title: val.title,templateCode: val.templateCode,DataBaseVal: source_table}
      }
    },
};
</script>

<style scoped lang="less">
.card-item {
  position: relative;
  margin: 5px;
  width: 250px;
  &:hover {
    .card-circle-del  {
      display: block;
    }
  }
  .card-circle-del {
    display: none;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 20px;
    margin: auto;
  }
}
.card-add {
  font-size: 30px;
  color: rgb(132, 132, 132);
  background: transparent;
  border: none;
  padding: 20px;
}
</style>