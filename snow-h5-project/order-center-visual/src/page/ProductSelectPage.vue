<template>
  <div class="newEstateOrder" style="padding: 66px 0 36px 0;">
    <!-- <navbar title="选择产品" rightIterm="保存" @leftBtnTapped="goBack" @rightBtnTapped="saveProduct"></navbar> -->
    <navbar title="添加案场产品" @leftBtnTapped="goBack"></navbar>
    <!-- 业务类型选择 -->
    <div class="businessTypeBox">
      <el-form ref="businessType" :rules="businessTypeRules" inline-message label-position="left">
        <el-form-item label="业务类型" prop="businessType" class="selectIterm">
          <el-cascader
            v-model="businessType"
            :options="businessTypeOption"
            clearable
            @change="businessTypeDidChanged"
            :props="{'value':'fId'}"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </div>

    <!-- 服务 -->
    <div class="servers">
      <div class="sectionHeader">服务项目与费用</div>
      <div class="serverBox" v-for="(item, index) in servers" :key="item.idx">
        <el-form :model="item">
          <!-- <el-button class="deleteBtn" v-show="item.idx > 0" @click="serveRemove(index)"><i class="el-icon-close"></i></el-button> -->
          <el-button class="deleteBtn" @click="serveRemove(index)">
            <i class="el-icon-close"></i>
          </el-button>
          <searchSelectIterm
            title="服务项目"
            v-model="item.productName" 
            :options="caseModel && serveInfo[caseModel] ? serveInfo[caseModel] : []"
            valuekey="label"
            @valueChanged="serverChanged($event, index)"
            placeholder="请选择服务项目"
          ></searchSelectIterm>

          <inputIterm title="服务期限" v-model="item.serviceMonth" type="number">
            <template slot="append">月</template>
          </inputIterm>

          <inputIterm title="服务费用" type="number" v-model="item.amount">
            <template slot="append">元</template>
          </inputIterm>
        </el-form>
      </div>

      <el-button class="addProductBtn" icon="el-icon-plus" @click="addServe"></el-button>
    </div>

    <!-- 设备 -->
    <div class="device">
      <div class="sectionHeader">设备</div>
      <div class="deviceBox" v-for="(item, index) in devices" :key="item.idx">
        <el-form :model="item">
          <!-- <el-button class="deleteBtn" v-show="item.idx > 0" @click="deviceRemove(index)" ><i class="el-icon-close"></i></el-button> -->
          <el-button class="deleteBtn" @click="deviceRemove(index)">
            <i class="el-icon-close"></i>
          </el-button>
          <searchSelectIterm
            title="设备"
            v-model="item.productName"
            :options="caseModel ? deviceInfo[caseModel] : [] "
            valuekey="label"
            @valueChanged="devicesChanged($event, index)"
            placeholder="请选择设备"
          ></searchSelectIterm>

          <el-form-item label="数量" class="inputIterm">
            <el-input-number v-model="item.num" :min="1" label="描述文字"></el-input-number>
          </el-form-item>

          <inputIterm title="价格" type="number" v-model="item.amount"></inputIterm>
        </el-form>
      </div>

      <el-button class="addProductBtn lastBtn" icon="el-icon-plus" @click="addDevice"></el-button>
    </div>

    <el-button type="primary" class="saveBtn" @click="saveProduct">确认添加</el-button>
  </div>
</template>


