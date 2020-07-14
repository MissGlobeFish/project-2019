<template>
    <div class="salaryDetail">
        <div class="detailBox">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-sold-out"></i> 薪酬管理</el-breadcrumb-item>
                    <el-breadcrumb-item>薪酬查询</el-breadcrumb-item>
                    <el-breadcrumb-item>薪酬详情</el-breadcrumb-item>
                </el-breadcrumb>
                <el-button class="back" size="small" icon="el-icon-caret-left" @click="handleBack"> 返回</el-button>
            </div>
            <div class="steps">
                <div class="topInfo" > 
                    <el-date-picker  class="list" @input="handleSalary" v-model="salaryPayDate" type="month" placeholder="选择查询月份"></el-date-picker>
                    <el-select v-model="type" placeholder="请选择" class="list" @input="changeType">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> 
                </div>

                <div class="plugins-tips" style="border-radius:4px;">
                    <p style="color:#999;font-size:14px;">以下是您的工资明细表，请务必确认无误！如无疑问，即等同于亲自签收！（注意薪资保密，如有任何疑问，请咨询HR王倩）</p>
                </div>

                <div v-if="showWXB">
                    <el-table :data="rowOne" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="deptName" label="部门"></el-table-column>
                        <el-table-column prop="empCode" label="工号"></el-table-column>
                        <el-table-column prop="empName" label="姓名"></el-table-column>
                        <el-table-column prop="lastHireDate" label="入职日期"></el-table-column>
                    </el-table>

                    <el-table :data="rowTwo" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salaryBasic" label="基本工资"></el-table-column>
                        <el-table-column prop="salarySubsidy" label="补助"></el-table-column>
                        <el-table-column prop="salarySeniority" label="工龄奖"></el-table-column>
                        <el-table-column prop="salaryMonth" label="本月应发工资"></el-table-column>
                    </el-table>

                    <el-table :data="rowThree" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salarySickPay" label="病假"></el-table-column>
                        <el-table-column prop="salaryAbsencePay" label="事假"></el-table-column>
                        <el-table-column prop="salaryLatePay" label="迟到"></el-table-column>
                        <el-table-column prop="salaryMissPay" label="漏刷卡"></el-table-column>
                    </el-table>

                    <div class="sub"><span>缺勤应扣合计：</span><i>{{salaryAbsenteeismCount}}</i></div>

                    <el-table :data="subsidyWXB" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salaryTrafficPay" label="交通补助"></el-table-column>
                        <el-table-column prop="salaryContactPay" label="通讯补助"></el-table-column>
                        <el-table-column prop="salaryComputerPay" label="电脑补助"></el-table-column>
                        <el-table-column prop="salaryOther1" label="其他（一）"></el-table-column>
                    </el-table>

                    <el-table :data="deductWXB" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salarySale" label="销售提成"></el-table-column>
                        <el-table-column prop="salaryInstall" label="续约 / 装机"></el-table-column>
                        <el-table-column prop="salaryAchievements" label="绩效奖金"></el-table-column>
                        <el-table-column prop="salaryAfterSales" label="售后提成"></el-table-column>
                    </el-table>

                    <el-table :data="bonusWXB" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salaryDepot" label="仓管补贴"></el-table-column>
                        <el-table-column prop="salaryEstate" label="地产项目奖金"></el-table-column>
                        <el-table-column prop="specialDeduction" label="专项附加扣除"></el-table-column>
                        <el-table-column prop="blank" label="--"></el-table-column>
                    </el-table>

                    <div class="sub"><span>应发小计：</span><i>{{salarySubtotal}}</i></div>

                    <el-table :data="rowFour" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salarySocialSecurity" label="社保"></el-table-column>
                        <el-table-column prop="salaryAccumulationFund" label="住房公积金"></el-table-column>
                        <el-table-column prop="salaryPersonalTax" label="个税"></el-table-column>
                        <el-table-column prop="salaryOther2" label="其他（二）"></el-table-column>
                    </el-table>

                    <div class="sub"><span>应扣小计：</span><i>{{salaryDeductible}}</i></div>
                    <div class="sub"><span>实发工资：</span><b>实发一：<i>{{salaryNinePay}}</i></b><b>实发二：<i>{{salaryTwentyPay}}</i></b></div>
                </div>

                <div v-if="showGSTF">
                    <el-table :data="rowOne" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="deptName" label="部门"></el-table-column>
                        <el-table-column prop="empCode" label="工号"></el-table-column>
                        <el-table-column prop="empName" label="姓名" ></el-table-column>
                        <el-table-column prop="lastHireDate" label="入职日期"></el-table-column>
                    </el-table>

                    <el-table :data="rowTwo" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salaryBasic" label="基本工资"></el-table-column>
                        <el-table-column prop="salarySubsidy" label="补助"></el-table-column>
                        <el-table-column prop="salarySeniority" label="工龄奖"></el-table-column>
                        <el-table-column prop="salaryMonth" label="本月应发工资"></el-table-column>
                    </el-table>

                    <el-table :data="rowThree" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salarySickPay" label="病假"></el-table-column>
                        <el-table-column prop="salaryAbsencePay" label="事假"></el-table-column>
                        <el-table-column prop="salaryLatePay" label="迟到"></el-table-column>
                        <el-table-column prop="salaryMissPay" label="漏刷卡"></el-table-column>
                    </el-table>

                    <div class="sub"><span>缺勤应扣合计：</span><i>{{salaryAbsenteeismCount}}</i></div>

                    <el-table :data="subsidyGSTF" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salaryComputerPay" label="电脑补助"></el-table-column>
                        <el-table-column prop="salaryContactPay" label="交通补助"></el-table-column>
                        <el-table-column prop="salaryRenew" label="续费奖金"></el-table-column>
                        <el-table-column prop="salaryEstate" label="地产项目奖金"></el-table-column>
                    </el-table>

                    <el-table :data="bonusGSTF" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salaryOther1" label="其他（一）"></el-table-column>
                        <el-table-column prop="salaryMember" label="会员系统提成"></el-table-column>
                        <el-table-column prop="salaryQuarter" label="季度奖金"></el-table-column>
                        <el-table-column prop="specialDeduction" label="专项附加扣除"></el-table-column>
                    </el-table>

                    <el-table :data="rowFour" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salarySocialSecurity" label="社保"></el-table-column>
                        <el-table-column prop="salaryAccumulationFund" label="住房公积金"></el-table-column>
                        <el-table-column prop="salaryPersonalTax" label="个税"></el-table-column>
                        <el-table-column prop="salaryOther2" label="其他（二）"></el-table-column>
                    </el-table>

                    <div class="sub"><span>应扣小计：</span><i>{{salaryDeductible}}</i></div>
                    <div class="sub"><span>实发工资：</span><i>{{salaryPay}}</i></div>
                </div>

                <div v-if="showYearSalary">
                    <el-table :data="rowOne" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="deptName" label="部门"></el-table-column>
                        <el-table-column prop="empCode" label="工号"></el-table-column>
                        <el-table-column prop="empName" label="姓名"></el-table-column>
                        <el-table-column prop="lastHireDate" label="入职日期"></el-table-column>
                    </el-table>
                     <el-table :data="rowYearSalary" border :header-row-class-name="tableRowClassName" style="width: 100%">
                        <el-table-column prop="salarySubtotal" label="应发年终奖"></el-table-column>
                        <el-table-column prop="salaryDeductible" label="应扣小计"></el-table-column>
                        <el-table-column prop="salaryPay" label="实发年终奖"></el-table-column> 
                    </el-table>  
                </div>

                <div class="remark"><span>备注：</span><i>{{ salaryDesc }}</i></div>
                <div v-if="showYearDesc" class="remark remarkSection">
                    <p>小宝人，十分感谢你在2018年对公司的付出和贡献！！年终奖来袭，请准备好口袋！！</p>
                    <p>同时让我们带着最大的激情和热情投入2019年，做旺小宝事业的主人，携手小宝共迎新一年，新挑战！！fighting！！</p>

                    <p>一、年终奖的发放范围及规则<p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;原则上是2018年12月之前入职的所有员工；2018年在职不满一年的，根据实际在岗天数发放。</p>
                    <p>二、疑问咨询</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;地产：有疑问请咨询HR杨峥嵘；</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非地产：有疑问请咨询HR王倩。</p>
                </div>
                <div v-if="showSalaryDesc" class="remark" style="font-size:12px;">
                    <span>（ 实发工资 = 应发小计 - 应扣小计 ）试用期工资为转正工资的80%</span>
                </div>  
            </div>
        </div>
    </div>
