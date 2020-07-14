<template>
  <div class="blackAndWhite">
    <!-- 头部 -->
    <div class="addPanel">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增名单</el-button>
    </div>

    <!-- 新增名单 dialog -->
    <el-dialog class="addPanelDialog" :title="panelTitle" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="panelForm" ref="panelForm" label-width="200px" class="demo-ruleForm" size="small">
        
        <!-- 车牌号 -->
        <el-form-item class="carNoClass1" label="车牌号：" prop="cityConstruction" :show-message="true" :rules="{ required: true, message: '请选择城市简称', trigger: 'blur' }">
          <el-select v-model="panelForm.cityConstruction" placeholder="简称" filterable :filter-method="filter"> 
            <el-option v-for="item in cityConstructions" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="carNoClass2" prop="carNo" :show-message="true" :rules="[{ required: true, message: '车牌号不能为空', trigger: 'blur' }, { 
            validator: (rule, value, callback)=>{validateCarNo(rule, value, callback)}, 
            trigger: ['blur', 'change'] 
        }]">
          <el-input v-model="panelForm.carNo" autocomplete="off" placeholder="请输入车牌号" maxlength="8" minlength="7"></el-input>
        </el-form-item>
        <!-- 车牌号 -->

        <el-form-item label="时长：" prop="date" :rules="{ required: true, message: '地址不能为空', trigger: 'blur' }">
          <el-input v-model="panelForm.date" autocomplete="off" placeholder="请输入地址"></el-input>
        </el-form-item>

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('panelForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('panelForm')">保 存</el-button>
      </span>

    </el-dialog>

    <div style="display:flex;justify-content: space-between;">
      <div class="white-box">
        <p class="box-header">白名单</p>
        <!-- 表格 -->
        <el-table
          v-loading="whiteLoading"
          :data="whiteData"
          max-height="700"
          element-loading-text="Loading"
          size="mini"
          fit
          highlight-current-row
          :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
        >
          <el-table-column type="index" fixed width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="车牌号" width="300" align="center"></el-table-column>
          <el-table-column prop="address" label="时长" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="70" align="center">
            <template slot-scope="scope">

              <el-dropdown size="mini" trigger="click">
                <el-button size="mini" type="primary">
                  <i class="el-icon-setting"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="padding:10px;">
                  <el-button type="primary" size="mini" class="el-icon-edit" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
                  <el-button type="danger" size="mini" class="el-icon-delete" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
                </el-dropdown-menu>
              </el-dropdown>

            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="black-box">
        <p class="box-header">黑名单</p>
        <!-- 表格 -->
        <el-table
          v-loading="blackLoading"
          :data="blackData"
          max-height="700"
          element-loading-text="Loading"
          size="mini"
          fit
          highlight-current-row
          :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
        >
          <el-table-column type="index" fixed width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="车牌号" width="300" align="center"></el-table-column>
          <el-table-column prop="address" label="时长" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="70" align="center">
            <template slot-scope="scope">

              <el-dropdown size="mini" trigger="click">
                <el-button size="mini" type="primary">
                  <i class="el-icon-setting"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="padding:10px;">
                  <el-button type="primary" size="mini" class="el-icon-edit" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
                  <el-button type="danger" size="mini" class="el-icon-delete" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
                </el-dropdown-menu>
              </el-dropdown>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

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
import {  } from "@/api/blackAndWhite";

export default {
  data() {
    return {
      /* 弹出框 */
      dialogVisible: false, //  新建/编辑弹框显示
      panelTitle: '',
      panelForm: { // 新建/编辑初始数据
        cityConstruction: '',//城市简称
        carNo: '', //车牌号
        date: '',//时长
      },
      cityConstruction: '',//城市简称
      cityConstructions: [{//城市简称
          label: '京',
          szm:'jing'
        },{
          label: '津',
          szm:'jin'
        },{
          label: '沪',
          szm:'hu'
        },{
          label: '渝',
          szm:'yu'
        },{
          label: '冀',
          szm:'ji'
        },{
          label: '晋',
          szm:'jin'
        },{
          label: '辽',
          szm:'liao'
        },{
          label: '吉',
          szm:'ji'
        },{
          label: '黑',
          szm:'hei'
        },{
          label: '苏',
          szm:'su'
        },{
          label: '浙',
          szm:'zhe'
        },{
          label: '皖',
          szm:'guan'
        },{
          label: '闽',
          szm:'min'
        },{
          label: '赣',
          szm:'gan'
        },{
          label: '鲁',
          szm:'lu'
        },{
          label: '豫',
          szm:'yu'
        },{
          label: '鄂',
          szm:'e'
        },{
          label: '湘',
          szm:'xiang'
        },{
          label: '粤',
          szm:'yue'
        },{
          label: '琼',
          szm:'qiong'
        },{
          label: '川',
          szm:'chuan'
        },{
          label: '贵',
          szm:'gui'
        },{
          label: '云',
          szm:'yun'
        },{
          label: '陕',
          szm:'shan'
        },{
          label: '甘',
          szm:'gan'
        },{
          label: '宁',
          szm:'ning'
        },{
          label: '青',
          szm:'qing'
        },{
          label: '藏',
          szm:'zang'
        },{
          label: '桂',
          szm:'gui'
        },{
          label: '蒙',
          szm:'meng'
        },{
          label: '新',
          szm:'xin'
      }],

      /* 列表 */
      whiteData: [],
      blackData: [],

      /* 列表加载动画 */
      whiteLoading: false,
      blackLoading: false,

      /* 分页 */
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    
  },
  mounted () {
    // 保留数据源
    this.copy = Object.assign(this.cityConstructions)
  },
  methods: {  
    //新增
    handleAdd(){
      this.panelForm = {
        cityConstruction: '',//城市简称
        carNo: '', //车牌号
        date: '',//时长
      }
      this.dialogVisible = true;
      this.facilityStatus = 'add';
      this.panelTitle = '新增名单';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.panelForm) {
            this.$refs.panelForm.resetFields();
        }
        this.dialogVisible = true;
        this.facilityStatus = 'edit';
        this.panelTitle = '编辑名单';
        getItemParking(rows[index].id).then(response => {
          this.panelForm = response.data;
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            deleteParking(rows[index].id).then(response => {
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
            if (this.facilityStatus == 'add') {
              addParking(this.panelForm).then(response => {
                this.dialogVisible = false;
                this.fetchData();
              })
            }else if(this.facilityStatus == 'edit'){
              editParking(this.panelForm).then(response => {
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
    //校验车牌号
    validateCarNo(rule, value, callback){
      this.parkingForm.carNo = (value).toUpperCase();
      var text = /^(([A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      if (!text.test(this.parkingForm.carNo)) {
          callback(new Error("请输入正确的车牌号"))
      } else {
          callback();
      }
    },
    //城市简称的模糊查询
    filter(v) {
      // 对绑定数据赋值
      this.cityConstructions = this.copy.filter((item) => {
        // 如果直接包含输入值直接返回true
        const val = v.toLowerCase()
        if (item.label.indexOf(val) !== -1) return true
        if (item.szm.substring(0, 1).indexOf(val) !== -1) return true
        if (item.szm.indexOf(val) !== -1) return true
      })
    },
  }
};
</script>
<style lang="scss">
.blackAndWhite{
  margin: 20px;
  
  .white-box,.black-box{
    display: inline-block;
    width: 49.5%;
    .box-header{
      text-align: center;
      border: 1px dashed rgb(189, 189, 189);
      border-radius: 10px;
      padding: 6px 0;
    }
  }
}
.addPanel{
  overflow: hidden;
  .el-button{
    float: right;
  }
}
.addPanelDialog{
  .el-dialog{
    .el-input{
      width: 70%;
    }
    .el-select{
      width: 70%;
      .el-input{
        width: 100%;
      }
    }
  }
}
/* 大屏幕 ：大于等于1200px*/
@media (min-width: 1400px) {
  .carNoClass1{
    display: inline-block;
    width: 35%;
    .el-select{
      width: 100% !important;
      .el-input{
        width: auto !important;
      }
    } 
  }
  .carNoClass2{
    display: inline-block;
    width: 41%;
    .el-form-item__content{
      margin: 0 !important;
      .el-input{
        width: 100% !important;
      }
    }
  }
}
/* 平板电脑和小屏电脑之间的分辨率 */
@media (max-width: 1500px){
  .carNoClass1{
    display: inline-block;
    width: 50%;
    .el-select{
      width: 100% !important;
      .el-input{
        width: auto !important;
      }
    } 
  }
  .carNoClass2{
    display: inline-block;
    width: 29%;
    .el-form-item__content{
      margin: 0 !important;
      .el-input{
        width: 100% !important;
      }
    }
  }
}
</style>
