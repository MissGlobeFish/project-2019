<template>
  <div class="root">
    <div id= "CompLogo">
      <img id= "CompLogoImg" src="../assets/logo.png">
    </div>
    <h1>请使用手机打开该网页</h1>
      </div>
  </div>
</template>

<script>

export default {
  name: 'PCpage',
  data () {
    return {
    }
  },
  created(){
    let PCpage = this
    var t;
    clearTimeout(t)
    t = setTimeout(function (){
      PCpage.turnToHomePage();
    }, 1500);
  },
  methods: {
     turnToHomePage(){
      //如果是手机端打开PC 界面，跳到回到首页
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      
      if (isiOS || isAndroid){
          this.$router.push({path: '/'});
      }
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 50px;
}

.root{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 100px
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
