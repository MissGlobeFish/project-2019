<template>
  <div class="index">
    <keep-alive>
      <transition name="el-fade-in-linear">
        <component :is="isChange" @handleChange="handleChange"></component>
      </transition>
    </keep-alive>
    <div class="border">
      <span v-if="one"></span>
      <span v-if="two"></span>
      <span v-if="three"></span>
      <span v-if="four"></span>
      <span v-if="five"></span>
      <span v-if="six"></span>
    </div>
    <Bottom/>
  </div>
</template>

<script>

  import Stepone from '../common/Stepone'
  import Steptwo from '../common/Steptwo'
  import Stepthree from '../common/Stepthree'
  import Stepfour from '../common/Stepfour'
  import Stepfive from '../common/Stepfive'
  import Stepsix from '../common/Stepsix'
  import Bottom from '../common/Bottom'

  export default {
    name: 'Index',
    components: {
      Stepone,
      Steptwo,
      Stepthree,
      Stepfour,
      Stepfive,
      Stepsix,
      Bottom
    },
    data(){
      return {
        isChange: "Stepone",
        one: true,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false
      }
    },
    methods: {
      handleChange(){
        this.isChange = arguments[0];
        if (this.isChange === "Steptwo") {
          this.two = true;
        } else if (this.isChange === "Stepthree") {
          this.three = true;
        } else if (this.isChange === "Stepfour") {
          this.four = true;
        } else if (this.isChange === "Stepfive") {
          this.five = true;
        } else if (this.isChange === "Stepsix") {
          this.six = true;
        }
        if (arguments[1] === "Stepone") {
          this.two = false;
        } else if (arguments[1] === "Steptwo") {
          this.three = false;
        } else if (arguments[1] === "Stepthree") {
          this.four = false;
        } else if (arguments[1] === "Stepfour") {
          this.five = false;
        } else if (arguments[1] === "Stepfive") {
          this.six = false;
        }
      }
    }
  }


</script>

<style lang="less">
  .index {
    background: rgb(240, 240, 240);
    position: relative;

    .border {
      width: 100%;
      height: 2px;
      position: fixed;
      top: 66px;
      left: 0;
      z-index: 2018;

      span {
        width: 16.66666666666%;
        height: 2px;
        background: rgb(255, 102, 0);
        display: block;
        float: left;
      }
    }
  }
</style>
