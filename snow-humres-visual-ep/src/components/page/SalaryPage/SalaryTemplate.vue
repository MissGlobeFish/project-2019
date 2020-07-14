<template>
    <div class="sub-page">
      <Bread :data="breadData"/>
      <div v-if="!isSHow">
        <div class="head-wrap handle-box ">
          <div class="btn-wrap">
            <el-button type="primary" size="small" @click.native.prevent="resetSearch()" class="el-icon-refresh">重置</el-button>
            <el-button type="primary" size="small" @click="handleSearch()">查询</el-button>
            <el-button type="primary" @click="addTemp()" size="small">新建模板</el-button>
          </div>
          <div class="input-wrap">
            <el-input v-model="searchObj.title" placeholder="请输入模版名称" clearable class="handle-input"></el-input>
            <el-date-picker v-model="searchObj.creatTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" class="data-pick"></el-date-picker>
            <el-date-picker v-model="searchObj.importTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="导入开始日期" end-placeholder="导入结束日期" class="data-pick"></el-date-picker>
            <el-select v-model="searchObj.tempSelectStatus" placeholder="模板状态" class="handle-input">
              <el-option v-for="item in tempOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabel-content" v-loading="loading">
          <el-table :data="tableData" style="width: 100%" border :cell-style="cellStyle">
            <el-table-column prop="templateCode" label="模板编号" :width="tableWidth" fixed="left"></el-table-column>
            <el-table-column prop="title" label="模板名称"  :width="tableWidth"></el-table-column>
            <el-table-column prop="createdTime" label="建立时间"  :width="150"></el-table-column>
            <el-table-column prop="tempImportTime" label="导入时间"  :width="150"></el-table-column>
            <!-- <el-table-column prop="edit" label="状态"  :width="150" >
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isEnable" @change="handleSwitch(scope.$index, tableData)" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
              </template>
            </el-table-column> -->
            <el-table-column prop="edit" label="是否监控"  :width="150" >
              <template slot-scope="scope">
                <p>{{scope.row.edit ? '是' : '否'}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作"  fixed="right">
              <template slot-scope="scope">
                <el-popover placement="bottom" width="150px" trigger="hover">
                  <el-button type="primary"  @click.native.prevent="exportTemp(scope.$index,tableData)" size="small">模板导出</el-button>
                  <el-button type="success"  @click.native.prevent="creatTable(scope.$index,tableData)" size="small" :disabled="tableData[scope.$index].hasMainTable">生成实体表</el-button>
                  <!-- <el-button type="primary"  @click.native.prevent="importData(scope.$index,tableData)" size="small">数据导入</el-button> -->
                  <el-upload style="display: inline-flex" :action="uploadAction" accept=".xlsx" :before-upload="beforeUpload" :on-error = "UploadError" :on-success = "UploadSuccess" :show-file-list="false" class="upload-demo">
                    <el-button size="small" type="primary" :disabled="!tableData[scope.$index].hasMainTable">数据导入</el-button>
                  </el-upload>
                  <el-button type="primary"  @click.native.prevent="exportData(scope.$index,tableData)" size="small" :disabled="!tableData[scope.$index].hasMainTable">数据导出</el-button>
                  <el-button type="primary"  @click.native.prevent="handleEdit(scope.$index,tableData)" size="small" :disabled="tableData[scope.$index].hasMainTable">编辑</el-button>
                  <el-button type="danger"  @click.native.prevent="handelDel(scope.$index,tableData)" size="small">删除</el-button>
                  <el-button type="primary" slot="reference" size="small">操作按钮</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination 
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :page-sizes="[10]" 
              :page-size="10" 
              layout="total, sizes, prev, pager, next" 
              :total="role.total">
            </el-pagination>
          </div>
        </div>
        <div class="dialog-wrap">
          <CreatImportTemp :dialogVisible = dialogVisible  :tableData = tableData ref="CreatImportTemp"/>
        </div>
      </div>
      <!--数据导出 -->
      <ExportTempData v-if="isSHow" v-on:backTemp="backTemp" :currTemp="currTemp" />
    </div>
</template>

<script>
import Bread from '../../common/Bread.vue'
import ExportTempData from './ExportTempData.vue'
import CreatImportTemp from './CreatImportTemp.vue'
export default {
  components: {
    Bread,ExportTempData,CreatImportTemp
  },
  props: {

  },
  data() {
    return {
      isSHow: false,//是否显示数据导出
      loading: false,
      currTemp: '',
      uploadAction: global.SALARY_URL + "/file/upload-template-data",
      hasTempDialog: false,// 复制模板弹框
      dialogVisible: false,// 弹出框
      breadData:['薪酬管理','输入模版'],
      searchObj: {
        title: '', // 模板名称
        creatTime: '', // 模板建立时间
        importTime: '', // 数据导入时间
        tempSelectStatus: '', // 模板状态是否被监控---和子组件公用的
      },
      tempOptions: [ // 模板状态选项
        {value: '锁定'},
        {value: '正常'}
      ],
      tableData: [],
      tableWidth: 250,
      // total: 0,
      // pageSize: 10,
      role:{
        pageNum: 1, // 当前页
        pageSize: 10,//，每页分页条数
        // isPage: true, //是否分页
        // total: null, //总条数
        // pages: null, //总页数
        // curPage: 1, //当前页
        // pageSize:10 //当前页条数
      },
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
    backTemp(data) { // 返回按钮（接受子组件）
      this.isSHow = data;
      this.$set(this.breadData,1,'输入模板');
    },
    cellStyle(row, column, rowIndex, columnIndex) { //指定表格样式
      if (row.row.edit == true && row.columnIndex == 4) {
        return 'background:#DAF0CC'
      }
    },
    beforeUpload(file) {
      // 文件上传前
      let suffix = file.name;
      if(suffix.indexOf('.xlsx') == -1){
        this._log_warn(`上传文件格式不正确，只能上传.xlsx后缀的文件！`)
        return false;
      }
      return true;
    },
    UploadError(err, file, fileList) {
      //文件上传失败
      console.log('失败')
    },
    UploadSuccess(response, file) {
      //文件上传成功后
      console.log('成功',response, file)
      this._log_success('上传成功');
      this.handleInit()
    },
    handleSizeChange(val) {//切换显示列表行数切换显示列表行数
      // this.role.curPage = 1;
      // this.role.pageSize = val;
      // this.handleInit();
    },
    handleCurrentChange(val){//列表分页
      // this.role.curPage = val;
      this.role.pageNum = val
      this.handleInit();
    },
    addTemp() { // 新增模板
      this.dialogVisible = true;
      this.$refs.CreatImportTemp.openAddTemp()
    },
    // handleSwitch(index,data) {// 控制锁定和解锁
    // console.log(index)
    // },
    // lock(index,data) { // 锁定
    //   console.log()
    // },
    handleSearch() { // 查询
      let searchVal;
      searchVal = {
        searchKey: this.searchObj.title,
        queryBeginDate:  this.searchObj.creatTime ? this.searchObj.creatTime[0] : '',
        queryEndDate: this.searchObj.creatTime ? this.searchObj.creatTime[1] : '',
        importBeginDate: this.searchObj.importTime ? this.searchObj.importTime[0] : '',
        importEndDate: this.searchObj.importTime ? this.searchObj.importTime[1] : ''
      }

      this.handleInit(searchVal)
    },
    resetSearch() { //重置查询
      this.searchObj ={};
      this.handleInit();
    },
    handleInit(searchVal) { // 获取列表
      this.loading = true;
      let obj;
      if(searchVal) {
        obj = Object.assign(searchVal, this.role);
      } else {
        obj= this.role
      }
      this.getAjax(`${SALARY_URL}/template`,obj).then((res)=>{
        this.loading = false;
        this.tableData = res.data.list;
        this.role.total = Number(res.data.total);
        // this.role.pages = res.pages
        console.log(this.role)
      }).catch(error => {
        this.loading = false;
        console.log(error)
      })
    },
    exportTemp(index,data) { // 模板导出
      this.getAjax(`${SALARY_URL}/file/download-template`,{templateId:data[index].id}).then(res=> {
        if (res.code == 1) {
          this._log_info(res.data)
        }
      })
    },
    creatTable(index, data) { // 生成实体表
      this.postAjax(`${SALARY_URL}/template/create-table/?templateId=${data[index].id}`).then(res=>{
        if(res != undefined) {
          // TODU 刷新列表
          this.handleInit()
        }
      }).catch(error=>{})
    },
    // importData(index, data) { // 数据导入
    // // POST /file/upload-template-data
    
    // },
    exportData(index,data) { // 数据导出
      this.isSHow = true;
      this.currTemp = data[index];
      this.$set(this.breadData,1,'数据导出');
    },
    handleEdit(index,data) { //编辑
      this.dialogVisible = true;
      this.$refs.CreatImportTemp.editTemp(data[index]);// 调用子组件方法
    },
    handelDel(index, data) { // 删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',this.del_obj ).then(() => {
        this.delData(index, data);
      }).catch(() => {
        this._log_info('已取消操作')     
      });
    },
    delData(index, data) {
      this.deleteAjax(`${SALARY_URL}/template`,{templateId: data[index].id}).then(res => {
        this._log_success('删除成功');
        this.handleInit();
      }).catch(error=> {console.log(error)})
    }
  }
};
</script>

<style lang="less">
.sub-page {
    user-select: none;
    background: #fff;
    box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
    padding: 20px;
    .el-upload--text {
      display: inline-flex;
      width: auto;
      height: auto;
      border: none;
      border-radius: 4px;
      margin: auto 10px;
    }
    .isMonitor {
      background-color: #992211
    }
    .btn-wrap {
      text-align: right;
      margin-bottom: 20px;
    }
    .input-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .data-pick {
        width: 25%;
      }
    }
    .tabel-content {
      margin-top: 50px;
    }
    .tempAddForm {
      display: flex;
      justify-content:space-between;
    }
}
</style>
