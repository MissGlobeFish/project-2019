<template>
  <div class="serviceListBox">
    <label v-if="!value || value.length == 0" class="emptyLabel">无记录</label>
    <div v-if="value && value.length > 0" class="productsInfoBox">
      <ul class="server" v-show="value.length > 0">
        <li v-for="item in value" :key="item.productId" @click="selectItem($event,item)">
          <p class="infoIterm">
            <span class="name">{{item.billNo}}</span>
            <span class="number">
              {{serviceMethodLabel(item.serviceMethod)}}
              <i class="el-icon-arrow-right"></i>
            </span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //值
    value: {
      type: [Array],
      default: []
    }
  },
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    selectItem(event, data) {
      this.$emit("didSelected", data);
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

<style lang="less">
.serviceListBox {
  background-color: #fff;

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
}
</style>