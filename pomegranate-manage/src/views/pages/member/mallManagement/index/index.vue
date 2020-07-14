<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <!-- 页面导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <template>
      <div class="containerBox">

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;商品管理</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面对商品进行管理</span>
          </div>
          <div class="creat-module">
              <el-button type="primary" icon="el-icon-edit-outline" plain @click="handleNewGoods">新建商品</el-button>
          </div>
        </div>

        <!-- 新建商品 dialog -->
        <el-dialog class="newGoodsDialog" title="商品管理" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

          <!-- dialog-body -->
          <el-form :model="productForm" ref="productForm" label-width="200px" class="demo-ruleForm">
            <el-form-item label="商品类型：" prop="productType" :rules="{ required: true, message: '请选择商品类型', trigger: 'change' }">
              <el-radio-group v-model="productForm.productType" @change='changeProductType'>
                  <el-radio label="TIC">福利券</el-radio>
                  <el-radio label="CA">会员卡</el-radio>
                  <!-- <el-radio dio label="PRO">普通商品</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品名称：" prop="productName" :rules="{ required: true, message: '商品名称不能为空', trigger: 'blur' }"> 
              <el-input v-model="productForm.productName" placeholder="请输入商品名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="会员卡类型：" prop="productRegisterTypeName" v-if="productForm.productType == 'CA'" :rules="{ required: true, message: '请选择会员卡类型', trigger: 'change' }">
              <el-select v-model="productForm.productRegisterTypeName"  @change="cardTypeChange" value-key="id" autocomplete="off" placeholder="请选择会员卡类型">
                  <el-option v-for="item in cardTypes" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="福利券类型：" prop="productRegisterTypeName" v-if="productForm.productType == 'TIC'" :rules="{ required: true, message: '请选择福利券类型', trigger: 'change' }">
              <el-select v-model="productForm.productRegisterTypeName" @change="ticketTypeChange" value-key="id" autocomplete="off" placeholder="请选择福利券类型">
                <el-option v-for="item in ticketTypes" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <!-- 折扣/优惠 -->
            <el-form-item v-if="productForm.productRegisterType == 'D1'" label="" prop="ticketPrice" :rules="[{ required: true, message: '折扣不能为空',trigger: 'blur'},{ pattern: /^[1-9](\.\d{1,2})?$/, message: '请输入0-10的数字' }]">
                <span>请输入折扣 </span>
                <el-input class="otherInput" v-model="productForm.ticketPrice" autocomplete="off" placeholder="如：8"></el-input>
                <span> 折</span>
              </el-form-item>
              <el-form-item v-if="productForm.productRegisterType == 'D2'" label="" prop="ticketPrice" :rules="{ required: true, message: '优惠金额不能为空', trigger: 'blur' }">
                <span>请输入优惠金额 </span>
                <el-input class="otherInput" v-model="productForm.ticketPrice" autocomplete="off"></el-input>
                <span> 元</span>
            </el-form-item>
            
            <el-form-item label="是否能与会员权益共用：" prop="isBoth" v-if="productForm.productType == 'TIC'" :rules="{ required: true, message: '请选择是否能与会员权益共用', trigger: 'change' }">
              <el-radio-group v-model="productForm.isBoth">
                <el-radio :label="1">能</el-radio>
                <el-radio :label="0">不能</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="售价：" prop="currentScore">
              <el-checkbox v-model="researchChecked">研值</el-checkbox>
              <el-input class="otherInput" :disabled="!researchChecked" v-model="productForm.currentScore" placeholder="如：100" autocomplete="off"></el-input> 研值
            </el-form-item>
            <el-form-item label="" prop="currentPrice">
              <el-checkbox v-model="cashChecked">现金</el-checkbox>
              <el-input class="otherInput" :disabled="!cashChecked" v-model="productForm.currentPrice" placeholder="如：100" autocomplete="off"></el-input> 元
            </el-form-item>

            <el-form-item label="库存：" prop="productStock" :rules="[{ required: true, message: '库存不能为空'},{ type: 'number', message: '请输入数字值'}]">
              <el-input v-model.number="productForm.productStock" autocomplete="off" placeholder="如：10" ></el-input>
              <span> 件</span>
            </el-form-item>

            <!-- 使用范围多选框 -->
            <el-form-item label="使用范围：" prop="courseList" v-if="productForm.productType == 'TIC'" :rules="{ type: 'array', required: true, message: '请至少选择一个使用范围', trigger: 'change' }">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="productForm.courseList" @change="handlecheckedRangesChange">
                <el-checkbox v-for="range in Ranges" :label="range.id" :key="range.id" name="courseList">{{range.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <!-- 图片上传位置 -->
            <el-form-item label="商品图片：" prop="fileUrl" v-if="productForm.productType == 'PRO'">
              <el-upload
                class="avatar-uploader"
                :action="uploadImgUrl"
                :headers='uploadHeaders'
                :show-file-list="false"
                :before-upload = "beforeUpload"
                :on-error = "UploadError"
                :on-success = "UploadSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel('productForm')">取 消</el-button>
            <el-button type="primary" @click="handleDialogSave('productForm')">仅保存</el-button>
            <el-button type="primary" @click="handleDialogPutaway('productForm')">保存并上架</el-button>
          </span>

        </el-dialog>

        <!-- 编辑商品 dialog -->
        <el-dialog class="editGoodsDialog" title="商品管理" :append-to-body="true" :visible.sync="editdialogVisible" width="50%" :before-close="handleCloseEdit">

          <!-- dialog-body -->
          <el-form :model="productForm" ref="productForm" label-width="200px" class="demo-ruleForm">
            <el-form-item label="商品类型：" prop="productType" :rules="{ required: true, message: '请选择商品类型', trigger: 'change' }">
              <el-radio-group v-model="productForm.productType">
                  <el-radio :disabled="isTIC" label="TIC">福利券</el-radio>
                  <el-radio :disabled="isCA" label="CA">会员卡</el-radio>
                  <!-- <el-radio dio label="PRO">普通商品</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品名称：" prop="productName" :rules="{ required: true, message: '商品名称不能为空', trigger: 'blur' }"> 
              <el-input v-model="productForm.productName" placeholder="请输入商品名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="会员卡类型：" prop="productRegisterTypeName" v-if="productForm.productType == 'CA'" :rules="{ required: true, message: '请选择会员卡类型', trigger: 'change' }">
              <el-select v-model="productForm.productRegisterTypeName"  @change="cardTypeChange" value-key="id" autocomplete="off" placeholder="请选择会员卡类型">
                  <el-option v-for="item in cardTypes" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="福利券类型：" prop="productRegisterTypeName" v-if="productForm.productType == 'TIC'" :rules="{ required: true, message: '请选择福利券类型', trigger: 'change' }">
              <el-select v-model="productForm.productRegisterTypeName" @change="ticketTypeChange" value-key="id" autocomplete="off" placeholder="请选择福利券类型">
                <el-option v-for="item in ticketTypes" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <!-- 折扣/优惠 -->
            <el-form-item v-if="productForm.productRegisterType == 'D1'" label="" prop="ticketPrice" :rules="[{ required: true, message: '折扣不能为空',trigger: 'blur'},{ pattern: /^[1-9](\.\d{1,2})?$/, message: '请输入0-10的数字' }]">
                <span>请输入折扣 </span>
                <el-input class="otherInput" v-model="productForm.ticketPrice" autocomplete="off" placeholder="如：0.8"></el-input>
                <span> 折</span>
              </el-form-item>
              <el-form-item v-if="productForm.productRegisterType == 'D2'" label="" prop="ticketPrice" :rules="{ required: true, message: '优惠金额不能为空', trigger: 'blur' }">
                <span>请输入优惠金额 </span>
                <el-input class="otherInput" v-model="productForm.ticketPrice" autocomplete="off"></el-input>
                <span> 元</span>
              </el-form-item>
              <!-- <el-form-item v-if="productForm.productRegisterType == 'D3'" label="" prop="ticketPrice">
                <span>请输入抵用金额 </span>
                <el-input class="otherInput" v-model="productForm.ticketPrice" autocomplete="off"></el-input>
                <span> 元</span>
            </el-form-item> -->

            <el-form-item label="是否能与会员权益共用：" prop="isBoth" v-if="productForm.productType == 'TIC'" :rules="{ required: true, message: '请选择是否能与会员权益共用', trigger: 'change' }">
              <el-radio-group v-model="productForm.isBoth">
                <el-radio :label="1">能</el-radio>
                <el-radio :label="0">不能</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="售价：" prop="currentScore">
              <el-checkbox v-model="researchChecked">研值</el-checkbox>
              <el-input class="otherInput" :disabled="!researchChecked" v-model="productForm.currentScore" placeholder="如：100" autocomplete="off"></el-input> 研值
            </el-form-item>
            <el-form-item label="" prop="currentPrice">
              <el-checkbox v-model="cashChecked">现金</el-checkbox>
              <el-input class="otherInput" :disabled="!cashChecked" v-model="productForm.currentPrice" placeholder="如：100" autocomplete="off"></el-input> 元
            </el-form-item>

            <el-form-item label="库存：" prop="productStock" :rules="[{ required: true, message: '库存不能为空'},{ type: 'number', message: '请输入数字值'}]">
              <el-input v-model.number="productForm.productStock" autocomplete="off" placeholder="如：10" ></el-input>
              <span> 件</span>
            </el-form-item>

            <!-- 使用范围多选框 -->
            <el-form-item label="使用范围：" prop="courseList" v-if="productForm.productType == 'TIC'" :rules="{ type: 'array', required: true, message: '请至少选择一个使用范围', trigger: 'change' }">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="productForm.courseList" @change="handlecheckedRangesChange">
                <el-checkbox v-for="range in Ranges" :label="range.id" :key="range.id" name="courseList">{{range.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <!-- 图片上传位置 -->
            <el-form-item label="商品图片：" prop="fileUrl" v-if="productForm.productType == 'PRO'">
              <el-upload
                class="avatar-uploader"
                :action="uploadImgUrl"
                :headers='uploadHeaders'
                :show-file-list="false"
                :before-upload = "beforeUpload"
                :on-error = "UploadError"
                :on-success = "UploadSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancelEdit('productForm')">取 消</el-button>
            <el-button type="primary" @click="handleDialogSaveEdit('productForm')">仅保存</el-button>
            <el-button type="primary" @click="handleDialogPutawayEdit('productForm')">保存并上架</el-button>
          </span>

        </el-dialog>

        <!-- 表格 -->
        <el-table :data="tableData" v-loading="loading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="640" style="width: 100%;">
          <el-table-column type="index" fixed width="80" align="center"></el-table-column>
          <el-table-column prop="productNumber" label="商品编号" width="200" align="center"></el-table-column>
          <el-table-column prop="productName" label="商品名称" width="250" align="center"></el-table-column>
          <el-table-column prop="productTypeName" label="商品类型" width="150" align="center"></el-table-column>
          <el-table-column prop="priceTypeName" label="售卖方式" width="120" align="center"></el-table-column>
          <el-table-column prop="currentScore" label="研值价格" width="120" align="center"></el-table-column>
          <el-table-column prop="currentPrice" label="现金价格" width="120" align="center"></el-table-column>
          <el-table-column prop="productStock" label="库存" width="120" align="center"></el-table-column>
          <el-table-column prop="flag" label="状态" align="center"></el-table-column>
          <el-table-column  fixed='right' label="操作" width="300" align="center">
            <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.flag == '下架' || scope.row.flag == ''" size="small" plain @click.native.prevent="handlePutaway(scope.$index, tableData)">上架</el-button>
                <el-button type="info" v-else disabled size="small" plain>上架</el-button>

                <el-button type="primary" v-if="scope.row.flag == '上架' || scope.row.flag == ''" size="small" plain @click.native.prevent="handleSoldOut(scope.$index, tableData)">下架</el-button>
                <el-button type="info" v-else disabled size="small" plain>下架</el-button>

                <el-button type="primary" v-if="scope.row.flag == '下架' || scope.row.flag == ''" size="small" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
                <el-button type="info" v-else disabled size="small" plain>编辑</el-button>

                <el-button type="primary" v-if="scope.row.flag == '下架' || scope.row.flag == ''" size="small" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
                <el-button type="info" v-else disabled size="small" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination 
          style="margin: 20px 0;text-align: right;"
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next" 
          :total="total">
          </el-pagination>
        </div>
      </div>
    </template>
  </d2-container>
</template>

<script>
import https from '../../../../../https.js'
import { constants } from 'fs';

export default {
  data () {
    return {
      filename: __filename,
      loading: false,// 表格加载
      isFlage: true,//上架状态下禁用按钮
      isFlageOther: true,//下架状态下禁用按钮
      dialogVisible: false, //  新建弹框显示
      editdialogVisible: false,//  编辑弹框显示
      researchChecked: false,//研值选择框
      cashChecked: false,//现金选择框
      isTIC: false,//判断是否是券
      isCA: false,//判断是否是卡

      /* 商品图上传 */
      uploadImgUrl: '/pomegranate/web/file',
      uploadHeaders: {
        'token': localStorage.getItem('token')
      },
      imageUrl: '',

      /* 福利券类型数组 */
      ticketTypes: [],

      /* 会员卡类型数组 */
      cardTypes: [], 

      productState: '',//判断新增/编辑商品
      productForm: { // 新建/编辑商品表单数据  
          productName: '',
          productType: 'TIC',
          isBoth: 1,//是否能与会员权益共用
          priceType: '',
          productRegisterType: '',
          productRegisterTypeName: '',
          ticketPrice: '',
          currentScore: '',
          currentPrice: '',
          productStock: '',
          flag: null,
          courseList: [],
          fileUrl: '',
      },
      tableData: [], // 初始列表数组

      /* 多选框 */
      checkAll: false,
      Ranges: [],
      isIndeterminate: false,

      /* 分页 */
      total: 0,
      pageNum: 1,
      pageSize: 10,
    }
  },
  created() {
    this.productForm.isBoth = '1';
    this.getTableList();
    this.getRangeList();
    this.getticketTypeList();
    this.getCardTypesList();
  },
  methods: {

    // 查询商品列表
    getTableList () {
      this.loading = true;
      let self = this;
      https.fetchGet('/pomegranate/web/product/find?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize)
        .then(function(res){
          if (res.data.code) {
            self.loading = false;
            self.$message({
                type: 'warning',
                message: '列表查询失败，请稍后重试！'
            });
          }else{
            self.loading = false;
            self.tableData = res.data.list;
            self.total = parseInt(res.data.total);
            let list = res.data.list;
            for (const i in list) {
              if (list[i].flag == 1) {
                list[i].flag = '上架';
              }else if(list[i].flag == 3){
                list[i].flag = '下架';
              }else{
                list[i].flag = '';
              }
            }
          }
        })
        .catch(function(err){
          self.loading = false;
          self.$message({
            type: 'warning',
            message: '请求失败！'
          });
        })
    },

    //查询使用范围列表
    getRangeList(){
      let self = this;
      https.fetchGet('/pomegranate/web/course/names')
      .then(function(res){
        if (res.data.code) {
          self.$message({
              type: 'warning',
              message: '信息查询失败，请稍后重试！'
          });
        }else{
          let data = res.data;
          for (const i in data) {
            data[i].id = data[i].courseId;
            data[i].name = data[i].courseName;    
          }
          self.Ranges = data;
        }
      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '查询使用范围失败！'
        });
      })
    },

    /* 查询商品类型列表 */
    getticketTypeList(){
      let self = this;
      https.fetchGet( '/pomegranate/web/baseInfo/ticket' )
      .then(function(res){
        if (res.data.code) {
          self.$message({
              type: 'warning',
              message: '信息查询失败，请稍后重试！'
          });
        }else{
          self.ticketTypes = res.data;
        }
      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '查询商品类型失败！'
        });
      })
    },

    /* 查询会员卡类型 */
    getCardTypesList(){
        let self = this;
        https.fetchGet( '/pomegranate/web/baseInfo/card' )
        .then(function(res){
          if (res.data.code) {
            self.$message({
                type: 'warning',
                message: '信息查询失败，请稍后重试！'
            });
          }else{
            self.cardTypes = res.data;
          }
        })
        .catch(function(err){
            self.$message({
            type: 'warning',
            message: '查询会员卡类型失败！',
            });
        })
    },

    //会员卡类型
    cardTypeChange(value){
      this.productForm.productRegisterType = value.id;
      this.productForm.productRegisterTypeName = value.name;
    },

    //福利券类型
    ticketTypeChange(value){
      this.productForm.productRegisterType = value.id;
      this.productForm.productRegisterTypeName = value.name;
    },

    //切换商品类型
    changeProductType(val){
      this.productForm = { // 新建/编辑商品表单数据  
          productName: '',
          productType: val,
          productRegisterType: '',
          productRegisterTypeName: '',
          ticketPrice: '',
          currentScore: '',
          currentPrice: '',
          productStock: '',
          flag: null,
          courseList: [],
          fileUrl: '',
      }
      this.$refs.productForm.resetFields();
    },

    //上架商品
    handlePutaway(index, rows){
      this.$confirm('确定要将商品 [ ' + rows[index].productName + ' ] 上架吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        https.fetchGet('/pomegranate/web/product/status?pid='+ rows[index].productId +'&flag='+ 1 +'')
        .then(function(res){
          if (res.data.code) {
            self.$message({
                type: 'warning',
                message: '信息提交失败，请检查后重试！'
            });
          }else{
            self.getTableList();
            self.$message({
              type: 'success',
              message: '商品上架成功！',
            });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '商品上架失败！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        });          
      });
    },

    //下架商品
    handleSoldOut(index, rows){
      this.$confirm('确定要将商品 [ ' + rows[index].productName + ' ] 下架吗？?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        https.fetchGet('/pomegranate/web/product/status?pid='+ rows[index].productId +'&flag='+ 3 +'')
        .then(function(res){
          if (res.data.code) {
            self.$message({
                type: 'warning',
                message: '信息提交失败，请稍后重试！'
            });
          }else{
            self.getTableList();
            self.$message({
              type: 'success',
              message: '商品下架成功！',
            });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '商品下架失败！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架！'
        });          
      });
    },

    //编辑商品
    handleEdit(index, rows){
      this.editdialogVisible = true;
      this.productState = 'edit';
      if (rows[index].productType == "TIC") {
        this.isTIC = false;
        this.isCA = true;
        if (rows[index].courseList) {
          if (rows[index].courseList.length == this.Ranges.length) {
            this.isIndeterminate = false;
            this.checkAll = true;
          }
          this.handlecheckedRangesChange(rows[index].courseList);
        }
      }else if (rows[index].productType == 'CA') {
        this.isTIC = true;
        this.isCA = false;
      }else if (rows[index].productType == 'PRO') {
        this.imageUrl = rows[index].fileUrl;
      }
      if (rows[index].priceType == 0) {
        this.researchChecked = false;
        this.cashChecked = true;
      }else if (rows[index].priceType == 1) {
        this.researchChecked = true;
        this.cashChecked = false;
      }else if (rows[index].priceType == 3) {
        this.researchChecked = true;
        this.cashChecked = true;
      }
      
      this.productForm = {
        productRegisterId: rows[index].productRegisterId,
        priceType: rows[index].priceType,
        isBoth: rows[index].isBoth,
        priceTypeName: rows[index].priceTypeName,
        productId: rows[index].productId,
        productName: rows[index].productName,
        productNumber: rows[index].productNumber,
        productStock: rows[index].productStock,
        productType: rows[index].productType,
        ticketPrice: parseFloat(rows[index].ticketPrice)*10,
        currentScore: rows[index].currentScore,
        currentPrice: rows[index].currentPrice,
        productRegisterType: rows[index].productRegisterType,
        productRegisterTypeName: rows[index].productRegisterTypeName,
        courseList: rows[index].courseList,
        fileUrl: rows[index].fileUrl,
        flag: rows[index].flag,
      };
    },

    //删除商品
    handleDelete(index, rows){
      this.$confirm('此操作将永久删除商品 [ ' + rows[index].productName + ' ] , 是否继续？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        https.fetchDelete('/pomegranate/web/product/delete/' + rows[index].productId)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '商品删除失败！'
              });
          }else{
              self.getTableList();
              self.$message({
                type: 'success',
                message: '商品删除成功!'
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '商品删除失败！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },

    //新建商品
    handleNewGoods(){
      this.dialogVisible = true;
      this.productState = 'new';
      this.imageUrl = '';
      this.isIndeterminate = false;
      this.checkAll = false;
      this.researchChecked = false;
      this.cashChecked = false;
      this.productForm = { // 新建/编辑商品表单数据  
          productName: '',
          productType: 'TIC',
          isBoth: 1,//是否能与会员权益共用
          productRegisterType: '',
          productRegisterTypeName: '',
          ticketPrice: '',
          currentScore: '',
          currentPrice: '',
          productStock: '',
          flag: null,
          courseList: [],
          fileUrl: '',
      }
      this.$nextTick(()=>{
          this.$refs.productForm.resetFields();
      })
    },

    //取消新建商品
    handleCancel(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.imageUrl = '';
    },

    //仅保存新建商品
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.researchChecked && !this.cashChecked) {
            this.$alert('请至少选择一种售卖方式！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }else{
            if (this.researchChecked && !this.productForm.currentScore) {
              this.$alert('请正确填写研值额度！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }else{
              if (this.cashChecked && !this.productForm.currentPrice) {
                this.$alert('请正确填写现金额度！', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
              }else{
                this.submitProduct(3, this.productState, formName);
                this.dialogVisible = false;
              }
            }
          }
        } else {
          return false;
        }
      });
    },

    //保存并上架新建商品
    handleDialogPutaway(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.researchChecked && !this.cashChecked) {
            this.$alert('请至少选择一种售卖方式！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }else{
            if (this.researchChecked && !this.productForm.currentScore) {
              this.$alert('请正确填写研值额度！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }else{
              if (this.cashChecked && !this.productForm.currentPrice) {
                this.$alert('请正确填写现金额度！', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
              }else{
                this.submitProduct(1, this.productState, formName);
                this.dialogVisible = false;
              }
            }
          }
        } else {
          return false;
        }
      });
    },

    //取消编辑商品
    handleCancelEdit(formName){
      this.editdialogVisible = false;
      this.$refs[formName].resetFields();
      this.imageUrl = '';
    },

    //仅保存编辑商品
    handleDialogSaveEdit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.researchChecked && !this.cashChecked) {
            this.$alert('请至少选择一种售卖方式！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }else{
            if (this.researchChecked && !this.productForm.currentScore) {
              this.$alert('请正确填写研值额度！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }else{
              if (this.cashChecked && !this.productForm.currentPrice) {
                this.$alert('请正确填写现金额度！', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
              }else{
                this.submitProduct(3, this.productState, formName);
                this.editdialogVisible = false;
              }
            }
          }
        } else {
          return false;
        }
      });
    },

    //保存并上架编辑商品
    handleDialogPutawayEdit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.researchChecked && !this.cashChecked) {
            this.$alert('请至少选择一种售卖方式！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }else{
            if (this.researchChecked && !this.productForm.currentScore) {
              this.$alert('请正确填写研值额度！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }else{
              if (this.cashChecked && !this.productForm.currentPrice) {
                this.$alert('请正确填写现金额度！', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
              }else{
                this.submitProduct(1, this.productState, formName);
                this.editdialogVisible = false;
              }
            }
          }
        } else {
          return false;
        }
      });
    },

    //提交新增商品信息
    submitProduct(val, productState, formName){
      let self = this;
      let messageState = '';
      self.productForm.flag = val;
      if (self.productForm.productRegisterType == 'D4') {
        self.productForm.ticketPrice = 0;
      }else if (self.productForm.productRegisterType == 'D1') {
        self.productForm.ticketPrice = parseFloat(self.productForm.ticketPrice) * 0.1;
      }
      if (self.researchChecked && !self.cashChecked) {
        self.productForm.priceType = 1;//研值
        self.productForm.currentPrice = '';
      }else if (!self.researchChecked && self.cashChecked) {
        self.productForm.priceType = 0;//现金
        self.productForm.currentScore = '';
      }else if (self.researchChecked && self.cashChecked) {
        self.productForm.priceType = 3;
      }
      if (val == 1) {
        messageState = '商品已成功保存并上架！';
      }else if(val == 3) {
        messageState = '商品保存成功！';
      }

      if (productState == 'new') {//新增
        https.fetchPost('/pomegranate/web/product/add', self.productForm)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.getTableList();
              self.imageUrl = '';
              self.$refs[formName].resetFields();
              self.$message({
                type: 'success',
                message: messageState,
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '新增商品失败 ！'
          });
        })
      }else if(productState == 'edit'){//编辑
        https.fetchPut('/pomegranate/web/product/update', self.productForm)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.getTableList();
              self.imageUrl = '';
              self.$refs[formName].resetFields();
              self.$message({
                type: 'success',
                message: messageState,
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '编辑商品失败 ！'
          });
        })
      }
    },

    //全选
    handleCheckAllChange(val) {
      let ranges = [];
      this.Ranges.forEach(element => {
        ranges.push(element.id);
      });
      this.productForm.courseList = val ? ranges : [];
      this.isIndeterminate = false;
    },

    //多选
    handlecheckedRangesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.Ranges.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.Ranges.length;
      this.productForm.courseList = value;
    },

    //商品图上传
    beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 / 1024 / 1024 / 1024  < 5;
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return  isLt5M;
      },
      UploadSuccess(response, file) {//文件上传成功后
        if (response) {
          this.imageUrl = response;
          this.productForm.fileUrl = response;
          this.$message({
            message: "图片上传成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "图片上传发生错误，请检查文件格式！",
            type: "warning"
          });
        }
      },
      UploadError(err, file, fileList) {//文件上传失败
        this.$message({
          message: "图片上传失败，请检查后重试！",
          type: "error"
        });
    },

    //误操作关闭 dialog 的提示
    handleClose(done) {
        this.$confirm('确认关闭？编辑的内容将不会被保存！是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done();
          this.imageUrl = '';
          this.$refs['productForm'].resetFields();
        }).catch(() => {});
    },
    handleCloseEdit(done) {
        this.$confirm('确认关闭？编辑的内容将不会被保存！是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done();
          this.imageUrl = '';
          this.$refs['productForm'].resetFields();
        }).catch(() => {});
    },

    //切换当页显示数据条数
    handleSizeChange(val) {
        this.pageNum = 1;
        this.pageSize = val;
        this.getTableList()
    },

    //切换页码
    handleCurrentChange(val) {
        this.pageNum = val;
        this.getTableList()
    },
  }
}
</script>

<style lang="scss">
  ul,li{ 
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .top-title{
        font-size: 24px;
        color: #323232;
      }
    }
  .newGoodsDialog,.editGoodsDialog{
    .el-dialog{
      margin-top: 30px !important;
      .el-dialog__header{
        background: #F9F9F9;
        border-bottom: 1px solid #DDDDDD;
      }
      .el-dialog__body{
        padding: 30px 50px;
      }
      .otherInput{
        width: 30% !important;
      }
      .el-input{
        width: 50%;
      }
      .el-select{
        width: 50%;
        .el-input{
          width: 100%;
        }
      }
      .el-checkbox-group{
        width: 60%;
      }
    }
  }
  .el-table{
    box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
  }
  /* 商品图片 style */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
