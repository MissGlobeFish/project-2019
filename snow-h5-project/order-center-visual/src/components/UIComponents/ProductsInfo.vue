<template>
  <div class="productsInfo">
    <!-- <el-form-item :prop="prop"  class="productsInfo"> -->
    <div class="productsInfoBox">
      <ul class="server" v-show="this.servers.length > 0">
        <li v-for="item in this.servers" :key="item.productId">
          <p>
            <span class="name">{{item.productName}}</span>
            <span class="number">{{item.serviceMonth}}个月</span>
            <span class="price">{{item.amount}}元</span>
          </p>
          <p v-show="item.nextServerAmount">
            <span class="name">续费价格</span>
            <span class="number">12个月</span>
            <span class="price">{{item.reAmount}}元</span>
          </p>
        </li>
      </ul>
      <ul class="device" v-show="this.devices.length">
        <li v-for="item in this.devices" :key="item.productId">
          <p>
            <span class="name">{{item.productName}}</span>
            <span class="number">X {{item.num}}</span>
            <span class="price">{{item.amount}}元</span>
          </p>
        </li>
      </ul>
      <div class="foot" v-show="this.productData.length > 0">
        <hr>
        <span class="name">总计：</span>
        <span class="price">{{allTotalAmount}}元</span>
      </div>
    </div>
  </div>
  <!-- </el-form-item> -->
</template>



<script>
export default {
  // name: ' productsInfo',
  props: {
    //form 数据
    productData: {
      type: [Array,Object],
      default: () => []
    },
    //form 验证项
    // prop: String
  },
  data() {
    return {
      servers: [],
      devices: [],
      serveTotalAmount: null,
      facilityTotalAmount: null,
      allTotalAmount: null
    };
  },
  created() {
    this.reload(this.productData);
  },
  activated() {},
  methods: {
    reload(data) {
      this.servers = [];
      this.devices = [];
      this.serveTotalAmount = 0.0;
      this.facilityTotalAmount = 0.0;
      this.allTotalAmount = 0.0;
      // console.log(data);
      data.forEach(function(p) {
        if (this.isSeviceProduct(p.productName)) {
          //服务
          let t = p.amount;
          this.serveTotalAmount += parseFloat(t);
          this.servers.push(p);
        } else {
          //设备
          let m = parseFloat(p.depositPriceAmount);
          this.facilityTotalAmount += m;
          this.devices.push(p);
        }
        // console.log(this.allTotalAmount);
        this.allTotalAmount += parseFloat(p.amount);
      }, this);
      // console.log("服务");
      // console.log(this.servers);
      // console.log("设备");
      // console.log(this.devices);
    },

    isSeviceProduct(name) {
      return name.search("服务") != -1;
    }
  }
};
</script>

<style lang="less">
.productsInfoBox {
  background-color: #fff;
  // border-bottom: 0.5px solid #dcdfe6;
  ul {
    li {
      p {
        // height: 40px;
        // line-height: 40px;
        color: @lightText;
        padding: 0 10px;
        overflow: hidden;
        margin-top: 10px;
        margin-bottom: 10px;
        .name {
          width: 34%;
          float: left;
          text-align: left;
        }
        .number {
          width: 33%;
          overflow: hidden;
          text-align: center;
        }
        .price {
          width: 33%;
          float: right;
          text-align: right;
        }
      }
    }
  }
  .foot {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;

    .name {
      width: 34%;
      float: left;
      text-align: left;
    }

    .price {
      width: 33%;
      float: right;
      text-align: right;
    }
  }
}
</style>