<template>
  <div class="product" style="padding: 66px 0 36px 0;">
    <navbar
      title="选购产品"
      @leftBtnTapped="goBack"
      :rightIterm=" editable ? '保存' : '' "
      @rightBtnTapped="saveProduct"
    ></navbar>
    <div class="cardContener">
      <!-- 卡片 -->
      <div class="productCard" v-for="(val, item, index) in attributeProductEntity" :key="item">
        <!-- 删除按钮 -->
        <el-button class="deleteBtn" v-if="editable" @click="removeCard(item)">
          <i class="el-icon-close"></i>
        </el-button>
        <!-- 卡片标题 -->
        <p class="cardHeader">
          <span class="teamName">{{findTeamNameByBusinessId(item)}}</span>
          <span class="businessName">{{findBussinessById(item).label}}</span>
        </p>
        <hr>
        <!-- 卡片内容 -->
        <div class="productsInfoBox" @click="clickCard(item)">
          <productView :ref="item" :productData="attributeProductEntity[item]"></productView>
        </div>
      </div>
      <div class="productCardAddBtnBox" v-if="editable" >
        <el-button class="addProductCardBtn" icon="el-icon-plus" @click="addProductCard">添加案场产品</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import productView from "../components/UIComponents/ProductsInfo";

export default {
  components: {
    productView
  },
  component: {},
  name: "ProductPage",
  data() {
    return {
      url: global.ERP_BASE_URL,
      //按照业务类型整理的产品 list
      attributeProductEntity: {},
      editable: true,
      cloudTypeId: '',
      orgId: ''
    };
  },
  computed: {
    //产品明细
    productsEntity: {
      get: function() {
        let entity = [];
        for (const key in this.attributeProductEntity) {
          if (this.attributeProductEntity.hasOwnProperty(key)) {
            const element = this.attributeProductEntity[key];
            entity = entity.concat(element);
          }
        }
        return entity;
      },
      set: function(newValue) {
        if (!newValue || newValue.length < 1) {
          return;
        }
        var attributeEntity = {};
        newValue.forEach(element => {
          let caseModel = element.caseModel ? element.caseModel : '0000'
          var products = attributeEntity[caseModel];
          if (products) {
             products.push(element);
          } else {
            attributeEntity[caseModel] = new Array(element);
          }
        });
        this.attributeProductEntity = attributeEntity;
      }
    }
  },
  /*创建时*/
  created() {

    this.editable    = this.$route.query.editable;
    this.cloudTypeId = this.$route.query.cloudTypeId;
    this.orgId       = this.$route.query.orgId;
    
    //加载项目信息、业务类型
    this.loadProjectInfo();
    this.loadBusinessType();
   
    //获取下单页面传进来的产品明细
    console.log("收到产品信息：\n");
      let productInfo = JSON.parse(
        window.localStorage.getItem("ProductEntryToProductPage")
      );
      this.productsEntity = productInfo;
      console.log(productInfo)
  },
  /*激活时*/
  activated() {
    //根据key名获取传递回来的参数，data就是map
    //选择产品后回调
    this.eventBus.$on(
      "productsSelect",
      function(data) {
        this.eventBus.$off("productsSelect");
        var isNew = data.isNew;
        var businessType = data.businessType;
        var productEntity = data.productEntity;
        var originalBusinessType = isNew ? null : data.originalBusinessType
        
        this.reloadPrductCard(originalBusinessType, businessType, productEntity);
        console.log(
          " 收到案场选择界面传来 products ",
          "是否新建卡片：",
          isNew,
          "产品明细",
          productEntity
        );
      }.bind(this)
    );
  },
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    this.eventBus.$off("productPageGiveBack");
  },
  methods: {
    //返回
    goBack() {
      if (this.editable && this.productsEntity.length > 0) {
        this.showAlert("退出后，将不会保存已添加的内容，确认要退出？", "退出")
          .then( () => {
             this.$router.goBack();
          })
      } else {
        this.$router.goBack();
      }
    },
    //保存产品
    saveProduct() {
      if (!this.editable) {
        return
      }
      console.log("保存", this.productsEntity);
      let productsEntity = this.productsEntity;
      if (productsEntity.length <= 0) {
        this.showError("数据为空");
        return;
      }
      this.eventBus.$emit("productPageGiveBack", productsEntity);
      this.$router.goBack();
    },

    /**
     * 添加新业务对应产品
     */
    addProductCard() {
      this.$router.gspush({ name: "SelectProducts", query: { isNew: true } });
    },
    /**
     * 删除业务产品卡
     */
    removeCard(key) {
      this.$delete(this.attributeProductEntity, key);
    },
    /**
     * 点击再次进入编辑
     */
    clickCard(key) {
      if (!this.editable) {
        return
      }
      if (!key || key == '0000'){
        this.showError("订单物料没有归属具体的项目组及业务类型，需要重新选择")
        return
      }
      var info = {
        businessType: [this.findTeamByBusinessId(key).fId, key],
        productEntity: this.attributeProductEntity[key]
      };
      window.localStorage.setItem("BussinessProductInfo", JSON.stringify(info));
      this.$router.gspush({ name: "SelectProducts", query: { isNew: false} });
    },

    /**
     *  改变某个卡片内容
     */
    reloadPrductCard(originalBusinessType, businessType, productEntity) {
      if (!productEntity || productEntity.length < 1) {
        return;
      }

      if (originalBusinessType != null && originalBusinessType[1] != null) {
        //点击卡片进入编辑删除之前原本数据
        console.log('点击',originalBusinessType[1],'进入de1')
         this.$delete(this.attributeProductEntity, originalBusinessType[1]);
      }

      let businessID = businessType[1];
      var products = this.attributeProductEntity[businessID];

      if (!products){
         // 原本不存在的业务
         this.$set(this.attributeProductEntity, businessID, productEntity);
      } else if (products) {
        // 原本存在的业务 -- 拼接
        this.$set(
          this.attributeProductEntity,
          businessID,
          products.concat(productEntity)
        );
      }


      var productView = this.$refs[businessID];
      if (productView && productView.length > 0) {
        productView[0].reload(this.attributeProductEntity[businessID]);
      }
    },

    /**
     * 加载项目组信息
     */
    loadProjectInfo() {
      let self = this;
      let url = global.ERP_BASE_URL + "/erp/assistant/combo/list";
      let params = {
        token: this.gsNative.gsNativeUserId(),
        parentId: this.cloudTypeId,
        orgId: this.orgId,
        grpNum: "PROJECT_TEAM"
      };
      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      self.$http.get(url, option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            window.localStorage.setItem("PROJECT_TEAM", JSON.stringify(info));
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.showError("加载项目信息失败");
        }
      );
    },
    /**
     * 加载业务类型信息
     */
    loadBusinessType() {
      let self = this;
      let url = global.ERP_BASE_URL + "/erp/assistant/combo/list";
      let params = {
        token: this.gsNative.gsNativeUserId(),
       
        orgId: this.orgId,
        grpNum: "BUSINESS_TYPES"
      };
      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      self.$http.get(url, option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.msg) {
            console.log(data);
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            window.localStorage.setItem("BUSINESS_TYPES", JSON.stringify(info));
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.showError("加载业务类型信息失败");
        }
      );
    },
    /**
     * 查找项目组名
     */
    findTeamNameByBusinessId(businessId) {
      let team = this.findTeamByBusinessId(businessId);
      if (team) {
        return team.label;
      } else {
        return "未分配组";
      }
    },
    /**
     * 查找项目组
     */
    findTeamByBusinessId(businessId) {
      let businessTypes = JSON.parse(
        window.localStorage.getItem("BUSINESS_TYPES")
      );
      let business = businessTypes.find(item => {
        return item.fId == businessId;
      });
      if (business && business.parent) {
        let teams = JSON.parse(window.localStorage.getItem("PROJECT_TEAM"));
        let team = teams.find(item => {
          return item.fId == business.parent;
        });
        return team ? team : null;
      } else {
        return null;
      }
    },
    /**
     * 查找业务类型
     */
    findBussinessById(businessId) {
      let businessTypes = JSON.parse(
        window.localStorage.getItem("BUSINESS_TYPES")
      );
      let businessType = businessTypes.find(item => {
        return item.fId == businessId;
      });
      return businessType ? businessType : {label: "未知类型"}
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.product {
  background: #f0f2f5;
  min-height: 100%;
  bottom: 0;
}
.cardContener {
  // padding-left: 5%;
  // padding-right: 5%;
}
.productCard {
  background-color: #fff;
  border: 1px solid #e6effb;
  margin: 15px 10px;
  padding: 15px 5px;
  // height: 100px;
  border-radius: 10px;
  position: relative;
  .deleteBtn {
    width: 30px;
    height: 30px;
    z-index: 100;
    position: absolute;
    top: 0;
    right: 0px;
    border: none;
    padding: 10px 5px;
    background-color: rgba(255, 255, 255, 0);
    i {
      font-size: 12px;
    }
  }
  .cardHeader {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 10px;
    padding-right: 30px;
    display: flex;
    justify-content: space-between;
    .teamName {
    }
    .businessName {
    }
  }
}
.productCardAddBtnBox {
  width: 100%;
}
.addProductCardBtn {
  color: #606266;
  border-color: #dcdfe6;
  background-color: #fff;
}
</style>
