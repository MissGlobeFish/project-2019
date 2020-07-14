<template>
  <div class="shareIndex">

    <div class="titleBox">
      <div class="shackBox"></div>
      <div class="centerText"></div>
      <div class="takePartInButt" @click="takePartInClick()"></div>
    </div>

    <el-dialog class="maskLayerBox" :visible.sync="dialogVisible" width='100%'>
      <div class="arrowsBox"></div>
      <div class="hintBox">
        <p>点击右上角</p>
        <p>选择在系统浏览器中打开</p>
      </div>
      <div class="buttonBox" @click="iSeeClick()"></div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ShareIndex',
  data () {
    return {
      dialogVisible: false,
    }
  },
  methods: {
    takePartInClick() {
        if (this.isWeiXin()) {
            this.dialogVisible = true;
        } else {
            window.location.href = "cangbaoge://FiveViewpointIndex";
        }
    },
    isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    iSeeClick(){
      this.dialogVisible = false;
    }
  },
}
</script>

<!-- 添加'scoped'属性以将CSS限制到此组件 -->
<style lang='scss'>
  .shareIndex {
    width: 100%;
    height: 100vh;
    background: url(../assets/bg.png) no-repeat 0 0;
    background-size: 100%;
    background-color: #AC1323;
  }
  .titleBox {
    width: 80%;
    height: 100%;
    background: url(../assets/wenzi.png) no-repeat 0 50px;
    background-size: 100%;
    position: relative;
    margin: 0 auto;
  }
  .shackBox{
    width: 80%;
    height: 100%;
    background: url(../assets/yaoyiyao.png) no-repeat 0 center;
    background-size: 100%;
    margin: 0 auto;
  }
  .centerText{
    width: 100%;
    height: 15%;
    background: url(../assets/shengyucishu.png) no-repeat center center;
    background-size: 70%;
    position: absolute;
    top: 65%;
  }
  .takePartInButt{
    width: 100%;
    height: 15%;
    background: url(../assets/takePartInButt.png) no-repeat center center;
    background-size: 70%;
    border: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 75%;
    margin: auto;
  }
  .takePartInButt:active{
    background: url(../assets/takePartInButtClick.png) no-repeat center center;
    background-size: 70%;
    border: none;
  }
  .takePartInButt:focus {outline: none;}
  .maskLayerBox{
    background: #000;
    opacity: 0.8;

    .el-dialog{
      height: 100vh;
      background-color:transparent;
      margin: 0 !important;
    }
    .el-dialog__headerbtn{
      display: none;
    }
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      height: 100%;
      padding: 0 10px;
    }
    .arrowsBox{
      width: 100%;
      height: 20%;
      background: url(../assets/jiantou.png) no-repeat center right;
      background-size: 50%;
    }
    .hintBox{
      width: 100%;
      height: 40%;
        p{
          text-align: center;
          color: #FFD5A9;    
          font-weight: bold;         
        }
    }
    .buttonBox{
      width: 100%;
      height: 20%;
      background: url(../assets/cpm-button.png) no-repeat center center;
      background-size: 35%;
      opacity: 1;
    }
  }
</style>
