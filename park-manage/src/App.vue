<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
  #app .el-table--mini td{
    padding: 6;
  }
  .el-dialog{
    border-radius: 5px;
    .el-dialog__header{
      background: #F9F9F9;
      border-bottom: 1px solid #DDDDDD;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      padding: 10px 20px 10px;
      .el-dialog__title{
        font-size: 14px;
      }
      .el-dialog__headerbtn{
        top: 15px;
      }
    }
  }
  .el-button+.el-button{
    margin-left: 1;
  }
</style>
