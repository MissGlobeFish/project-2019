<template>
  <div class="container">
    <div class="wall">
      <img class="wallTitleLogo" src="../assets/images/PhotoWallLogo.png">
      <div class="photoBox">
        <!-- 常量 K = 宽高比 2.277 * 照片比例 1.5  当前 K = 3.415 /  -->
        <!-- shake shake-hard shake-constant -->
        <div
          v-for="(person, index) in signedPersons"
          :class="shakeStyle[ parseInt(Math.random() * shakeNames.length ) % shakeNames.length ]"
          :ref="'persenBox' + index"
          :style=" { width: ((Math.sqrt(signedPersons.length / 3.415 )) * 100) / signedPersons.length + '%' ,
                    height: 100 / (Math.sqrt(signedPersons.length / 3.415 ) + 1) + '%'
                    } "
          :key="index"
        >
          <!-- <div v-for="person in signedPersons" class="persenBox"> -->
          <img :src="person.photo" class="photoImage">
        </div>
      </div>
    </div>

    <!-- 抽奖按钮 -->
    <button class="drawBtnStyle shake shake-hard" @click="beginDraw"> Go！</button>

    <!-- 弹窗 -->
    <div id="dialog" v-if="dialogPersons.length > 0">
      <div class="dialogBackView">
        <div class="welcomePhotoBox">
          <img :src="dialogPerson.photo">
        </div>
        <label class="welcomeLabel">
          欢迎
          <label class="nameLabel">{{" " + dialogPerson.empName }}</label> 入场
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoWall",
  data() {
    return {
      websock: null,
      //签到墙数据
      signedPersons: [],
      //弹窗数据池
      dialogPersons: [
        // {
        // empCode: "GS0286",
        // empName: "张6豪",
        // sign: 0,
        // photo:
        //   "https://gstf-merchantkey.oss-cn-beijing.aliyuncs.com/stage/RecognitionPortrait/20181129/1543477950429.jpg"
        // }
      ],
      //当前弹窗数据
      dialogPerson: {
        // empCode: "GS0286",
        // empName: "张6豪",
        // sign: 0,
        // photo:
        //   "https://gstf-merchantkey.oss-cn-beijing.aliyuncs.com/stage/RecognitionPortrait/20181129/1543477950429.jpg"
      },

      //----------抽奖配置👇

      //抽奖数量
      drawNumber: 3,
      //抽奖时间
      drawDuring: 10000,
      //抖动类型
      shakeNames: ["shake-hard", "shake-slow","shake-chunk"],

      //开始抽奖
      draw: false,
      //每秒减少人数（点击开始后会自动计算）
      passNumberPS: 5
    };
  },
  computed: {
    //返回样式
    shakeStyle: function() {
      var shakeStyles = [];
      shakeStyles = this.shakeNames.map(name => {
        var obj = {
          persenBox: true,
          shake: this.draw,
          "shake-constant": this.draw
        }
        obj[name] = true
        return obj
      });
      return shakeStyles
    }
  },
  created() {
    //页面刚进入时开启长连接
    this.initializeDatas();
    this.initWebSocket();
  },
  destroyed: function() {
    //页面销毁时关闭长连接
    this.closeSocket();
  },
  methods: {
    //抽奖
    beginDraw() {
      if (this.draw || this.signedPersons.length <= this.drawNumber) {
        return;
      }
      this.draw = true;
      var totle = this.signedPersons.length;
      this.passNumberPS = parseInt(
        (totle - this.drawNumber) / (this.drawDuring / 1.5 / 1000 - 1) 
      );
      //开始逻辑
      setTimeout(this.removeSingers, 1000);
    },
    removeSingers() {
      //结束抽奖
      if (this.signedPersons.length == this.drawNumber) {
        console.log("-----------抽奖结果出现-------------");
        console.log(
          this.signedPersons.map(persen => {
            return persen.empName;
          })
        );
        this.draw = false;
        return;
      }
      //随机排除人数
      var passNumber = this.passNumberPS;
      if (this.signedPersons.length < this.drawNumber + this.passNumberPS) {
        passNumber = this.signedPersons.length - this.drawNumber;
      }
      do {
        var index = parseInt(Math.random() * this.signedPersons.length);
        this.signedPersons.splice(index, 1);
        passNumber -= 1;
      } while (passNumber > 0);

      var ms = this.signedPersons.length == this.drawNumber ? 100 : 1500
      setTimeout(this.removeSingers, ms);
    },

    // Http 全量数据同步
    initializeDatas() {
      console.log("开始加载数据...");
      let self = this;
      let url = global.BASE_URL + "user/sign";
      console.log(url);
      let options = {
        timeout: 30 * 1000
      };
      self.$http.get(url, options).then(
        function(data) {
          console.log(data.body);
          self.signedPersons = data.body;
        },
        function(error) {
          console.log("加载失败！");
        }
      );
    },

    //Socket 相关
    initWebSocket() {
      //初始化weosocket
      const wsuri = global.WS_BASE_URL + "0001"; //ws地址
      this.websock = new WebSocket(wsuri);
      console.log(this.websock);
      this.websock.onopen = this.websocketOnOpen.bind(this);
      this.websock.onerror = this.websocketOnError.bind(this);
      this.websock.onmessage = this.websocketOnMessage.bind(this);
      this.websock.onclose = this.websocketOnClose.bind(this);
    },

    websocketOnOpen() {
      console.log("WebSocket连接成功");
      this.initializeDatas();
      this.pingSocket(this.websock);
    },
    websocketOnError(e) {
      //错误
      console.log("WebSocket连接发生错误", e);
    },
    websocketOnMessage(e) {
      //数据接收
      this.didReceivedMsg(e.data);
    },

    websocketOnClose(e) {
      //关闭
      console.log(e.code, e.reason);
      console.log("客户端收到服务端发送的关闭连接");
      //重连
      if (e.code != 1001) {
        console.log("重连");
        this.initWebSocket();
      }
    },

    /**
     *  收到 JSON 类型消息
     * @param {String} msgString
     */
    didReceivedMsg(msgString) {
      var jsonObject = JSON.parse(msgString);
      if (jsonObject == null) {
        return;
      }

      let code = jsonObject.code;
      // console.log("收到", code, "数据：", jsonObject.data);
      switch (code) {
        case "PHOTO":
          //添加数据
          this.signedPersons = this.signedPersons.concat(jsonObject.data);
          this.handleSignPersons(jsonObject.data);
          break;
        default:
          break;
      }
    },

    /**
     * 关闭连接
     */
    closeSocket() {
      if (this.websocket != null) {
        console.log("处理关闭11");
        this.websock.close(1001, "Closed Game page !!!");
        this.websock = null;
      }
    },

    /**
     * 定时发心跳，保持活跃
     */
    pingSocket(curreWS) {
      if (this.websock == null || this.websock !== curreWS) {
        console.log("停止该次 Ping");
        return;
      }
      // if (this.websock === curreWS ) {
      let pingObject = {
        code: "PING",
        data: "我还活着" + "---签到墙---"
      };
      this.websock.send(JSON.stringify(pingObject));
      console.log("SocketConnect----- [Ping] ----");

      /**
       * 0 (CONNECTING) 正在链接中
       * 1 (OPEN)  已经链接并且可以通讯
       * 2 (CLOSING) 连接正在关闭
       * 3 (CLOSED) 连接已关闭或者没有链接成功
       *  */
      console.log("连接状态： ", this.websock.readyState);
      if (this.websock.readyState == 3) {
        //重连
        console.log("SocketConnect 心跳检测连接断开，执行重新连接!");
        this.initWebSocket();
        this.initializeDatas();
      }
      // }
      setTimeout(() => {
        this.pingSocket(curreWS);
      }, 30000);
    },

    //弹窗相关
    handleSignPersons(persons) {
      //原本池为空，手动激活
      var isEmpty = this.dialogPersons.length == 0;
      this.dialogPersons = this.dialogPersons.concat(persons);
      if (isEmpty && persons.length > 0) {
        this.signPersonDialog();
      }
    },

    signPersonDialog() {
      console.log(this.dialogPersons);
      if (this.dialogPersons.length == 0) {
        return;
      }
      this.dialogPerson = this.dialogPersons[0];
      setTimeout(() => {
        this.dialogPersons.shift();
        this.signPersonDialog();
      }, 1000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "../assets/less/reset.less";
@import "../assets/less/csshake.css";
//弹窗
#dialog {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
}
.dialogBackView {
  text-align: center;
  width: 50%;
  height: 40%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url("../assets/images/ModeBack.png") no-repeat;
  background-size: 100% 100%;
  // background-color: white;

  .welcomePhotoBox {
    background-color: #ffffff;
    width: 28%;
    height: 70%;
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%); //rotate(90deg);
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../assets/images/PortraitHuge.png") no-repeat;
    background-size: 100% 100%;
    img {
      width: 65%;
      height: 65%;
    }
  }

  .welcomeLabel {
    font-family: PingFangSC-Regular;
    font-size: 32px;
    color: #ffffff;
    line-height: 48px;
    position: absolute;
    width: 100%;
    left: 0px;
    bottom: 12%;
    .nameLabel {
      color: #65edf0;
    }
  }
}

.container {
  width: 1920px;
  height: 1080px;
  margin: 200px auto auto auto;
  background-image: url("../assets/images/BackgroundIMG.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.wall {
  margin-top: 10%;
  margin-left: 1%;
  margin-right: 1%;
  width: 98%;
  height: 90%;
  background-image: url("../assets/images/WallBack.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .wallTitleLogo {
    position: relative;
    width: 30%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin: -100px auto auto auto;
    transform: translate(0, -50%);
  }
  .photoBox {
    flex-direction: row;
    width: 100%;
    height: 85%;
    margin-top: -80px;

    .persenBox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-image: url("../assets/images/PortraitMini.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      max-width: 400px;
      max-height: 500px;
      // height: 140px;
      overflow: hidden;
      position: relative;
      // transform: rotate(90deg);
      // background-color: #ffffff;
    }
    .photoImage {
      width: 60%;
      height: 60%;
    }
  }
}
.drawBtnStyle {
  box-shadow: 0 7px 0 #ffc354cc, 0 8px 3px rgba(0, 0, 0, 0.3);
  padding: 20px 80px;
  border: none;
  background-color: #ffc354cc;
  color: #fff;
  margin: 20px auto auto auto;
}
</style>
