<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addParking">
      <el-button type="primary" size="small" plain @click="handleAdd" icon="el-icon-circle-plus-outline">新增优惠用户</el-button>
    </div>

    <!-- 新增优惠用户 dialog -->
    <el-dialog class="addParkingDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="parkingForm" ref="parkingForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="停车场：" prop="parkName" :rules="{ required: true, message: '请选择停车场', trigger: 'change' }">
          <el-select v-model="parkingForm.parkName" @change="parkNameChange" filterable value-key="id" placeholder="请选择停车场">
            <el-option v-for="item in parkNames" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <!-- 车牌号 -->
        <el-form-item class="carNoClass3" label="车牌号：" prop="cityConstruction" :show-message="true" :rules="{ required: true, message: '城市简称', trigger: 'change' }">
          <el-select v-model="parkingForm.cityConstruction" placeholder="简称" filterable :filter-method="filter"> 
            <el-option v-for="item in cityConstructions" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="carNoClass4" prop="carNo" :show-message="true" :rules="[{ required: true, message: '车牌号不能为空', trigger: 'blur' }, { 
            validator: (rule, value, callback)=>{validateCarNo(rule, value, callback)}, trigger: ['blur','change'] }]">
          <el-input v-model="parkingForm.carNo" autocomplete="off" placeholder="请输入车牌号" maxlength="8" minlength="7"></el-input>
        </el-form-item>
        <el-button class="carNoClass5" size="small" type="primary" plain @click="handleIsInpark">校验是否入场</el-button>
        <el-button v-if="isInpark" type="success" size="small" icon="el-icon-check" circle></el-button>
        <el-button v-if="isOutpark" type="info" size="small" icon="el-icon-close" circle></el-button>
        <!-- 车牌号 -->

        <el-form-item label="免费时长：" prop="freeTime" :rules="{ required: true, message: '请选择免费时长', trigger: 'change' }">
          <el-select v-model="parkingForm.freeTime" autocomplete="off" placeholder="请选择免费时长">
            <el-option v-for="item in freeTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
       <!--  <el-form-item label="免费类型：" prop="freeType" :rules="{ required: true, message: '请选择免费类型', trigger: 'change' }">
          <el-select v-model="parkingForm.freeType" @change='changeCarType' value-key="code" autocomplete="off" placeholder="请选择免费类型">
            <el-option v-for="item in freeTypes" :key="item.code" :label="item.codeName" :value="item"></el-option>
          </el-select>
        </el-form-item> -->

      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('parkingForm')">取 消</el-button>
        <el-button v-if="isInpark" size="small" type="primary" @click="handleDialogSave('parkingForm')">保 存</el-button>
      </span>

    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      max-height="700"
      element-loading-text="Loading"
      size="mini"
      fit
      highlight-current-row
      :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
      >
      <el-table-column type="index" fixed width="50" align="center"></el-table-column>
      <el-table-column prop="carNo" label="车牌号" width="300" align="center"></el-table-column>
      <el-table-column prop="freeTime" label="免费时（min）" width="200" align="center"></el-table-column>
      <!-- <el-table-column prop="freeType" label="免费类型" width="200" align="center"></el-table-column> -->
      <el-table-column prop="createdTime" label="创建时间" width="300" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 'OUT'" type="info">离场</el-tag>
            <el-tag v-else type="success">入场</el-tag>
          </template>
      </el-table-column> 
      <el-table-column fixed="right" label="操作" width="70" align="center">
        <template slot-scope="scope">

          <el-dropdown size="mini" trigger="click">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu v-if="scope.row.state != 'OUT'" slot="dropdown" style="padding:10px;">
              <el-button type="primary" size="mini" plain class="el-icon-edit" @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
              <el-button type="danger" size="mini" plain class="el-icon-delete" @click="handleDelete(scope.$index, tableData)">删除</el-button>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
    </el-table>

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
import { getList, addCarWash, modifyCarWash, deleteCarWash, getParking, itemCarWash, getIsInpark } from '@/api/carWash'
import { constants } from 'fs';

