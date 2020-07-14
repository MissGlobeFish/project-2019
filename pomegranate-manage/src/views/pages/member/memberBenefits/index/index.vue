<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员权益</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
        <div>
            <!-- 头部 -->
            <div class="top">
            <div class="top-title">
                <span>&nbsp;会员权益</span>
                <span style="margin-left:20px;font-size:12px;">你可以在该页面对会员权益进行管理</span>
            </div>
            </div>

            <!-- 会员权益配置表 -->
            <el-form class="benefitsForm" ref="benefitsForm" :model="benefitsForm" v-loading="loading" label-width="120px" style="padding: 0 10px;">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="研习会员" name="Y1">
                        <el-form-item label="研习卡价格：">
                            <el-input v-model="benefitsForm.cardPrice" placeholder="如：100"></el-input> 元 / 年
                        </el-form-item>
                        <el-form-item label="初始研值：">
                            <el-input v-model="benefitsForm.integral" placeholder="如：100"></el-input> 分
                        </el-form-item>
                        
                        <!-- 可删减课程优惠表单 -->
                        <el-form-item label="课程优惠：">
                            <div class="courseBox" v-for="(benefits) in benefitsForm.preferentialList" :key="benefits.key">
                                <el-select v-model="benefits.courseId" placeholder="选择课程系列">
                                    <el-option v-for="item in preferentialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <span style="margin-left:8%;">优惠金额</span>
                                <el-input class="otherInput" v-model.number="benefits.preferentialPrice" autocomplete="off" placeholder="如：100"></el-input>
                                <span style="margin-right:8%;">元</span>
                                <el-button type="text" @click.prevent="removeCourse(benefits)" style="float:right;">删除</el-button>
                            </div>
                            <el-button type="text" icon="el-icon-document-add" @click="addCourse">添 加</el-button>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="研学会员" name="Y2">
                        <el-form-item label="研学卡价格：">
                            <el-input v-model="benefitsForm.cardPrice" placeholder="如：100"></el-input> 元 / 年
                        </el-form-item>
                        <el-form-item label="初始研值：">
                            <el-input v-model="benefitsForm.integral" placeholder="如：100"></el-input> 分
                        </el-form-item>
                        
                        <!-- 可删减课程优惠表单 -->
                        <el-form-item label="课程优惠：">
                            <div class="courseBox" v-for="(benefits) in benefitsForm.preferentialList" :key="benefits.key">
                                <el-select v-model="benefits.courseId" placeholder="选择课程系列">
                                    <el-option v-for="item in preferentialLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <span style="margin-left:8%;">优惠金额</span>
                                <el-input class="otherInput" v-model.number="benefits.preferentialPrice" autocomplete="off" placeholder="如：100"></el-input>
                                <span style="margin-right:8%;">元</span>
                                <el-button type="text" @click.prevent="removeCourse(benefits)" style="float:right;">删除</el-button>
                            </div>
                            <el-button type="text" icon="el-icon-circle-plus-outline" @click="addCourse">添 加</el-button>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="研修会员" name="Y3">
                        <el-form-item label="啦啦啦">
                            <el-input v-model="benefitsForm.cardPrice"></el-input>
                        </el-form-item>
                    </el-tab-pane> -->
                </el-tabs>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">保 存</el-button>
                </el-form-item>
            </el-form>
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
            activeName: 'Y1',
            tabIndex: '0',
            memberCard: [],//会员权益总数据
            benefitsForm: {//表单数据
                cardPrice: '',
                integral: '',
                preferentialList: [
                    {
                        courseId: '',
                        price: '',
                    }
                ]
            },
            preferentialLists: [],//课程列表
        }
    },
    created() {
        this.getForm();
        this.getRangeList();
    },
    methods: {
        //基础查询接口
        getForm(){
            let self = this;
            self.loading = true;
            https.fetchGet( '/pomegranate/web/memberCard' )
            .then(function(res){
                if (res.data.code) {
                    self.loading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.loading = false;
                    console.log(res.data)
                    self.memberCard = res.data;
                    self.benefitsForm = self.memberCard[self.tabIndex];
                }
            })
            .catch(function(err){
                self.loading = false;
                self.$message({
                    type: 'warning',
                    message: '会员权益查询失败！',
                });
            })
        },

        //查询课程列表
        getRangeList(){
            let self = this;
            https.fetchGet('/pomegranate/web/course/names')
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    let data = res.data;
                    for (const i in data) {
                        data[i].id = data[i].courseId;
                        data[i].name = data[i].courseName;    
                    }
                    self.preferentialLists = data;
                }
            })
            .catch(function(err){
                self.$message({
                type: 'warning',
                message: '查询课程列表失败！'
                });
            })
        },

        //切换Tab页
        handleClick(tab, event) {
            this.tabIndex = tab.index;
            this.benefitsForm = this.memberCard[tab.index];
        },

        //新增课程优惠
        addCourse() {
            this.benefitsForm.preferentialList.push({
                courseId: '',
                preferentialPrice: '',
                key: Date.now()
            });
        },

        //删除课程优惠
        removeCourse(item) {
            var index = this.benefitsForm.preferentialList.indexOf(item)
            if (index !== -1) {
                this.benefitsForm.preferentialList.splice(index, 1)
            }
        },

        //保存配置
        handleSave(){
            console.log(this.benefitsForm)
            let self = this;
            self.loading = true;
            if (this.benefitsForm.cardId) {
                this.benefitsForm.preferentialList.forEach(element => {
                    element.cardId = this.benefitsForm.cardId;
                });
            }
            https.fetchPost('/pomegranate/web/memberCard/edit', self.benefitsForm)
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
                    message: '会员权益保存失败！'
                });
            })
        },
    }
}
</script>

<style lang="scss">
    .benefitsForm{
        .el-input{
            width: 30%;
        }
        .el-select{
            .el-input{
                width: 100%;
            }
        }
        .otherInput{
            width: 30%;
            margin: 0 0.5%;
        }
        .courseBox{
            width: 65%;
            border-bottom: 1px solid #DCDFE6;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
    }
</style>
