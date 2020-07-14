<template>
    <div class="Stepone">
        <Toper v-model="msg" />
        <el-form class="one demo-ruleForm" :model="empMainModel" :rules="empMainModelRules" ref="empMainModel">
                <el-form-item :show-message="false" prop="recruit" style="margin-top:15px;">
                    <el-select placeholder="招聘渠道" v-model="empMainModel.recruit" @visible-change="handleRecruit" @change="recruitChange">
                        <el-option v-for="item in recruits" :key="item.code" :value-key="item.codeName" :label="item.codeName" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            <p><i class="el-icon-setting"></i> 基本信息</p>
                <el-form-item :show-message="false" prop="empName">
                    <el-input placeholder="姓名" v-model="empMainModel.empName"></el-input>
                </el-form-item>
                <el-form-item :show-message="false" prop="gender">
                    <el-select placeholder="性别" v-model="empMainModel.gender">
                        <el-option v-for="item in genders" :key="item.number" :label="item.label" :value="item.number"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :show-message="false" prop="nationDesc">

                    <el-autocomplete placeholder="民族" v-model="empMainModel.nationDesc" :fetch-suggestions="querySearchAsync" @select="handleSelect"></el-autocomplete>

                </el-form-item>
                <el-form-item :show-message="false" prop="pVisageDesc">
                    <el-select placeholder="政治面貌" v-model="empMainModel.pVisageDesc" @visible-change="handlePvisage" @change="pvisageChange">
                        <el-option v-for="item in pvisageDescs" :key="item.code" :value-key="item.codeName" :label="item.codeName" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :show-message="false" prop="birthdayType">
                  <el-select placeholder="实际生日/类型" v-model="empMainModel.birthdayType">
                    <el-option label="农历" value="0"></el-option>
                    <el-option label="公历" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :show-message="false" prop="actualBirthday">
                  <el-date-picker placeholder="实际生日" v-model="empMainModel.actualBirthday" v-if="empMainModel.birthdayType == '1' || empMainModel.birthdayType == '公历'" :editable="false" type="date"></el-date-picker>

                    <div class="chooseLunar" v-if="empMainModel.birthdayType == '0' || empMainModel.birthdayType == '农历'">
                        <el-select placeholder="月" v-model="c_month">
                            <el-option v-for="item in c_months" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                        <el-select placeholder="日" v-model="c_day">
                            <el-option v-for="item in c_days" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </div>

                </el-form-item>

                <el-form-item :show-message="false" prop="maritalStatus">
                    <el-select placeholder="婚姻状况" v-model="empMainModel.maritalStatus">
                        <el-option v-for="item in maritalStatuss" :key="item.label" :label="item.label" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :show-message="false" prop="childNum">
                    <el-select placeholder="子女数量" v-model.number="empMainModel.childNum">
                        <el-option v-for="item in childNums" :key="item.number" :label="item.label" :value="item.number"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :show-message="false" prop="workStartDate">
                    <el-date-picker placeholder="开始工作时间" v-model="empMainModel.workStartDate" type="date" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item :show-message="false" prop="workYears">
                    <el-input placeholder="工龄" v-model.number="empMainModel.workYears"></el-input>
                </el-form-item>
                <el-form-item :show-message="false" prop="healthy">
                    <el-input placeholder="健康状况" v-model="empMainModel.healthy"></el-input>
                </el-form-item>
                <el-input placeholder="个人爱好及特长" v-model="empMainModel.interest"></el-input>

            <p><i class="el-icon-phone"></i> 通讯信息</p>
                <el-form-item :show-message="false" prop="personalMail">
                    <el-input placeholder="个人邮箱" v-model="empMainModel.personalMail"></el-input>
                </el-form-item>
                <el-form-item :show-message="false" prop="phoneNum">
                    <el-input placeholder="手机号" v-model.number="empMainModel.phoneNum"></el-input>
                </el-form-item>
                <el-form-item :show-message="false" prop="qqNum">
                    <el-input placeholder="QQ" v-model.number="empMainModel.qqNum"></el-input>
                </el-form-item>
                <el-form-item :show-message="false" prop="wechatNum">
                    <el-input placeholder="微信号" v-model.number="empMainModel.wechatNum"></el-input>
                </el-form-item>

            <p><i class="el-icon-location"></i> 户籍信息</p>
                <el-form-item :class="cerTypeClass" :show-message="false" prop="cerType">
                    <el-select placeholder="证件类型" disabled v-model="empAddrModel.cerTypeDesc" @input="handleCerType" @visible-change="handleCerTypeDesc" @change="cerTypeDescChange">
                        <el-option v-for="item in cerTypeDescs" :key="item.code" :value-key="item.codeName" :label="item.codeName" :value="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :class="identityNumClass" v-if="showIdNum" :show-message="false" prop="identityNum">
                    <el-input placeholder="证件号码" v-model="empAddrModel.identityNum" @input="handleIdNumber"></el-input>
                </el-form-item>
                <el-form-item :class="identityNumClass" v-if="showIdentityNum" :show-message="false" prop="identityNum">
                    <el-input placeholder="证件号码" v-model="empAddrModel.identityNum" @input="handleIdentityNum"></el-input>
                </el-form-item>

                <el-form-item :class="identityTypeClass" :show-message="false" prop="identityTypeDesc">
                    <el-select placeholder="户口性质" v-model="empAddrModel.identityTypeDesc" @input="handleidentityType" @visible-change="handleIdentity" @change="identityChange">
                        <el-option v-for="item in identityTypes" :key="item.code" :value-key="item.codeName" :label="item.codeName" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :class="identityAddrClass" :show-message="false" prop="identityAddr">
                    <el-input placeholder="身份证地址" v-model="empAddrModel.identityAddr" @input="handleidentityAddr"></el-input>
                </el-form-item>
                <el-form-item :class="addrClass" :show-message="false" prop="addr">
                    <el-input placeholder="现居住地址" v-model="empAddrModel.addr" @input="handleaddr"></el-input>
                </el-form-item>

            <p><i class="el-icon-picture"></i> 银行信息</p>
                <el-input v-model="empAccountModel.accountNum" placeholder="银行卡号"></el-input>
                <el-input v-model="empMainModel.empName" :readonly="true" placeholder="持卡人姓名"></el-input>
                <el-input v-model="empAccountModel.accountBankName" placeholder="开户行名称（如：中国建设银行成都市高新支行）"></el-input>

            <el-button @click="submitForm('empMainModel')">下一步</el-button>
        </el-form>
    </div>

