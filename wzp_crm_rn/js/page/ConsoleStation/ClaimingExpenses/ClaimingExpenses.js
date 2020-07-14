/**
 * 费用报销单详情页
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native';
import { FormInput, FormSelect, FormTextArea, FormSwitch, FormDate, FormSection, FormDetailSelect, FormUpload } from '../../../common/FormComponents/Index';
import { Button } from 'react-native-elements'
import ClaimingExpensesDetailList from '../../../common/consoleComponent/ClaimingExpensesDetailList'
import ajax from '../../../config/Fetch'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ClaimingExpenses extends Component {


  static navigationOptions = ({ navigation }) => {
    let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
    let editEnable = navigation.getParam('editEnable')
    return {
      title: '费用报销单',
      headerBackTitle: null,
      headerRight:
        editEnable ?
          (<TouchableOpacity style={{ marginRight: 23 }}
            onPress={rightNavigateBtnTapped}
          >
            <Text style={{ fontSize: 16, color: '#306FFE' }}>保存</Text>
          </TouchableOpacity>) : null
    }
  }


  constructor(props) {
    super(props);
    this.state = {
      fId: null,
      organization: [],  //备选组织
      department: [],    //备选部门
      unitType: [
        { name: "客户", id: "BD_Customer" },
        { name: "部门", id: "BD_Department" },
        { name: "员工", id: "BD_Empinfo" },
        { name: "其他", id: "FIN_OTHERS" },
        { name: "供应商", id: "BD_Supplier" }
      ],
      feeIterms: [],     //备选费用项目
      payBank: [{ name: "民生" }, { name: "建设" }, { name: "支付宝" }],

      formValue: {
        org: {},         //申请组织
        requestDept: {},  //申请部门
        date: "",         //申请日期
        proposerId: '',   //申请人
        contactPhone: "", //申请人电话
        expenseOrg: {},   //费用承担组织
        expenseDept: {},  //费用承担部门
        contactUnitType: {}, //往来单位类型
        contactUnit: {},     //往来单位
        causa: "",           //事由
        requestType: "1",    //结算情况
        payOrg: {},          //付款组织 && 原付款组织
        settlleType: { name: "现金", id: "1" },     //结算方式
        expenseEntrylist: [], //明细
        files: [] //附件
      },
      errorInfo: {
      },
      editEnable: true, //是否可编辑
    }
  }

  componentWillMount() {
    const { setParams } = this.props.navigation;
    setParams({
      rightNavigateBtnTapped: () => {
        console.log("表单当前值", this.state.formValue)
        this.save()
      },
      editEnable: true
    })
  }

  componentDidMount() {
    const { getParam } = this.props.navigation
    var self = this
    this.loadComboListDatas()
    //明细编辑 && 添加
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.claimingExpensesDetailDidChange, function (detailIndex, formValue) {
      self.detailListChange(detailIndex, formValue)
    });
    //搜索往来单位
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.unitSearchDidSelect, function (dataInfo) {
      self.formItemValueChanged(dataInfo, 'contactUnit', null)
    });

    //取值 加载已有表单数据
    let fId = getParam("fId")
    if (fId) {
      this.state.fId = fId
      this.loadFormInfo()
    } else {
      let proposer = {proposerId: PersistanceManger.ShareInstance().userName}
      this.setState({
        formValue: Object.assign({}, this.state.formValue, proposer)
      })
    }
  }


  componentWillUnmount() {
    this.listener.remove();
  }


  render() {
    const { formValue, errorInfo, editEnable, organization, department, payBank, unitType } = this.state

    /**
     * 基本
     */
    let baseSection = (
      <FormSection title="基本" enable={editEnable}>
        <FormSelect title='申请组织' error={errorInfo.org} value={formValue.org.name} keyName="org" editEnable={editEnable}
          pickerDatas={organization}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormSelect title='申请部门' error={errorInfo.requestDept} value={formValue.requestDept.name} keyName="requestDept" editEnable={editEnable}
          pickerDatas={department}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormDate title='申请日期' error={errorInfo.date} value={formValue.date} keyName="date" editEnable={editEnable}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormInput title="申请人" subtitle="(不可更改)" value={formValue.proposerId} keyName="proposerId" editEnable={false} />
        <FormInput title="申请人电话" error={errorInfo.contactPhone} value={formValue.contactPhone} keyName="contactPhone" editEnable={editEnable}
          keyboardType="numeric"
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormSelect title='费用承担组织' error={errorInfo.expenseOrg} value={formValue.expenseOrg.name} keyName="expenseOrg" editEnable={editEnable}
          pickerDatas={organization}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormSelect title='费用承担部门' error={errorInfo.expenseDept} value={formValue.expenseDept.name} keyName="expenseDept" editEnable={editEnable}
          pickerDatas={department}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormSelect title='往来单位类型' error={errorInfo.contactUnitType} value={formValue.contactUnitType.name} keyName="contactUnitType" editEnable={editEnable}
          pickerDatas={unitType}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        <FormDetailSelect title='往来单位' error={errorInfo.contactUnit} value={formValue.contactUnit.name} editEnable={editEnable}
          onItermClicked={this.onClickedToSearchUnit.bind(this)}
        />
        <FormTextArea title="事由" error={errorInfo.causa} value={formValue.causa} keyName="causa" editEnable={editEnable}
          placeholder={"请填写事由"}
          maxLength={100}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
      </FormSection>
    )

    /**
     * 结算
     */
    let paySection = (
      <FormSection title="结算" enable={editEnable}>
        <FormSwitch title='结算情况' error={errorInfo.requestType} value={formValue.requestType == "1"} keyName="requestType" editEnable={editEnable}
          leftBtnTitle={"申请付款"}
          rightBtnTitle={"申请退款"}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        {formValue.requestType == "1" ?
          (<FormSelect title='付款组织' error={errorInfo.payOrg} value={formValue.payOrg.name} keyName="payOrg" editEnable={editEnable}
            pickerDatas={organization}
            onValueChanged={this.formItemValueChanged.bind(this)}
          />)
          :
          (<FormSelect title='原付款组织' error={errorInfo.payOrg} value={formValue.payOrg.name} keyName="payOrg" editEnable={editEnable}
            pickerDatas={organization}
            onValueChanged={this.formItemValueChanged.bind(this)}
          />)
        }
        <FormSwitch title='结算方式' error={errorInfo.settlleType} value={formValue.settlleType.id == "1" || !formValue.settlleType.id} keyName="settlleType" editEnable={editEnable}
          leftBtnTitle={"现金"}
          rightBtnTitle={"电汇"}
          onValueChanged={this.formItemValueChanged.bind(this)}
        />
        {formValue.settlleType.name == "电汇" ?
          formValue.requestType == "1" ?
            (
              <View>
                <FormInput title="开户银行" error={errorInfo.bankBranch} value={formValue.bankBranch} keyName="bankBranch" editEnable={editEnable}
                  onValueChanged={this.formItemValueChanged.bind(this)}
                />
                <FormInput title="账户名称" error={errorInfo.bankAccountName} value={formValue.bankAccountName} keyName="bankAccountName" editEnable={editEnable}
                  onValueChanged={this.formItemValueChanged.bind(this)}
                />
                <FormInput title="银行账号" error={errorInfo.bankAccount} value={formValue.bankAccount} keyName="bankAccount" editEnable={editEnable}
                  keyboardType="numeric"
                  onValueChanged={this.formItemValueChanged.bind(this)}
                />
              </View>
            )
            :
            (
              <FormSelect title='选择银行' error={errorInfo.bankAcntId} value={formValue.bankAcntId} keyName="bankAcntId" editEnable={editEnable}
                pickerDatas={payBank}
                onValueChanged={this.formItemValueChanged.bind(this)}
              />
            ) : null}
      </FormSection>
    )

    /**
     * 明细
     */
    let detaileSection = (
      <FormSection title="明细" enable={editEnable} rightBtnTitle="+添加"
        onRightBtnTapped={() => {
          const { organization, department, feeIterms } = this.state
          let param = {
            organization: organization,
            department: department,
            feeIterms: feeIterms,
          }
          this.props.navigation.navigate('ClaimingExpensesDetail', param)
        }
        }>
        <ClaimingExpensesDetailList
          value={formValue.expenseEntrylist}
          editEnable={editEnable}
          onDeleteRowAtIndex={this.onDeleteRowAtIndex.bind(this)}
          onPressRowAtIndex={this.onPressRowAtIndex.bind(this)}
        />
      </FormSection>
    )


    /**
     * 附件
     */
    let filesSection = (
      <FormSection title="附件" enable={editEnable}>
        <FormUpload editEnable={editEnable} value={formValue.files} keyName="files" onValueChanged={this.formItemValueChanged.bind(this)} />
      </FormSection>
    )


    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView >
          {/* <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="0"> */}
          {baseSection}
          {paySection}
          {detaileSection}
          {filesSection}
          {/* </KeyboardAvoidingView> */}

          {editEnable && (
            <Button
              fontSize={16}
              buttonStyle={styles.entryButton} 
              containerStyle={{ marginLeft: 0, marginRight: 0 }}
              title='提交'
              onPress={this.submit.bind(this)}
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
   * @param {string} KeyName
   * @param {FormBaseComponents} sender
   * @memberof ClaimingExpenses
   */
  formItemValueChanged(value, KeyName, sender) {
    console.log(sender, "Change： ", KeyName, "----", value)
    var changeValue = {}
    var name = KeyName
    switch (KeyName) {
      case "org", "requestDept", "expenseOrg", "expenseDept", "contactUnit", "payOrg":
        changeValue[name] = value
        break;
      case "contactUnitType":
        //往来单位类型 -- 选择后清空往来单位
        changeValue[name] = value
        this.formItemValueChanged({}, 'contactUnit', null)
        break
      case "bankAcntId":
        changeValue[name] = value.name
        break
      case "requestType":
        changeValue[name] = value ? "1" : "0"
        break;
      case "settlleType":
        //现金 电汇
        changeValue[name] = {
          name: value ? "现金" : "电汇",
          id: value ? "1" : "4",
        }
        break
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
      errorInfo: errorInfo,
    })
  }

  /**
   * 点击进入选择往来单位
   *
   * @memberof ClaimingExpenses
   */
  onClickedToSearchUnit() {
    let unitType = this.state.formValue.contactUnitType
    if (!unitType || !unitType.name) {
      Toast.showFail("请先选择往来单位类型")
      return
    }
    this.props.navigation.navigate('ContactUnitSearchPage', { unitType: unitType })

  }


  /**
   * 明细列表删除某一项
   *
   * @param {*} index
   * @memberof ClaimingExpenses
   */
  onDeleteRowAtIndex(index) {
    let data = this.state.formValue
    data.expenseEntrylist.splice(index, 1)
    this.setState({
      formValue: data,
    })
  }


  /**
   *  明细列表发生改变 或 添加明细
   *
   * @param {number?} detailIndex 数据序号 新建时为 null
   * @param {object} formValue  表单数据
   * @memberof ClaimingExpenses
   */
  detailListChange(detailIndex, formValue) {
    let data = this.state.formValue
    if (detailIndex != null) {
      data.expenseEntrylist[detailIndex] = formValue
    } else {
      data.expenseEntrylist.push(formValue)
    }
    this.setState({
      formValue: data,
    })
  }


  /**
   * 明细列表点击某一项
   *
   * @param {*} index
   * @memberof ClaimingExpenses
   */
  onPressRowAtIndex(index) {
    const { editEnable, formValue, organization, department, feeIterms } = this.state
    let expense = formValue.expenseEntrylist[index]
    let param = {
      editEnable: editEnable,
      detailIndex: index,
      formValue: expense,
      organization: organization,
      department: department,
      feeIterms: feeIterms,
    }
    this.props.navigation.navigate('ClaimingExpensesDetail', param)
  }




  //网络请求

  /**
   * 加载备选列表数据
   *
   * @memberof ClaimingExpenses
   */
  loadComboListDatas() {
    let userId = PersistanceManger.ShareInstance().userId
    let self = this
    let errorFunc = (e) => {
      console.log(e)
    }
    //部门
    ajax.get('dept&org', { isDept: "1", userId: userId })
      .then((res) => {
        self.setState({
          department: res
        })
      }).catch(errorFunc)
    //组织
    ajax.get('dept&org', { isDept: "0", userId: userId })
      .then((res) => {
        self.setState({
          organization: res
        })
      }).catch(errorFunc)
    //费用项目
    ajax.get('baseData',
      {
        tableName: global.BaseDataPath.expenseFeeItermTableName,
        fpk: global.BaseDataPath.expenseFeeItermFPK
      }
    ).then((res) => {
      self.setState({
        feeIterms: res
      })
    }).catch(errorFunc)
  }

  /**
   * 加载已有表单数据
   *
   * @memberof ClaimingExpenses
   */
  loadFormInfo() {
    const { setParams, goBack } = this.props.navigation
    let userId = PersistanceManger.ShareInstance().userId
    let self = this
    Toast.showLoading("加载中...", {mask: true})
    //部门
    ajax.get('expensess', { userId: userId, fid: this.state.fId })
      .then((res) => {
        Toast.hide()
        this.setState({
          formValue: res,
          editEnable: res.documentStatus == 'A' || res.documentStatus == 'D'
        })
        setParams({
          editEnable: res.documentStatus == 'A' || res.documentStatus == 'D'
        })
      }).catch((e) => {
        Toast.hide()
        goBack()
        console.log(e)
      })
  }


  //提交
  submit() {
    this.submitForm(false)
  }

  //保存
  save() {
    this.submitForm(true)
  }

  /**
   * 校验表单
   *
   * @returns
   * @memberof ClaimingExpenses
   */
  verifyForm() {
    const {formValue, errorInfo} = this.state
    var changeErrorInfo = {}

    //基本
    if ( formValue.org.id == null) {
      changeErrorInfo.org = '申请组织是必填项'
    }
    if ( formValue.requestDept.id == null) {
      changeErrorInfo.requestDept = '申请部门是必填项'
    }
    if ( formValue.date == null || formValue.date.length < 1) {
      changeErrorInfo.date = '申请日期是必填项'
    }
    if ( formValue.contactPhone == null ) {
      changeErrorInfo.contactPhone = '申请人电话是必填项'
    } else if (formValue.contactPhone.length != 11){
      changeErrorInfo.contactPhone = '申请人电话格式错误'
    }
    if ( formValue.expenseOrg.id == null) {
      changeErrorInfo.expenseOrg = '费用承担组织是必填项'
    }
    if ( formValue.expenseDept.id == null) {
      changeErrorInfo.expenseDept = '费用承担部门是必填项'
    }
    if (formValue.contactUnitType.id == null) {
      changeErrorInfo.contactUnitType = '往来单位类别是必填项'
    }
    if (formValue.contactUnit.id == null) {
      changeErrorInfo.contactUnit = '往来单位是必填项'
    }

    //结算
    if (formValue.requestType == null) {
      changeErrorInfo.requestType = '结算情况是必填项'
    }
    if (formValue.payOrg.id == null) {
      changeErrorInfo.payOrg = "请选择付款组织"
    }
    if (formValue.settlleType.id == null) {
      changeErrorInfo.settlleType = '结算方式是必填项'
    }

    if (formValue.settlleType.id == '4' && formValue.requestType == '1') {
      if (formValue.bankBranch == null || formValue.bankBranch.length < 1) {
        changeErrorInfo.bankBranch = '开户银行是必填项'
      }
      if (formValue.bankAccountName == null || formValue.bankAccountName.length < 1) {
        changeErrorInfo.bankAccountName = '账户名称是必填项'
      }
      if (formValue.bankAccount == null || formValue.bankAccount.length < 1) {
        changeErrorInfo.bankAccount = '银行账号是必填项'
      }
    }else if (formValue.settlleType.id == '4' && formValue.requestType == '0'){
      if (formValue.bankAcntId == null) {
        changeErrorInfo.bankAcntId = '退款银行是必填项'
      }
    }

    //明细
    if (formValue.expenseEntrylist.length < 1) {
      changeErrorInfo.expenseEntrylist = '至少需要一条明细信息'
    }

    if (Object.keys(changeErrorInfo).length == 0) {
      return true
    }else{
      this.setState({
        errorInfo: Object.assign({}, errorInfo, changeErrorInfo)
      })
      Toast.showFail("表单校验失败")
      return false
    }
  }



  /**
   * 提交表单
   *
   * @param {*} isSave
   * @memberof ClaimingExpenses
   */
  submitForm(isSave) {
    if (!this.verifyForm()) {
      return
    }
    Toast.showLoading(isSave ? "保存中" : "提交中",{ mask: true })
    var formDatas = this.state.formValue
    formDatas.fId = this.state.fId
    var param = {
      userId: PersistanceManger.ShareInstance().userId,
      status: isSave ? "0" : "1",
      data: formDatas
    }
    console.log("提交费用报销单", param)
    ajax.post('expensesSubmit', param)
      .then((res) => {
        console.log(res)
        Toast.showSuccess(isSave ? "保存成功" : "提交成功")
        this.props.navigation.goBack()
        DeviceEventEmitter.emit(global.NotificationIdentify.listPageNeedRefresh, true);
      }).catch((e) => {
        console.log("提交出错", e)
        let msg = e.msg ?? "提交出错"
        Toast.showFail(msg)
      })
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