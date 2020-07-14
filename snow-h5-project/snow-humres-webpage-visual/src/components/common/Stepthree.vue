<template>
    <div class="Stepthree">
        <Toper v-model="msg" />
        <div class="three">

            <div v-for="(item, index) in educationModelList" :key="item.id">
                <el-form class="demo-ruleForm" :model="item" :rules="educationModelRules" ref="educationModelList">
                    <p class="p"><i class="el-icon-document"></i> 教育经历</p>
                    <span class="span" v-show="index > 0" @click="handleRemove(index)">删除</span>
                    <el-form-item :show-message="false" prop="college">
                        <el-input v-model="item.college" placeholder="学校全称"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="major">
                        <el-input v-model="item.major" placeholder="专业名称"></el-input>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="educationTypeDesc">
                        <el-select v-model="item.educationTypeDesc" placeholder="学历" @visible-change="handlEducation(index)" @change="educationChange">
                            <el-option v-for="i in educationTypes" :value-key="i.codeName" :key="i.code" :label="i.codeName" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="degreeDesc">
                        <el-select v-model="item.degreeDesc" placeholder="学位" @visible-change="handldeGreeDesc(index)" @change="degreeDescChange">
                            <el-option v-for="i in degreeDescs" :value-key="i.codeName" :key="i.code" :label="i.codeName" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="type">
                        <el-select v-model="item.type" placeholder="是否统招">
                            <el-option v-for="i in types" :key="i.number" :label="i.label" :value="i.number"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="beginDate">
                        <el-date-picker v-model="item.beginDate" type="date" :editable="false" placeholder="入学时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :show-message="false" prop="graduationDate">
                        <el-date-picker v-model="item.graduationDate" @focus="handleIndex(index)" :picker-options="pickerOptionsInit" type="date" :editable="false" placeholder="毕业时间"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>

            <el-dialog title="添加成员" :visible.sync="dialogFormVisible">
                <el-input v-model="education.college" placeholder="学校全称"></el-input>
                <el-input v-model="education.major" placeholder="专业名称"></el-input>
                <el-select v-model="education.educationTypeDesc" placeholder="学历" @visible-change="handlEducation" @change="dialogChange">
                    <el-option v-for="i in educationTypes" :value-key="i.codeName" :key="i.code" :label="i.codeName" :value="i"></el-option>
                </el-select>
                <el-select v-model="education.degreeDesc" placeholder="学位" @visible-change="handldeGreeDesc" @change="degreeDialogChange">
                    <el-option v-for="i in degreeDescs" :value-key="i.codeName" :key="i.code" :label="i.codeName" :value="i"></el-option>
                </el-select>
                <el-select v-model="education.type" placeholder="是否统招">
                    <el-option v-for="i in types" :key="i.number" :label="i.label" :value="i.number"></el-option>
                </el-select>
                <el-date-picker v-model="education.beginDate" type="date" :editable="false" placeholder="入学时间"></el-date-picker>
                <el-date-picker v-model="education.graduationDate" :picker-options="pickerOptions" type="date" :editable="false" placeholder="毕业时间"></el-date-picker>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addEducationSure">确 定</el-button>
                </div>
            </el-dialog>

            <el-button class="add" icon="el-icon-plus" @click="addEducation">添加经历</el-button>

            <el-button class="jump" style="margin-left:5%;background:#fff;color:rgb(170,170,170);outline:none;" @click="prev">上一步</el-button>
            <el-button class="jump" @click="submitForm('educationModelList')">下一步</el-button>
        </div>
    </div>
</template>