<script>
export default {
  // name: ' productsInfo',
  data() {
    /**
     *  校验业务类型必填
     */
    var validateBusinessType = (rule, value, callback) => {
      if (this.businessType && this.businessType.length > 0) {
        callback();
      } else {
        console.log("业务类型为空");
        callback(new Error("请选择具体业务类型"));
      }
    };
    return {
      // 是否新建卡片 或 已有业务再次编辑
      isNewCard: true,
      // 已有业务再次编辑原始的业务类型
      originalBusinessType: null,
      // 选择的数据
      businessType: null,
      // 根据选择数据配置需要案场类型 ID
      caseModel: null,
      // 选择的产品设备信息
      servers: [],
      devices: [],
      // 备选的数据
      serveInfo: {},
      deviceInfo: {},
      businessTypeOption: [],
      // form 检查项目
      businessTypeRules: {
        businessType: [
          {
            validator: validateBusinessType,
            message: "请选择具体业务类型",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    //同步地址选结果
    businessType: function(val) {
      //   console.log("业务类型发生改变", val);
      if (val == null || val.length < 2) {
        this.caseModel = null;
      } else {
        this.caseModel = val[1];
      }
    }
  },
  beforeCreate() {},
  created() {
    this.findProduct();
    this.configBussinessOptions();

    this.isNewCard = this.$route.query.isNew;
    if (!this.isNewCard) {
      console.log("收到产品信息：\n");
      let productInfo = JSON.parse(
        window.localStorage.getItem("BussinessProductInfo")
      );
      this.businessType = productInfo.businessType;
      this.originalBusinessType = productInfo.businessType;
      var productEntity = productInfo.productEntity;
      console.log(productEntity);
      this.configEntity(productEntity);
    } else {
      this.configEntity([]);
    }
  },
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    this.eventBus.$off("productsSelect");
  },
  methods: {
    /**
     * 配置业务类型备选项
     */
    configBussinessOptions() {
      let teams = JSON.parse(window.localStorage.getItem("PROJECT_TEAM"));
      let businessTypes = JSON.parse(
        window.localStorage.getItem("BUSINESS_TYPES")
      );
      teams.forEach(team => {
        var businessList = [];
        businessTypes.forEach(business => {
          if (business.parent == team.fId) {
            businessList.push(business);
          }
        });
        team.children = businessList;
      });

      this.businessTypeOption = teams;
    },

    configEntity(productEntity) {
      //初始化数据
      if (!productEntity || productEntity.length == 0) {
        //没有数据，直接初始化
        this.servers = [
          {
            idx: 0,
            serviceMonth: "12",
            productId: "",
            productName: "",
            amount: "",
            reAmount: "0",
            num: 1,
            depositPrice: "",
            depositPriceAmount: "",
            taxPrice: null
          }
        ];
        this.devices = [
          {
            idx: 0,
            serviceMonth: "0",
            productId: "",
            productName: "",
            amount: "",
            reAmount: "",
            num: 1,
            depositPrice: "",
            depositPriceAmount: "",
            taxPrice: null
          }
        ];
      } else {
        //有历史数据，根据数据初始化
        console.log("有历史数据，根据数据初始化");
        let idxS = -1;
        let idxD = -1;
        console.log(typeof productEntity);

        productEntity.forEach(function(p) {
          let code = p.productName.slice(-2);
          if (code == "服务") {
            this.servers.push(p);
            p.idx = idxS + 1;
            idxS += 1;
          } else {
            this.devices.push(p);
            p.idx = idxD + 1;
            idxD += 1;
          }
        }, this);
      }
    },

    findProduct() {
      //查询服务和设备信息
      let self = this;
      let url = global.ERP_BASE_URL + "/erp/product/list";
      let params = {
        token: this.gsNative.gsNativeUserId(),
        types: "2,6",
        cusType: "002"
      };

      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      let loadingInstance = this.$loading({ text: "信息加载中..." });
      self.$http.get(url, option).then(
        function(data) {
          loadingInstance.close();
          // 这里是处理正确的回调
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            info.forEach(function(p) {
              let code = p.number.slice(0, 2);
              var option = {};
              option.key = p.number;
              option.caseModel = p.caseModel;
              option.label = p.name;
              option.value = p;
              //   console.log(p);

              var dic = {};
              if (code == "FW" || p.number == "HKYDBDSQ10005") {
                dic = self.serveInfo;
              } else {
                dic = self.deviceInfo;
              }
              option.caseModel.forEach(caseId => {
                if (dic[caseId]) {
                  dic[caseId].push(option);
                } else {
                  // dic[caseId] = [option];
                  self.$set(dic, caseId, [option])
                }
              });
            }, self);
          }
        },
        function(error) {
          // 这里是处理错误的回调
          loadingInstance.close();
          self.showError(error);
        }
      );
    },

    goBack() {
      //返回上级
      this.$router.goBack();
    },
    /**
     * 业务类型发生改变
     */
    businessTypeDidChanged(val) {
      this.configEntity([]);
    },
    serverChanged(event, index) {
      //选择服务
      if (typeof event == "object") {
        var server = {
          productName: event.name,
          productId: event.materialId,
          chargeway: event.chargeway
        }
        server = Object.assign(this.servers[index], server)
        this.$set(this.servers, index, server);
        // this.servers[index].productName = event.name;
        // this.servers[index].productId = event.materialId;
        // this.servers[index].chargeway = event.chargeway;
      }
      console.log("选择服务:" + this.servers[index].productName, event);
    },
    devicesChanged(event, index) {
      //选择设备
      if (typeof event == "object") {
        var device = {
          productName: event.name,
          productId: event.materialId
        }
        device = Object.assign(this.devices[index], device)
        this.$set(this.devices, index, device);
        // this.devices[index].productName = event.name;
        // this.devices[index].productId = event.materialId;
      }
      console.log("选择设备:" + this.devices[index].productName);
    },
    addServe() {
      //添加服务
      let serve = {
        idx: this.servers.length + 1,
        serviceMonth: "12",
        productId: "",
        productName: "",
        amount: "",
        reAmount: "0",
        num: 1,
        depositPrice: "",
        depositPriceAmount: "",
        taxPrice: null
      };
      this.servers.push(serve);
    },
    addDevice() {
      //添加设备
      let device = {
        idx: this.devices.length + 1,
        serviceMonth: "0",
        productId: "",
        productName: "",
        amount: "",
        reAmount: "",
        num: 1,
        depositPrice: "",
        depositPriceAmount: "",
        taxPrice: null
      };
      this.devices.push(device);
    },
    serveRemove(index) {
      this.servers.splice(index, 1);
    },
    deviceRemove(index) {
      this.devices.splice(index, 1);
    },
    saveProduct() {
      if (!this.businessType) {
        this.showError("未选择有效的业务类型");
        return;
      }

      let teams = JSON.parse(window.localStorage.getItem("PROJECT_TEAM"));
      let businessTypes = JSON.parse(
        window.localStorage.getItem("BUSINESS_TYPES")
      );
      let teamName = teams.find(item => {
        return item.fId == this.businessType[0];
      }).label;
      let businessName = businessTypes.find(item => {
        return item.fId == this.businessType[1];
      }).label;

      //保存
      let productEntity = [];
      this.servers.forEach(function(s) {
        if (s.productName) {
          if (!s.amount) {
            s.amount = "0";
          }
          s.num = 1;
          s.depositPriceAmount = "0.0";
          s.depositPrice = "0.0";
          s.taxPrice = s.amount;
		  s.caseModel = this.businessType[1];
		  s.caseModelName = businessName
		  s.projectGroup = this.businessType[0];
		  s.projectGroupName = teamName
          delete s.chargeway;
          delete s.idx;
          productEntity.push(s);
        }
      }, this);

      this.devices.forEach(function(d) {
        if (d.productName) {
          if (!d.amount) {
            d.amount = "0";
          }
          if (!d.depositPriceAmount) {
            d.depositPriceAmount = "0";
          }
          d.reAmount = "0.0";
          d.serviceMonth = "0";
          d.taxPrice = parseFloat(d.amount) / parseFloat(d.num);
		  d.caseModel = this.businessType[1];
		  d.caseModelName = businessName
		  d.projectGroup = this.businessType[0];
		  d.projectGroupName = teamName
          delete d.chargeway;
          delete d.idx;
          productEntity.push(d);
        }
      }, this);

      console.log("返回产品：");
      console.log(productEntity);
      this.eventBus.$emit("productsSelect", {
        isNew: this.isNewCard,
        originalBusinessType: this.originalBusinessType,
        businessType: this.businessType,
        productEntity: productEntity
      });
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less">
.newEstateOrder {
  min-height: 100%;
  .child-view {
    background: red;
  }

  .sectionHeader {
    text-align: left;
    padding: 5px 15px;
  }

  .businessTypeBox {
    margin-top: 50px;
    margin-bottom: 20px;
    .el-cascader {
      width: 100%;
    }
    .el-cascader.is-disabled .el-cascader__label {
      color: @disabelText;
    }
  }

  .serverBox {
    background-color: #fff;
    position: relative;
    border: 1px solid #e6effb;
    margin: 15px 10px;
    padding: 15px 5px;
    .deleteBtn {
      width: 20px;
      height: 20px;
      z-index: 100;
      position: absolute;
      top: 0;
      right: 0px;
      border: none;
      i {
        font-size: 12px;
      }
    }
    .deleteBtn:hover {
      color: #606266;
      background-color: #fff;
    }
  }

  .serverMonthBox {
    background-color: #fff;
    position: relative;
    border: 1px solid #e6effb;
    margin: 15px 0px;
    padding: 15px 5px;
    .numberIterm {
      display: flex;
      margin-bottom: 0px;
      padding: 0px 10px;
      background-color: #fff;
      border-bottom: 0.5px solid @borderColor;
    }
  }

  .deviceBox {
    background-color: #fff;
    position: relative;
    border: 1px solid #e6effb;
    margin: 15px 10px;
    padding: 15px 5px;

    .el-input-number {
      float: right;

      .el-input-number__increase {
        border: 1px solid #dcdfe6;
      }
      .el-input-number__decrease {
        border: 1px solid #dcdfe6;
      }
    }

    .deleteBtn {
      width: 20px;
      height: 20px;
      z-index: 100;
      position: absolute;
      top: 0;
      right: 0px;
      border: none;
      i {
        font-size: 12px;
      }
    }

    .deleteBtn:hover {
      color: #606266;
      background-color: #fff;
    }
  }

  .saveBtn {
    z-index: 1000;
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
  }

  .lastBtn {
    margin-bottom: 50px;
  }

  .addProductBtn:hover {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fff;
  }
}
</style>