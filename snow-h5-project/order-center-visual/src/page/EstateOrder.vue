<template>
  <div class="newEstateOrder" style="padding: 66px 0 36px 0;">
    <navbar
      :title="pageTitle"
      rightIterm="保存"
      @leftBtnTapped="goBack(false)"
      @rightBtnTapped="validateForm('orderform',true)"
      :rightEnable="editable"
    ></navbar>
    <div class="fromSectionBox">
      <el-form ref="orderform" :model="form" :rules="rules" inline-message label-position="left">
        <span class="formBoundary"></span>
        <!-- 下单信息 -->
        <sectionHeader title="下单信息"></sectionHeader>

        <selectIterm
          title="订单类型"
          v-model="form.orderType"
          :options="orderTypeOption"
          @valueChanged="orderTypeChanged($event)"
          prop="orderType"
          :disabled="!editable"
        ></selectIterm>

        <selectIterm
          title="下单部门"
          v-model="form.deptName"
          :options="deptOption"
          valuekey="id"
          :loading="deptLoading"
          @focus="selectDept"
          @valueChanged="deptChanged($event)"
          prop="deptName"
          :disabled="!editable"
        >
        <template slot="customOptions" slot-scope="item">
          <span class="selctItemTitle">{{ item.data.label }}</span>
          <span class="selctItemDes">{{ item.data.orgName }}</span>
        </template>
        </selectIterm>

        <selectIterm
          title="云类型"
          v-model="form.cloudTypeName"
          :options="cloudTypeOption"
          valuekey="id"
          :loading="cloudTypeLoading"
          @focus="selectcloudType"
          @valueChanged="cloudTypeChanged($event)"
          prop="cloudTypeName"
          :disabled="!editable"
        >
        <template slot="customOptions" slot-scope="item">
          <span class="selctItemTitle">{{ item.data.label }}</span>
        </template>
        </selectIterm>
        
        <selectIterm
          title="渠道类型"
          v-model="form.channelName"
          :options="channelOption"
          @valueChanged="channelNameChanged($event)"
          prop="channelName"
          :disabled="!editable"
        ></selectIterm>

        <!-- 渠道城市 -->
        <div class="areaBox" v-if="form.channelName == '2'">
          <el-form-item label="渠道城市" prop="channelCityName" class="selectIterm">
            <el-cascader
              v-model="channelCityName"
              :options="araOption"
              clearable
              :disabled="!(editable)"
              :props="araProps"
            ></el-cascader>
          </el-form-item>
        </div>

        <span class="formBoundary"></span>
        <!-- 项目信息 -->
        <sectionHeader
          title="项目信息"
          rightIterm="选择已有项目"
          @detaile="selectProject"
          :disabled="!(isNewCus && editable)"
        ></sectionHeader>
        <inputIterm
          title="项目名称"
          v-model="form.orderProject.prjName"
          prop="orderProject.prjName"
          :disabled="!(isNewCus && editable)"
        ></inputIterm>

        <selectIterm
          title="集团名称"
          filterable
          remote
          v-model="form.groupId"
          :options="groupOptions"
          :remoteMethod="groupRemoteMethod"
          :loading="groupLoading"
          @valueChanged="groupNameChanged($event)"
          :disabled="!(isNewCus && editable)"
        ></selectIterm>


        <inputIterm
          title="公司名称"
          v-model="form.orderProject.cusName"
          prop="orderProject.cusName"
          :disabled="!(isNewCus && editable)"
        ></inputIterm>
        <!-- 区域模块 -->
        <div class="areaBox">
          <el-form-item label="区域" prop="orderProject.prjCityName" class="selectIterm">
            <el-cascader
              v-model="selectAra"
              :options="araOption"
              clearable
              @change="areaDidChanged"
              :disabled="!(isNewCus && editable)"
              :props="araProps"
            ></el-cascader>
          </el-form-item>
        </div>
        <inputIterm
          title="详细地址"
          v-model="form.orderProject.prjAddr"
          prop="orderProject.prjAddr"
          :disabled="!(isNewCus && editable)"
        ></inputIterm>
        <inputIterm
          title="项目电话"
          v-model="form.orderProject.prjTel"
          type="tel"
          prop="orderProject.prjTel"
          :disabled="!(isNewCus && editable)"
        ></inputIterm>
        <span class="formBoundary"></span>
        <inputIterm
          title="联系人"
          v-model="form.orderProject.contact"
          prop="orderProject.contact"
          :disabled="!editable"
        ></inputIterm>
        <inputIterm
          title="联系人职务"
          v-model="form.orderProject.contactPos"
          prop="orderProject.contactPos"
          :disabled="!editable"
        ></inputIterm>
        <inputIterm
          title="联系人电话"
          v-model="form.orderProject.contactTel"
          type="tel"
          prop="orderProject.contactTel"
          :disabled="!editable"
        ></inputIterm>

        <!-- 选购产品信息 -->
        <span class="formBoundary"></span>
        <sectionHeader title="选购产品" :rightIterm="editable ? '选择' : '查看'" @detaile="selectProducts"></sectionHeader>
        <productView ref="productView" :productData="products" prop="products"></productView>

        <!-- 业绩方案 -->
        <span class="formBoundary"></span>
        <sectionHeader title="业绩" :disabled="!editable"></sectionHeader>
        <!-- <el-form-item prop="planName" >
        <div class="solutionSelected" v-show="!isEmptyPlan" @click="openCurrySolution">
          <i class='el-icon-tickets'></i>
          <label>{{form.planName}}</label>
        </div>
        </el-form-item>-->
        <div class="orderRuleItermsBox">
          <div class="title">
            <label>销售员</label>
          </div>
          <ul class="rulelist">
            <li
              class="ruleIterm"
              v-for="(rule, ruleiIndex) in form.saleList"
              v-bind:key="ruleiIndex"
              @click.self="selectSolution($event,ruleiIndex)"
            >
              <!-- 选取人物 -->
              <el-form-item
                :prop="'saleList.' + ruleiIndex + '.itemCode'"
                :rules="{required: true, message: '请输入后点击备选项', trigger: 'change'}"
              >
                <el-autocomplete
                  class="inline-input personInput"
                  v-model="rule.itemDesc"
                  :fetch-suggestions="querySearch"
                  placeholder="输入人名"
                  :trigger-on-focus="false"
                  :disabled="!editable"
                  @select="handleSelect($event,'saleList',ruleiIndex)"
                  @focus="userNameInputFocus($event,'saleList',ruleiIndex)"
                >
                  <!-- 备选方案 -->
                  <template slot-scope="props">
                    <div class="selctItemTitle">{{ props.item.name }}</div>
                    <span class="selctItemDes">{{ props.item.dep }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <!-- 填写比例 -->
              <inputIterm
                class="rateInput"
                title="比例"
                :value="rule.rate * 100.0"
                @valueChanged="changeRateNumber($event,rule)"
                :prop="'saleList.' + ruleiIndex + '.rate'"
                type="number"
                :rules="{validator: validateRate, trigger: 'change'}"
                :disabled="!editable"
                :clearable="false"
              >
                <template slot="append">%</template>
              </inputIterm>
              <!-- 删除该条 -->
              <el-button
                v-if="editable && ruleiIndex != 0"
                type="text"
                class="deletBtn"
                icon="el-icon-circle-close-outline"
                @click="deleteRule($event,'saleList',ruleiIndex)"
              ></el-button>
            </li>
          </ul>
          <!-- 添加条目 -->
          <el-button
            v-if="editable"
            type="text"
            class="addBtn"
            icon="el-icon-circle-plus-outline"
            @click="addRule($event,'saleList')"
          ></el-button>
          <!-- 运营 -->
          <div class="title">
            <label>运营</label>
          </div>
          <ul class="rulelist">
            <li
              class="ruleIterm"
              v-for="(rule, ruleiIndex) in form.operateList"
              v-bind:key="ruleiIndex"
              @click.self="selectSolution($event,ruleiIndex)"
            >
              <!-- 选取人物 -->
              <el-form-item
                :prop="'operateList.' + ruleiIndex + '.itemCode'"
                :rules="{required: true, message: '请输入后点击备选项', trigger: 'change'}"
              >
                <el-autocomplete
                  class="inline-input personInput"
                  v-model="rule.itemDesc"
                  :fetch-suggestions="querySearch"
                  placeholder="输入人名"
                  :trigger-on-focus="false"
                  :disabled="!editable"
                  @select="handleSelect($event,'operateList',ruleiIndex)"
                  @focus="userNameInputFocus($event,'operateList',ruleiIndex)"
                >
                  <!-- 备选方案 -->
                  <template slot-scope="props">
                    <div class="selctItemTitle">{{ props.item.name }}</div>
                    <span class="selctItemDes">{{ props.item.dep }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <!-- 填写比例 -->
              <inputIterm
                class="rateInput"
                title="比例"
                :value="rule.rate * 100"
                @valueChanged="changeRateNumber($event,rule)"
                :prop="'operateList.' + ruleiIndex + '.rate'"
                type="number"
                :rules="{validator: validateRate, trigger: 'change'}"
                :disabled="!editable"
                :clearable="false"
              >
                <template slot="append">%</template>
              </inputIterm>
              <!-- 删除该条 -->
              <el-button
                v-if="editable && ruleiIndex != 0"
                type="text"
                class="deletBtn"
                icon="el-icon-circle-close-outline"
                @click="deleteRule($event,'operateList',ruleiIndex)"
              ></el-button>
            </li>
          </ul>
          <!-- 添加条目 -->
          <el-button
            v-if="editable"
            type="text"
            class="addBtn"
            icon="el-icon-circle-plus-outline"
            @click="addRule($event,'operateList')"
          ></el-button>
        </div>

        <span class="formBoundary"></span>
        <!-- 其他信息 -->
        <sectionHeader title="其他信息" disabled></sectionHeader>
        <!-- 安装信息 -->
        <switchIterm title="安装服务" v-model="isInstall" :disabled="!editable"></switchIterm>
        <div class="installInfo" v-show="isInstall == '1'">
          <datePickerIterm
            title="安装日期"
            v-model="form.orderInstall.installDate"
            :pickerOptions="pickerOptions"
            prop="orderProject.installDate"
            :disabled="!editable"
          ></datePickerIterm>
          <inputIterm
            title="安装对接人"
            v-model="form.orderInstall.contact"
            prop="orderInstall.contact"
            :disabled="!editable"
          ></inputIterm>
          <inputIterm
            title="对接人电话"
            v-model="form.orderInstall.contactTel"
            type="tel"
            prop="orderInstall.contactTel"
            :disabled="!editable"
          ></inputIterm>
          <inputIterm
            title="环境描述"
            v-model="form.orderInstall.environment"
            type="textarea"
            prop="orderInstall.environment"
            :disabled="!editable"
          ></inputIterm>
        </div>

        <selectIterm
          title="选择系统类型"
          v-model="form.orderOther.sysName"
          valuekey="fId"
          :options="systemOption"
          :loading="systemLoading"
          @focus="selectSystem"
          @valueChanged="systemChanged($event)"
          prop="orderOther.sysName"
          :disabled="!editable"
        ></selectIterm>
        <switchIterm title="3S CALL客服务" v-model="form.orderOther.callFlag" :disabled="!editable"></switchIterm>
        <selectIterm
          title="3S 来电通讯录"
          v-model="type3sCaller"
          valuekey="value"
          :options="callerTypeOption"
          :disabled="!editable"
        ></selectIterm>
        <span class="formBoundary"></span>
        <inputIterm title="备注" v-model="form.remark" type="textarea" :disabled="!editable"></inputIterm>
        <span class="formBoundary"></span>
        <!-- 附件 -->
        <sectionHeader title="附件" disabled></sectionHeader>
        <div class="uploadBox" v-if="!editable">
          <img v-for="file in files" v-bind:key="file.url" :src="file.url" class="fileIterm" />
        </div>

        <div class="uploadBox">
          <el-upload
            v-if="editable"
            list-type="picture-card"
            :action="uploadURL"
            :data="upLoadData"
            :file-list="files"
            :before-upload="beforeUpload"
            :on-success="UploadSuccess"
            :on-error="UploadError"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </div>
      </el-form>
      <el-button
        v-if="editable"
        type="primary"
        class="submitBtn"
        @click="validateForm('orderform',false)"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import productView from "../components/UIComponents/OrderPageProductsInfo";

export default {
  components: {
    productView
  },
  name: "newEstateOrder",
  data() {
    /*产品验证*/
    var validateProducts = (rule, value, callback) => {
      if (this.products.length == 0) {
        console.log("产品为空！");
        callback(new Error("请选择产品"));
      } else {
        this.form.orderProductList = this.products;
        callback();
      }
    };
    /*业绩方案验证*/
    // var validatePlan = (rule, value, callback)=> {
    //   if (this.form.planName == ""){
    //     console.log("业绩方案为空！")
    //     callback(new Error('请选择业绩方案'));
    //   } else {
    //     callback();
    //   }
    // };
    /*安装信息验证*/
    var validateInstall = (rule, value, callback) => {
      if (this.isInstall == "0") {
        callback();
        return;
      } else {
        switch (rule.field) {
          case "orderInstall.installDate":
            if (!value || value.length < 2) {
              callback(new Error());
            } else {
              callback();
            }
            break;
          case "orderInstall.contact":
            if (!value || value.length < 2) {
              callback(new Error());
            } else {
              callback();
            }
            break;
          case "orderInstall.contactTel":
            if (!value || value.length < 8) {
              callback(new Error());
            } else {
              callback();
            }
            break;
        }
      }
    };

    return {
      //是否是新建订单
      isNewOrder: true,
      //标题
      pageTitle: "地产订单",
      //订单 ID
      formId: null,
      //是否可以编辑
      editable: true,
      //form数据
      form: {
        planName: "",
        orderProject: {
          prjName: null,
          cusName: null,
          prjCityName: null,
          prjAddr: null,
          prjTel: null,
          contact: null,
          contactPos: null,
          contactTel: null
        },
        orderOther: {
          callFlag: "0",
          common3s: "0",
          connect3s: "0"
        },
        orderInstall: { isInstall: "0" },
        saleList: [
          {
            itemCode: this.gsNative.gsNativeUserCode(),
            itemDesc: this.gsNative.gsNativeUserName(),
            rate: 1
          }
        ],
        operateList: [
          {
            itemCode: null,
            itemDesc: null
          }
        ]
      },
      //表单验证规则
      rules: {
        //下单信息
        orderType: [
          { required: true, message: "请选择订单类型", trigger: "change" }
        ],
        deptName: [
          { required: true, message: "请选择下单部门", trigger: "change" }
        ],
        cloudTypeName:[
          { required: true, message: "请选择下单云类型", trigger: "change" }
        ],
        channelName: [
           { required: true, message: "请选择渠道类型", trigger: "change" }
        ],
        channelCityName: [
          { required: false, message: "请选择渠道城市", trigger: "change" }
        ],
        //项目信息
        "orderProject.prjName": [
          { required: true, message: "请输入项目名称", trigger: "change" }
        ],
        "orderProject.cusName": [
          { required: true, message: "请输入公司名称", trigger: "change" }
        ],
        "orderProject.prjCityName": [
          { required: true, message: "请选择具体城市", trigger: "change" }
        ],
        "orderProject.prjAddr": [
          { required: true, message: "请填写具体地址", trigger: "change" }
        ],
        "orderProject.prjTel": [
          { required: true, message: "正确填写联系电话", trigger: "change" }
        ],
        "orderProject.contact": [
          { required: true, message: "请填写联系人", trigger: "change" }
        ],
        "orderProject.contactPos": [
          { required: true, message: "请填写联系人职务", trigger: "change" }
        ],
        "orderProject.contactTel": [
          { required: true, message: "联系人电话不能为空", trigger: "blur" },
          { pattern: /^1[3-9]\d{9}$/g, message: "请正确填的联系方式" }
        ],
        products: [{ validator: validateProducts, trigger: "change" }],
        // planName: [
        // {validator: validatePlan, trigger: 'change'}
        // ],
        "orderOther.sysName": [
          {
            required: true,
            min: 2,
            message: "请选择对接系统类型",
            trigger: "change"
          }
        ],
        "orderInstall.installDate": [
          {
            validator: validateInstall,
            message: "请选择安装日期",
            trigger: "change"
          }
        ],
        "orderInstall.contact": [
          {
            validator: validateInstall,
            message: "请填写对接人",
            trigger: "blur"
          }
        ],
        "orderInstall.contactTel": [
          {
            validator: validateInstall,
            min: 8,
            message: "请选准确填写对接人电话",
            trigger: "blur"
          }
        ]
      },
      //区域备选项
      araOption: [],
      // 选定渠道城市
      channelCityName: [],
      //选定区域
      selectAra: [],
      //区域空间配置
      araProps: { children: "children", value: "label" },
      //是否是新商家：（控制客户信息是否编辑）
      isNewCus: true,
      // 集团信息
      groupLoading: false,
      groupOptions: [],
      
      //选择产品
      products: [],
      orderTypeOption: [
        {
          value: "BZ",
          label: "标准订单"
        },
        {
          value: "XF",
          label: "续费订单"
        },
        {
          value: "SB",
          label: "设备追加"
        }
      ],
      // 渠道类型枚举 
      channelOption: [
        {
          value: "0",
          label: "直销"
        },
        {
          value: "1",
          label: "直渠"
        },
        {
          value: "2",
          label: "渠道"
        },
        {
          value: "3",
          label: "自渠"
        }
      ],
      //是否需要安装服务
      isInstall: "0",
      //没有选择 Plan
      isEmptyPlan: true,
      //日期限制
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      //销售部门
      deptOption: [],
      deptLoading: false,
      //云类型
      cloudTypeOption: [],
      cloudTypeLoading: false, 

      //系统类型
      systemOption: [],
      systemLoading: false,
      selectSys: {},
      //是否3SCall客
      is3SCaller: "0",
      //3S 来电通讯录
      type3sCaller: null,
      callerTypeOption: [
        {
          label: "无",
          value: null
        },
        {
          label: "3S来电通用版",
          value: true
        },
        {
          label: "3S来电对接版",
          value: false
        }
      ],
      //上传的参数
      uploadURL: global.ERP_BASE_URL + "/erp/file/oss/upload",
      upLoadData: {
        type: "order",
        fileName: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      files: [],
      /*验证比例*/
      validateRate: (rule, value, callback) => {
        if (value > 1) {
          callback(new Error("比例错误"));
        } else {
          callback();
        }
      }
    };
  },
  watch: {
    // 同步渠道城市
    channelCityName: function(val) {
      console.log("渠道城市改变", val)
      if (val) {
        this.$set(this.form, "channelCityName", val[2])
      }
    },
    //同步地址选结果
    selectAra: function(val) {
      console.log("项目区域改变");
      this.form.orderProject.prjCityName = val[2];
      this.form.orderProject.prjCity = "";
      this.form.orderProject.prjProvinceName = val[1];
      this.form.orderProject.prjProvince = "";
      this.form.orderProject.prjAreaName = val[0];
      this.form.orderProject.prjArea = "";
    },
    // 选购产品发生改变
    products: function(val) {
      console.log("产品发生改变");
      this.form.orderProductList = val;
      this.$refs.productView.reload(val);
    },
    //同步是否安装
    isInstall: function(val) {
      console.log("安装服务改变");
      this.form.orderInstall.isInstall = val;
    },
    //同步是否3Scall 客
    is3SCaller: function(val) {
      console.log("call客状态改变");
      this.form.orderOther.isInstall = val ? "1" : "0";
    },
    type3sCaller: function(val) {
      console.log("3sCall 客类型改变");
      this.form.orderOther.common3s = val != null && val ? "1" : "0";
      this.form.orderOther.connect3s = val != null && !val ? "1" : "0";
    }
  },
  /*创建前*/
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#F0F2F5");
    console.log("验证 Native");
    let verify = this.gsNative.gsNativeVerify();
    console.log(verify);
    if (verify == null) {
      // this.$notify.error({
      //   title: "错误",
      //   message: "用户信息获取失败！"
      // });
    }
  },
  /*创建时*/
  created() {
    this.loadBaseAreaOptons();
    console.log(this.gsNative.gsNativeUserId());
    if (this.$route.query.id == null) {
      //新建
      this.isNewOrder = true;
      this.pageTitle = "创建订单";
    } else {
      //历史订单
      this.isNewOrder = false;
      this.formId = this.$route.query.id;
      this.pageTitle = this.$route.query.title;
      this.loadOrderInfo();
    }
  },
  /*激活时*/
  activated() {
    //根据key名获取传递回来的参数，data就是map
    //选择产品后回调
    this.eventBus.$on(
      "productPageGiveBack",
      function(data) {
        this.products = data;
        console.log("收到 products   " + this.products);
        this.$refs.orderform.validateField("products");
        this.eventBus.$off("productsSelect");
      }.bind(this)
    );

    //选择已有项目的回调
    this.eventBus.$on(
      "customSelect",
      function(data) {
        console.log("收到 Custom   ");
        console.log(data);
        this.customInfoSearch(data);
        this.eventBus.$off("customSelect");
      }.bind(this)
    );

    //选择提成方案

    // this.eventBus.$on('solutionSelect',function(data){
    //   console.log( "收到 Solution   ", data);
    //   this.isEmptyPlan = false
    //   this.form.planId = data.id
    //   this.form.planName = data.planName

    //   this.form.ruleId = data.ruleId
    //   this.form.ruleName = data.ruleName

    //   this.form.unitList = data.unitList
    //   this.$refs.orderform.validateField('planName');
    //   this.eventBus.$off('solutionSelect');
    // }.bind(this));
  },
  methods: {
    //返回上一级
    goBack(refresh) {
      this.gsNative.goback(refresh);
      // this.$router.goBack()
    },
    /*点击选择销售部门触发*/
    selectDept(event) {
      if (this.deptOption.length == 0) {
        //加载备选项
        this.deptLoading = true;
        console.log("开始加载部门信息");
        let self = this;
        let url = global.ERP_BASE_URL + "/erp/saler/dept";
        let params = {
          token: this.gsNative.gsNativeToken(),
          userId: this.gsNative.gsNativeUserId()
        };
        let options = {
          timeout: 30 * 1000,
          params: params
        };
        self.$http.get(url, options).then(
          function(data) {
            self.deptLoading = false;
            if (data.body.msg) {
              self.showError(data.body.msg);
            } else {
              let info = data.body.data;
              if (info == null) {
                self.showError("未能加载部门信息！");
                return;
              }
              console.log("部门 response:", info);
              self.deptOption = info.map(function(dept) {
                return {
                  label: dept.name,
                  key: dept.id,
                  orgName: dept.orgName,
                  value: {
                    name: dept.name,
                    id: dept.id,
                    orgName: dept.orgName,
                    orgId: dept.orgId
                  }
                };
              });
            }
          },
          function(error) {
            self.deptLoading = false;
            self.showError("加载部门信息失败！");
          }
        );
      } else {
        return;
      }
    },
    /*点击选择云类型触发*/
    selectcloudType(event) {
      if (this.cloudTypeOption.length == 0) {
        //加载备选项
        this.cloudTypeLoading = true;
        console.log("开始加载云类型信息");
        let self = this;
        let url = global.ERP_BASE_URL + "/erp/assistant/combo/list"
        let params = {
          token: this.gsNative.gsNativeToken(),
          userId: this.gsNative.gsNativeUserId(),
          grpNum: 'CLOUD'
        };
        let options = {
          timeout: 30 * 1000,
          params: params
        };
        self.$http.get(url, options).then(
          function(data) {
            self.cloudTypeLoading = false;
            if (data.body.msg) {
              self.showError(data.body.msg);
            } else {
              let info = data.body.data;
              if (info == null) {
                self.showError("未能加载云类型信息！");
                return;
              }
              console.log("云类型 response:", info);
              self.cloudTypeOption = info.map(function(clould) {
                return {
                  label: clould.label,
                  key: clould.fId,
                  value: {
                    name: clould.label,
                    id: clould.fId
                  }
                };
              });
            }
          },
          function(error) {
            self.deptLoading = false;
            self.showError("加载云类型信息失败！");
          }
        );
      } else {
        return;
      }
    },

    /*选定下单部门*/
    deptChanged(event) {
      this.products = []
      if (typeof event == "object") {
        this.form.deptName = event.name;
        this.form.deptCode = event.id;
        this.form.orgName  = event.orgName;
        this.form.orgId    = event.orgId;
      }
    },
    /*选定下单云类型*/
    cloudTypeChanged(event) {
      this.products = []
      if (typeof event == "object") {
        this.form.cloudTypeName = event.name;
        this.form.cloudTypeId = event.id;
      }
    },

    /*下单类型改变*/
    orderTypeChanged(event) {
      console.log("下单类型", typeof event);
      
      if (typeof event == "string") {
          this.form.saleList = [
            {
              itemCode: null,
              itemDesc: null
            }
          ],
          this.form.operateList = [
            {
              itemCode: null,
              itemDesc: null
            }
          ];

        // if (event == "XF") {
        //   this.form.saleList = [
        //     {
        //       itemCode: null,
        //       itemDesc: null
        //     }
        //   ],
        //     this.form.operateList = [
        //       {
        //         itemCode: this.gsNative.gsNativeUserCode(),
        //         itemDesc: this.gsNative.gsNativeUserName(),
        //         rate: 1
        //       }
        //     ];
        // } else {
        //   this.form.operateList = [
        //     {
        //       itemCode: null,
        //       itemDesc: null
        //     }
        //   ];
        //   this.form.saleList = [
        //     {
        //       itemCode: this.gsNative.gsNativeUserCode(),
        //       itemDesc: this.gsNative.gsNativeUserName(),
        //       rate: 1
        //     }
        //   ];
        // }
      }
    },

     /*渠道类型改变*/
    channelNameChanged(event) {
      console.log("渠道类型", event, this.form);
      this.channelCityName = []
      this.rules.channelCityName[0].required = event == '2'
    },

    /*加载区域信息*/
    loadBaseAreaOptons() {
      console.log("开始加载基本区域信息");
      this.loadAreaOptons("Provincial");
    },
    loadAreaOptons(code) {
      console.log("开始加载区域信息" + code);
      let self = this;
      let url = global.ERP_BASE_URL + "/erp/area/info";
      let params = { token: this.gsNative.gsNativeToken() };
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options).then(
        function(data) {
          console.log(data);
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            if (info == null) {
              self.showError("未能加载地域信息！");
              return;
            }
            console.log(info);
            //根据收到的数据赋值以及禁用
            if (code == "Provincial") {
              self.araOption = info;
              // let city = '重庆市'
              // self.channelCityName = self.setchannelCity(city)
            }
          }
        },
        function(error) {
          console.log(error);
          self.showError("加载区域信息失败！");
        }
      );
    },
    /*地址改变*/
    areaDidChanged(val) {
      console.log("联级控件Change回调触发");
      //使用观察方式、保证已有项目回写数据
      // this.form.orderProject.prjCityName = val[2]
      // this.form.orderProject.prjCity = ''
      // this.form.orderProject.prjProvinceName = val[1]
      // this.form.orderProject.prjProvince = ''
      // this.form.orderProject.prjAreaName = val[0]
      // this.form.orderProject.prjArea = ''
    },

    /** 搜索集团 */
    groupRemoteMethod(query) {
      console.log(query)
      this.groupLoading = true
      
      let self = this;
      let url = global.ERP_BASE_URL + "/erp/project/group";
      let params = { token: this.gsNative.gsNativeToken() , name: query};
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options)
        .then((data)=> {
          this.groupLoading = false
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data.map((item)=> {
              return { label: item.name,value: item.id }
            })

            this.groupOptions = info
          }
        }).catch((e)=> {
          this.groupLoading = false
          self.showError(e);
        })
    },

    /** 选中集团 */
    groupNameChanged(val, val2) {
      var selectGroup = this.groupOptions.filter((item)=>{ return item.value == val})[0]
      console.log("选中",selectGroup)
      this.form.groupName = selectGroup.label
      console.log(this.form)
    },

    /*加载订单详情*/
    loadOrderInfo() {
      let loadingInstance = this.$loading({ text: "信息加载中..." });
      let self = this;

      // let url = global.SNOW_TRANS_URL;
      // let params = {
      //   type: "GET",
      //   path: global.OrderCenter_URL + "/order/order-main/" + this.formId,
      //   data: {}
      // };
      // let options = {
      //   timeout: 30 * 1000
      // };
      // let jsonParams = JSON.stringify(params);
      // self.$http.post(url, jsonParams, options).then(

      let url = global.OrderCenter_URL + "/order-main/";
      let options = {
        timeout: 30 * 1000
      };
      self.$http.get(url + this.formId, options).then(
        function(data) {
          console.log(data);
          loadingInstance.close();
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body;
            if (info == null || info == "") {
              self.showError("未能查到该订单！");
              setTimeout(function timer() {
                self.goBack(false);
              }, 1000);
              return;
            }
            //根据收到的数据赋值以及禁用
            console.log("加载详情：");
            console.log(info);
            self.form = info;
            // 渠道城市设置
            let city = info.channelCityName
            self.channelCityName = self.setchannelCity(city)
            self.pageTitle = info.orderProject.prjName;
            self.selectAra = [
              info.orderProject.prjAreaName,
              info.orderProject.prjProvinceName,
              info.orderProject.prjCityName
            ];
            self.isInstall = info.orderInstall.isInstall;
            self.products = info.orderProductList;
            self.editable = info.orderStatus == "A" || info.orderStatus == "D";
            self.isEmptyPlan = info.planName == null;
            self.isNewCus = info.projectFlag == "0";
            //call客通讯录
            if (info.orderOther.common3s == "1") {
              self.type3sCaller = true
            } else if (info.orderOther.connect3s == "1") {
              self.type3sCaller = false
            } else {
              self.type3sCaller = null
            }
            self.files = info.filesList.map(function(file) {
              return { url: file.filePath, name: file.fileName };
            });
            // 配置集团显示
            if (info.groupName != null && info.groupId != null) {
              this.groupOptions = [{label: info.groupName, value: info.groupId}]
            }
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("订单详情加载失败");
          self.goBack(false);
        }
      );
    },
    /*右导航栏 点击保存*/
    saveForm(isSave) {
      this.form.userId = this.gsNative.gsNativeUserId();
      this.form.token = this.gsNative.gsNativeToken();
      this.form.dataSource = "H5";
      this.form.orderProject.busType = "5699aa40ec7e60";
      this.form.synStatus = isSave ? "0" : "1";
      this.form.orderStatus = isSave ? "A" : "B";
      this.form.projectFlag = this.isNewCus ? "0" : "1";
      this.form.synFlag = "H5";

      // console.log(this.form.orderProductList[0].caseModelName ,this.form.orderProductList[0].caseModel)
      this.form.materialGroupName = this.form.orderProductList[0].caseModel

      // let deviceNumber = this.$refs.productView.devices.length
      // let serverNumber = this.$refs.productView.servers.length
      // this.form.orderType = "BZ"
      // if (deviceNumber == 0) {
      //   this.form.orderType = "XF"
      // }else if (serverNumber == 0) {
      //   this.form.orderType = "SB"
      // }

      this.form.filesList = this.files.map(function(file) {
        return { filePath: file.url, fileName: file.name, fileType: file.type };
      });

      console.log("表单：");
      console.log(this.form);
      let loadingInstance = this.$loading({ text: "提交中..." });
      let self = this;

      // let url = global.SNOW_TRANS_URL;
      // let params = {
      //   type: this.isNewOrder ? "POST" : "PUT",
      //   path: global.OrderCenter_URL + "/order/order-main/",
      //   data: JSON.stringify(this.form),
      // };
      // let options = {
      //   timeout: 30 * 1000
      // };
      // let jsonParams = JSON.stringify(params);
      // console.log("jsonParams :" + jsonParams);
      // self.$http.post(url, jsonParams, options).then(

      let url = global.OrderCenter_URL + "/order-main/";
      let options = {
        timeout: 30 * 1000
      };
      let jsonParams = JSON.stringify(this.form);
      console.log("jsonParams :" + jsonParams);
      let networkFunction = this.isNewOrder
        ? this.$http.post(url, jsonParams, options)
        : this.$http.put(url, jsonParams, options);
      networkFunction.then(
        function(data) {
          loadingInstance.close();
          console.log("提交返回：");
          console.log(data);
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            self.showSucceed("提交成功！");
            setTimeout(function timer() {
              self.goBack(true);
            }, 750);
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("操作订单失败！");
        }
      );
    },

    /*根据城市名返回城市完整路径*/
    setchannelCity(cityName, soureOptions = this.araOption, result = []) {
      for(var i = 0; i < soureOptions.length; i++) {
        var tmpPath = result.concat();
        let currentNode = soureOptions[i]
        tmpPath.push(currentNode.label);
        // console.log('TARGET ', cityName, '------>', currentNode.label)
        if(cityName == currentNode.label && (!currentNode.children || currentNode.children.length <= 0 )) {
          return tmpPath;
        }
        if(currentNode.children) {
          var findResult = this.setchannelCity(cityName, currentNode.children, tmpPath);
          if(findResult) {
            return findResult;
          }
        }
      }
    },
    /*选择已有项目*/
    selectProject() {
      this.$router.gspush({ name: "CustomSearch", query: {} });
    },
    /*已有项目信息查询*/
    customInfoSearch(custom) {
      if (custom.prjName == null) {
        return;
      }
      let loadingInstance = this.$loading({ text: "客户信息查询中..." });
      let self = this;
      let url = global.ERP_BASE_URL + "/erp/sale/order/get/project/msg";
      let params = {
        token: this.gsNative.gsNativeToken(),
        project: custom.prjName
      };
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options).then(
        function(data) {
          loadingInstance.close();
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            if (info == null) {
              self.showError("未能查到该项目！");
              return;
            }
            //根据收到的数据赋值以及禁用
            console.log(info);
            self.form.orderProject.prjName = info.proName;
            self.form.orderProject.cusName = info.cusName;
            self.selectAra = [info.areaName, info.provinceName, info.cityName];
            self.form.orderProject.prjAddr = info.address;
            self.form.orderProject.prjTel = info.serTel;
            self.form.orderProject.contact = info.linker;
            self.form.orderProject.contactPos = info.position;
            self.form.orderProject.contactTel = info.telephone;
            self.form.orderProject.prjNo = custom.fId;
            console.log(custom.fId);

            self.form = self.form;
            self.isNewCus = false;
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("已有项目查找失败");
        }
      );
    },
    /* 选购产品 */
    selectProducts() {

      if (this.editable && (!this.form.orgId || !this.form.cloudTypeId) ) {
        // 编辑时没有填写云类型，和 部门不允许进入选择
        this.showError('请先完善下单部门、云类型')
        return
      }

      window.localStorage.setItem(
        "ProductEntryToProductPage",
        JSON.stringify(this.products)
      );
      this.$router.gspush({
        name: "ProductPage",
        query: { editable: this.editable, orgId: this.form.orgId, cloudTypeId: this.form.cloudTypeId }
      });
    },
    /*选择业绩方案*/
    // selectSolution(){
    //   this.$router.gspush({ name: 'SolutionList'});
    // },
    /*选择编辑当前已有方案*/
    // openCurrySolution(){
    //   var solution = {}
    //   solution.id       = this.form.planId
    //   solution.planName = this.form.planName
    //   solution.ruleId   = this.form.ruleId
    //   solution.ruleName = this.form.ruleName
    //   solution.unitList = this.form.unitList
    //   window.localStorage.setItem('currySolution',JSON.stringify(solution));
    //   this.$router.gspush({ name: 'CurrySolutionEdit' ,  query: {editable: this.editable}});
    // },

    //业绩方案相关
    //模糊搜索人员
    querySearch(queryString, cb) {
      let self = this;
      let url = global.SNOW_TRANS_URL;
      let params = {
        // type: "POST",
        // path: global.EHR_URL + "/ext/emp/query",
        // data: {
        //   isPage: false,
        //   empName: queryString
        // }

        type: "GET",
        path: global.SALES_URL + `/relation/order?empName=${queryString}`
        
      };
      let jsonParams = JSON.stringify(params);
      console.log(jsonParams)
      self.$http.post(url, jsonParams, self.httpOptions).then(
        function(data) {
          console.log("人员查询接口 Response：");
          console.log(data);
          if (!data.data.flag) {
            self.showError(data.data.msg);
            cb([]);
            return;
          } else {
            let infos = data.data.data;
            if (infos == null) {
              self.showError("未能查到该项目！");
              cb([]);
              return;
            }
            console.log(infos)
            infos.forEach(function(p) {
              p.name = p.salesName;
              p.dep = p.k3Name;
            });
            cb(infos);
          }
        },
        function(error) {
          self.showError(error.data.msg);
        }
      );
    },
    //模糊搜索选中
    handleSelect(item, unit, ruleiIndex) {
      console.log("人员选中", item, unit, ruleiIndex);
      // this.solutionInfo.unitList[unitIndex].details[ruleiIndex].itemDesc = "11";
      this.form[unit][ruleiIndex].itemCode = item.sales;
      this.form[unit][ruleiIndex].itemDesc = item.name + " ";
      this.form[unit][ruleiIndex].deptCode = item.k3Code;
      console.log(this.form[unit][ruleiIndex]);
    },
    //处理人名输入获得焦点
    userNameInputFocus(item, unit, ruleiIndex) {
      console.log(item);
      console.log(unit);
      console.log(ruleiIndex);
      this.form[unit][ruleiIndex].itemCode = null;
      this.form[unit][ruleiIndex].itemDesc = null;
    },
    //点击删除某一条rule
    deleteRule(event, unit, ruleiIndex) {
      console.log("删除" + "单元" + unit + "项目" + ruleiIndex.toString());
      if (this.form[unit].length <= 1) {
        this.showError("请至少保留一条规则！");
      } else {
        this.form[unit].splice(ruleiIndex, 1);
      }
    },
    //添加 rule
    addRule(event, unit) {
      console.log("添加" + unit);
      let newrule = {
        itemCode: "",
        itemDesc: "",
        rate: 0
      };
      if (this.form[unit] == null) {
        this.form[unit] = [];
      }
      this.form[unit].push(newrule);
    },
    //处理百分比数据
    changeRateNumber(rateNumber, rule) {
      rule.rate = rateNumber / 100.0;
      console.log(rule);
    },

    /*点击选择系统类型触发*/
    selectSystem(event) {
      console.log("触发");
      if (this.systemOption.length == 0) {
        //加载备选项
        this.systemLoading = true;
        let self = this;
        let url = global.ERP_BASE_URL + "/erp/assistant/combo/list";
        let params = {
          token: this.gsNative.gsNativeToken(),
          grpNum: "ZDY_ESTATE_TYPE"
        };
        let options = {
          timeout: 30 * 1000,
          params: params
        };
        self.$http.get(url, options).then(
          function(data) {
            self.systemLoading = false;
            if (data.body.msg) {
              self.showError(data.body.msg);
            } else {
              let info = data.body.data;
              if (info == null) {
                self.showError("数据获取失败！");
                return;
              }
              console.log("SystemList response:", info);
              info.forEach(function(p) {
                p.key = p.fId;
                p.value = { fId: p.fId, label: p.label };
              }, self);
              self.systemOption = info;
            }
          },
          function(error) {
            self.systemLoading = false;
            self.showError("数据获取失败！");
          }
        );
      } else {
        return;
      }
    },
    /*选定系统类型*/
    systemChanged(event) {
      console.log(event);
      if (typeof event == "object") {
        this.form.orderOther.sysFlag = "1";
        this.form.orderOther.sysName = event.label;
        this.form.orderOther.sysCode = event.fId;
      }
    },
    /*附件上传相关*/
    beforeUpload(file) {
      //文件上传之前获取文件名
      console.log(file);
      this.upLoadData.fileName = file.name;
      this.upLoadData.fileType = file.type;
    },
    UploadSuccess(response, file) {
      //文件上传成功后
      console.log(file);
      let result = {};
      result.name = response.filename;
      result.url = response.datas;
      result.type = file.type;
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      this.files.push(result);
    },
    UploadError(err, file, fileList) {
      //文件上传失败
      this.showError("上传失败");
    },
    handleRemove(file, fileList) {
      //删除上传的文件
      console.log(file);
      let index = this.files.indexOf(file);
      this.files.splice(index, 1);
    },

    /*验证提成比例*/
    valiSolutionRate(list) {
      var rate = 0.0;
      list.forEach(function(item) {
        rate += item.rate;
      });
      return rate == 1.0;
    },
    /*表单验证*/
    validateForm(formName, isSave) {
      if (!this.editable) {
        return;
      }
      let self = this;
      console.log("开始表单验证");
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          //成功回调
          console.log("表单验证成功");
          console.log(this.form);
          if (
            this.valiSolutionRate(this.form.saleList) &&
            this.valiSolutionRate(this.form.operateList)
          ) {
            self.saveForm(isSave);
            return true;
          } else {
            this.showError("提成比例有误，请检查后再试");
            return false;
          }
        } else {
          //失败
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.newEstateOrder {
  width: 100%;
  background: @fromBackColor;

  .formBoundary {
    height: 20px;
    display: block;
  }

  .areaBox {
    .el-cascader {
      width: 100%;
    }
    .el-cascader.is-disabled .el-cascader__label {
      color: @disabelText;
    }
  }
  .inputIterm {
    background-color: #fff;
  }
  .orderRuleItermsBox {
    padding: 2.5%;
    background: #ffffff;

    .addBtn {
      font-size: 28px;
    }

    .title {
      display: block;
      text-align: left;
      font-family: @textstyle;
      font-size: @textCommonFont;
    }
    .ruleIterm {
      // height: 45px;
      min-height: 45px;
      display: flex;
      justify-content: space-between;
      .personInput {
        display: flex;
        margin-bottom: 0px;
        padding: 0px;
        background-color: #fff;
        border: none;
        // border-bottom: 0.5px solid @borderColor;
      }
      .rateInput {
        width: 40%;
        border: none;
        .el-form-item__label {
          width: 50px;
          padding: 0px;
        }
      }
      .el-input__inner {
        height: 44.5px;
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0px;
        border-bottom-width: 0.5px;
      }
      .el-input.is-disabled .el-input__inner {
        background-color: #fff;
      }
      .el-input-group__append {
        background-color: transparent;
        border: none;
        color: #606266;
        padding: 0px;
      }
      .el-form-item__content {
        width: 100%;
      }

      .el-input__inner {
        padding: 0px 10px;
        text-align: center;
      }

      .deletBtn {
        font-size: 20px;
      }
    }
  }

  .fileIterm {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }

  .uploadBox {
    background-color: #fff;
    padding: 10px;
  }
  .submitBtn {
    width: 100%;
    margin-top: 20px;
  }
}


//模糊搜索选项信息
  .el-autocomplete-suggestion li {
    // border-bottom: 0.5px solid @borderColor;
    padding: 2px 5px;
  }
  .selctItemDes {
    padding: 0 20px;
    text-align: left;
    line-height: 10px;
    color: #8492a6; 
    font-size: 10px
  }
  .selctItemTitle {
    padding: 0 20px;
    line-height: 20px;
    text-align: left;
    font-size: 14px;
  }

.el-cascader-menu {
  min-width: 100px !important;
}

</style>
