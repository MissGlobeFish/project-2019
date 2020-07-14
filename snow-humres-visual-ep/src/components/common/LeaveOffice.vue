<template>
    <div class="leaveOffice">
        <div class="leaveBox">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-news"></i> 离职申请</el-breadcrumb-item>
                </el-breadcrumb>
                <el-button class="back" size="small" icon="el-icon-caret-left" @click="handleBack"> 返回</el-button>
            </div>
            
            <div v-loading="loading" class="steps">

                <el-steps :active="activeStep" :align-center="true" finish-status="success">
                    <el-step v-for="item in stepsList" :key="item.id" :title="item.name"></el-step>
                </el-steps>

                <div v-show="showDetails" class="details">

                    <el-form v-if="LeaveOption.LeaveId == 'application'" :model="applicationData" :rules="applicationRules" ref="applicationData" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="姓名" prop="empName">
                            <el-input v-model="applicationData.empName" :readonly="readPresent" placeholder="输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="department">
                            <el-input v-model="applicationData.department" :readonly="readPresent" placeholder="输入部门"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="applicationData.position" :readonly="readPresent" placeholder="输入职位"></el-input>
                        </el-form-item>
                        <el-form-item label="入职日期" prop="entryDate">
                            <el-date-picker v-model="applicationData.entryDate" type="date" :readonly="readPresent" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="离职日期" prop="dimissionDate">
                            <el-date-picker v-model="applicationData.dimissionDate" type="date" :readonly="readPresent" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="离职类别：" prop="quitCategory">
                            <el-radio-group v-model="applicationData.quitCategory" :disabled="readPresent">
                                <el-radio :label="0">辞职</el-radio>
                                <el-radio :label="1">辞退</el-radio>
                                <el-radio :label="2">自动离职</el-radio>
                                <el-radio :label="3">合同到期</el-radio>
                                <el-radio :label="4">其他</el-radio>
                            </el-radio-group>
                            <el-input class="other" v-if="applicationData.quitCategory == 4" v-model="applicationData.quitCategoryOther" :readonly="readPresent"></el-input>
                        </el-form-item>
                        <el-form-item class="rest" v-if="applicationData.quitCategory == 0" prop="applyReason" label="离职原因详述：（若是辞职，由申请离职员工填写，其他情况由部门主管填写）">
                            <el-input v-model="applicationData.applyReason" type="textarea" :autosize="{ minRows: 6}" :readonly="readPresent" placeholder="请输入内容"></el-input>
                        </el-form-item>

                        <div class="btns">
                            <el-button @click="resetApplicationForm('applicationData')" :disabled="readPresent">重置</el-button>
                            <el-button style="margin-top: 12px;" @click="handlePresent('applicationData')" :disabled="readPresent">提交申请</el-button>
                        </div>

                    </el-form>

                    <el-form v-if="LeaveOption.LeaveId == 'myAgent'" :model="myAgentData" :rules="applicationRules" ref="myAgentData" label-width="100px" class="demo-ruleForm">
                        <el-table :data="basicData" border :header-row-class-name="tableRowClassName">
                            <el-table-column prop="empName" label="姓名"></el-table-column>
                            <el-table-column prop="empCode" label="工号"></el-table-column>
                            <el-table-column prop="department" label="部门"></el-table-column>
                            <el-table-column prop="position" label="职位"></el-table-column>
                            <el-table-column prop="entryDate" label="入职日期"></el-table-column>
                            <el-table-column prop="dimissionDate" label="申请离职日期"></el-table-column>
                        </el-table>
                        
                        <div v-if="activeStep == 1">
                            <el-form-item class="rest workHandover" prop="teamTransfer">
                                <el-checkbox-group v-model="myAgentData.teamTransfer">
                                    <el-checkbox v-for="item in teamTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" prop="teamOther" label="其他">
                                <el-input v-model="myAgentData.teamOther"></el-input>
                            </el-form-item>
                            <el-form-item class="rest" prop="applyReason" label="员工离职原因详述：（若是辞职，由申请离职员工填写，其他情况由部门主管填写）">
                                <el-input v-model="myAgentData.applyReason" type="textarea" :autosize="{ minRows: 6}" :readonly="readPresent" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 2">
                            <el-form-item class="rest workHandover" prop="deptTransfer">
                                <el-checkbox-group v-model="myAgentData.deptTransfer">
                                    <el-checkbox v-for="item in deptTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" prop="deptOther" label="其他">
                                <el-input v-model="myAgentData.deptOther"></el-input>
                            </el-form-item>
                            <el-form-item class="rest" prop="applyReason" label="员工离职原因详述：（若是辞职，由申请离职员工填写，其他情况由部门主管填写）">
                                <el-input v-model="myAgentData.applyReason" type="textarea" :autosize="{ minRows: 6}" :readonly="readPresent" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 3">
                            <el-form-item class="rest" prop="itTransfer">
                                <el-checkbox-group v-model="myAgentData.itTransfer">
                                    <el-checkbox v-for="item in itTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" prop="itOther" label="其它">
                                <el-input v-model="myAgentData.itOther"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 4">
                            <el-form-item class="rest" prop="adminTransfer">
                                <el-checkbox-group v-model="myAgentData.adminTransfer">
                                    <el-checkbox v-for="item in adminTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" label="其它：" prop="adminOther">
                                <el-input v-model="myAgentData.adminOther"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 5">
                            <el-form-item class="rest" prop="bpTransfer">
                                <el-checkbox-group v-model="myAgentData.bpTransfer">
                                    <el-checkbox v-for="item in bpTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" label="其它：" prop="bpOther">
                                <el-input v-model="myAgentData.bpOther"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 6">
                            <el-form-item class="rest" prop="maintenanceTransfer">
                                <el-checkbox-group v-model="myAgentData.maintenanceTransfer">
                                    <el-checkbox v-for="item in maintenanceTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" label="其它：" prop="maintenanceOther">
                                <el-input v-model="myAgentData.maintenanceOther"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 7">
                            <el-form-item class="rest" prop="financeTransfer">
                                <el-checkbox-group v-model="myAgentData.financeTransfer">
                                    <el-checkbox v-for="item in financeTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" label="其它：" prop="financeOther">
                                <el-input v-model="myAgentData.financeOther"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeStep == 8">
                            <el-form-item class="rest" prop="humanTransfer">
                                <el-checkbox-group v-model="myAgentData.humanTransfer">
                                    <el-checkbox v-for="item in humanTransferData" :key="item.number" :label="item.number">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item class="rest" label="其它：" prop="humanOther">
                                <el-input v-model="myAgentData.humanOther"></el-input>
                            </el-form-item>
                        </div>

                        <div class="btns">
                            <el-button style="margin-top: 12px;" @click="handleTurnDown">驳回</el-button>
                            <el-button style="margin-top: 12px;" @click="handleConsent('myAgentData')">审批通过</el-button>
                        </div>
                    </el-form>

                </div>

                <transition name="el-fade-in-linear">
                    <div v-show="showSuccess" class="success">
                        <el-button type="success" icon="el-icon-check" round>{{succeedText}}</el-button>
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <div v-show="showDerive" class="success">
                        <el-button type="primary" icon="el-icon-printer" round>导出离职 PDF</el-button>
                    </div>
                </transition>

            </div>

        </div>
    </div>
