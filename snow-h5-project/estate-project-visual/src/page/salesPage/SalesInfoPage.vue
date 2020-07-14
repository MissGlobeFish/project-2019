<template>
  <div class="ProjectInfoPage" style="padding: 66px 0 36px 0;">
    <navbar :title="pageTitle" @leftBtnTapped="goBack()"></navbar>
    <div>
      <el-form ref="form" inline-message label-position="left">
        <sectionHeader title="基本信息"></sectionHeader>
        <infoIterm title="项目名称" v-model="listData.name"/>
        <infoIterm title="销售人员" v-model="listData.saler"/>
        <infoIterm title="运营人员" v-if="listData.operator" v-model="listData.operator"/>
        <infoIterm title="安装人员" v-if="listData.install" v-model="listData.install"/>

        <span class="formBoundary"></span>
        <sectionHeader title="订单信息"></sectionHeader>

        <ul>
          <li v-for="(item,index) in listData.orderList" :key="index"  class="parent-menu" >
            <div @touchstart="openMenu(index)">
              <div class="menu"><span>{{item.type}}({{item.billno}})</span><span class="price">¥ {{item.amount.toFixed(2)}}</span></div>
              <div class="menu"><span class="date">{{item.date || "暂无审核时间"}}</span><span class="review">{{item.status == "C" ? "已审核" : "未审核"}}</span></div>
            </div>
            <transition name="draw">
              <div class="progress" v-if="item.list" v-show="open&&(currIndex == index)">
                <ul>
                  <li v-for="(itemChild,index) in item.list" :key="index" class="child-menu">
                    <i v-show="item.list.length > 1"></i>
                    <div style="margin-left: 20px">
                      <div class="menu" :style="{marginTop: itemChild.type == orderTypeStatus['outstock'].type ? '15px' : ''}">
                        <span :class="[itemChild.isReceive == '1'? 'wraning' : '']">{{orderTypeStatus[itemChild.type].text}}({{itemChild.billno}})</span>
                        <span class="price">¥ {{itemChild.amount.toFixed(2)}}</span>
                      </div>
                      <div class="menu">
                        <span class="date">{{itemChild.date}}</span>
                        <span class="review">{{itemChild.status == "C" ? "已审核" : "未审核"}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </transition>
            <div class="toggle-icon" v-if="item.list" @touchstart="toggle(index)" ><i :class="[open&&(currIndex == index) ? ' el-icon-arrow-up ': 'el-icon-arrow-down', 'arrow-icon']"></i></div>  
          </li>
        </ul>
        <p class="not-data" v-if="notData">查询暂无数据哦～</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalesInfoPage",
  components: {
  },
  props: {

  },
  data() {
    let name = this.$route.query.prjName
      ? this.$route.query.prjName
      : "项目信息";
    let projectId = this.$route.query.prjId;
    return {
      open: false,
      currIndex: -1,
      listData: "",
      pageTitle: name,
      orderTypeStatus: {
        "outstock": {type: "outstock", text: "出库"},
        "receive": {type: "receive", text: "回款"}
      },
      notData: false // 没有数据
    }
  },
  computed: {
  },
  mounted () {
    this.handleInit()
  },
  watch: {

  },
  methods: {
    goBack() {
      // this.$router.goBack();
     this.$router.goBack();
    },
     // 切换列表显示隐藏的方法
    toggle(index) {
      // this.open = !this.open
      if (this.currIndex == index) {
        this.open = !this.open
      } else {
        this.open = true
      }
      this.currIndex = index;
    },
    openMenu(index) {
      this.currIndex = index;
      this.open = true;
    },
    handleInit() {
      // /project/CDRCJHT
      let loadingInstance = this.$loading({ text: "信息加载中..." });
      let url = global.K3_URL + "/project/"+this.$route.query.prjName;
      let params = {};
      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      this.$http.get(url, option).then(
        ({code,data})=> {
          // console.log(data)
          if (data.code == 1 && data.data) {
            this.listData = data.data;
            if ( data.data.orderList.length <= 0) {
              this.notData = true
            }
          }
          loadingInstance.close();
        },
        (error)=> {
          loadingInstance.close();
          this.showError("项目信息加载失败");
        }
      );
    }
  },
};
</script>

<style lang="less">
  ul:focus,li:focus{
    outline: none;
  }
  .formBoundary {
    height: 20px;
    display: block;
  }
  .wraning {
    color: #E6A23C;
  }
  .parent-menu {
    margin-top: 20px;
    padding: 0 10px;
    border-radius: 8px;
    background-color: #fff;
    &>div {
      padding: 10px 0;
    }
    // border-bottom: 1px solid #dcdfe6;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding: 2px 0;
  }
  .parent-menu .price {
    font-size: 16px;
    color: #e10505;
    font-weight: bold;
  }
  .date {
    font-size: 12px;
    color: #606266;
  }
  .review {
    font-size: 12px;
    color:#606266;
  }
  .toggle-icon {
    padding: 10px 0;
    .arrow-icon {
      font-weight: bolder;
      font-size: 20px;
    }
  }
  .progress {
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding: 20px 0;
    .child-menu {
      padding-bottom: 55px;
      i {
          float: left;
          width: 1px;
          height: 100px;
          // margin-right: 20px;
          background-color: #000;
          position: relative;
          top: 6px;
          &::before {
            display: inline-block;
            content: "";
            width: 6px;
            height: 6px;
            background-color: #000;
            position: absolute;
            top: 0;
            left: -3px;
            border-radius: 6px;
        }
      }
      .price {
        font-weight: bold;
        color: #000;
        font-size: 14px;
      }
    }
    .child-menu:last-child {
      padding-bottom: 0;
    }
    .child-menu:last-child i {
      background-color: transparent;
    }
  }
  .not-data {
    line-height: 4;
    font-size: 14px;
    color: #888;
  }
</style>
