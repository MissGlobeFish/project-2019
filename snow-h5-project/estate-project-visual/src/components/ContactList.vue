<template>
  <div class="contactListBox">
    <label v-if="!value || value.length == 0" class="emptyLabel">无记录</label>
    <div v-if="value && value.length > 0" class="productsInfoBox">
      <ul class="server" v-show="value.length > 0">
        <li v-for="item in value" :key="item.productId">
          <p class="contactItem">
            <span class="name">{{item.contact}}</span>
            <a :href="'tel:' + item.mobileTel " class="call">{{item.mobileTel}}</a>
            <!-- <tel class="number">{{item.mobileTel}}</tel> -->
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
  methods: {}
};
</script>

<style lang="less">
.contactListBox {
  background-color: #fff;

  .emptyLabel {
    line-height: 45px;
  }
  .call {
    color: black;
    font-family: PingFangSC-Regular;
    font-size: @textLessFont;
  }
  .contactItem {
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