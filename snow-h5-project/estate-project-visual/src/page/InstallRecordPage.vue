<template>
  <div class="InstallRecordPage" style="padding: 66px 0 36px 0;">
    <navbar :title="pageTitle" @leftBtnTapped="goBack()"></navbar>
    <div>
      <el-form ref="form" inline-message label-position="left">
        <infoIterm title="单据标号" v-model="infoData.billNo"/>
        <infoIterm title="联系人" v-model="infoData.installLinker"/>
        <infoIterm title="联系方式" v-model="infoData.linkerTel" isCall/>

        <span class="formBoundary"></span>
        <!-- 实施报告单列表 -->
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(report, index) in installReport"
            :label="report.name"
            :name="'report' + index"
            :key="'report' + index"
          >
            <!-- 实施报告 -->
            <ul class="typesBox" v-show="report.list.length > 0">
              <li v-for="typrItem in report.list" :key="typrItem.confirmItem">
                <sectionHeader :title="typrItem.confirmItem"/>
                <!-- 时事报告单类目 -->
                <ul class="typesBox" v-show="typrItem.confirmItemList.length > 0">
                  <!-- 报告项 -->
                  <li v-for="item in typrItem.confirmItemList" :key="item.confirmItem">
                    <!-- 星级 -->
                    <infoIterm v-if="item.checkType == 'STAR'" :title="item.confirmItem">
                      <template slot="valueSlot">
                        <el-rate
                          v-model="item.confirmValue"
                          disabled
                          show-score
                          text-color="#ff9900"
                          score-template="{value}"
                        ></el-rate>
                      </template>
                    </infoIterm>
                    <!-- 跳转下一级页面 -->
                    <div
                      v-else-if="item.checkType == 'DETAIL'"
                      :key="item.pointNo"
                      @click="selectPointInfo($event,item , typrItem.confirmItem)"
                    >
                      <p class="infoIterm">
                        <span class="name">{{item.confirmItem}}</span>
                        <!-- <span class="name">{{item.pointName}}</span> -->
                        <i class="el-icon-arrow-right"></i>
                      </p>
                    </div>
                    <!-- 一般报告项目 -->
                    <infoIterm v-else :title="item.confirmItem" v-model="item.confirmValue"/>
                  </li>
                </ul>
                <span class="formBoundary"></span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "InstallRecordPage",
  data() {
    return {
      pageTitle: "项目/安装信息",
      infoData: {},
      billNo: "",
      installReport: [],
      activeName: "report0"
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
    this.billNo = info.billNo;

    //遍历数据，提取有效数据，整理 👇
    var installReport = [];
    //遍历实施报告单
    info.confirmItemList.forEach(report => {
      var confirmItems = [];
      //遍历报告单类目
      report.confirmItemList.forEach(typeItems => {
        var listName = typeItems.confirmItem;
        let subList = typeItems.confirmItemList;
        var confirmItemList = [];
        if (
          typeItems.childTable &&
          typeItems.confirmItemList &&
          typeItems.confirmItemList.length > 0
        ) {
          //查询子表
          confirmItems.push({
            confirmItem: listName,
            childTable: typeItems.childTable,
            confirmItemList: this.dealChildTableInfo(typeItems.confirmItemList)
          });

          return;
        } else if (!subList || subList.length == 0) {
          //空类目
          return;
        }
        //遍历报告单报告项
        subList.forEach(item => {
          if (!item.confirmValue) {
            return;
          }
          confirmItemList.push({
            confirmItem: item.confirmItem,
            confirmValue:
              item.checkType == "STAR"
                ? parseFloat(item.confirmValue)
                : item.confirmValue,
            checkType: item.checkType
          });
        });
        if (confirmItemList.length == 0) {
          return;
        } else {
          confirmItems.push({
            confirmItem: listName,
            childTable: typeItems.childTable,
            confirmItemList: confirmItemList
          });
        }
      });
      console.log(confirmItems);
      installReport.push({ name: report.confirmItem, list: confirmItems });
    });

    this.installReport = installReport;
  },
  /*激活时*/
  activated() {},
  methods: {
    //返回上一级
    goBack() {
      this.$router.goBack();
    },
    //处理点位信息子表数据
    dealChildTableInfo(sourceData) {
      console.log("待处理数据", sourceData);
      let pointList = JSON.parse(sourceData[0].confirmValue).map(point => {
        return { confirmItem: point, confirmValue: [] , checkType: "DETAIL"};
      });
      console.log("预创建数据", pointList);

      pointList.forEach((item, index) => {
        var childTableIterms = [];
        sourceData.forEach(item => {
          let itemValues = JSON.parse(item.confirmValue);
          childTableIterms.push({
            confirmItem: item.confirmItem,
            confirmValue: itemValues[index]
          });
        });
        pointList[index].confirmValue = childTableIterms;
      });
      console.log("处理结果", pointList)
      return pointList;
    },
    selectPointInfo(event, info, title) {
      console.log(" POINT ", info);
      this.$router.gspush({ name: "PointInfoPage", query: { infoData: info , title: title} });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.InstallRecordPage {
  width: 100%;
  min-height: calc(~"100vh - 66px - 40px");
  background: @fromBackColor;

  .formBoundary {
    height: 20px;
    display: block;
  }

  .el-tabs__header {
    background-color: #fff;
    margin: 0;
    padding: 0 10px;
  }

  .el-tabs__nav-prev,
  .el-tabs__nav-next {
    line-height: 50px;
    font-size: 16px;
  }

  .el-tabs__item {
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    // color: #333333;
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
  }
}
</style>
