/**
 * 费用报销单明细页
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native';
import { Button } from 'react-native-elements'
import { FormInput, FormSelect, FormTextArea, FormDate, FormSection, FormUpload } from '../../../common/FormComponents/Index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from '../../../common/Toast'

export default class ClaimingExpensesDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
        let detailIndex = navigation.getParam("detailIndex")
        let editEnable = navigation.getParam("editEnable")
        return {
            title: '费用明细',
            headerBackTitle: null,
            headerRight:
                (detailIndex != null && editEnable) ? (
                    <TouchableOpacity style={{ marginRight: 23 }}
                        onPress={rightNavigateBtnTapped}
                    ><Text style={{ fontSize: 16, color: '#306FFE' }}>保存</Text></TouchableOpacity>
                ) : null

        }
    }

    constructor(props) {
        super(props);
        this.state = {
            organization: [],
            department: [],
            feeIterms: [],
            detailIndex: null, //明细序号
            formValue: {
                exp: {}, //费用项目
                actualDate: "", //实际日期
                expenseAmount: "", //申请报销金额
                requestAmount: "",//申请付款金额
                expenseDept: {}, //费用承担部门
                remark: ""
            },
            errorInfo: {

            },
            editEnable: true,
        }
    }

    componentWillMount() {
        const { setParams, getParam } = this.props.navigation;
        //配置右导航按钮事件
        setParams({
            rightNavigateBtnTapped: () => {
                console.log("表单当前值", this.state.formValue)
                this.saveDetaile()
            }
        })

        //配置已有表单编辑选项
        let detailIndex = getParam("detailIndex")
        this.setState({
            organization: getParam("organization"),
            department: getParam("department"),
            feeIterms: getParam("feeIterms"),
        }, () => {
            console.log(this.state)
        })
        if (detailIndex != null) {
            this.setState({
                detailIndex: detailIndex,
                formValue: getParam("formValue"),
                editEnable: getParam("editEnable"),
            })
        }
    }


    render() {
        const { formValue, errorInfo, editEnable, detailIndex, feeIterms, department } = this.state
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView >
                    {/* <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="0"> */}
                    <FormSection title="基本" enable={editEnable}>
                        <FormSelect title='费用项目' error={errorInfo.exp} value={formValue.exp.name} keyName="exp" editEnable={editEnable}
                            pickerDatas={feeIterms}
                            onValueChanged={this.formItemValueChanged.bind(this)}
                        />
                        <FormDate title='实际日期' error={errorInfo.actualDate} value={formValue.actualDate} keyName="actualDate" editEnable={editEnable}
                            onValueChanged={this.formItemValueChanged.bind(this)}
                        />
                        <FormInput title="申请报销金额(元)" error={errorInfo.expenseAmount} value={formValue.expenseAmount} keyName="expenseAmount" editEnable={editEnable}
                            keyboardType="decimal-pad"
                            onValueChanged={this.formItemValueChanged.bind(this)}
                        />
                        <FormInput title="申请退/付款金额(元)" error={errorInfo.requestAmount} value={formValue.requestAmount} keyName="requestAmount" editEnable={editEnable}
                            keyboardType="decimal-pad"
                            onValueChanged={this.formItemValueChanged.bind(this)}
                        />
                        <FormSelect title='费用承担部门' error={errorInfo.expenseDept} value={formValue.expenseDept.name} keyName="expenseDept" editEnable={editEnable}
                            pickerDatas={department}
                            onValueChanged={this.formItemValueChanged.bind(this)}
                        />
                        <FormTextArea title="事由" error={errorInfo.remark} value={formValue.remark} keyName="remark" editEnable={editEnable}
                            placeholder={"请填写事由"}
                            maxLength={100}
                            onValueChanged={this.formItemValueChanged.bind(this)}
                        />
                    </FormSection>
                    {/* </KeyboardAvoidingView> */}
                    {detailIndex != null ? null : (
                        <Button
                            fontSize={16}
                            buttonStyle={styles.entryButton} containerStyle={{ marginLeft: 0, marginRight: 0 }}
                            title='确认添加'
                            onPress={this.addDetaile.bind(this)}
                        />
                    )}
                </KeyboardAwareScrollView>
            </View>
        );
    }


    /**
     * 表单数据绑定
     *
     * @param {any} value
     * @param {string} keyName
     * @param {FormBaseComponents} sender
     * @memberof ClaimingExpensesDetail
     */
    formItemValueChanged(value, keyName, sender) {
        console.log(sender, "Change： ", keyName, "----", value)
        var changeValue = {}
        var name = keyName
        switch (keyName) {
            case "exp", "expenseDept":
                changeValue[name] = value
                break;
            default:
                changeValue[name] = value
                break;
        }
        let data = Object.assign({}, this.state.formValue, changeValue)

        var errorChange = {}
        errorChange[name] = null
        let errorInfo = Object.assign({}, this.state.errorInfo, errorChange)

        this.setState({
            formValue: data,
            errorInfo: errorInfo
        })
    }


    /**
  * 校验表单
  *
  * @returns
  * @memberof ClaimingExpenses
  */
    verifyForm() {
        const { formValue, errorInfo } = this.state
        var changeErrorInfo = {}
        if (formValue.exp.id == null) {
            changeErrorInfo.exp = '费用项目是必填项'
        }
        if (formValue.actualDate == null || formValue.actualDate.length < 1) {
            changeErrorInfo.actualDate = '实际日期是必填项'
        }
        if (formValue.expenseAmount == null || formValue.expenseAmount.length < 1) {
            changeErrorInfo.expenseAmount = '申请报销金额是必填项'
        }
        if (formValue.requestAmount == null || formValue.requestAmount.length < 1) {
            changeErrorInfo.requestAmount = '申请退/付款金额是必填项'
        }
        if (formValue.expenseDept.id == null) {
            changeErrorInfo.expenseDept = '费用承担部门是必填项'
        }
        if (formValue.remark == null || formValue.remark.length < 1) {
            changeErrorInfo.remark = '事由是必填项'
        }
        if (Object.keys(changeErrorInfo).length == 0) {
            return true
        } else {
            this.setState({
                errorInfo: Object.assign({}, errorInfo, changeErrorInfo)
            })
            Toast.showFail("表单校验失败")
            return false
        }
    }

    addDetaile() {
        const { detailIndex, formValue } = this.state
        if (!this.verifyForm()) {
            return
        }
        DeviceEventEmitter.emit(global.NotificationIdentify.claimingExpensesDetailDidChange, detailIndex, formValue);
        this.props.navigation.goBack();
    }

    saveDetaile() {
        const { detailIndex, formValue } = this.state
        if (!this.verifyForm()) {
            return
        }
        DeviceEventEmitter.emit(global.NotificationIdentify.claimingExpensesDetailDidChange, detailIndex, formValue);
        this.props.navigation.goBack();
    }



}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F9',
        flex: 1
    },
    entryButton: {
        padding: 0,
        height: 55,
        margin: 30,
        borderRadius: 4,
        backgroundColor: '#4D66FD',
    }

})