<template>
  <div class="root">
    <div id= "CompLogo">
      <img id= "CompLogoImg" src="../assets/logo.png">
    </div>
    <div id = "successInfo">
      <h1> ——录入成功——</h1>
    <el-button id="Btn" type="primary" @click="turnToHomePage">继续录入</el-button>
    </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SuccessPage',
  data () {
    return {

    }
  },
  created(){
    let self = this
    var t;
  },
  methods: {
     turnToHomePage(){
      //跳到回到首页
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // if (isiOS || isAndroid){
          this.$router.push({path: '/'});
      // }
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 40px;
}

.root{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 100px
}

#Btn{
  margin: 20px auto;
}

#successInfo{
  width: 100%;
  height: 30%;
}

#CompLogo{
  margin: 0 auto;
  width: 40%
}

#CompLogo img{
  width: 100%;
  height: 100%
}

</style>
