<template>
  <div class="PointInfoPage" style="padding: 66px 0 36px 0;">
    <navbar :title="pageTitle" @leftBtnTapped="goBack()"></navbar>
    <div>

      <el-form ref="form" inline-message label-position="left">
        <infoIterm  v-for="item in infoData.confirmValue" :title="item.confirmItem" v-model="item.confirmValue" :key="item.confirmItem"/>
        <span class="formBoundary"></span>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "PointInfoPage",
  data() {
    return {
      pageTitle: this.$route.query.title,
      infoData: {
      }
    };
  },
  watch: {},
  /*创建前*/
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#F0F2F5");
  },
  /*创建时*/
  created() {
    let info = this.$route.query.infoData
    this.infoData = info
  },
  /*激活时*/
  activated() {},
  methods: {
    //返回上一级
    goBack() {
      this.$router.goBack();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.ServiceRecordPage {
  width: 100%;
  min-height: calc(~ '100vh - 66px - 40px');
  background: @fromBackColor;
}
.records{
  text-align: center
}
</style>
