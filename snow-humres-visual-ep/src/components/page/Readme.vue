<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 自述</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="ms-doc">
            <h3>README.md</h3>
            <article>
                <h1>EHR（人力资源管理系统）</h1>
                <p>人力资源系统是涵盖了人事基本信息管理，薪酬福利，考勤绩效等核心功能的一站式HR服务平台
                ，本期作为该项目的第一期涉及员工个人信息查询/修改，花名册管理，组织架构管理，审批管理等模块</p>

                <h2>模块（下列为人事基本信息部分，选中部分为目前上线模块）</h2>
                <el-checkbox disabled checked>个人信息查询/修改</el-checkbox>
                <br>
                <el-checkbox disabled checked>花名册管理</el-checkbox>
                <br>
                <el-checkbox disabled checked>组织架构管理</el-checkbox>
                <br>
                <el-checkbox disabled checked>审批管理</el-checkbox>
                <br>
                <el-checkbox disabled>员工/组织异动</el-checkbox>
                <br>
                <el-checkbox disabled>入职/离职流程</el-checkbox>
                <br>
                <el-checkbox disabled>轨迹管理</el-checkbox>
                <br>
                <el-checkbox disabled>基础信息BI</el-checkbox>
            </article>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {}
        }
    }
</script>

<style scoped>
    .ms-doc{
        width:100%;
        max-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .ms-doc article h1{
        font-size:32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }
    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
    .ms-doc article p{
        margin-bottom: 15px;
        line-height: 1.5;
    }
    .ms-doc article .el-checkbox{
        margin-bottom: 5px;
    }
</style>