</template>
<style>
    .el-table .success-row {
        background: #f6faff;
    }
</style>
<script>
export default {
    props: ["LeaveOption"],
    data() {
        return {
            loading: false,
            datas: {
                identification: "GS_Quit"
            },
            stepsList: [],
            basicData: [],
            activeStep: 0,
            applicationData: {
                empCode: localStorage.getItem("ms_empCode"),
                empName: '',
                department: '',
                position: '',
                entryDate: '',
                dimissionDate: '',
                quitCategory: 0,
                quitCategoryOther: '',
                applyReason: '',
            },
            myAgentData: {
                consentCode: localStorage.getItem("ms_empCode"),
                empCode: '',
                k3BillNo: '',
                teamTransfer: [],
                deptTransfer: [],
                itTransfer: [],
                adminTransfer: [],
                bpTransfer: [],
                maintenanceTransfer: [],
                financeTransfer: [],
                humanTransfer: [],
                teamOther: '',
                deptOther: '',
                itOther: '',
                adminOther: '',
                bpOther: '',
                maintenanceOther: '',
                financeOther: '',
                humanOther: '',
                applyReason: ''
            },
            teamTransferData: [],
            deptTransferData: [],
            itTransferData: [],
            adminTransferData: [],
            bpTransferData: [],
            maintenanceTransferData: [],
            financeTransferData: [],
            humanTransferData: [],
            applicationRules: {
                empName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                department: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' },
                ],
                position: [
                    { required: true, message: '请输入职位名称', trigger: 'blur' },
                ],
                entryDate: [
                    { required: true, message: '请选择入职日期'}
                ],
                dimissionDate: [
                    { required: true, message: '请选择入职日期'}
                ]
            },
            param: {
                grpNum: ""
            },
            readPresent: false,
            showDetails: true,
            showSuccess: false,
            showDerive: false,
            succeedText: '',
            option: {
                timeout: 30 * 1000 //30秒过期
            }
        }
    },
    created() {
        //在实例创建完成后被立即调用
        let self = this;
        self.loading = true;
        let info = JSON.parse(localStorage.getItem("info")).empMainModel;
        if (info) {
            self.applicationData.empName = info.empName;
            self.applicationData.department = info.deptPath;
            self.applicationData.position = info.jobDesc;
            let url =  global.HUMRES_URL + "/humres/common/findXmlLine";
            
            self.$http.post(url, self.datas, self.option).then(function(data) {
                if (data.body.flag) {
                    self.loading = false;
                    self.stepsList = data.body.msg.data;
                    if (self.LeaveOption.LeaveId == 'application') {//本人提交离职申请
                        self.activeStep = 0;
                        self.judgeQiut();
                    }else if(self.LeaveOption.LeaveId == 'myAgent'){//我的代办审核离职申请
                        self.findNode(self.LeaveOption.k3BillNo);
                        self.getQiut(self.LeaveOption.k3BillNo);
                        self.myAgentData.k3BillNo = self.LeaveOption.k3BillNo;
                    } 
                } else {
                    self.loading = false;
                    self.$message({
                        message: data.body.msg,
                        type: 'warning'
                    });
                }
            },
            function(error) {
                // 这里是处理错误的回调
                self.loading = false;
                self.$message({
                    message: "请求超时！",
                    type: 'error'
                });
            });
        }
        console.log(self.activeStep)
    },
    methods: {
        judgeQiut(){//判断有没有提交过离职申请
            let self = this;
            let data = {
                empCode: localStorage.getItem("ms_empCode")
            }
            let url =  global.HUMRES_URL + "/humres/empmanage/get/Quit";

            self.$http.post(url, data, self.option).then(function(data) {
                // 这里是处理正确的回调
                if (data.body.flag) {
                    if (data.body.msg) {
                        self.findNode(data.body.msg.k3BillNo);
                        self.applicationData = data.body.msg;
                        self.applicationData.quitCategory = parseInt(data.body.msg.quitCategory);

                        if(data.body.msg.k3DocumentStatus == "A"){//开始创建（可填写信息）
                            self.readPresent = false;

                        }else if(data.body.msg.k3DocumentStatus == "B"){//已经提交审批并且正在审批中（不可填写信息）
                            self.readPresent = true;

                        }else if(data.body.msg.k3DocumentStatus == "C"){//已完成审批流程（不可填写信息）
                            self.activeStep = 8;
                            self.readPresent = true;
                            console.log(self.activeStep)

                        }else if(data.body.msg.k3DocumentStatus == "D"){//被驳回到本人（可填写信息）
                            self.readPresent = false;
                            
                        }
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
            });
        },
        getQiut(val){//获取离职信息
            let self = this;
            let data = {
                k3BillNo: val
            }
            let url =  global.HUMRES_URL + "/humres/empmanage/get/Quit";

            self.$http.post(url, data, self.option).then(function(data) {
                // 这里是处理正确的回调
                if (data.body.flag) {
                    let info = data.body.msg;
                    let msg = data.body.msg.dimissionDate;
                    self.basicData = [{
                        empName: info.empName,
                        empCode: info.empCode,
                        department: info.department,
                        position: info.position,
                        entryDate: info.entryDate,
                        dimissionDate: msg[0] +'-'+ (msg[1]<10?"0"+msg[1]:msg[1]) +'-'+ (msg[2]<10?"0"+msg[2]:msg[2])
                    }];
                    self.myAgentData.applyReason = info.applyReason;
                    self.myAgentData.empCode = info.empCode;
                    console.log(self.myAgentData)
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
            });
        },
        findNode(val) {//加载当前节点
            let self = this;
            let data = {
                k3BillNo: val
            }
            let url =  global.HUMRES_URL + "/humres/empmanage/get/nowApprovalFlow";

            self.$http.post(url, data, self.option).then(function(data) {
                // 这里是处理正确的回调
                if (data.body.flag) {
                    let m = data.body.data;
                    self.activeStep = parseInt(m.key);
                    switch (m.value) {
                        case '团队经理':
                            self.findAssist("TD");
                            break;
                        case '部门负责人':
                            self.findAssist("BM");
                            break;
                        case 'IT':
                            self.findAssist("IT");
                            break;
                        case '行政':
                            self.findAssist("XZ");
                            break;
                        case 'BP助理':
                            self.findAssist("BP");
                            break;
                        case '运维':
                            self.findAssist("YW");
                            break;
                        case '财务':
                            self.findAssist("CW");
                            break;
                        case '人力':
                            self.findAssist("RL");
                            break;
                    }
                } else {
                    self.$message({
                        message: data.body.data,
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
            });
        },
        findAssist(val){//获取辅助资料
            let self = this;
            let url = global.K3INTERFACE_URL + "/k3interface/common/findAssistantInfos";
            
            self.param.grpNum = val;
            self.$http.post(url, self.param, self.option).then(function(data) {
                // 这里是处理正确的回调
                if (data.body.flag) {
                    let dataText = data.body.data;
                    if (val == "TD") {
                        //团队经理
                        self.deptTransferData = dataText;
                    } else if (val == "BM") {
                        //部门负责人
                        self.itTransferData = dataText;
                    } else if (val == "IT") {
                        //IT
                        self.itTransferData = dataText;
                    } else if (val == "XZ") {
                        //行政
                        self.adminTransferData = dataText;
                    } else if (val == "BP") {
                        //BP助理
                        self.bpTransferData = dataText;
                    }  else if (val == "YW") {
                        //运维
                        self.maintenanceTransferData = dataText;
                    } else if (val == "CW") {
                        //财务
                        self.financeTransferData = dataText;
                    } else if (val == "RL") {
                        //人力
                        self.humanTransferData = dataText;
                    }
                } else {
                    self.$message({
                    message: data.body.erro,
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
            });
        },
        handlePresent(formName) {//提交申请
            this.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let self = this;
                    let url =  global.HUMRES_URL + "/humres/empmanage/addEmpQuit";

                    let dates = new Date(self.applicationData.entryDate);
                    let y = dates.getMonth()+1;
                    self.applicationData.entryDate = dates.getFullYear() + '-' + (y < 10 ? "0"+y : y) + '-' + (dates.getDate() < 10 ? "0"+dates.getDate() : dates.getDate());

                    let date = new Date(self.applicationData.dimissionDate);
                    let i = date.getMonth()+1;
                    self.applicationData.dimissionDate = date.getFullYear() + '-' + (i < 10 ? "0"+i : i) + '-' + (date.getDate() < 10 ? "0"+date.getDate() : date.getDate()); 

                    self.$http.post(url, self.applicationData, self.option).then(function(data) {
                        // 这里是处理正确的回调
                        if (data.body.flag) {
                            self.loading = false;
                            self.$message({
                                message: '提交成功！',
                                type: "success"
                            });
                            self.readPresent = true;
                        } else {
                            self.loading = false;
                            self.$message({
                                message: data.body.data,
                                type: "warning"
                            });
                        }
                    },
                    function(error) {
                        // 这里是处理错误的回调
                        self.loading = false;
                        self.$message({
                            message: "请求失败，请刷新重试！",
                            type: "error"
                        });
                    });
                } else {
                    return false;
                }
            })
        },
        handleTurnDown() {//驳回
            let self = this;
            let url =  global.HUMRES_URL + "/humres/empmanage/reject/approvalFlow";
            let info = {
                empCode: localStorage.getItem("ms_empCode"),
                k3BillNo: self.myAgentData.k3BillNo
            }
            self.loading = true;

            self.$http.post(url, info, self.option).then(function(data) {
                // 这里是处理正确的回调
                if (data.body.flag) {
                    self.loading = false;
                    self.showDetails = false;
                    self.showSuccess = true;
                    self.succeedText = "驳回成功！";
                    self.$message({
                        message: '驳回成功！',
                        type: "success"
                    });
                } else {
                    self.loading = false;
                    self.$message({
                        message: data.body.msg,
                        type: "warning"
                    });
                }
            },
            function(error) {
                // 这里是处理错误的回调
                self.loading = false;
                self.$message({
                    message: "请求失败，请刷新重试！",
                    type: "error"
                });
            });
        },
        handleConsent(formName) {//同意审批
            this.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let self = this;
                    let url =  global.HUMRES_URL + "/humres/empmanage/consent/approvalFlow";
                    self.myAgentData.teamTransfer = JSON.stringify(self.myAgentData.teamTransfer);
                    self.myAgentData.deptTransfer = JSON.stringify(self.myAgentData.deptTransfer);
                    self.myAgentData.itTransfer = JSON.stringify(self.myAgentData.itTransfer);
                    self.myAgentData.adminTransfer = JSON.stringify(self.myAgentData.adminTransfer);
                    self.myAgentData.bpTransfer = JSON.stringify(self.myAgentData.bpTransfer);
                    self.myAgentData.maintenanceTransfer = JSON.stringify(self.myAgentData.maintenanceTransfer);
                    self.myAgentData.financeTransfer = JSON.stringify(self.myAgentData.financeTransfer);
                    self.myAgentData.humanTransfer = JSON.stringify(self.myAgentData.humanTransfer);

                    self.$http.post(url, self.myAgentData, self.option).then(function(data) {
                        // 这里是处理正确的回调
                        if (data.body.flag) {
                            self.loading = false;
                            self.showDetails = false;
                            self.showSuccess = true;
                            self.succeedText = "审批完毕！";
                            self.$message({
                                message: '审批成功！',
                                type: "success"
                            });
                        } else {
                            self.loading = false;
                            self.$message({
                                message: data.body.msg,
                                type: "warning"
                            });
                        }
                    },
                    function(error) {
                        // 这里是处理错误的回调
                        self.loading = false;
                        self.$message({
                            message: "请求失败，请刷新重试！",
                            type: "error"
                        });
                    }); 
                } else {
                    return false;
                }
            });
        },
        resetApplicationForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleBack() {
            //返回上一级（只在员工页面编辑跳转时才启用）
            this.$emit("goLeaveBack", false);
        },
        tableRowClassName({row, rowIndex}){
            if (rowIndex === 0) {
                return 'success-row';
            }
        },
    }
}
</script>

<style lang="less">
    .leaveOffice {
        background: #fff;
        .leaveBox{
            box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
            padding: 20px;

            .crumbs{
                position: relative;
                margin-bottom: 40px;

                .back{
                    position: absolute;
                    right: 0;
                    bottom: -12px;
                }
            }
            .details{
                width: 80%;
                margin: 50px auto;

                .el-form{
                    position: relative;
                    .el-form-item{
                        label{
                            text-align: center;
                        }
                        .el-input{
                            width: 40%;
                        }
                    }
                    .rest{
                        label{
                            width: auto !important;
                        }
                        .el-form-item__content{
                            margin: 0 !important;

                            input{
                                border: 0;
                                border-radius: 0;
                                border-bottom: 1px solid #d8dce5; 
                            }
                        }
                    }
                    .other{
                        width: 20% !important;
                        input{
                            border: 0;
                            border-radius: 0;
                            border-bottom: 1px solid #d8dce5;
                        }
                    }
                    .workHandover{
                        label{
                            clear: both;
                            display: block;
                        }
                        .el-radio-group{
                            display: block;

                            .el-checkbox{
                                text-align: left;
                                display: block;
                                margin: 0;
                                margin: 10px 30px;
                            }
                        }
                    }
                    .btns{
                        width: 100%;
                        text-align: center;
                    }
                }
            }
            .success{
                text-align: center;
                margin: 70px 0;
            }
        }
    }
</style>
