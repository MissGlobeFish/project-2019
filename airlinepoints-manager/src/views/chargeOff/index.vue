<template>
  <div class="app-container">
    
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>优惠码兑换</span>
        </div>
        <el-form :model="chargeForm" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="name" :rules="{ required: true, message: '优惠码不能为空', trigger: 'blur' }">
                <el-input v-model="chargeForm.name" placeholder="请输入优惠码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('chargeForm')">兑换</el-button>
            </el-form-item>
        </el-form>
    </el-card>

  </div>
</template>

<script>
import {  } from '@/api/chargeOff'

export default {
  data() {
    return {
        chargeForm: {
          name: '',
        },
    }
  },
  created() {
    
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
          } else {
            return false;
          }
        });
    },
  }
}
</script>
<style lang="scss" scoped>
  .box-card {
    width: 50%;
    margin: 0 auto;
    .el-form{
        text-align: center;
        margin: 80px 0; 
        .el-form-item:first-child {
            width: 50%;
        }
        .el-form-item{
            display: inline-block;
        }
    }
  }
</style>
