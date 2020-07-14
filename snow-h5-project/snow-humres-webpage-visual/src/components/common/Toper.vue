<template>
    <div id="toper">
        <div class="top">员工入职登记</div>
        <div class="title">{{val}}</div>
    </div>
</template>

<script>
    export default {
        name: 'Toper',
        //这里配置props接受父组件所传递下来的值
        props:["value"],
        data () {
            return {
                val: this.value
            }
        },
    }
</script>
<style lang="less">
    #toper {
        width: 100%;
        height: 56px;
        background: #fff;
        box-shadow: 0 1px 2px 0 rgba(102, 102, 102, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2017;
        padding-top: 12px;

        .top {
            color: rgb(38, 38, 38);
            font-size: 16px;
            text-align: center;
        }

        .title {
            color: rgb(255, 102, 0);
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            margin-top: 6px;
        }
    }
    
</style>