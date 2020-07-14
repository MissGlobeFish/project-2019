<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        }
    }
</script>
<style>
    .selected{
      font-size: 14px !important;
      color: #5a5e66 !important;
      font-weight: normal !important;
    }
</style>
<style lang="less">


#app {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; //阻止文字被选中

    .content{
        background: #F2F2F2;
    }

    input {
      font-size:12px;
    }
    .el-input__inner {
      min-height:41px !important;
    }
    .el-pagination {
      input {
        min-height:25px !important;
      }
    }
    .el-table {
      tr {
        height:20px;
      }
      td {
        padding:5px 0;
      }
      font-size:12px !important;
    }
    .handle-box {
        margin-bottom: 20px;
        button {
          font-size:12px !important;
        }
        .button,
        .search {
            margin-bottom: 16px;
            .el-input,
            .el-select {
                margin-right: 10px;
            }
        }
        .handle-input {
            width: 20%;
            display: inline-block;
        }
        .follow {
            margin-left: 0;
        }
    }
}
</style>
