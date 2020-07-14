<template>
  <div class="myCardsBox">
    <div class="topBox">
        <p class="topText">{{ empName }} 集齐了五观</p>
    </div>
    <p class="littleText">速度杠杠的，快去合成吧</p>
    <div class="myCardscompBox">
        <img v-if="empPhoto && empPhoto != undefined" class="headImg" :src="empPhoto" alt="">
        <img v-else class="headImg" src="../assets/headerImg.png" alt="">
        <div class="outerBox firstBox">
            <div class="myCard"></div>
        </div>
        <div class="outerBox secondBox">
            <div class="myCard myCard1"></div>
            <div class="myCard myCard2"></div>
        </div>
        <div class="outerBox thirdBox">
            <div class="myCard myCard3"></div>
            <div class="myCard myCard4"></div>
        </div>
    </div>
    <div class="takePartInButt" @click="takePartInClick()"></div>

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
export default {
    name: 'ShareMyCards',
    data () {
        return {
            dialogVisible: false,
            empName: '',
            empPhoto: ''
        }
    },
    created(){
        this.empName = decodeURIComponent(this.getQueryVariable("empName"));
        this.empPhoto = decodeURIComponent(this.getQueryVariable("empPhoto"));
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
        },
        getQueryVariable(variable) {
            var url = window.location.href;
            var query = url.substring(url.lastIndexOf('?') + 1, url.length);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return('');
        }
    },
}
</script>

<!-- 添加'scoped'属性以将CSS限制到此组件 -->
<style lang='scss'>
    p{
        margin: 0;
        padding: 0;
    }
    .myCardsBox {
        width: 100%;
        height: 100vh;
        background: url(../assets/wuguan-bg.png) no-repeat 0 0;
        background-size: 100%;
        background-color: #110F0E;
        overflow: hidden;
    }
    .topBox {
        width: 100%;
        height: 13%;
        background: url(../assets/wuguan-jiqi.png) no-repeat center center;
        background-size: 85%;
        display: table;
    }
    .topText{
        width: 100%;
        height: 100%;
        text-align: center;
        color: #FFE79D;
        font-size: 22px;
        vertical-align: middle;
        display: table-cell;
    }
    .littleText{
        color: #FFEDBD;
        text-align: center;
        font-size: 12px;
    }
    .myCardscompBox{
        width: 100%;
        height: 60%;
        background: url(../assets/wuguan-hecheng.png) no-repeat center center;
        background-size: 50%;
        margin: 20px auto;
        position: relative;
    }
    .headImg{
        width: 110px;
        height: 110px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .headImg:focus{
        outline: none;
    }
    .outerBox {
        width: 100%;
        height: 30%;
    }
    .firstBox{
        position: absolute;
        top: 0;
    }
    .secondBox{
        display: flex;
        justify-content: space-between;
        position: absolute;
        top: 20%;
    }
    .thirdBox{
        display: flex;
        justify-content: space-between;
        position: absolute;
        top: 65%;
    }

    .myCard{
        width: 30%;
        height: 100%;
    }
    .firstBox .myCard{
        background: url(../assets/lifesmall.png) no-repeat center center;
        margin: 0 auto;
        background-size: 75%;
    }
    .secondBox .myCard1{
        background: url(../assets/renshengsmall.png) no-repeat center center;
        background-size: 75%;
        margin-left: 5%;
    }
    .secondBox .myCard2{
        background: url(../assets/succeedsmall.png) no-repeat center center;
        background-size: 75%;
        margin-right: 5%;
    }
    .thirdBox .myCard3{
        background: url(../assets/kehusmall.png) no-repeat center center;
        background-size: 75%;
        margin-left: 15%;
    }
    .thirdBox .myCard4{
        background: url(../assets/worksmall.png) no-repeat center center;
        background-size: 75%;
        margin-right: 15%;
    }

    .takePartInButt{
        width: 100%;
        height: 15%;
        background: url(../assets/takePartInButt.png) no-repeat center center;
        background-size: 60%;
        border: none;
        margin-top: 10%;
    }
    .takePartInButt:active{
        background: url(../assets/takePartInButtClick.png) no-repeat center center;
        background-size: 60%;
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
