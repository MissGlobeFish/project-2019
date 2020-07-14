<template>
  <div class="productsInfo">
    <el-form-item :prop="prop"  class="productsInfo">
    <div class="productsInfoBox">
      <ul class="business" v-show="this.productData.length > 0">
        <li v-for="(val, item, index) in businessData" :key="item">
          <p>
            <span class="name">{{item}}</span>
            <span class="price">{{businessData[item]}}元</span>
          </p>

        </li>
      </ul>
      <div class="foot" v-show="this.productData.length > 0">
        <hr>
        <span class="name">总计：</span>
        <span class="price">{{allTotalAmount}}元</span>
      </div>
    </div>
     </el-form-item>
  </div>
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
    prop: String
  },
  data() {
    return {
      business: [],
      businessData: {},
      allTotalAmount: null
    };
  },
  created() {
    this.reload(this.productData);
  },
  activated() {},
  methods: {
    reload(data) {
      this.businessData = {}
      this.allTotalAmount = 0.0
      // console.log(data);
      data.forEach(function(p) {
          let businessName = p.caseModelName
          if (!this.businessData[businessName]){
              this.businessData[businessName] = parseFloat(0.0)
          }
          this.businessData[businessName] += parseFloat(p.amount);
          this.allTotalAmount += parseFloat(p.amount);
        // if (this.isSeviceProduct(p.productName)) {
        //   //服务
        //   let t = p.amount;
        //   this.serveTotalAmount += parseFloat(t);
        //   this.servers.push(p);
        // } else {
        //   //设备
        //   let m = parseFloat(p.depositPriceAmount);
        //   this.facilityTotalAmount += m;
        //   this.devices.push(p);
        // }
        // // console.log(this.allTotalAmount);
        // this.allTotalAmount += parseFloat(p.amount);
      }, this);
    },

    // isSeviceProduct(name) {
    //   return name.search("服务") != -1;
    // }
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
        height: 40px;
        line-height: 40px;
        color: @lightText;
        padding: 0 10px;

        .name {
          width: 50%;
          float: left;
          text-align: left;
        }
        .price {
          width: 50%;
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