<script>
    import Toper from '../common/Toper'

    export default {
        name: 'Stepthree',
        data () {
            return {
                msg: '填写教育信息',
                info: JSON.parse( window.localStorage.getItem("info") ),
                educationModelList: [],
                education: {},
                dialogFormVisible: false,
                nowIndex: '',
                listIndex: '',
                educationTypeDesc: '',
                educationTypeCode: '',
                educationTypes: [],//学历
                degreeDescs: [],//学位
                types: [{ number: "1", label: "是" }, { number: "0", label: "否" }],
                param: {
                    grpNum: ""
                },
                remoteParam: {
                  serviceName: "assistant_info",
                  data:{
                    grpNum:"EDUCATION"
                  }
                },
                educationModelRules: {
                    college: [//学校全称
                        { required: true }
                    ],
                    major: [//专业名称
                        { required: true }
                    ],
                    educationTypeDesc: [//学历
                        { required: true, trigger: 'change' }
                    ],
                    degreeDesc: [//学位
                        { required: true, trigger: 'change' }
                    ],
                    type: [//是否统招
                        { required: true }
                    ],
                    beginDate: [//入学时间
                        { required: true }
                    ],
                    graduationDate: [//毕业时间
                        { required: true }
                    ]
                },
                pickerOptionsInit: {
                    disabledDate:(time) => {
                        if( this.educationModelList[this.nowIndex].beginDate != ""){
                            return time.getTime() <= this.educationModelList[this.nowIndex].beginDate;
                        }else {
                            return time.getTime() >= Date.now();
                        }
                    }
                },
                pickerOptions: {
                    disabledDate:(time) => {
                        if( this.education.beginDate != ""){
                            return time.getTime() <= this.education.beginDate;
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
            if (this.info.educationModelList) {
                this.educationModelList = this.info.educationModelList;
            }else{
                this.educationModelList = [{
                    college: '',
                    major: '',
                    educationTypeDesc: '',
                    degreeDesc: '',
                    educationTypeCode: '',
                    type: '',
                    beginDate: '',
                    graduationDate: ''
                }];
            }
        },
        methods: {
            findTrans(grpNum) {//加载下拉列表信息
                let self = this;
                let url = global.ERPAPI_URL + "/erp-api/snow/trans";
                let datas  = {
                    type: "POST",
                    path: global.HUMRES_URL + "/humres/config/main/list",
                    data: {
                        "isPage":true,
                        "codeType" : grpNum,
                        "curPage":1,
                        "pageSize":10
                    }
                };
                self.$http.post(url, datas, self.option).then(
                    function(data) {
                        // 这里是处理正确的回调
                        if (data.body.flag) {
                            let dataText = data.body.datas.list;
                            if (grpNum == "EDUCATION") {
                                //判断是否请求学历信息
                                self.educationTypes = dataText;
                            } else if (grpNum == "DEGREE") {
                                //学位
                                self.degreeDescs = dataText;
                            }
                        } else {
                            self.$message({
                                message: data.body.message,
                                type: "warning"
                            });
                        }
                    },
                    function(error) {
                        // 这里是处理错误的回调
                        self.$message({
                            message: "请求失败，请刷新重试！",
                            type: "error"
                        });
                    }
                );
            },
            handlEducation(index) {//下拉选择学历
                this.listIndex = index;
                this.findTrans('EDUCATION');
            },
            educationChange(value) {//当学历被改变
                this.educationModelList[this.listIndex].educationTypeDesc = value.codeName;
                this.educationModelList[this.listIndex].educationTypeCode = value.code;
            },
            handldeGreeDesc(index) {//下拉选择学位
                this.listIndex = index;
                this.findTrans('DEGREE');
            },
            degreeDescChange(value) {//当学位被改变
                this.educationModelList[this.listIndex].degreeDesc = value.codeName;
                this.educationModelList[this.listIndex].degreeCode = value.code;
            },
            handleIndex(index){
                this.nowIndex = index;
            },
            addEducation(){
                this.dialogFormVisible = true;
                this.education = {
                    college: '',
                    major: '',
                    educationTypeDesc: '',
                    educationTypeCode: '',
                    degreeDesc: '',
                    degreeCode: '',
                    type: '',
                    beginDate: '',
                    graduationDate: ''
                }
            },
            dialogChange(value){//当学历被改变( 弹框内 )
                this.education.educationTypeDesc = value.codeName;
                this.education.educationTypeCode = value.code;
            },
            degreeDialogChange(value){//当学位被改变( 弹框内 )
                this.education.degreeDesc = value.codeName;
                this.education.degreeCode = value.code;
            },
            addEducationSure(){
                if (this.education.college) {
                    this.educationModelList.push(this.education)
                }
                this.dialogFormVisible = false;
            },
            handleRemove(index){
                this.educationModelList.splice(index, 1);
            },
            prev(){
                this.$emit("handleChange","Steptwo","Steptwo")
            },
            submitForm(formName) {
                this.$refs[formName].forEach((item) => {item.validate((valid) => {
                    if (valid) {
                        this.educationModelList.forEach(i => {
                            i.beginDate = this.formatDate(i.beginDate);
                            i.graduationDate = this.formatDate(i.graduationDate);
                        });

                        this.info.educationModelList = this.educationModelList;
                        
                        window.localStorage.setItem("info", JSON.stringify(this.info));
                        this.$emit("handleChange","Stepfour");
                    } else {
                        return false;
                    }
                });
                });
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

    .Stepthree{
        .three{
            padding-top: 80px;

            .el-dialog{
                width: 80%;
                margin-top: 90px !important;
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
