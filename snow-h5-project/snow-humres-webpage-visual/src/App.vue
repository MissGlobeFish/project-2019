<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    #app{
        background: rgb(240, 240, 240);
    }
    .el-message{
        z-index: 2020 !important;
    }
    .is-error .el-input__inner,.is-success .el-input__inner{
        border-width: 2px !important;
    }
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>