</template>
<style>
  .el-table .success-row {
    background: #f6faff;
  }
  .salaryDetail .detailBox .steps .remarkSection {
      width: 87%;
      margin: auto;
      text-align: left !important;
  }
  .remarkSection p{
      font-size: 14px;
      line-height: 2;
  }
</style>
<script>
export default {
    data() {
        return {
            options: [{
                value: '0',
                label: '基本工资'
            }, {
                value: '1',
                label: '2018年终奖'
            }],
            type: '0',
            showWXB: true,
            showGSTF: false,
            showYearSalary: false,
            showSalaryDesc: true,
            showYearDesc: false,
            salaryPayDate: '',
            salarySubtotal: '',
            salaryAbsenteeismCount: '',
            salaryDeductible: '',
            salaryPay: '',
            salaryDesc: '',
            salaryNinePay: '',
            salaryTwentyPay: '',
            rowOne: [],
            rowTwo: [],
            rowThree: [],
            rowFour: [],
            subsidyWXB: [],
            deductWXB: [],
            bonusWXB: [],
            subsidyGSTF: [],
            bonusGSTF: [],
            rowYearSalary:[],
            option: {
                timeout: 30 * 1000 //30秒过期
            }
        }
    },
    created() {
        //在实例创建完成后被立即调用
        this.salaryPayDate = '';
        this.init();
    },
    methods: {
        init(){
            let self = this; 
            let url = global.HUMRES_URL +  '/humres/salary/find';
            let empCode = window.localStorage.getItem("ms_empCode"); 
            let securityCode = window.localStorage.getItem("securityCode");   
            if (empCode) {
                let datas = {
                    empCode: empCode,
                    securityCode: securityCode,
                    salaryPayMonth: self.salaryPayDate,
                    type: self.type
                }; 
                self.$http.post(url, datas, self.option).then(function(data) { // 这里是处理正确的回调
                    if (data.body.flag) {
                        let info = data.body.data;
                        if (info) {
                            if(info.type == '1'){
                                self.showWXB = false;
                                self.showGSTF = false;
                                self.showYearSalary = true;
                                self.showYearDesc = true;
                                self.showSalaryDesc = false;
                            }else if (info.companyCode == "GSTF") {
                                self.showWXB = false;
                                self.showGSTF = true;
                                self.showYearSalary = false;
                                self.showYearDesc = false;
                                self.showSalaryDesc = true;
                            }else if(info.companyCode == "WXB"){
                                self.showWXB = true;
                                self.showGSTF = false;
                                self.showYearSalary = false;
                                self.showYearDesc = false;
                                self.showSalaryDesc = true;
                            } 
                        }else{
                           self.$message({
                                message: '没有薪酬相关信息，请核实后重试！',
                                type: "warning"
                            });
                        }
                        self.rowOne = [{
                            deptName: info.deptName,
                            empCode: info.empCode,
                            empName: info.empName,
                            lastHireDate: info.lastHireDate.join('/'),
                        }];

                        self.rowTwo = [{
                            salaryBasic: info.salaryBasic,
                            salarySubsidy: info.salarySubsidy,
                            salarySeniority: info.salarySeniority,
                            salaryMonth: info.salaryMonth,
                        }];

                        self.rowThree = [{
                            salarySickPay: info.salarySickPay,
                            salaryAbsencePay: info.salaryAbsencePay,
                            salaryLatePay: info.salaryLatePay,
                            salaryMissPay: info.salaryMissPay,
                        }];

                        self.rowFour = [{
                            salarySocialSecurity: info.salarySocialSecurity,
                            salaryAccumulationFund: info.salaryAccumulationFund,
                            salaryPersonalTax: info.salaryPersonalTax,
                            salaryOther2: info.salaryOther2,
                        }];

                        self.subsidyWXB = [{
                            salaryTrafficPay: info.salaryTrafficPay,
                            salaryContactPay: info.salaryContactPay,
                            salaryComputerPay: info.salaryComputerPay,
                            salaryOther1: info.salaryOther1,
                        }];

                        self.deductWXB = [{
                            salarySale: info.salarySale,
                            salaryInstall: info.salaryInstall,
                            salaryAchievements: info.salaryAchievements,
                            salaryAfterSales: info.salaryAfterSales,
                        }];

                        self.bonusWXB = [{
                            salaryDepot: info.salaryDepot,
                            salaryEstate: info.salaryEstate,
                            specialDeduction:info.specialDeduction
                        }];

                        self.subsidyGSTF = [{
                            salaryComputerPay: info.salaryComputerPay,
                            salaryContactPay: info.salaryContactPay,
                            salaryRenew: info.salaryRenew,
                            salaryEstate: info.salaryEstate,
                        }];

                        self.bonusGSTF = [{
                            salaryOther1: info.salaryOther1,
                            salaryMember: info.salaryMember,
                            salaryQuarter: info.salaryQuarter,
                            specialDeduction:info.specialDeduction
                        }];
                        self.rowYearSalary =[{
                            salarySubtotal: info.salarySubtotal,
                            salaryDeductible: info.salaryDeductible,
                            salaryPay: info.salaryPay
                        }];
                        self.salarySubtotal = info.salarySubtotal;
                        self.salaryAbsenteeismCount = info.salaryAbsenteeismCount;
                        self.salaryDeductible = info.salaryDeductible;
                        self.salaryPay = info.salaryPay;
                        self.salaryDesc = info.salaryDesc;
                        self.salaryNinePay = info.salaryNinePay;
                        self.salaryTwentyPay = info.salaryTwentyPay;
                    } else {
                        self.$message({
                            message: data.body.msg,
                            type: "warning"
                        });
                    }
                },
                function(error) { // 这里是处理错误的回调
                    self.$message({
                        message: "请求超时！",
                        type: 'error'
                    });
                });
            }
        },
        handleSalary(){
            let date = new Date(this.salaryPayDate);
            let i = date.getMonth();
            this.salaryPayDate = date.getFullYear() + '-' + (i < 9 ? "0"+(i+1) : (i+1));
            this.init();
        },
        changeType(){
            if(this.type == 1){
                this.init();
            }
        },
        tableRowClassName({row, rowIndex}){
            if (rowIndex === 0) {
                return 'success-row';
            }
        },
        handleBack() {
            //返回上一级（只在员工页面编辑跳转时才启用）
            this.$emit("goSalaryBack", false);
        },
    }
}
</script>

<style lang="less">
    .salaryDetail {
        background: #fff;
        .detailBox{
            box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
            padding: 20px;

            .crumbs{
                position: relative;
                margin-bottom: 20px;

                .back{
                    position: absolute;
                    right: 0;
                    bottom: -12px;
                }
            }
            .steps{
                width: 80%;
                margin: 0 auto;

                .topInfo{
                    width: 100%;
                    height: 50px;

                    .list{
                        float: right;
                    }
                }
                .el-table{
                    margin-bottom: 20px;
                }
                .sub{
                    color: #999;
                    font-size: 12px;
                    text-align: right;
                    margin-bottom: 20px;

                    i{
                        color: #c97269;
                        font-style: normal;
                    }
                    b{
                        border: 1px dashed #ddd;
                        margin-left: 6px;
                        padding: 6px;
                    }
                }
                .remark{
                    color: #999;
                    text-align: center;
                    margin-bottom: 20px;

                    i{
                        color: #999;
                        font-style: normal;
                    }
                }
            }
        }

    }
</style>
