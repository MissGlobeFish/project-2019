<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>欢迎使用旺小宝ERP</h2>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'WXB'
    }
  },
  created(){
    let home = this
    var t;
    clearTimeout(t)
    t = setTimeout(function (){
      home.turnToInstallPage();
    }, 1500);
  },
  methods: {
     turnToInstallPage(){
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        // alert('iOS')
        location.href = 'https://www.pgyer.com/3JrL'
      }else if (isAndroid) {
        // alert('android')
      location.href = 'http://beta.bugly.qq.com/wxb_erp'
      }else{
        this.$router.push({path: '/PCpage'});
     }
    }
  }

}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: 900;
}

h2{
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
