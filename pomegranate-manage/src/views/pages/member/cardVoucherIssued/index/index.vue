<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>福利管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券发放</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
      <div class="">

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;卡券发放</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面发放优惠券和会员卡给指定人员</span>
          </div>
        </div>

        <!-- Tab标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 10px;">
            <el-tab-pane label="发放卡券" name="first">
                <!-- 发放卡券表单 -->
                <el-form :model="couponForm" ref="couponForm" :rules="couponFormRules" label-width="180px" class="demo-couponForm">
                    <el-form-item label="卡券类型：" prop="campaignType" :rules="{ required: true, message: '请选择卡券类型', trigger: 'change' }">
                        <el-radio-group v-model="couponForm.campaignType" @change='changeCampaignType'>
                            <el-radio label="ticket">券</el-radio>
                            <el-radio label="card">卡</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="isTicket" label="券的名称：" prop="productDto.productName" :rules="{ required: true, message: '券的名称不能为空', trigger: 'blur' }"> 
                        <el-input v-model="couponForm.productDto.productName" placeholder="请输入券的名称" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="活动名称：" prop="campaignName" :rules="{ required: true, message: '请输入活动名称', trigger: 'blur' }">
                        <el-input v-model="couponForm.campaignName" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isCard" label="会员卡类型：" prop="registerDto.cardType" :rules="{ required: true, message: '请选择会员卡类型', trigger: 'change' }">
                        <el-select v-model="couponForm.registerDto.cardType" value-key="id" autocomplete="off" placeholder="请选择会员卡类型">
                            <el-option v-for="item in cardTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="isTicket" label="福利券类型：" prop="productDto.productRegisterTypeName" :rules="{ required: true, message: '请选择券的类型', trigger: 'change' }">
                        <el-select v-model="couponForm.productDto.productRegisterTypeName" @change="ticketTypeChange" value-key="id" autocomplete="off" placeholder="请选择券的类型">
                            <el-option v-for="item in productTypes" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 折扣/优惠 -->
                    <el-form-item v-if="isTicket && couponForm.productDto.productRegisterType == 'D1'" label="" prop="productDto.ticketPrice" :rules="[{ required: true, message: '折扣不能为空',trigger: 'blur'},{ pattern: /^[1-9](\.\d{1,2})?$/, message: '请输入0-10的数字' }]">
                        <span>请输入折扣 </span>
                        <el-input class="otherInput" v-model="couponForm.productDto.ticketPrice" autocomplete="off" placeholder="如：8"></el-input>
                        <span> 折</span>
                    </el-form-item>
                    <el-form-item v-if="isTicket && couponForm.productDto.productRegisterType == 'D2'" label="" prop="productDto.ticketPrice" :rules="[{ required: true, message: '优惠金额不能为空',trigger: 'blur'},{ type: 'number', message: '请输入数字' }]">
                        <span>请输入优惠金额 </span>
                        <el-input class="otherInput" v-model.number="couponForm.productDto.ticketPrice" autocomplete="off" placeholder="如：100"></el-input>
                        <span> 元</span>
                    </el-form-item>

                    <el-form-item v-if="isTicket" label="是否能与会员权益共用：" prop="productDto.isBoth" :rules="{ required: true, message: '请选择是否能与会员权益共用', trigger: 'change' }">
                        <el-radio-group v-model="couponForm.productDto.isBoth">
                            <el-radio label="1">能</el-radio>
                            <el-radio label="0">不能</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="数量：" prop="quantity" :rules="[{ required: true, message: '数量不能为空'},{ type: 'number', message: '请输入数字值'}]">
                        <el-input class="otherInput" v-model.number="couponForm.quantity" autocomplete="off" placeholder="请输入数量 如：1"></el-input>
                        <span> 张</span>
                    </el-form-item>
                    <el-form-item v-if="isCard" label="接收人：" prop="receiverId" :rules="{ required: true, message: '接收人不能为空', trigger: 'blur' }">
                        <el-input v-model="couponForm.receiverId" placeholder="接收人用户编码"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isTicket" label="接收对象：" prop="receiverType" :rules="{ required: true, message: '请选择接收对象', trigger: 'change' }">
                        <el-radio v-model="couponForm.receiverType" label="0">个人</el-radio>
                        <el-radio v-model="couponForm.receiverType" label="1">指定会员类型</el-radio>
                    </el-form-item>

                    <!-- 判断接收对象 -->
                    <el-form-item v-if="isTicket && couponForm.receiverType == '0'" label="" prop="receiverId" :rules="{ required: true, message: '接收人用户编码不能为空', trigger: 'blur' }">
                        <el-input v-model="couponForm.receiverId" placeholder="接收人用户编码"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isTicket && couponForm.receiverType == '1'" label="" prop="receiverId" :rules="{ required: true, message: '请选择会员类型', trigger: 'change' }">
                        <el-select type="receiverId" v-model="couponForm.receiverId" value-key="id" autocomplete="off" placeholder="请选择会员类型">
                            <el-option v-for="item in receivers" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 使用范围多选框 -->
                    <el-form-item v-if="isTicket" label="使用范围：" prop="productDto.courseList" :rules="{ type: 'array', required: true, message: '请至少选择一个使用范围', trigger: 'change' }">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="couponForm.productDto.courseList" @change="handlecheckedRangesChange">
                            <el-checkbox v-for="range in Ranges" :label="range.id" :key="range.id" name="productDto.courseList">{{range.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleSend('couponForm')">发送</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="发放记录" name="second">
                <!-- 发放记录表格 -->
                <el-table :data="releaseRecordData" v-loading="loading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="600" style="width: 100%;">
                    <el-table-column type="index" fixed width="80" align="center"></el-table-column>
                    <el-table-column prop="campaignName"  label="活动名称" align="center"></el-table-column>
                    <el-table-column prop="campaignId"  label="活动编号" align="center"></el-table-column>
                    <el-table-column prop="lastCreateTime"  label="发送时间" align="center"></el-table-column>
                    <!-- <el-table-column fixed="right" label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" plain @click.native.prevent="handleDetail(scope.$index, releaseRecordData)">明细</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <!-- 表格分页 -->
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
            </el-tab-pane>
        </el-tabs>

      </div>
    </template>
   
  </d2-container>
</template>

<script>
import https from '../../../../../https.js'
export default {
    components: {

    },
    data () {
        var checkImg = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请上传商品图片'));
            }
            setTimeout(() => {
                if (!value) {
                callback(new Error('请上传商品图片'));
                } else {
                callback();
                }
            }, 100);
        };
        return {
            filename: __filename,
            loading: false,// 表格加载
            isTicket: true,//判断选择券的时候
            isCard: false,//判断选择卡的时候
            iscampaignType: '',

            /* 当前Tab名称 */
            activeName: 'first',

            couponForm: {
                campaignType: 'ticket',//卡券类型
                receiverType: '0',//个人还是集体
                campaignName: "",//活动名称
                receiverId: "",//接收人个人openid或者是会员等级
                quantity: '',//数量
                registerDto: {//卡券类型为卡的时候需要的对象
                    cardType: '',
                },
                productDto: {//卡券类型为券的时候需要的对象
                    productName: '',//商品名称
                    productType: 'TIC',//商品类型 
                    priceType: 0,//售卖方式
                    productRegisterType: '',
                    productRegisterTypeName: '',
                    isBoth: '1',//是否能与会员权益共用
                    ticketPrice: null,
                    currentScore: 0,//研值
                    currentPrice: 0,//金额
                    productStock: 0,//库存
                    flag: 0,
                    courseList: [],//适用范围
                    fileUrl: '',
                },
            },
            couponFormRules: {//表单验证
                /* fileUrl: [
                    { required: true, validator: checkImg, trigger: 'change' }
                ], */
            },

            /* 券类型数组 */
            productTypes: [],
            /* 卡类型数组 */
            cardTypes: [],
            /* 会员类型数组 */
            receivers: [],

            /* 多选框 */
            checkAll: false,
            Ranges: [],
            isIndeterminate: false,
            rangeItems: [],

            /* 发放记录列表 */
            releaseRecordData: [],

            /* 分页 */
            total: 0,
            pageNum: 1,
            pageSize: 10,
        }
    },
    created() {
        this.getRangeList();
        this.getCardList();
        this.getTicketList();
        this.getReceiverList();
    },
    methods: {
        //基础查询接口
        getList(module){
            let self = this;
            let msg = '';
            if (module == 'card') {
                msg = '查询卡类型失败！'
            }else if (module == 'ticket') {
                msg = '查询券类型失败！'
            }else if (module == 'member') {
                msg = '查询会员类型失败！'
            }
            https.fetchGet( '/pomegranate/web/baseInfo/'+ module )
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    if (module == 'card') {
                        self.cardTypes = res.data;
                    }else if (module == 'ticket') {
                        self.productTypes = res.data;
                    }else if (module == 'member') {
                        self.receivers = res.data;
                    }
                }
            })
            .catch(function(err){
                self.$message({
                type: 'warning',
                message: msg,
                });
            })
        },

        //查询卡类型列表
        getCardList(){
            this.getList('card');
        },

        //查询券类型列表
        getTicketList(){
            this.getList('ticket');
        },

        //查询会员类型列表
        getReceiverList(){
            this.getList('member');
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

        //查询发放记录列表
        getTableList(){
            this.loading = true;
            let self = this;
            https.fetchGet('/pomegranate/web/campaign?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize)
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.loading = false;
                    self.releaseRecordData = res.data.list;
                    self.total = parseInt(res.data.total);
                }
            })
            .catch(function(err){
                self.loading = false;
                self.$message({
                    type: 'warning',
                    message: '查询发放记录列表失败！'
                });
            })
        },

        //切换Tab页
        handleClick(tab, event) {
            if (tab.index == '1') {
                this.getTableList();
                this.$refs.couponForm.resetFields();
                this.couponForm.campaignType = this.iscampaignType;
            }
        },

        //卡券类型
        changeCampaignType(value){
            if (value == 'ticket') {
                this.isTicket = true;
                this.isCard = false;
            }else if(value == 'card'){
                this.isTicket = false;
                this.isCard = true;
            }
            this.iscampaignType = value;
            this.$refs.couponForm.resetFields();
            this.couponForm.campaignType = value;
        },

        //福利券类型
        ticketTypeChange(value){
            this.couponForm.productDto.productRegisterType = value.id;
            this.couponForm.productDto.productRegisterTypeName = value.name;
        },

        //全选
        handleCheckAllChange(val) {
            let ranges = [];
            this.Ranges.forEach(element => {
                ranges.push(element.id);
            });
            this.couponForm.productDto.courseList = val ? ranges : [];
            this.isIndeterminate = false;
        },

        //多选
        handlecheckedRangesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.Ranges.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.Ranges.length;
            this.couponForm.productDto.courseList = value;
        },

        //发送卡券
        handleSend(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                let self = this;
                if (self.couponForm.productDto.productRegisterType == 'D4') {
                    self.couponForm.productDto.ticketPrice = 0;
                }else if (self.couponForm.productDto.productRegisterType == 'D1') {
                    self.couponForm.productDto.ticketPrice = parseFloat(self.couponForm.productDto.ticketPrice) * 0.1;
                }
                if (self.couponForm.campaignType == 'ticket') {
                    self.couponForm.productDto.productType = 'TIC';
                }else if (self.couponForm.campaignType == 'card') {
                    self.couponForm.productDto.productType = 'CA';
                }
                https.fetchPost('/pomegranate/web/campaign', self.couponForm)
                .then(function(res){
                    if (res.data.code) {
                        self.$message({
                            type: 'warning',
                            message: '信息提交失败，请检查后重试！'
                        });
                    }else{
                        self.isIndeterminate = false;
                        self.checkAll = false;
                        self.$refs[formName].resetFields();
                        self.couponForm.receiverId = '';
                        self.$alert('发放卡券成功！', {
                            confirmButtonText: '确定',
                            type: 'success',
                        });
                    }
                })
                .catch(function(err){
                    self.$message({
                        type: 'warning',
                        message: '发放卡券失败！'
                    });
                })
            } else {
                return false;
            }
            });
        },

        //明细
        handleDetail(index, rows){
            //console.log(rows[index])
        },

        //表格分页
        handleSizeChange(val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.getTableList()
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getTableList()
        },
    }
}
</script>

<style lang="scss">
  .el-table{
    box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
  }
  .el-tab-pane{
    .el-form{
        .otherInput{
            width: 15% !important;
        }
        .el-input{
            width: 30%;
        }
        .el-select{
            width: 30%;
            .el-input{
            width: 100%;
            }
        }
        .el-checkbox-group{
            width: 30%;
        }
    }
  }
</style>
