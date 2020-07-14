<template>
  <div class="hello">
    <h1>Android下载二维码</h1>
      <div class="QRCode">
        <img src="../assets/AndroidQR.png">
      </div>
    <h1>iOS下载二维码</h1>
      <div class="QRCode">
        <img src="../assets/iOSQR.png">
      </div>
  </div>
</template>

<script>

export default {
  name: 'PCpage',
  data () {
    return {
      msg:'a1'
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: 900;
}
.QRCode {
  font-family: 'Ave/*nir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
