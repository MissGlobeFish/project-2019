<template>
    <div class="login-wrap">
        <div class="ms-title">EHR</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="empSpell">
                    <el-input v-model="ruleForm.empSpell" placeholder="empSpell"></el-input>
                </el-form-item>
                <el-form-item prop="empPassword">
                    <el-input type="password" placeholder="empPassword" v-model="ruleForm.empPassword" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import * as types from 'store/types'
    export default {
        data: function(){
            return {
                ruleForm: {
                    empSpell: '',
                    empPassword: '',
                    empCode:''
                },
                rules: {
                    empSpell: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    empPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){ 
            this.$store.commit(types.TITLE, 'Login');
        },
        methods: {
            submitForm(formName) {
                let self = this; 
                let url=global.HUMRES_URL+"/humres/empmanage/findLogin";
                self.$http.post(url,self.ruleForm).then(function(data){
                    if(data.body.flag){ 
                        this.$store.commit(types.LOGIN,data.body.data.empCode); 
                        if(data.body.authority){
                            localStorage.setItem('authority',data.body.authority);
                        }else{
                             localStorage.setItem('authority',1);
                        }  
                        localStorage.setItem('ms_empCode',data.body.data.empCode);
                        self.$router.push('/details');
                    }else{
                        self.$message({
                            message: data.body.msg,
                            type: 'error'
                        });
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login-wrap{
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;//阻止文字被选中
        position: relative;
        width:100%;
        height:100%;

        .ms-title{
            position: absolute;
            top:50%;
            width:100%;
            margin-top: -230px;
            text-align: center;
            font-size:30px;
            color: #fff;

        }
        .ms-login{
            position: absolute;
            left:50%;
            top:50%;
            width:300px;
            height:160px;
            margin:-150px 0 0 -190px;
            padding:40px;
            border-radius: 5px;
            background: #fff;

            .login-btn{
                text-align: center;

                button{
                    width:100%;
                    height:36px;
                }
            }
        }
    }
    
    
</style>
