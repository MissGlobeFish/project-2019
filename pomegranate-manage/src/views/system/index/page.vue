<template>
  <d2-container :filename="filename" class="page">
    <d2-page-cover>
      <img src="./image/logo-1.png" alt="">
      <template slot="footer">
        
      </template>
    </d2-page-cover>
  </d2-container>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      filename: __filename
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .page__logo {
    width: 120px;
  }
}
</style>
