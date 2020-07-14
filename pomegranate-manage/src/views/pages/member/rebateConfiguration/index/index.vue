<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>推荐返利</el-breadcrumb-item>
        <el-breadcrumb-item>返利配置</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
        <div>
            <!-- 头部 -->
            <div class="top">
            <div class="top-title">
                <span>&nbsp;返利配置</span>
                <span style="margin-left:20px;font-size:12px;">你可以在该页面对返利相关信息进行配置</span>
            </div>
            </div>

            <!-- 返利配置列表 -->
            <ul class="rebateList" v-loading="loading">
                <li>
                    <h4>购买研习会员</h4>
                    <el-form :model="rebateY1" ref="rebateY1" label-width="150px" class="demo-rebateY1">
                        <el-form-item label="被推荐人优惠：" prop="discount"> 
                            <el-input v-model.number="rebateY1.discount" placeholder="请输入优惠" autocomplete="off"></el-input> 元
                        </el-form-item>
                        <el-form-item label="推荐人获赠研值：" prop="inviterScore"> 
                            <el-input v-model="rebateY1.inviterScore" placeholder="请输入研值" autocomplete="off"></el-input> 分
                        </el-form-item>
                        <el-form-item label="被推荐人获赠研值：" prop="inviteeScore"> 
                            <el-input v-model="rebateY1.inviteeScore" placeholder="请输入研值" autocomplete="off"></el-input> 分
                        </el-form-item>
                    </el-form>
                    <div class="border"></div>
                </li>
                <li>
                    <h4>购买研学会员</h4>
                    <el-form :model="rebateY2" ref="rebateY2" label-width="150px" class="demo-rebateY2">
                        <el-form-item label="被推荐人优惠：" prop="discount"> 
                            <el-input v-model="rebateY2.discount" placeholder="请输入优惠" autocomplete="off"></el-input> 元
                        </el-form-item>
                        <el-form-item label="推荐人获赠研值：" prop="inviterScore"> 
                            <el-input v-model="rebateY2.inviterScore" placeholder="请输入研值" autocomplete="off"></el-input> 分
                        </el-form-item>
                        <el-form-item label="被推荐人获赠研值：" prop="inviteeScore"> 
                            <el-input v-model="rebateY2.inviteeScore" placeholder="请输入研值" autocomplete="off"></el-input> 分
                        </el-form-item>
                    </el-form>
                    <div class="border"></div>
                </li>
                <li>
                    <h4>购买研修会员</h4>
                    <el-form :model="rebateY3" ref="rebateY3" label-width="150px" class="demo-rebateY3">
                        <el-form-item label="被推荐人优惠：" prop="discount"> 
                            <el-input v-model="rebateY3.discount" placeholder="请输入优惠" autocomplete="off"></el-input> 元
                        </el-form-item>
                        <el-form-item label="推荐人获赠研值：" prop="inviterScore"> 
                            <el-input v-model="rebateY3.inviterScore" placeholder="请输入研值" autocomplete="off"></el-input> 分
                        </el-form-item>
                        <el-form-item label="被推荐人获赠研值：" prop="inviteeScore"> 
                            <el-input v-model="rebateY3.inviteeScore" placeholder="请输入研值" autocomplete="off"></el-input> 分
                        </el-form-item>
                    </el-form>
                    <div class="border"></div>
                </li>
            </ul>
            <el-button style="margin:40px;" type="primary" @click="handleSave">保 存</el-button>
        </div>
    </template>
   
  </d2-container>
</template>

<script>
import https from '../../../../../https.js'
export default {
    components: {

    },
    data () {
        return {
            filename: __filename,
            loading: false,
            rebateForm: [],//表单数据
            rebateY1: {
                discount: 0,
                inviterScore: 0,
                inviteeScore: 0,
            },
            rebateY2: {
                discount: 0,
                inviterScore: 0,
                inviteeScore: 0,
            },
            rebateY3: {
                discount: 0,
                inviterScore: 0,
                inviteeScore: 0,
            },
        }
    },
    created() {
        this.getForm();
    },
    methods: {
        //基础查询接口
        getForm(){
            let self = this;
            self.loading = true;
            https.fetchGet( '/pomegranate/web/rebate' )
            .then(function(res){
                if (res.data.code) {
                    self.loading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.loading = false;
                    res.data.forEach(element => {
                        if (element.cardType == 'Y1') {
                            self.rebateY1 = element;
                        }else if(element.cardType == 'Y2'){
                            self.rebateY2 = element;
                        }else if(element.cardType == 'Y3'){
                            self.rebateY3 = element;
                        }
                    });
                }
            })
            .catch(function(err){
                self.loading = false;
                self.$message({
                    type: 'warning',
                    message: '返利配置查询失败！',
                });
            })
        },
        handleSave(){
            let self = this;
            self.loading = true;
            self.rebateForm.push(self.rebateY1);
            self.rebateForm.push(self.rebateY2);
            self.rebateForm.push(self.rebateY3);
            https.fetchPut('/pomegranate/web/rebate/update', self.rebateForm)
            .then(function(res){
                if (res.data.code) {
                    self.loading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息提交失败，请检查后重试！'
                    });
                }else{
                    self.loading = false;
                    self.$alert('保存成功，配置已更新！', {
                        confirmButtonText: '确定',
                        type: 'success',
                    });
                    self.getForm();
                }
            })
            .catch(function(err){
                self.loading = false;
                self.$message({
                    type: 'warning',
                    message: '返利配置保存失败！'
                });
            })
        },
    }
}
</script>

<style lang="scss">
    .rebateList{
        margin-top: 40px;
        .border{
            margin: 0 35px;
            border-bottom: 1px dashed #666;
        }
        h4{
            padding-left: 35px;
        }
        .el-form{
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            .el-input{
                width: 80%;
            }
        }
    }
</style>
