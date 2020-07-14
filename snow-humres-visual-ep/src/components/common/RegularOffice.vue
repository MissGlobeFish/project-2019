<template>
    <div class="regularOffice">
        <div class="regularBox">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-service"></i> 转正申请</el-breadcrumb-item>
                </el-breadcrumb>
                <el-button class="back" size="small" icon="el-icon-caret-left" @click="handleBack"> 返回</el-button>
            </div>
            
            <div v-loading="loading" class="steps">

                

            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: ["LeaveOption"],
    data() {
        return {
            loading: false,
        }
    },
    created() {
        //在实例创建完成后被立即调用
        
    },
    methods: {
        handleBack() {
            //返回上一级（只在员工页面编辑跳转时才启用）
            this.$emit("goRegularBack", false);
        },
    }
}
</script>

<style lang="less">
    .regularOffice {
        background: #fff;
        .regularBox{
            box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
            padding: 20px;

            .crumbs{
                position: relative;
                margin-bottom: 40px;

                .back{
                    position: absolute;
                    right: 0;
                    bottom: -12px;
                }
            }
        }
    }
</style>
