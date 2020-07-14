<template>
  <div class="ProjectInfoPage" style="padding: 66px 0 36px 0;">
    <navbar :title="pageTitle" @leftBtnTapped="goBack()"></navbar>
    <div>
      <el-form ref="form" inline-message label-position="left">
        <sectionHeader title="合作信息"></sectionHeader>
        <infoIterm title="项目名" v-model="projectInfo.name"/>
        <infoIterm title="项目登录名" v-model="projectInfo.loginName"/>
        <infoIterm title="销售员" v-model="projectInfo.saleName"/>
        <infoIterm title="销售联系方式" v-model="projectInfo.saleTel" isCall/>
        <infoIterm title="3SCall客服务" :value="projectInfo.call3s ? '是': '否'"/>
        <infoIterm title="3S来电（通用版）" :value="projectInfo.common3s ? '是': '否'"/>
        <infoIterm title="3S来电（对接版）" :value="projectInfo.connect3s ? '是': '否'"/>

        <span class="formBoundary"></span>
        <sectionHeader title="项目联系人"/>
        <contactList v-model="projectInfo.contactList"/>

        <span class="formBoundary"></span>
        <sectionHeader title="安装记录"/>
        <installList v-model="projectInfo.installServices" @didSelected="didSelectedInstallInfo"/>

        <span class="formBoundary"></span>
        <sectionHeader title="售后记录"/>
        <serviceList v-model="projectInfo.serviceList" @didSelected="didSelectedServiceInfo"/>

        <span class="formBoundary"></span>
        <sectionHeader title="换货记录"/>
        <changeList v-model="projectInfo.chargeRequestList" @didSelected="didSelectedChangeInfo"/>
      </el-form>
    </div>
  </div>
</template>

<script>
import contactList from "../components/ContactList";
import serviceList from "../components/ServiceList";
import changeList from "../components/ChangeList";
import installList from "../components/InstallList";

export default {
  components: {
    contactList,
    serviceList,
    changeList,
    installList
  },
  name: "ProjectInfoPage",
  data() {
    let name = this.$route.query.prjName
      ? this.$route.query.prjName
      : "项目信息";
    let projectId = this.$route.query.prjId;
    return {
      //标题
      pageTitle: name,
      //项目ID
      prjId: projectId ? projectId : "",
      //项目信息
      projectInfo: {
        serviceList: [],
        contactList: [],
        chargeRequestList: [],
        installServices: [],
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
    console.log("query", this.$route.query);
    this.loadProjectInfo();
  },
  /*激活时*/
  activated() {},
  methods: {
    //返回上一级
    goBack() {
      this.$router.goBack();
    },
    //查看安装记录详情
    didSelectedInstallInfo(data){
      console.log(" INSTALL ", data);
      this.$router.gspush({ name: "InstallRecordPage", query: {infoData: data} });
    },
    //查看售后记录详情
    didSelectedServiceInfo(data) {
      console.log(" SERVICE  ", data);
      this.$router.gspush({ name: "ServiceRecordPage", query: {infoData: data} });
    },
    //查看换货记录
    didSelectedChangeInfo(data) {
      console.log("  CHANGE  ", data);
      this.$router.gspush({ name: "ChangeRecordPage", query: {infoData: data} });
    },
    //加载项目信息
    loadProjectInfo() {
      let loadingInstance = this.$loading({ text: "信息加载中..." });
      let self = this;
      let url = global.BASE_URL + "/project/" + this.prjId;
      let params = {};
      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      self.$http.get(url, option).then(
        function(data) {
          // console.log(data);
          loadingInstance.close();
          if (data.body.code != 1) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            if (info == null || info == "") {
              self.showError("未能查到该项目信息！");
              setTimeout(function timer() {
                self.goBack();
              }, 1000);
              return;
            }
            this.projectInfo = info;
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("项目信息加载失败");
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.ProjectInfoPage {
  width: 100%;
  background: @fromBackColor;

  .formBoundary {
    height: 20px;
    display: block;
  }

  .infoIterm {
    background-color: #fff;
  }
}

.el-cascader-menu {
  min-width: 100px !important;
}
</style>
