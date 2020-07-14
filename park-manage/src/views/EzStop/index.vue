<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="addParking">
      <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-ruleForm" size="mini" label-position="left">
          <el-form-item label="车牌号" prop="searchKey">
            <el-input v-model="searchForm.searchKey" autocomplete="off" placeholder="请输入车牌号" @keyup.enter.native="handleSearch('searchForm')"></el-input>
          </el-form-item>
          <el-form-item label="进出场类型" prop="queryType">
            <el-select v-model="searchForm.queryType" placeholder="请选择进出场类型" @keyup.enter.native="handleSearch('searchForm')">
              <el-option v-for="item in queryTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="停车场ID" prop="parkId">
            <el-input v-model="searchForm.parkId" autocomplete="off" placeholder="请输入停车场ID" @keyup.enter.native="handleSearch('searchForm')"></el-input>
          </el-form-item> -->
          <el-form-item label="查询时间" prop="timeList">
            <el-date-picker 
              v-model="searchForm.timeList" 
              type="daterange" 
              range-separator="-" 
              start-placeholder="开始日期" 
              end-placeholder="结束日期" 
              @keyup.enter.native="handleSearch('searchForm')">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="handleSearch('searchForm')" icon="el-icon-search" style="margin-left:10px;">查询</el-button>
            <el-button @click="resetForm('searchForm')" icon="el-icon-remove-outline">重置</el-button>
            <el-button type="primary" plain @click="handleAdd" icon="el-icon-circle-plus-outline" style="float:right;">新增停车记录</el-button>
          </el-form-item>
        </el-form>
    </div>

    <!-- 入场停车记录 dialog -->
    <el-dialog class="addParkingDialog" :title="titles" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

      <!-- dialog-body -->
      <el-form :model="parkingForm" ref="parkingForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="停车场：" prop="parkName" :rules="{ required: true, message: '请选择停车场', trigger: 'change' }">
          <el-select :disabled="parkStatus == 'edit'" v-model="parkingForm.parkName" @change="parkNameChange" filterable value-key="id" placeholder="请选择停车场">
            <el-option v-for="item in parkNames" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <!-- 车牌号 -->
        <el-form-item class="carNoClass1" label="车牌号：" prop="cityConstruction" :show-message="true" :rules="{ required: true, message: '请选择城市简称', trigger: 'change' }">
          <el-select v-model="parkingForm.cityConstruction" placeholder="简称" filterable :filter-method="filter"> 
            <el-option v-for="item in cityConstructions" :key="item.label" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="carNoClass2" prop="carNo" :show-message="true" :rules="[{ required: true, message: '车牌号不能为空', trigger: 'blur' }, { 
            validator: (rule, value, callback)=>{validateCarNo(rule, value, callback)}, trigger: ['blur','change'] }]">
          <el-input v-model="parkingForm.carNo" autocomplete="off" placeholder="请输入车牌号" maxlength="8" minlength="7"></el-input>
        </el-form-item>
        <!-- 车牌号 -->
        
        <el-form-item label="车辆类型：" prop="carTypeStr" :rules="{ required: true, message: '请选择车辆类型', trigger: 'change' }">
          <el-select v-model="parkingForm.carTypeStr" @change='changeCarType' value-key="code" autocomplete="off" placeholder="请选择车辆类型">
            <el-option v-for="item in carTypes" :key="item.code" :label="item.codeName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆品牌：" prop="brandStr">
          <el-select v-model="parkingForm.brandStr" @change='changeCarBrand' autocomplete="off" placeholder="请选择车辆品牌">
            <el-option v-for="item in carBrands" :key="item.code" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牌照类型：" prop="plateTypeStr" :rules="{ required: true, message: '请选择牌照类型', trigger: 'change' }">
          <el-select v-model="parkingForm.plateTypeStr" @change='changePlateType' autocomplete="off" placeholder="请选择牌照类型">
            <el-option v-for="item in plateTypes" :key="item.code" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车身颜色：" prop="carColorStr">
          <el-select v-model="parkingForm.carColorStr" @change='changeCarColor' autocomplete="off" placeholder="请选择车身颜色">
            <el-option v-for="item in carColors" :key="item.code" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入场时间：" prop="inTime" :rules="{ required: true, message: '请选择入场时间', trigger: 'change' }">
          <el-date-picker v-model="parkingForm.inTime" type="datetime" placeholder="请选择入场时间" :default-value='new Date()'></el-date-picker>
        </el-form-item>
        <el-form-item label="入场来源：" prop="inDeviceIp" :rules="{ required: true, message: '请输入入场信息来源', trigger: 'blur' }">
          <el-input disabled v-model="parkingForm.inDeviceIp" autocomplete="off" placeholder="请输入入场信息来源设备的IPV4地址" maxlength="15"></el-input>
        </el-form-item>
      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('parkingForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogSave('parkingForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 离场停车记录 dialog -->
    <el-dialog class="addParkingDialog" title="编辑离场记录" :append-to-body="true" :visible.sync="outDialogVisible" width="50%" :before-close="handleOutClose">

      <!-- dialog-body -->
      <el-form :model="parkingForm" ref="parkingForm" label-width="200px" class="demo-ruleForm" size="small">

        <el-form-item label="入场图片：" prop="inImagePanorama">
          <el-image style="width: 100px; height: 100px" :src="payForm.inImagePanorama"></el-image>
          <el-image style="width: 100px; height: 100px" :src="payForm.inImageSmall"></el-image>
        </el-form-item>
        <el-form-item label="车牌号：" prop="carNo">
          <el-input disabled v-model="payForm.carNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入场时间：" prop="inTime">
          <el-date-picker disabled v-model="payForm.inTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="支付金额：" prop="shouldPay">
          <span style="font-size:20px;">{{payForm.shouldPay ? payForm.shouldPay : '--'}} 元</span>
        </el-form-item>
        <el-form-item label="离场时间：" prop="outTime" :rules="{ required: true, message: '请选择离场时间', trigger: 'change' }">
          <el-date-picker v-model="parkingForm.outTime" type="datetime" :picker-options="pickerOptions" placeholder="请选择离场时间" :default-value='new Date()'></el-date-picker>
        </el-form-item>
        <el-form-item label="离场来源：" prop="outDeviceIp" :rules="{ required: true, message: '请输入离场信息来源', trigger: 'blur' }">
          <el-input disabled v-model="parkingForm.outDeviceIp" autocomplete="off" placeholder="请输入离场信息来源设备的IPV4地址" maxlength="15"></el-input>
        </el-form-item>
      </el-form>

      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleOutCancel('parkingForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogOutSave('parkingForm')">保 存</el-button>
      </span>

    </el-dialog>

    <!-- 表格 -->
    <el-table
        class="parkingTable"
        v-loading="listLoading"
        :data="tableData"
        element-loading-text="Loading"
        size="mini"
        max-height="700"
        fit
        highlight-current-row
        :header-cell-style="{background:'#F9F9F9',color:'#323232',}"
      >
      <el-table-column type="index" fixed width="50" align="center"></el-table-column>
      <el-table-column prop="carNo" label="车牌号" width="100" align="center"></el-table-column>
      <el-table-column prop="inImagePanorama" label="入场图像（车辆）" width="120" align="center">
        <template slot-scope="scope">
          <el-image 
            style="width: 80px; height: 40px"
            :src="scope.row.inImagePanorama"  :preview-src-list="[scope.row.inImagePanorama]">
          </el-image>
        </template>
      </el-table-column>  
      <el-table-column prop="inImageSmall" label="入场图像（车牌）" width="120" align="center">
        <template slot-scope="scope">
          <el-image 
            style="width: 80px; height: 40px"
            :src="scope.row.inImageSmall"  :preview-src-list="[scope.row.inImageSmall]">
          </el-image>
        </template>
      </el-table-column> 
      <el-table-column prop="totalPay" label="停车费用" width="100" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 'OUT'" type="info">已离场</el-tag>
            <el-tag v-else type="success">已入场</el-tag>
          </template>
      </el-table-column>  
      <el-table-column prop="carTypeStr" label="车辆类型" width="90" align="center"></el-table-column> 
      <el-table-column prop="brandStr" label="车辆品牌" width="90" align="center"></el-table-column> 
      <el-table-column prop="plateTypeStr" label="牌照类型" width="90" align="center"></el-table-column> 
      <el-table-column prop="carColorStr" label="车身颜色" width="90" align="center"></el-table-column> 
      <el-table-column prop="parkName" label="停车场名称" width="200" align="center"></el-table-column> 
      <el-table-column prop="inTime" label="入场时间" width="200" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.inTime" class="el-icon-time" />
          <span>{{ scope.row.inTime }}</span>
        </template>
      </el-table-column> 
      <el-table-column prop="inDeviceIp" label="入场来源" width="120" align="center"></el-table-column> 
      <el-table-column prop="outImagePanorama" label="离场图像（车辆）" width="120" align="center">
        <template slot-scope="scope">
          <el-image 
            style="width: 80px; height: 40px"
            :src="scope.row.outImagePanorama"  :preview-src-list="[scope.row.outImagePanorama]">
          </el-image>
        </template>
      </el-table-column>  
      <el-table-column prop="outImageSmall" label="离场图像（车牌）" width="120" align="center">
        <template slot-scope="scope">
          <el-image 
            style="width: 80px; height: 40px"
            :src="scope.row.outImageSmall"  :preview-src-list="[scope.row.outImageSmall]">
          </el-image>
        </template>
      </el-table-column>   
      <el-table-column prop="outTime" label="离场时间" width="200" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.outTime" class="el-icon-time" />
          <span>{{ scope.row.outTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="outDeviceIp" label="离场来源" width="120" align="center"></el-table-column> 
      <el-table-column fixed="right" label="操作" width="70" align="center">
        <template slot-scope="scope">

          <el-dropdown size="mini" trigger="click">
            <el-button size="mini" type="primary">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu v-if="scope.row.state != 'OUT'" slot="dropdown" style="padding:10px;">
              <el-button type="primary" size="mini" plain @click.native.prevent="handleEdit(scope.$index, tableData)">入场</el-button>
              <el-button type="primary" size="mini" plain @click.native.prevent="handleOutEdit(scope.$index, tableData)">离场</el-button>
              <!-- <el-button type="danger" size="mini" plain class="el-icon-delete" @click="handleDelete(scope.$index, tableData)">删除</el-button> -->
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
import { getList, addParking, modifyParking, deleteParking, enumeration, itemParking, getParking, getPay, getCarType } from '@/api/EzStop'

export default {
  data() {
    return {
      username: localStorage.getItem("username"),
      /* 列表 */
      tableData: [],
      titles: '',

      cityConstruction: '',
      parkStatus:'add',//判断当前是新增还是编辑

      queryTypes: [{
          value: 'IN',
          label: '入场'
        }, {
          value: 'OUT',
          label: '离场'
      }],
      carTypes: [],

      searchForm: {// 查询初始数据
        searchKey: '',
        queryType: '',
        timeList: '',
        parkId: '',
      },
      parkingForm: { // 新建/编辑初始数据
        id: '',
        state: '',
        cityConstruction: '',//城市简称
        carNo: '',
        carType: '',//车辆类型
        carTypeStr: '',
        carBrand: '',//车辆品牌
        brandStr: '',
        plateType: '',//牌照类型
        plateTypeStr: '',
        carColor: '',//车身颜色
        carColorStr: '',
        inTime: '',
        inImagePanorama: '',
        inImageSmall: '',
        inDeviceIp: '192.168.1.122',
        outTime: '',
        outImagePanorama: '',
        outImageSmall: '',
        outDeviceIp: '192.168.1.126',
        totalPay: '',
        parkId: '',
        parkName: '',
      },

      payForm:{
        inImagePanorama: '',
        inImageSmall: '',
        shouldPay: null, 
        carNo: '',
        inTime: '',
      },

      //枚举初始数组
      parkNames: [],//停车场
      carTypes: [],//车辆类型
      carBrands: [{
          code: 'TOYOTA',
          name: '丰田',
        },{
          code: 'VOLKSWAGEN',
          name: '大众',
        },{
          code: 'HONDA',
          name: '本田',
        },{
          code: 'PEUGEOT',
          name: '标致',
        },{
          code: 'HYUNDAI',
          name: '现代',
        },{
          code: 'BUICK',
          name: '别克',
        },{
          code: 'AUDI',
          name: '奥迪',
        },{
          code: 'KIA',
          name: '起亚',
        },{
          code: 'JEEP',
          name: '吉普',
        },{
          code: 'FORD',
          name: '福特',
        },{
          code: 'BENZ',
          name: '奔驰',
        },{
          code: 'BMW',
          name: '宝马',
        },{
          code: 'MAZDA',
          name: '马自达',
        },{
          code: 'SUZUKI',
          name: '铃木',
        },{
          code: 'CITROEN',
          name: '雪铁龙',
        },{
          code: 'NISSAN',
          name: '尼桑',
        },{
          code: 'MITSUBISHI',
          name: '三菱',
        },{
          code: 'LEXUS',
          name: '雷克萨斯',
        },{
          code: 'CHEVROLET',
          name: '雪佛兰',
        },{
          code: 'VOLVO',
          name: '沃尔沃',
        },{
          code: 'FIAT',
          name: '菲亚特',
        },{
          code: 'BYD',
          name: '比亚迪',
        },{
          code: 'CHERY',
          name: '奇瑞',
        },{
          code: 'UNKNOWN',
          name: '其他',
      },],//车辆品牌
      plateTypes: [{
          code: 'BLUE',
          name: '普通蓝牌',
        },{
          code: 'BLACK',
          name: '普通黑牌',
        },{
          code: 'YELL',
          name: '普通黄牌',
        },{
          code: 'YELL2',
          name: '双层黄牌',
        },{
          code: 'POL',
          name: '警察车牌',
        },{
          code: 'APOL',
          name: '武警车牌',
        },{
          code: 'APOL2',
          name: '双层武警',
        },{
          code: 'ARM',
          name: '单层军牌',
        },{
          code: 'ARM2',
          name: '双层军牌',
        },{
          code: 'INDI',
          name: '个性车牌',
        },{
          code: 'NEWN',
          name: '新能源小车牌',
        },{
          code: 'NEWN1',
          name: '新能源大车牌',
        },{
          code: 'EMB',
          name: '大使馆车牌',
        },{
          code: 'CON',
          name: '领事馆车牌',
        },{
          code: 'MIN',
          name: '民航车牌',
        },{
          code: 'UNKNOWN',
          name: '未知',
      },],//牌照类型
      carColors: [{
          code: 'BLUE',
          name: '蓝色',
        },{
          code: 'YELLOW',
          name: '黄色',
        },{
          code: 'WHITE',
          name: '白色',
        },{
          code: 'BLACK',
          name: '黑色',
        },{
          code: 'GREEN',
          name: '绿色',
        },{
          code: 'YELLOW_GREEN',
          name: '黄绿色',
        },{
          code: 'OTHER',
          name: '其他',
      },],//车身颜色
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

      /* 列表加载动画 */
      listLoading: true,
      dialogVisible: false, //  新建/编辑弹框显示
      outDialogVisible: false,

      /* 分页 */
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '',
        queryType: '',
        parkId: '1',
        startTime: '',
        endTime: '',
      },

      pickerOptions: {
        disabledDate:(time) => {
          if( this.parkingForm.inTime != ""){
            return time.getTime() < this.parkingForm.inTime;
          }else {
            return time.getTime() > Date.now();
          }
        }
      },
    }
  },
  mounted () {
    // 保留数据源
    this.copy = Object.assign(this.cityConstructions)
  },
  created() {
    this.fetchData();
    this.findParkName();
    this.findCarType();
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.tableData = response.data.list;
        this.total = parseInt(response.data.total);
        this.listLoading = false;
        this.tableData.forEach(item => {
          if (item.inTime != null) {
            item.inTime = this.formatDate(new Date(parseInt(item.inTime)));
          }
          if (item.outTime != null) {
            item.outTime = this.formatDate(new Date(parseInt(item.outTime)));
          }
        });
      })
    },
    //枚举
    enumerateInfo(codeType){
      let enumerate = {
        codeType: 'CT'
      };
      enumeration(enumerate).then(response => {
        this.carTypes = response.data.list;
      })
    },
    //查询停车场
    findParkName(){
      getParking().then(response => {
        this.parkNames = response.data;
      })
    },
    //选择停车场
    parkNameChange(val){
      this.parkingForm.parkId = val.id;
      this.parkingForm.parkName = val.name;
    },
    //查询车辆类型
    findCarType(){
      let datas = {
        parentCode: 'CAR_TYPE'
      };
      getCarType(datas).then(response => {
        this.carTypes = response.data;
      })
    },
    //选择车辆类型
    changeCarType(val){
      this.parkingForm.carType = val.code;
      this.parkingForm.carTypeStr = val.codeName;
    },
    //选择车辆品牌
    changeCarBrand(val){
      this.parkingForm.carBrand = val.code;
      this.parkingForm.brandStr = val.name;
    },
    //选择牌照类型
    changePlateType(val){
      this.parkingForm.plateType = val.code;
      this.parkingForm.plateTypeStr = val.name;
    },
    //选择车身颜色
    changeCarColor(val){
      this.parkingForm.carColor = val.code;
      this.parkingForm.carColorStr = val.name;
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
    //查询
    handleSearch(formName){
      let startTime = this.searchForm.timeList[0];
      let endTime = this.searchForm.timeList[1];
      if (startTime) {
        this.params.startTime = (new Date(startTime)).getTime();
      }
      if (endTime) {
        this.params.endTime = (new Date(endTime)).getTime();
      }
      this.params.searchKey = (this.searchForm.searchKey).toUpperCase();
      this.params.queryType = this.searchForm.queryType;
      this.params.parkId = this.searchForm.parkId;
      this.params.pageNum = 1;
      this.fetchData();
    },
    //重置
    resetForm(formName) {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.resetFields();
      }
      this.params = {
        pageNum: 1,
        pageSize: 10,
        searchKey: '',
        queryType: '',
        parkId: '',
        startTime: '',
        endTime: '',
      }
      this.fetchData();
    },
    //新增
    handleAdd(){
      this.parkingForm = {
        id: '',
        state: '',
        carDesc: '',
        cityConstruction: '',//城市简称
        carNo: '',
        carType: '',
        inTime: '',
        inImagePanorama: '',
        inImageSmall: '',
        inDeviceIp: '192.168.1.122',
        outTime: '',
        outImagePanorama: '',
        outImageSmall: '',
        outDeviceIp: '192.168.1.126',
        totalPay: '',
        parkId: '',
        parkName: '',
      }
      this.dialogVisible = true;
      this.parkStatus = 'add';
      this.titles = '新增停车记录';
    },
    //入场编辑
    handleEdit(index, rows){
      if (this.$refs.parkingForm) {
        this.$refs.parkingForm.resetFields();
      }
      this.dialogVisible = true;
      this.parkStatus = 'edit';
      this.titles = '编辑停车记录';
      itemParking(rows[index].id).then(response => {
        this.parkingForm = response.data;
        this.parkingForm.inTime = new Date(parseInt(this.parkingForm.inTime));
        this.parkingForm.cityConstruction = this.parkingForm.carNo.substring(0,1);
        this.parkingForm.carNo = this.parkingForm.carNo.substring(1,this.parkingForm.carNo.length);
      })
    },
    //离场编辑
    handleOutEdit(index, rows){
      if (this.$refs.parkingForm) {
        this.$refs.parkingForm.resetFields();
      }
      this.payForm = {
        inImagePanorama: '',
        inImageSmall: '',
        shouldPay: null,
        carNo: '',
        inTime: '',
      };
      this.outDialogVisible = true;
      var par = {carNo: rows[index].carNo}
      getPay(par).then(response => {
        this.payForm = response.data;
        this.payForm.inTime = new Date(parseInt(this.payForm.inTime));
      })
      itemParking(rows[index].id).then(response => {
        this.parkingForm = response.data;
        if (this.parkingForm.outTime) {
          this.parkingForm.outTime = new Date(parseInt(this.parkingForm.outTime));
        }else{
          this.parkingForm.outTime = new Date();
        }
        this.parkingForm.outDeviceIp = '192.168.1.126';
      })
    },
    //删除
    handleDelete(index, rows){
      this.$confirm('此操作将永久删除该条记录, 是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteParking(rows[index].id).then(response => {
          this.$message({
              type: 'success',
              message: '删除记录成功！'
          });
          this.fetchData();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        });          
      });
    },
    //入场保存
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.parkingForm.inTime = (new Date(this.parkingForm.inTime)).getTime();
          this.parkingForm.carNo = this.parkingForm.cityConstruction + this.parkingForm.carNo;
          if (this.parkStatus == 'add') {
            this.parkingForm.state = 'IN';
            addParking(this.parkingForm).then(response => {
              this.$message({
                  type: 'success',
                  message: '新增记录成功！'
              });
              this.$refs[formName].resetFields();
              this.fetchData();
              this.dialogVisible = false;
            })
          }else if(this.parkStatus == 'edit'){
            modifyParking(this.parkingForm).then(response => {
              this.$message({
                  type: 'success',
                  message: '入场编辑成功！'
              });
              this.$refs[formName].resetFields();
              this.fetchData();
              this.dialogVisible = false;
            })
          }
        } else {
          return false;
        }
      });
    },
    //离场保存
    handleDialogOutSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.parkingForm.outTime = (new Date(this.parkingForm.outTime)).getTime();
          this.parkingForm.state = 'OUT';
          modifyParking(this.parkingForm).then(response => {
            this.$message({
                type: 'success',
                message: '离场编辑成功！'
            });
            this.$refs[formName].resetFields();
            this.fetchData();
            this.outDialogVisible = false;
          })
        } else {
          return false;
        }
      });
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
    //取消
    handleCancel(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    //误操作关闭 dialog 的提示
    handleClose(done) {
      done();
    },
    //取消
    handleOutCancel(formName){
      this.outDialogVisible = false;
      this.$refs[formName].resetFields();
    },
    //误操作关闭 dialog 的提示
    handleOutClose(done) {
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
    //时间格式转换
    formatDate(now) { 
      var year = now.getFullYear(); 
      var month = now.getMonth()+1; 
      var date = now.getDate(); 
      var hour = now.getHours(); 
      var minute = now.getMinutes(); 
      var second = now.getSeconds(); 
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second; 
    } 
  }
}
</script>
<style lang="scss">
  .parkingTable .el-table--mini td{
    padding: 0;
  }
  .addParking{
    margin-bottom: 10px;
    .el-range-separator{
      padding: 0;
    }
  }
  .addParkingDialog{
    .el-dialog{
      border-radius: 5px;
      .el-dialog__header{
        background: #F9F9F9;
        border-bottom: 1px solid #DDDDDD;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding: 10px 20px 10px;
        .el-dialog__title{
          font-size: 14px;
        }
        .el-dialog__headerbtn{
          top: 15px;
        }
      }
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
  .el-table{
    .el-image{
      overflow: visible;
      margin: 5px 0;
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
  /* 横向放置的手机和竖向放置的平板之间的分辨率 */
  @media (max-width: 900px) {
    .el-dialog{
      .el-form{
        label{
          width: 95px !important;
        }
        .el-form-item__content{
          margin-left: 95px !important;
          .el-input{
            width: 100%;
          }
          .el-select{
            width: 100%;
            .el-input{
              width: 100%;
            }
          }
        }
        .carNoClass1{
          display: inline-block;
          width: 57%;
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
    }
  }
</style>