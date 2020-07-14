<template>
    <div class="Steptwo">
        <Toper v-model="msg" />
        <div class="two">
            <el-form class="demo-ruleForm" :model="empMainModel" ref="empMainModel">
                <p><i class="el-icon-mobile-phone"></i> 紧急联系人</p>
                <el-form-item :class="nameClass" :show-message="false" prop="contactName">
                    <el-input @input="handlename" v-model="empMainModel.contactName" placeholder="联系人姓名"></el-input>
                </el-form-item>
                <el-form-item :class="relationClass" :show-message="false" prop="contactRelation">
                    <el-input @input="handlerelation" v-model="empMainModel.contactRelation" placeholder="联系人关系"></el-input>
                </el-form-item>
                <el-form-item :class="contactPhoneNumClass" :show-message="false" prop="contactPhoneNum">
                    <el-input @input="handlecontactPhoneNum" v-model.number="empMainModel.contactPhoneNum" placeholder="联系人电话"></el-input>
                </el-form-item>
            </el-form>

            <div v-for="(item, index) in familyModelList" :key="item.id">
                <el-form class="demo-ruleForm" :model="item" :rules="familyModelListRules" ref="familyModelList">
                    <p><i class="el-icon-service"></i> 家庭成员</p>
                    <span v-show="index > 0" @click="handleRemove(index)">删除</span>
                    <span @click="handleContact(index)">写入紧急联系人</span>
                    <el-form-item :show-message="false" prop="name">
                        <el-input v-model="item.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="relation">
                        <el-input v-model="item.relation" placeholder="关系"></el-input>
                    </el-form-item>
                    <el-input v-model="item.occupation" placeholder="职业"></el-input>
                    <el-form-item :show-message="false" prop="contactPhoneNum">
                        <el-input v-model.number="item.contactPhoneNum" placeholder="联系方式"></el-input>
                    </el-form-item>
                    <el-input v-model="item.addr" placeholder="住址"></el-input>
                </el-form>
            </div>
            
            <el-dialog title="添加成员" :visible.sync="dialogFormVisible">
                <el-input v-model="family.name" placeholder="姓名"></el-input>
                <el-input v-model="family.relation" placeholder="关系"></el-input>
                <el-input v-model="family.occupation" placeholder="职业"></el-input>
                <el-input v-model="family.contactPhoneNum" placeholder="联系方式"></el-input>
                <el-input v-model="family.addr" placeholder="住址"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addFamilySure">确 定</el-button>
                </div>
            </el-dialog>
            
            <el-button class="add" icon="el-icon-plus" @click="addFamily">添加成员</el-button>

            <el-button class="jump" style="margin-left:5%;background:#fff;color:rgb(170,170,170);outline:none;" @click="prev">上一步</el-button>
            <el-button class="jump" @click="submitForm('familyModelList')">下一步</el-button>
        </div>
    </div>

</template>

<script>
    import Toper from '../common/Toper'

    export default {
        name: 'Steptwo',
        data () {
            return {
                msg: '填写家庭信息',
                info: JSON.parse( window.localStorage.getItem("info") ),
                familyModelList: [],
                empMainModel: [],
                family: {},
                dialogFormVisible: false,
                familyModelListRules: {
                    name: [//姓名
                        { required: true }
                    ],
                    relation: [//关系
                        { required: true }
                    ],
                    contactPhoneNum: [//联系方式
                        {required: true, message: '',trigger: 'blur',type:'number'},
                        { pattern: /^1[34578]\d{9}$/, message: '' }
                    ]
                },
                nameClass: '',
                relationClass: '',
                contactPhoneNumClass: ''
            }
        },
        components: {
            'Toper' : Toper
        },
        created() {
            //在实例创建完成后被立即调用
            this.empMainModel = this.info.empMainModel;
            
            if (this.info.familyModelList) {
                this.familyModelList = this.info.familyModelList;
            }else{
                this.familyModelList = [{
                    name: '',
                    relation: '',
                    occupation: '',
                    contactPhoneNum: '',
                    addr: ''
                }]
            }
        },
        methods: {
            handlename(){//验证紧急联系人姓名
                if (!this.empMainModel.contactName) {
                    this.nameClass = 'is-error';
                } else {
                    this.nameClass = 'is-success';
                }
            },
            handlerelation(){//验证紧急联系人关系
                if (!this.empMainModel.contactRelation) {
                    this.relationClass = 'is-error';
                } else {
                    this.relationClass = 'is-success';
                }
            },
            handlecontactPhoneNum(){//验证紧急联系人联系方式
                let val = this.empMainModel.contactPhoneNum;
                let reg = /^1[34578]\d{9}$/;
                if (!reg.test(val)) {
                    this.contactPhoneNumClass = 'is-error';
                } else {
                    this.contactPhoneNumClass = 'is-success';
                }
            },
            addFamily(){
                this.dialogFormVisible = true;
                this.family = {
                    name: '',
                    relation: '',
                    occupation: '',
                    contactPhoneNum: '',
                    addr: ''
                }
            },
            addFamilySure(){
                if (this.family.name) {
                    this.familyModelList.push(this.family)
                }
                this.dialogFormVisible = false;
            },
            handleRemove(index){
                this.familyModelList.splice(index, 1);
            },
            handleContact(index){
                this.empMainModel.contactName = this.familyModelList[index].name;
                this.empMainModel.contactRelation = this.familyModelList[index].relation;
                this.empMainModel.contactPhoneNum = this.familyModelList[index].contactPhoneNum;
            },
            prev(){
                this.$emit("handleChange","Stepone","Stepone")
            },
            submitForm(formName) {
                
                this.$refs[formName].forEach((item) => {item.validate((valid) => {
                    if (valid) {
                        if (!this.empMainModel.contactName) {
                            this.nameClass = 'is-error';
                        }else if(!this.empMainModel.contactRelation) {
                            this.relationClass = 'is-error';
                        }else if(!this.empMainModel.contactPhoneNum) {
                            this.contactPhoneNumClass = 'is-error';
                        }else{
                            this.nameClass = 'is-success';
                            this.relationClass = 'is-success';
                            this.contactPhoneNumClass = 'is-success';

                            this.info.familyModelList = this.familyModelList;
                            this.info.empMainModel = this.empMainModel;
                            window.localStorage.setItem("info", JSON.stringify(this.info));
                            
                            this.$emit("handleChange","Stepthree")
                        }
                    } else {
                        return false;
                    }
                });
                });
            },
        }
    }
</script>


<style lang="less">
@boxShadow: 0 2px 4px 0 rgba(102, 102, 102, 0.1);

   .Steptwo{
        .two{
            padding-top: 80px;
            
            .el-dialog{
                width: 80%;
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
            .el-form{
                margin-bottom: 15px;

                .el-form-item{
                    margin: 0;
                }
                p{
                    font-size: 14px;
                    color: #E55B00;
                    display: inline;
                    padding-left: 25px;
                    margin: 10px 0;   
                }
                span{
                    font-size: 14px;
                    color: #E55B00;
                    float: right;
                    padding-right: 25px;
                }
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