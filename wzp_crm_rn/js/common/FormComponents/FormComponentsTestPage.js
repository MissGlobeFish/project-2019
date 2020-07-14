/**
 * 控件测试页面
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { FormInput, FormSelect, FormTextArea, FormSwitch, FormDate, FormSection } from '../../common/FormComponents/Index';

export default class FormComponentsTestPage extends Component {
  static navigationOptions = ({ navigation }) => {
    let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
    return {
      title: '控件测试页面',
      headerBackTitle: null,
      headerRight:
        <TouchableOpacity style={{ marginRight: 23 }}
          onPress={rightNavigateBtnTapped}
        ><Text style={{ fontSize: 18, color: '#306FFE' }}>不可编辑</Text></TouchableOpacity>
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      formValue: {
        testInputKey: '',
        testSelectKey: '',
        testSwitchKey: null,
        testDateKey: '',
      },
      editEnable: true,
    }
  }

  componentWillMount() {
    const { setParams } = this.props.navigation;
    setParams({
      rightNavigateBtnTapped: () => {
        console.log("绑定值", this.state.formValue)
        this.setState({
          error: "ddddd",
          editEnable: !this.state.editEnable,
        })
      }
    })

  }


  render() {
    const { formValue, error, editEnable } = this.state
    return (
      <View >
        <ScrollView scrollEnabled={true}>
          <FormInput title="测试标题" error={error} value={formValue.testInputKey} keyName="testInputKey" editEnable={editEnable}
            onValueChanged={this.formItemValueChanged.bind(this)} />
          <FormSelect title='测试单选' error={error} value={formValue.testSelectKey} keyName="testSelectKey" editEnable={editEnable}
            pickerDatas={[{ name: "数据1" }, { name: "数据2" }]}
            onValueChanged={this.formItemValueChanged.bind(this)}
          />
          {/* <FormTextArea placeholder="请输处理意见" maxLength={100}/> */}
          <FormSwitch title='测试开关' error={error} value={formValue.testSwitchKey} keyName="testSwitchKey" editEnable={editEnable}
            leftBtnTitle={"测试按钮"}
            rightBtnTitle={"测试按钮"}
            onValueChanged={this.formItemValueChanged.bind(this)} 
            />
            <FormSection title="标题 " rightBtnTitle="+测试" enable={editEnable} onRightBtnTapped={()=>{console.log("点击")}}>
            <FormDate title='测试日期' error={error} value={formValue.testDateKey} keyName="testDateKey" editEnable={editEnable}
            onValueChanged={this.formItemValueChanged.bind(this)}
          />
            </FormSection>
          
        </ScrollView>
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
      case "testSelectKey":
        changeValue[name] = value.name
        break;
      default:
        changeValue[name] = value
        break;
    }
    let data = Object.assign({}, this.state.formValue, changeValue)
    this.setState({
      formValue: data,
      error: null
    })
  }

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: 20
  },

})