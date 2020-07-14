/**
 * Payroll  我的 -- 工资单
 */
import React, { Component } from 'react';
import { TouchableOpacity,TextInput, StyleSheet, Text, View, Image, FlatList, DatePickerIOS } from 'react-native';
// import SplashScreen from 'react-native-splash-screen'; // 启动页三方库
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import { Button } from 'react-native-elements';
import {isNumber} from '../../common/Check';
import Toast from '../../common/Toast';
export default class PayrollLogin extends Component {
  static navigationOptions = {
    title: '工资单'
  };
  constructor(props){
    super(props)
    this.state= {
      code: '',
      errorInfo: '',
      loading: false,
      errorStatus: 0,
      phone: '',
      securityCode: '',
      sendCodeText: '发送验证码'
    }
  }
  componentDidMount() {
    this.fetData()
    // SplashScreen.hide(); // 关闭启动页
  }
  componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
    }
  handleTimer() { //倒计时
    var num = 60;
    num--;
    this.setState({
      sendCodeText: `${num}秒`
    })
    var timer = setInterval(() => {
      num--;
      this.setState({
        sendCodeText: `${num}秒`,
        disabled: true
      })
      if (num == 0) {
        this.setState({
          sendCodeText: '重新发送验证码',
          disabled: false
        })
        clearInterval(timer)
      }
    }, 1000)
  }
  sendCode() { // 发送验证码
    ajax.get('user/msg-code',{empCode: PersistanceManger.ShareInstance().empCode}).then((res)=>{
      if (res.flag) {
        this.handleTimer()
        console.log('发功成功开始倒计时')
      }
    })
    .catch((error)=>{
      if (error.code) {
        Toast.showFail(error.msg)
      } else {
        return
      }
      console.log(error, 'error--PayrollLogin--61')
    })
  }
  fetData() { //获取手机号
    ajax.getOther('user',PersistanceManger.ShareInstance().empCode).then((res)=>{
      this.setState({
        phone: res.phoneNum.toString(),
      })
    })
    .catch((error)=>{
      alert('请求失败')
    })
  }
  findSalary() { // 点击进入工资单
    let securityCode = this.state.securityCode.toString()
    if (!securityCode) {
      this.setState({errorInfo: '验证码不能为空',errorStatus:1})
    } else {
      ajax.get('user/verify-code',{empCode:PersistanceManger.ShareInstance().empCode,securityCode:securityCode})
      .then((res)=>{
        if (res.flag) {
          this.props.navigation.replace('Payroll',{securityCode:securityCode})
          this.setState({errorInfo: '',errorStatus:0,securityCode: ''})
        } else {
          this.setState({errorInfo: '验证码错误',errorStatus:1})
        } 
      })
      .catch((error)=>{
        console.log(error, 'error--PayrollLogin--100')
      })
    }
  }
  _onPress() {
    this.refs.InputText.blur();
  }
  render() {
    const {phone,errorStatus,errorInfo,loading,securityCode,sendCodeText,disabled} = this.state
    return (
      <TouchableOpacity  style={styles.payrolllogin}
      activeOpacity={1}
      onPress={this._onPress.bind(this)}>
        <View>
          <Text style={{fontSize: 24,color: '#000'}}>请先验证手机号</Text>
          <Text style={{fontSize: 14,marginTop: 18, color: '#353535'}}>{phone.substr(0, 3) + '****' + phone.substr(7)}</Text>
          <View style={styles.codewrap}>
            <View style={[styles.containerFormStyle,errorStatus== 1 ? styles.errorBorder: '']}>
              <TextInput placeholder="验证码" style={styles.fontInputSize} placeholderTextColor="#808080" autoFocus={true}
                maxLength ={4}
                onChangeText = {(securityCode)=>{
                  this.setState({securityCode})
                }}
                value={securityCode}
                keyboardType = 'numeric'
                ref="InputText"
              />

              {/* <TextInput placeholder="验证码" style={[styles.fontInputSize,this.state.errorStatus== 1 ? styles.errorBorder: styles.corrBorder]}/> */}
              <Button 
                titleStyle={{color: '#808080', fontSize: 14}}
                buttonStyle = {styles.sendCode}
                title={sendCodeText}
                onPress = {()=>{
                  this.sendCode()
                }}
                disabled = {disabled}
                disabledStyle = {styles.disabled}
              />
            </View>
            <Text style={styles.msgStyle}>{errorInfo}</Text>
            <Button 
            loading={loading} 
            buttonStyle={styles.entryButton} 
            title='进入'
            containerStyle={styles.containerEntryButton}
            onPress = {()=>{
                this.findSalary()
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  payrolllogin: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingLeft: 30,
    paddingRight: 30,
  },
  errorBorder: {
    borderBottomColor: 'red'
  },
  corrBorder: {
    borderBottomColor: '#e8e8e8' 
  },
  fontInputSize: {
    flex: 1,
    fontSize: 14,
    height: 36,
    color: '#808080'
  },
  codewrap: {
    width: '100%'
  },
  containerFormStyle: {
    marginTop: 18,
    flexDirection: 'row',
    marginLeft:0,
    marginRight:0,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    alignContent: 'center',
    paddingBottom: 10
  },
  sendCode: {
    width: 100,
    height: 36,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#e8e8e8',
    paddingTop: 0,
    paddingBottom: 0
  },
  inputStatus: {
    borderBottomWidth: 1,
    borderBottomColor:'#e8e8e8'
  },
  msgStyle: {
    marginLeft:0,
    marginRight:0,
    marginTop: 10,
    marginBottom: 26,
    color: 'red'
  },
  entryButton: {
    marginLeft: 0,
    paddingLeft: 0,
    justifyContent: 'center',
    height: 55,
    backgroundColor: '#4D66FD'
  },
  containerEntryButton: {
    marginLeft:0,
    marginRight:0,
    borderRadius: 5
  },
  disabled: {
    backgroundColor: 'transparent'
  }
});
