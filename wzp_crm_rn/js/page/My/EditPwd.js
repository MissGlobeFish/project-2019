/**
 * Payroll  我的 -- 工资单
 */
import React, { Component } from 'react';
import { ScrollView,TouchableOpacity,Alert, StyleSheet, Text, View, KeyboardAvoidingView, FlatList, DatePickerIOS } from 'react-native';
import { Button } from 'react-native-elements';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import  FormList  from '../../common/FormList';
export default class EditPwd extends Component {
  static navigationOptions = {
    title: '修改密码',
  };
  constructor(props){
    super(props)
    this.state = {
      pwd: '',// 原始密码
      newPwd: '',
      replayPwd: '',
      errorStatus: 0,// 0代码正确，1代表错误
      errorStatusnew: 0,
      errorStatusreplay: 0,
      errorText: '',
      loading: false,
    }
  };
  checkIputValue() { //验证输入框输入内容
    const { pwd, newPwd, replayPwd} = this.state;
    let regVlaue = /[0-9]/;
    let regPwd = regVlaue.test(pwd);
    let regNewPwd = regVlaue.test(newPwd);
    let regRePwd = regVlaue.test(replayPwd);
    console.log(pwd ,newPwd ,replayPwd)
    console.log(regPwd ,regNewPwd ,regRePwd)
    if(!regPwd || !regNewPwd || !regRePwd) {
      this.setState({errorText: '请输入6-20位含数字密码'})
      if (!regPwd) {
        this.setState({
          errorStatus: 1,
        })
      }
      if (!regNewPwd) {
        this.setState({errorStatusnew:1})
      } 
      if (!regRePwd){
        this.setState({errorStatusreplay:1})
      }
    } else {
      let pwdObj = {
        userName: PersistanceManger.ShareInstance().loginName,
        empCode: PersistanceManger.ShareInstance().empCode,
        password: pwd,
        newPassword: newPwd,
        duplicateNewPassword: replayPwd
      }
      if (newPwd.length < 6 || newPwd.length > 20) {
        this.setState({
          errorStatusnew: 1,
          errorText: '请输入6-20位含数字密码'
        })
      } else if (newPwd != replayPwd) {
          this.setState({
            errorStatusnew: 1,
            errorStatusreplay: 1,
            errorText: '两次密码不一致'
          })
      }  else{
          console.log(pwdObj)
          this.setState({
            errorStatus: 0,
            errorStatusnew: 0,
            errorStatusreplay: 0,
            errorText: '',
            loading: true
          })
          this.editPwd(pwdObj) 
        }
    }
  }
  fnPwd(val){
    this.setState({
      pwd:val
    });
  }
  fnNewPwd(val){
    this.setState({
      newPwd:val
    });
  }
  fnRePwd(val){
    this.setState({
      replayPwd:val
    });
  }
  editPwd (pwdObj) { //修改密码请求
    const { goBack, getParam } = this.props.navigation;
    console.log(pwdObj)
    this.setState({loading: true})
    ajax.post('user',pwdObj).then((res)=>{
      console.info(res,'res')
      this.setState({loading: false})
      if (res.flag) {
        this.setState({
          loading: false
        })
        PersistanceManger.ShareInstance().psw = pwdObj.newPassword //把新密码存一下
        Alert.alert(
          '',
          '修改成功',
          [
            {text: '确定', onPress: () => goBack()},
          ],
          { cancelable: false }
        )            
      }
    })
    .catch(error => {
      this.setState({
        errorText: error.msg,
        loading: false
      })
      if (error.errorCode == 1002) {
        this.setState({
          errorStatus: 1,
          errorStatusnew: 1
        })
      } else {
        this.setState({
          errorStatus: 1
        })
      }

    }) 
  } 
  submitForm() { // 提交修改密码表单
    this.setState({
      errorStatus: 0,
      errorStatusnew: 0,
      errorStatusreplay: 0
    })
    this.checkIputValue()
  }
  render() {
    const FormBorderStyle = this.state.errorStatus== 1 ? styles.errorBorder: styles.corrBorder
    const FormBorderStyleNew = this.state.errorStatusnew== 1 ? styles.errorBorder: styles.corrBorder
    const FormBorderStylereplay = this.state.errorStatusreplay== 1 ? styles.errorBorder: styles.corrBorder
    
    return (
    <TouchableOpacity  style={styles.payrolllogin}
      activeOpacity={1}
      onPress={() => {
        this.refs.pwd.handleBlur();
        this.refs.newPwd.handleBlur();
        this.refs.replayPwd.handleBlur();
      }}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="0">
      {/* <ScrollView keyboardShouldPersistTaps={'handled'}> */}
      <View>
        <Text style={{fontSize: 24,color: '#000'}}>修改密码<Text style={{fontSize:14}}>(请输入6-20位含数字的密码)</Text></Text>
        <View style={[styles.codewrap,{height:180}]}>
          <FormList placeholder="请输入密码" secureTextEntry = {true} fn={this.fnPwd.bind(this)} FormBorderStyle={FormBorderStyle} ref="pwd" maxLength={20}/>
          <FormList placeholder="请输入新密码" secureTextEntry = {true} fn={this.fnNewPwd.bind(this)} FormBorderStyle={FormBorderStyleNew} ref="newPwd" maxLength={20}/>
          <FormList placeholder="再次输入新密码" secureTextEntry = {true} fn={this.fnRePwd.bind(this)} FormBorderStyle={FormBorderStylereplay} ref="replayPwd" maxLength={20}/>
        </View>
        <Text style={styles.containerFormStyle}>{this.state.errorText}</Text>
        <Button loading={this.state.loading} buttonStyle={styles.entryButton} title='确定' containerStyle={styles.containerFormStyle} titleStyle={{fontSize: 18}}
          onPress = {()=>{this.submitForm()}}
        />
      </View>
      {/* </ScrollView> */}
      </KeyboardAvoidingView>
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
    color: '#000'
  },
  errorBorder: {
    borderBottomColor: 'red'
  },
  corrBorder: {
    borderBottomColor: '#e8e8e8' 
  },
  codewrap: {
    marginTop: 10, 
    position: 'relative',
  },
  containerFormStyle: {
    marginLeft:0,
    marginRight:0,
    marginTop: 16,
    position: 'relative',
    height: 55,
    justifyContent: 'center',
    borderRadius: 5,
    color: 'red'
  },
  entryButton: {
    marginLeft: 0,
    paddingLeft: 0,
    justifyContent: 'center',
    height: 55,
    backgroundColor: '#4D66FD'
  }
});
