<template>
    <div class="Stepfive">
        <Toper v-model="msg" />
        <div class="five">
            <p><i class="el-icon-tickets"></i> 个人声明</p>
                <el-form :model="empOtherModel" class="demo-ruleForm" :rules="empOtherModelRules" ref="empOtherModel">
                    <el-form-item :show-message="false" prop="lrExist">
                        <el-select v-model="empOtherModel.lrExist" placeholder="与其它单位有无劳动关系">
                            <el-option v-for="item in lrExists" :key="item.number" :label="item.label" :value="item.number"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="pjExist">
                        <el-select v-model="empOtherModel.pjExist" placeholder="与其它单位有无兼职情况">
                            <el-option v-for="item in pjExists" :key="item.number" :label="item.label" :value="item.number"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="ncaExist">
                        <el-select v-model="empOtherModel.ncaExist" placeholder="是否有禁业协议">
                            <el-option v-for="item in ncaExists" :key="item.number" :label="item.label" :value="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="empOtherModel.ncaExist == '是'" :show-message="false" prop="ncaDesc">
                        <el-input v-model="empOtherModel.ncaDesc" placeholder="禁业期限及范围"></el-input>
                    </el-form-item>
                </el-form>
            <el-button style="margin-left:5%;background:#fff;color:rgb(170,170,170);outline:none;" @click="prev">上一步</el-button>
            <el-button @click="submitForm('empOtherModel')">下一步</el-button>
        </div>
    </div>
   
</template>

<script>
    import Toper from '../common/Toper'
    
    export default {
        name: 'Stepfive',
        data () {
            return {
                msg: '填写个人声明',
                info: JSON.parse( window.localStorage.getItem("info") ),
                empOtherModel: {
                    ncaExist: '',
                    ncaDesc: '',
                    lrExist: '',
                    pjExist: ''
                },
                lrExists: [{ number: "1", label: "有" }, { number: "0", label: "无" }],
                pjExists: [{ number: "1", label: "有" }, { number: "0", label: "无" }],
                ncaExists: [{ number: "1", label: "是" }, { number: "0", label: "否" }],
                empOtherModelRules: {
                    lrExist: [//与其它单位有无劳动关系
                        { required: true, trigger: 'change' }
                    ],
                    pjExist: [//与其它单位有无兼职情况
                        { required: true, trigger: 'change' }
                    ],
                    ncaExist: [//是否有禁业协议
                        { required: true, trigger: 'change' }
                    ],
                    ncaDesc: [//是否有禁业协议
                        { required: true, trigger: 'change' }
                    ]
                },
            }
        },
        components: {
            "Toper" : Toper
        },
        created() {
            //在实例创建完成后被立即调用
            if (this.info.empOtherModel) {
                this.empOtherModel = this.info.empOtherModel;
            }
            if (this.empOtherModel.lrExist == '1') {
                this.empOtherModel.lrExist = "有";
            } else if(this.empOtherModel.lrExist == '0') {
                this.empOtherModel.lrExist = "无";
            }
            if (this.empOtherModel.pjExist == '1') {
                this.empOtherModel.pjExist = "有";
            } else if((this.empOtherModel.pjExist == '0')) {
                this.empOtherModel.pjExist = "无";
            }
            if (this.empOtherModel.ncaExist == '1') {
                this.empOtherModel.ncaExist = "是";
            } else if((this.empOtherModel.ncaExist == '0')) {
                this.empOtherModel.ncaExist = "否";
            }
        },
        methods: {
            prev(){
                this.$emit("handleChange","Stepfour","Stepfour")
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.empOtherModel.lrExist == "有") {
                            this.empOtherModel.lrExist = '1';
                        } else if(this.empOtherModel.lrExist == "无") {
                            this.empOtherModel.lrExist = '0';
                        }
                        if (this.empOtherModel.pjExist == "有") {
                            this.empOtherModel.pjExist = "1";
                        } else if(this.empOtherModel.pjExist == "无") {
                            this.empOtherModel.pjExist = "0";
                        }
                        if (this.empOtherModel.ncaExist == "是") {
                            this.empOtherModel.ncaExist = "1";
                        } else if(this.empOtherModel.ncaExist == "否") {
                            this.empOtherModel.ncaExist = "0";
                        }
                        this.info.empOtherModel = this.empOtherModel;
                        window.localStorage.setItem("info", JSON.stringify(this.info));

                        this.$emit("handleChange","Stepsix")
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="less">
@boxShadow: 0 2px 4px 0 rgba(102, 102, 102, 0.1);

    .Stepfive{
        .five{
            padding-top: 70px;
            .el-form-item{
                margin: 0;
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
            p{
                font-size: 14px;
                color: #E55B00;
                text-align: left;
                display: block;
                padding-left: 25px;
                margin-top: 20px;   
            }
            .el-button{
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