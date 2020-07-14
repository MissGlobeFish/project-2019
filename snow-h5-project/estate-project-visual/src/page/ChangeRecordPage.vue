<template>
  <div class="ChangeRecordPage" style="padding: 66px 0 36px 0;">
    <navbar :title="pageTitle" @leftBtnTapped="goBack()"></navbar>
    <div>
      <el-form ref="form" inline-message label-position="left">
        <infoIterm title="单据标号" v-model="infoData.billNo"/>
        <infoIterm title="换机人员" v-model="infoData.chargerName"/>
        <infoIterm title="换货原因" v-model="infoData.reason" alignType="center"/>

        <!-- 退货 -->
        <span class="formBoundary"></span>
        <sectionHeader title="退货明细"/>
        <div class="returnBox">
          <label
            v-if="!infoData.chargeReturnList || infoData.chargeReturnList.length == 0"
            class="emptyLabel"
          >无记录</label>
          <div v-if="infoData.chargeReturnList && infoData.chargeReturnList.length > 0">
            <ul>
              <li v-for="item in infoData.chargeReturnList" :key="item.id">
                <p class="infoIterm">
                  <span class="name">{{item.productName}}</span>
                  <span>{{item.snNum}}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 换货 -->
        <span class="formBoundary"></span>
        <sectionHeader title="换货明细"/>
        <div class="changeBox">
          <label
            v-if="!chargeList || chargeList.length == 0"
            class="emptyLabel"
          >无记录</label>
          <div v-if="chargeList && chargeList.length > 0">
            <ul>
              <li v-for="item in chargeList" :key="item.id">
                <p class="infoIterm">
                  <span class="name">{{item.productName}}</span>
                  <span>{{item.snNum}}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "ChangeRecordPage",
  data() {
    return {
      pageTitle: "换货信息",
      infoData: {},
      chargeList: [],//换货列表
    };
  },
  watch: {},
  /*创建前*/
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#F0F2F5");
  },
  /*创建时*/
  created() {
    let info = this.$route.query.infoData;
    this.infoData = info;

    if ( !info.chargeReturnList || info.chargeReturnList.length == 0) {
      return
    }
    
    info.chargeReturnList.forEach(returnItem => {
      this.chargeList = this.chargeList.concat(returnItem.chargeList)
    });

  },
  /*激活时*/
  activated() {},
  methods: {
    //返回上一级
    goBack() {
      this.$router.goBack();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.ChangeRecordPage {
  width: 100%;
  min-height: calc(~"100vh - 66px - 40px");
  background: @fromBackColor;
}

.formBoundary {
  height: 20px;
  display: block;
}

.returnBox {
  background-color: #fff;
}

.changeBox {
  background-color: #fff;
}

.emptyLabel {
  line-height: 45px;
}

.infoIterm {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 45px;
  margin-bottom: 0px;
  padding: 0px 10px;
  background-color: #fff;
  border-bottom: 0.5px solid @borderColor;
  .name {
      font-size: 14px;
      color: #606266;
      line-height: 25px;
      text-align: left;
      width: 35%;
      padding: 0px;
    }
}
</style>