</template>

<script>
    import Toper from '../common/Toper'

    export default {
        name: 'Stepone',
        data () {
            return {
                msg: '填写基本信息',//这里定义的msg，通过props传递给Toper
                info: JSON.parse( window.localStorage.getItem("info") ),
                inactiveText: '公历',
                c_month:'',
                c_day:'',
                timeout:  null,
                empMainModel: {//主表(基本信息)
                    recruit: '',
                    empName: '',
                    gender: '',
                    nationDesc: '',
                    pVisageDesc: '',
                    birthdayType: '1',
                    actualBirthday: '',
                    birthday:'',
                    maritalStatus:'',
                    childNum: '',
                    workStartDate: '',
                    workYears: '',
                    healthy: '',
                    interest: '',
                    personalMail: '',
                    phoneNum: '',
                    qqNum: '',
                    wechatNum: '',
                    contactName: '',
                    contactRelation: '',
                    contactPhoneNum: ''
                },
                empAddrModel: {//户籍信息
                    cerTypeDesc: '身份证',
                    cerType: 'IC01_SYS',
                    identityNum: '',
                    identityTypeDesc: '',
                    identityAddr: '',
                    addr: '',
                },
                empAccountModel: {//银行信息
                    accountNum: '',
                    accountBankName: ''
                },
                param: {
                    grpNum: ""
                },
                nationList: [],
                recruits: [],//招聘渠道
                nationDescs: [],//民族
                pvisageDescs: [],//政治面貌
                cerTypeDescs: [],//证件类型
                identityTypes: [],//户口性质
                c_months:["正月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","腊月"],
                c_days:["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"],
                genders: [//性别
                    {number: 'female',label: '女'},
                    {number: 'male',label: '男'}
                ],
                maritalStatuss: [//婚姻状态
                    { label: "已婚" },
                    { label: "未婚" }
                ],
                childNums: [//子女数量
                    { number: "0", label: 0 },
                    { number: "1", label: 1 },
                    { number: "2", label: 2 },
                    { number: "3", label: 3 },
                    { number: "4", label: 4 },
                    { number: "5", label: 5 }
                ],
                option: {
                    timeout: 30 * 1000 //30秒过期
                },
                empMainModelRules: {
                    recruit: [//招聘渠道
                        { required: true, trigger: 'change'  }
                    ],
                    empName: [//姓名
                        { required: true }
                    ],
                    gender: [//性别
                        { required: true, trigger: 'change' }
                    ],
                    nationDesc: [//民族
                        { required: true, trigger: 'change' }
                    ],
                    pVisageDesc: [//政治面貌
                        { required: true, trigger: 'change' }
                    ],
                    maritalStatus: [//婚姻状况
                        { required: true, trigger: 'change' }
                    ],
                    childNum: [//子女数量
                        {required: true, trigger: 'change'}
                    ],
                    workStartDate: [//开始工作时间
                        { required: true }
                    ],
                    workYears: [//工龄
                        {type:'number',required: true, message: '',trigger: 'blur'},
                        {type:'number', message: '',trigger: 'change'}
                    ],
                    healthy: [//健康状况
                        { required: true }
                    ],
                    personalMail:[//个人邮箱
                        {required: true, message: '',trigger: 'blur'},
                        {type: 'email', message: '', trigger: 'blur,change'}
                    ],
                    phoneNum:[//电话号码
                        {required: true, message: '',trigger: 'blur',type:'number'},
                        { pattern: /^1[34578]\d{9}$/, message: '' }
                    ],
                    qqNum:[//QQ号码
                        {type:'number',required: true, message: '',trigger: 'blur'},
                        {type:'number', message: '',trigger: 'change'}
                    ],
                    wechatNum: [//微信号
                        { required: true }
                    ]
                },
                showIdNum: true,
                showIdentityNum: false,
                loading: false,
                identityNumClass:'',
                identityTypeClass: '',
                identityAddrClass: '',
                addrClass: '',
                cerTypeClass: '',
            }
        },
        components: {
            'Toper' : Toper
        },
        created() {
            //在实例创建完成后被立即调用
            let empCode = window.localStorage.getItem("empCode");
            if (empCode) {
                this.findInfos(window.localStorage.getItem("empCode"));
            }else{
                if (this.info) {
                    this.initData(this.info);
                }else{
                    this.info = {};
                }
            }
        },
        mounted() {
            let self = this;
            let url = global.ERPAPI_URL + "/erp-api/snow/trans";
            let datas  = {
                type: "POST",
                path: global.HUMRES_URL + "/humres/config/main/list",
                data: {
                    "isPage":true,
                    "codeType" : 'NATION',
                    "curPage":1,
                    "pageSize":10
                }
            };
            self.$http.post(url, datas, self.option).then(
                function(data) {
                    // 这里是处理正确的回调
                    if (data.body.flag) {
                        self.nationDescs = data.body.datas.list;
                        for (const i in self.nationDescs) {
                            self.nationDescs[i].value = self.nationDescs[i].codeName;
                        }
                    } else {
                        self.$message({
                            message: data.body.msg,
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
        methods: {
            findInfos(empCode){//查询员工信息
                let self = this;
                let url = global.ERPAPI_URL + "/erp-api/snow/trans";
                let datas  = {
                    type: "GET",
                    path: global.HUMRES_URL + "/humres/empmanage/findEmpDto/"+empCode,
                };
                self.$http.post(url, datas, self.option).then(
                    function(data) {
                        // 这里是处理正确的回调
                            console.log(data)
                        if (data.body.flag) {
                            this.info = data.body.data;
                            this.initData(this.info);
                        } else {
                            self.$message({
                                message: data.body.msg,
                                type: "warning"
                            });
                        }
                    },
                    function(error) {
                        // 这里是处理错误的回调 
                        this.info = {};                       
                        self.$message({
                            message: "请求失败，请刷新重试！",
                            type: "error"
                        });
                    }
                );
            },
            initData(info){//赋值
                this.empMainModel = info.empMainModel;
                this.empAddrModel = info.empAddrModel;
                this.empAccountModel = info.empAccountModel;
                if (this.empMainModel.gender == 'male') {
                    this.empMainModel.gender = "男";
                } else if(this.empMainModel.gender == 'female') {
                    this.empMainModel.gender = "女";
                }
                if(this.empMainModel.birthdayType == '0') {
                    this.empMainModel.birthdayType = '农历';
                    this.c_month = this.empMainModel.actualBirthday.slice(0,-2);
                    this.c_day = this.empMainModel.actualBirthday.slice(-2);
                } else if(this.empMainModel.birthdayType == '1'){
                    this.empMainModel.birthdayType = '公历';
                }/*
                if (this.empAddrModel.cerTypeDesc == '身份证') {
                    this.showIdentityNum = false;
                    this.showIdNum = true;
                }else{
                    this.showIdNum = false;
                    this.showIdentityNum = true;
                } */
            },
            handleIdNumber(){//验证身份证
                let val = this.empAddrModel.identityNum;
                let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (!reg.test(val)) {
                    this.identityNumClass = 'is-error';
                } else {
                    this.identityNumClass = 'is-success';
                   if (parseInt(val.substr(16, 1)) % 2 == 1) {
                        this.empMainModel.gender = "男";
                    } else {
                        this.empMainModel.gender = "女";
                    }
                   this.empMainModel.actualBirthday = val.substring(6, 10) + "/" + val.substring(10, 12) + "/" + val.substring(12, 14);
                   this.empMainModel.birthday = val.substring(6, 10) + "/" + val.substring(10, 12) + "/" + val.substring(12, 14);
                }
            },
            handleIdentityNum(){//验证证件号码
                if (!this.empAddrModel.identityNum) {
                    this.identityNumClass = 'is-error';
                } else {
                    this.identityNumClass = 'is-success';
                }
            },
            handleCerType(){//验证证件类型
                if (!this.empAddrModel.cerTypeDesc) {
                    this.cerTypeClass = 'is-error';
                } else {
                    this.cerTypeClass = 'is-success';
                }
            },
            handleidentityType(){//验证户口性质
                if (!this.empAddrModel.identityTypeDesc) {
                    this.identityTypeClass = 'is-error';
                } else {
                    this.identityTypeClass = 'is-success';
                }
            },
            handleidentityAddr(){//验证身份证地址
                if (!this.empAddrModel.identityAddr) {
                    this.identityAddrClass = 'is-error';
                } else {
                    this.identityAddrClass = 'is-success';
                }
            },
            handleaddr(){//验证现居住地址
                if (!this.empAddrModel.addr) {
                    this.addrClass = 'is-error';
                } else {
                    this.addrClass = 'is-success';
                }
            },
            findTrans() {//加载下拉列表信息
                let self = this;
                let url = global.ERPAPI_URL + "/erp-api/snow/trans";
                let datas  = {
                    type: "POST",
                    path: global.HUMRES_URL + "/humres/config/main/list",
                    data: {
                        "isPage":true,
                        "codeType" : self.param.grpNum,
                        "curPage":1,
                        "pageSize":10
                    }
                };
                self.$http.post(url, datas, self.option).then(
                    function(data) {
                        // 这里是处理正确的回调
                        if (data.body.flag) {
                            let dataText = data.body.datas.list;
                            if (self.param.grpNum == "NATION") {
                                //判断是否请求民族信息
                                self.nationDescs = dataText;
                            } else if (self.param.grpNum == "VISAGE") {
                                //政治面貌
                                self.pvisageDescs = dataText;
                            } else if (self.param.grpNum == "RECRUIT") {
                                //招聘渠道
                                self.recruits = dataText;
                            } else if (self.param.grpNum == "CERTYPE") {
                                //证件类型
                                self.cerTypeDescs = dataText;
                            } else if (self.param.grpNum == "REGTYPE"){
                                //户口性质
                                self.identityTypes = dataText;
                            }
                        } else {
                            self.$message({
                                message: data.body.msg,
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
            handleRecruit() {//下拉选择招聘渠道
                this.param.grpNum = "RECRUIT";
                this.findTrans();
            },
            recruitChange(value){//当招聘渠道被改变
                this.empMainModel.recruit = value.codeName;
            },
            querySearchAsync(queryString, cb) {
                var nationDescs = this.nationDescs;
                var results = queryString ? nationDescs.filter(item => { return item.codeName.toLowerCase().indexOf(queryString.toLowerCase()) === 0}) : nationDescs;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 300 * Math.random());
            },
            handleSelect(item) {
                this.empMainModel.nationDesc = item.codeName;
                this.empMainModel.nationCode = item.code;
            },
            handlePvisage() {//下拉选择政治面貌
                this.param.grpNum = "VISAGE";
                this.findTrans();
            },
            pvisageChange(value) {//当政治面貌被改变
                this.empMainModel.pVisageDesc = value.codeName;
                this.empMainModel.pVisageCode = value.code;
            },
            handleCerTypeDesc() {//下拉选择证件类型
                this.param.grpNum = "CERTYPE";
                this.findTrans();
            },
            cerTypeDescChange(value) {//当证件类型被改变
                this.empAddrModel.cerTypeDesc = value.codeName;
                this.empAddrModel.cerType = value.code;
                if (value.codeName == '身份证') {
                    let val = this.empAddrModel.identityNum;
                    let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                    this.showIdentityNum = false;
                    this.showIdNum = true;
                    if (!reg.test(val)) {
                        this.identityNumClass = 'is-error';
                    } else {
                        this.identityNumClass = 'is-success';
                    }
                }else{
                    if (!this.empAddrModel.identityNum) {
                        this.identityNumClass = 'is-error';
                    } else {
                        this.identityNumClass = 'is-success';
                    }
                    this.showIdNum = false;
                    this.showIdentityNum = true;
                }
            },
            handleIdentity() {//下拉选择户口性质
                this.param.grpNum = "REGTYPE";
                this.findTrans();
            },
            identityChange(value) {//当户口性质被改变
                this.empAddrModel.identityTypeDesc = value.codeName;
                this.empAddrModel.identityType = value.code;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!this.empAddrModel.cerTypeDesc) {

                            this.cerTypeClass = 'is-error';
                            this.$message.warning('请选择证件类型！');

                        }else if (!this.empAddrModel.identityNum) {

                            this.identityNumClass = 'is-error';
                            this.$message.warning('请填写正确的证件号码！');

                        }else if (this.identityNumClass == 'is-error') {

                            this.$message.warning('请填写正确的证件号码！');

                        }else if(!this.empAddrModel.identityTypeDesc) {

                            this.identityTypeClass = 'is-error';
                            this.$message.warning('请选择户口性质！');
                        }else if(!this.empAddrModel.identityAddr) {

                            this.identityAddrClass = 'is-error';
                            this.$message.warning('请填写身份证地址！');
                        }else if(!this.empAddrModel.addr) {

                            this.addrClass = 'is-error';
                            this.$message.warning('请填写现居住地址！');
                        }else{
                            this.cerTypeClass = 'is-success';
                            this.identityNumClass = 'is-success';
                            this.identityTypeClass = 'is-success';
                            this.identityAddrClass = 'is-success';
                            this.addrClass = 'is-success';
                            this.NativePlaceClass = 'is-success';

                            if (this.empMainModel.gender == "男") {
                                this.empMainModel.gender = 'male';
                            } else if(this.empMainModel.gender == "女"){
                                this.empMainModel.gender = "female";
                            }
                            if (this.empMainModel.birthdayType == '农历' || this.empMainModel.birthdayType == '0') {
                                this.empMainModel.birthdayType = '0';
                                this.empMainModel.actualBirthday = this.c_month + this.c_day;
                            } else if(this.empMainModel.birthdayType == '公历'){
                                this.empMainModel.birthdayType = '1';
                            }

                            this.empMainModel.workStartDate = this.formatDate(this.empMainModel.workStartDate);

                            this.info.empMainModel = this.empMainModel;
                            this.info.empAddrModel = this.empAddrModel;
                            this.info.empAccountModel = this.empAccountModel;

                            window.localStorage.setItem("info", JSON.stringify(this.info));
                            this.$emit("handleChange" , 'Steptwo');
                        }

                    } else {
                        return false;
                    }
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

    .Stepone{
        .one{
            padding-top: 70px;

            .el-form-item{
                margin: 0;
            }
            .el-input,.el-select,.el-autocomplete{
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
            .bankTitle{
                input{
                    background: #fff url(../../assets/bank.png) no-repeat 8px 12px;
                    background-size: 25px 25px;
                    padding-left: 12%;
                }
            }
            p{
                font-size: 14px;
                color: #E55B00;
                text-align: left;
                display: block;
                padding-left: 25px;
                margin: 15px 0 10px;
            }
            button{
                width: 90%;
                height: 50px;
                color: #fff;
                background: #E55B00;
                display: block;
                margin: 20px auto;
                box-shadow: @boxShadow;
            }
            .chooseLunar{
                width: 90%;
                display: flex;
                justify-content: space-between;
                margin:5px auto;

                .el-select{
                    width: 48%;
                    display: inline-block;
                    box-shadow: none;
                }
            }
        }

    }
</style>
