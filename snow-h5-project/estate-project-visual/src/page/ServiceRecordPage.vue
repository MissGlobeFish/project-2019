<template>
  <div class="ServiceRecordPage" style="padding: 66px 0 36px 0;">
    <navbar :title="pageTitle" @leftBtnTapped="goBack()"></navbar>
    <div>
      <el-form ref="form" inline-message label-position="left">
        <infoIterm title="单据标号" v-model="infoData.billNo"/>
        <infoIterm title="报修人" v-model="infoData.sender"/>
        <infoIterm title="报修人联系方式" v-model="infoData.senderPhone" isCall/>
        <infoIterm title="报修日期" v-model="infoData.senderTime"/>
        <infoIterm title="故障描述" v-model="infoData.problemDesc" alignType="center"/>
        <infoIterm title="服务方式" v-model="infoData.serviceMethodLabel"/>
        <infoIterm title="处理描述">
          <template slot="valueSlot"><p class="records" v-html="infoData.recordString"/></template>
        </infoIterm>
        
        <span class="formBoundary"></span>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "ServiceRecordPage",
  data() {
    return {
      pageTitle: "维修信息",
      infoData: {
        contentList: []
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
    //转义服务方式
    info.serviceMethodLabel = this.serviceMethodLabel(info.serviceMethod)
    //拼接处理描述
    var recordString = ""
    info.contentList.map(function(record){
      recordString += "<span>" + record.serviceTime + "</span>"
      recordString += "<br />"
      recordString += "<span>" + record.content + "</span>"
      recordString += "<br />"
    })
    info.recordString = recordString
    // console.log("##############", this.$route.query.infoData)
    this.infoData = info
  },
  /*激活时*/
  activated() {},
  methods: {
    //返回上一级
    goBack() {
      this.$router.goBack();
    },
    serviceMethodLabel(methodCode) {
      switch (methodCode) {
        case "YC":
          return "远程";
          break;
        case "SM":
          return "上门";
          break;
        default:
          return "";
          break;
      }
    }
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
