<template>
    <div class="Stepfour">
        <Toper v-model="msg" />
        <div class="four">
            
            <div v-for="(item, index) in workModelList" :key="item.id" style="margin-bottom:20px;">
                <el-form class="demo-ruleForm" :model="item" :rules="workModelRules" ref="workModelList">
                    <p class="p"><i class="el-icon-message"></i> 工作经历</p>
                    <span class="span" v-show="index > 0" @click="handleRemove(index)">删除</span>
                    <el-form-item :show-message="false" prop="company">
                        <el-input v-model="item.company" placeholder="公司名称"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="jobDesc">
                        <el-input v-model="item.jobDesc" placeholder="职位名称"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="contactPeople">
                        <el-input v-model="item.contactPeople" placeholder="证明人"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="contactPhoneNum">
                        <el-input v-model.number="item.contactPhoneNum" placeholder="证明人联系方式"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="beginDate">
                        <el-date-picker v-model="item.beginDate" type="date" :editable="false" placeholder="开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="finishDate">
                        <el-date-picker v-model="item.finishDate" @focus="handleIndex(index)" :picker-options="pickerOptionsInit" type="date" :editable="false" placeholder="离职时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="leaveReason">
                        <el-input v-model="item.leaveReason" placeholder="离职原因"></el-input>
                    </el-form-item>
                    
                </el-form>
            </div>
            
            <el-dialog title="添加成员" :visible.sync="dialogFormVisible">
                <el-input v-model="work.company" placeholder="公司名称"></el-input>
                <el-input v-model="work.jobDesc" placeholder="职位名称"></el-input>
                <el-input v-model="work.contactPeople" placeholder="证明人"></el-input>
                <el-input v-model="work.contactPhoneNum" placeholder="证明人联系方式"></el-input>
                <el-date-picker v-model="work.beginDate" type="date" :editable="false" placeholder="开始时间"></el-date-picker>
                <el-date-picker v-model="work.finishDate" :picker-options="pickerOptions" type="date" :editable="false" placeholder="离职时间"></el-date-picker>
                <el-input v-model="work.leaveReason" placeholder="离职原因"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addWorkSure">确 定</el-button>
                </div>
            </el-dialog>

            <el-button class="add" icon="el-icon-plus" @click="addWork">添加经历</el-button>
            <el-button class="add" style="color:#E55B00;" @click="not">无工作经历</el-button>

            <el-button class="jump" style="margin-left:5%;background:#fff;color:rgb(170,170,170);outline:none;" @click="prev">上一步</el-button>
            <el-button class="jump" @click="submitForm('workModelList')">下一步</el-button>
        </div>
    </div>
   
</template>

<script>
    
    import Toper from '../common/Toper'

    export default {
        name: 'Stepfour',
        data () {
            return {
                msg: '填写工作经历',
                info: JSON.parse( window.localStorage.getItem("info") ),
                nowIndex: '',
                workModelList: [],
                work: {},
                dialogFormVisible: false,
                workModelRules: {
                    company: [//公司名称
                        { required: true }
                    ],
                    jobDesc: [//职位名称
                        { required: true }
                    ],
                    contactPeople: [//证明人
                        { required: true }
                    ],
                    contactPhoneNum: [//证明人联系方式
                        {required: true, message: '',trigger: 'blur',type:'number'},
                        { pattern: /^1[34578]\d{9}$/, message: '' }
                    ],
                    beginDate: [//开始时间
                        { required: true }
                    ],
                    finishDate: [//离职时间
                        { required: true }
                    ],
                    leaveReason: [//离职原因
                        { required: true }
                    ]
                },
                pickerOptionsInit: {
                    disabledDate:(time) => {
                        if( this.workModelList[this.nowIndex].beginDate != ""){
                            return time.getTime() <= this.workModelList[this.nowIndex].beginDate;
                        }else {
                            return time.getTime() >= Date.now();
                        }
                    }
                },
                pickerOptions: {
                    disabledDate:(time) => {
                        if( this.work.beginDate != ""){
                            return time.getTime() <= this.work.beginDate;
                        }else {
                            return time.getTime() >= Date.now();
                        }
                    }
                },
            }
        },
        components: {
            'Toper' : Toper
        },
        created() {
            //在实例创建完成后被立即调用
            if (!this.info.workModelList || this.info.workModelList.length == 0) {
                this.workModelList = [{
                    company: '',
                    jobDesc: '',
                    contactPeople: '',
                    contactPhoneNum: '',
                    beginDate: '',
                    finishDate: '',
                    workYear: '',
                    leaveReason: ''
                }];
            }else{
                this.workModelList = this.info.workModelList;
            }
        },
        methods: {
            addWork(){
                this.dialogFormVisible = true;
                this.work = {
                    company: '',
                    jobDesc: '',
                    contactPeople: '',
                    contactPhoneNum: '',
                    beginDate: '',
                    finishDate: '',
                    workYear: '',
                    leaveReason: ''
                }
            },
            addWorkSure(){
                if (this.work.company) {
                    this.workModelList.push(this.work)
                }
                this.dialogFormVisible = false;
            },
            handleRemove(index){
                this.workModelList.splice(index, 1);
            },
            handleIndex(index){
                this.nowIndex = index;
            },
            prev(){
                this.$emit("handleChange","Stepthree","Stepthree")
            },
            submitForm(formName) {
                this.$refs[formName].forEach((item) => {item.validate((valid) => {
                    if (valid) {
                        this.workModelList.forEach(i => {
                            i.beginDate = this.formatDate(i.beginDate);
                            i.finishDate = this.formatDate(i.finishDate);
                        });

                        this.info.workModelList = this.workModelList;

                        window.localStorage.setItem("info", JSON.stringify(this.info));
                        this.$emit("handleChange","Stepfive");  
                    } else {   
                        return false;
                    }
                });
                });
            },
            not(){
                this.info.workModelList = [];
                window.localStorage.setItem("info", JSON.stringify(this.info));
                this.$emit("handleChange","Stepfive");
            },
            formatDate(datetime) {
                let newdate = new Date(datetime);
                let year = newdate.getFullYear(),
                month = (newdate.getMonth() + 1 < 10) ? '0' + (newdate.getMonth() + 1):newdate.getMonth() + 1,
                day = newdate.getDate() < 10 ? '0' + newdate.getDate() : newdate.getDate();
                return year + '/' + month + '/' + day;
            }
        }
    }
</script>

<style lang="less">
@boxShadow: 0 2px 4px 0 rgba(102, 102, 102, 0.1);

    .Stepfour{
        .four{
            padding-top: 80px;

            .el-form-item{
                margin: 0;
            }

            .el-dialog{
                width: 80%;
                margin-top: 80px !important;
            }
            .el-input,.el-select{
                width: 90%;
                display: block;
                margin:5px auto;
                box-shadow: @boxShadow;
                input{
                    height: 50px;
                }

                .el-input{
                    width: 100%;

                    input{
                        height: 50px;
                    }
                }
            }
            .add{
                width: 90%;
                height: 50px;
                display: block;
                margin: 20px auto;
                box-shadow: @boxShadow;
            }
            .p{
                font-size: 14px;
                color: #E55B00;
                display: inline;
                padding-left: 25px;
                margin: 10px 0;   
            }
            .span{
                font-size: 14px;
                color: #E55B00;
                float: right;
                padding-right: 25px;
            }
            .jump{
                width: 43%;
                height: 50px;
                color: #fff;
                background: #E55B00;
                border: none;
                box-shadow: @boxShadow;
                margin: 15px 2% 15px 0;
            }
        }
        
    }
</style>