export default {
  data() {
    return {
      /* 列表 */
      tableData: [],
      titles: '',

      parkingStatus:'',//判断当前是新增还是编辑

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
      freeTimes: [{//免费时长
        value: 30,
        label: '30分钟',
        },{
        value: 60,
        label: '60分钟',
        },{
        value: 120,
        label: '120分钟',
      }],
      parkingForm: { // 新建/编辑初始数据
        id: '', //ID
        parkId: '', //车场ID
        parkName: '', //车场名称
        userId: '0', //用户ID
        recordId: '', //停车记录ID
        cityConstruction: '',//城市简称
        carNo: '', //车牌号
        //state: '', //当前停车状态
        freeTime: '', //免费时长
        freeType: 'CAR_WASH', //免费类型
        createdTime: '' //创建时间
      },

      //判断是否在场
      isInpark: false,
      isOutpark: false,

      parkNames: [],
      freeTypes: [],

      /* 列表加载动画 */
      listLoading: true,
      dialogVisible: false, //  新建/编辑弹框显示

      /* 分页 */
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created() {
    this.fetchData();
    this.handleParkName();
  },
  mounted () {
    // 保留数据源
    this.copy = Object.assign(this.cityConstructions)
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.listLoading = false;
        this.total = parseInt(response.data.total);
        this.tableData = response.data.list;
      })
    },
    //查询停车场
    handleParkName(){
      getParking().then(response => {
        this.parkNames = response.data;
      })
    },
    //选择停车场
    parkNameChange(val){
      this.parkingForm.parkId = val.id;
      this.parkingForm.parkName = val.name;
    },
    //选择免费类型
    changeCarType(val){

    },
    //判断是否在场
    handleIsInpark(){
      let isInpark = {
        parkId: this.parkingForm.parkId,
        carNo: this.parkingForm.cityConstruction + this.parkingForm.carNo,
        freeType: this.parkingForm.freeType,
      }
      if (isInpark.parkId && isInpark.carNo) {
        getIsInpark(isInpark).then(response => {
          let datas = response.data;
          if (datas.id) {
            this.isInpark = true;
            this.isOutpark = false;
            this.parkingForm.recordId = datas.id;
          }else{
            this.isInpark = false;
            this.isOutpark = true;
            this.$message({
              type: 'warning',
              message: datas
            });
          }
        })
      }else{
        this.$message({
          type: 'warning',
          message: '请选择停车场和车牌号后进行校验！'
        }); 
      }
    },
    //新增
    handleAdd(){
      this.parkingForm = {
        id: '', //ID
        parkId: '', //车场ID
        parkName: '', //车场名称
        userId: '0', //用户ID
        recordId: '', //停车记录ID
        cityConstruction: '',//城市简称
        carNo: '', //车牌号
        //state: '', //当前停车状态
        freeTime: '', //免费时长
        freeType: 'CAR_WASH', //免费类型
        createdTime: '' //创建时间
      };
      this.dialogVisible = true;
      this.isInpark = false;
      this.isOutpark = false;
      this.facilityStatus = 'add';
      this.titles = '新增优惠用户';
    },
    //编辑
    handleEdit(index, rows){
        if (this.$refs.parkingForm) {
            this.$refs.parkingForm.resetFields();
        }
        this.dialogVisible = true;
        this.isInpark = false;
        this.isOutpark = false;
        this.facilityStatus = 'edit';
        this.titles = '编辑优惠用户';
        itemCarWash(rows[index].id).then(response => {
          this.parkingForm = response.data;
          this.parkingForm.cityConstruction = this.parkingForm.carNo.substring(0,1);
          this.parkingForm.carNo = this.parkingForm.carNo.substring(1,this.parkingForm.carNo.length);
        })
    },
    //删除
    handleDelete(index, rows){
        this.$confirm('此操作将永久删除该条记录, 是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteCarWash(rows[index].id).then(response => {
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
          this.parkingForm.carNo = this.parkingForm.cityConstruction + this.parkingForm.carNo;
          if (this.facilityStatus == 'add') {
            addCarWash(this.parkingForm).then(response => {
              this.dialogVisible = false;
              this.fetchData();
            })
          }else if(this.facilityStatus == 'edit'){
            modifyCarWash(this.parkingForm).then(response => {
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
          callback(new Error("输入正确的车牌"))
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
}
</script>
<style lang="scss">
  .addParking{
    overflow: hidden;
    margin-bottom: 10px;
    .el-button{
      float: right;
    }
  }
  .addParkingDialog{
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
    }
  }
  /* 大屏幕 ：大于等于1200px*/
  @media (min-width: 1400px) {
    .carNoClass3{
      display: inline-block;
      width: 35%;
      .el-select{
        width: 100% !important;
        .el-input{
          width: auto !important;
        }
      } 
    }
    .carNoClass4{
      display: inline-block;
      width: 28%;
      .el-form-item__content{
        margin: 0 !important;
        .el-input{
          width: 100% !important;
        }
      }
    }
    .carNoClass5{
      display: inline-block;
      width: 13%;
      .el-form-item__content{
        margin: 0 !important;
      }
    }
  }
  /* 平板电脑和小屏电脑之间的分辨率 */
  @media (max-width: 1500px){
    .el-dialog{
      .el-form{
        label{
          width: 110px !important;
        }
        .el-form-item__content{
          margin-left: 110px !important;
          .el-select{
            width: 100%;
            .el-input{
              width: 100%;
            }
          }
        }
        .carNoClass3{
          display: inline-block;
          width: 50%;
          .el-select{
            width: 100% !important;
            .el-input{
              width: auto !important;
            }
          } 
        }
        .carNoClass4{
          display: inline-block;
          width: 49%;
          .el-form-item__content{
            margin: 0 !important;
            .el-input{
              width: 100% !important;
            }
          }
        }
        .carNoClass5{
          width: 40%;
          display: inline-block;
          margin-left: 110px;
          margin-bottom: 18px;
          .el-form-item__content{
            margin: 0 !important;
          }
        }
      }
    }
  }
  /* 横向放置的手机和竖向放置的平板之间的分辨率 */
  @media (max-width: 900px) {
    .el-dialog{
      width: 70% !important;
      .el-dialog__body {
          padding: 30px 20px !important;
      }
      .el-form{
        label{
          width: 110px !important;
        }
        .el-form-item__content{
          margin-left: 110px !important;
          .el-select{
            width: 100%;
            .el-input{
              width: 100%;
            }
          }
        }
        .carNoClass3{
          display: inline-block;
          width: 46%;
          .el-select{
            width: 100% !important;
            .el-input{
              width: auto !important;
            }
          } 
        }
        .carNoClass4{
          display: inline-block;
          width: 53%;
          .el-form-item__content{
            margin: 0 !important;
            .el-input{
              width: 100% !important;
            }
          }
        }
        .carNoClass5{
          display: inline-block;
          width: 40%;
          margin-left: 110px !important;
          .el-form-item__content{
            margin: 0 !important;
          }
        }
      }
    }
  }
  /* 竖向放置的手机分辨率 */
  @media (max-width: 500px) {
    .el-dialog{
      width: 90% !important;
      .el-dialog__body {
          padding: 30px 15px !important;
      }
      .el-form{
        label{
          width: 100px !important;
          display: block;
        }
        .el-form-item__content{
          margin-left: 100px !important;
          .el-select{
            width: 100%;
            .el-input{
              width: 100%;
            }
          }
        }
        .carNoClass3{
          display: inline-block;
          width: 60%;
          .el-select{
            width: 100% !important;
            .el-input{
              width: auto !important;
            }
          } 
        }
        .carNoClass4{
          display: inline-block;
          width: 38%;
          .el-form-item__content{
            margin: 0 !important;
            .el-input{
              width: 100% !important;
            }
          }
        }
        .carNoClass5{
          display: inline-block;
          width: 40%;
          margin-left: 100px !important;
          .el-form-item__content{
            margin: 0 !important;
          }
        }
      }
    }
  }
</style>
