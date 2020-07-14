/**
 * login 登陆
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Alert, DeviceEventEmitter } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import PersistanceManger from '../util/PersistanceManger';
import XGPushManager from '../util/XGPushManager'
import ajax from '../config/Fetch';
import Toast from '../common/Toast'

import '../config/GlobalContants';


export default class Login extends Component {
  static navigationOptions = {
    title: 'login',
  };

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      psw: '',
      errorInfo: '',
      loading: false,
    }
  }

  render() {
    // const { navigate } = this.props.navigation;
    const { userName, psw, errorInfo, loading } = this.state;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this.lostBlur.bind(this)}
      >
        <Text style={styles.titleLabel}>
          登录
        </Text>
        <View style={styles.inputBox}>
          <Input
            ref='userName'
            returnKeyType='next'
            onSubmitEditing={() => {
              this.refs.pswName.focus()
            }}
            containerStyle={styles.loginInputContent}
            inputStyle={styles.loginInput}
            placeholder="账号"
            autoCapitalize='none'
            value={userName}
            // underlineColorAndroid='#e8e8e8'
            onChangeText={(text) => this.setState({ userName: text })}
          />
          {
            userName.length > 0 && <Icon iconStyle={styles.clearIcon}
              name="cancel"
              size={20}
              onPress={() => this.setState({ userName: "" })}
              color="#8B8B8B" />
          }
        </View>
        <View style={styles.inputBox}>
          <Input
            ref='pswName'
            returnKeyType='go'
            onSubmitEditing={() => {
              this.loginTapped()
            }}
            containerStyle={styles.loginInputContent}
            inputStyle={styles.loginInput}
            placeholder="密码"
            secureTextEntry={true}
            autoCapitalize='none'
            value={psw}
            // underlineColorAndroid='#e8e8e8'
            onChangeText={(text) => this.setState({ psw: text })}
          />
          {
            psw.length > 0 && <Icon iconStyle={styles.clearIcon}
              name="cancel"
              size={20}
              onPress={() => this.setState({ psw: "" })}
              color="#8B8B8B" />
          }
        </View>
        <Text style={styles.errorInfoLab}>{errorInfo}</Text>
        <Button
          borderRadius={4}
          buttonStyle={styles.submitBtn}
          title={loading ? "" : "登录"}
          fontSize={16}
          onPress={this.loginTapped.bind(this)}
          loading={loading}
        />
        <Text
          style={styles.textBtn}
          onPress={this.forgetPsw.bind(this)}
        >
          不知道账号密码？
        </Text>
      </TouchableOpacity>
    );
  }


  lostBlur() {
    this.refs.userName.blur();
    this.refs.pswName.blur();
  }

  loginTapped() {
    const { userName, psw } = this.state
    this.refs.userName.blur();
    this.refs.pswName.blur();
    if (this.verifyFormData()) {
      this.setState({ loading: true })

      ajax.login(userName, psw)
        .then((res) => {
          this.setState({ loading: false })
          console.log(res)
          if (res.msg) {
            this.setState({ errorInfo: res.msg })
            this.refs.pswName.shake();
          } else {
            XGPushManager.bindXGAccount(res.empCode)
            DeviceEventEmitter.emit(global.NotificationIdentify.loginNotice, "login");
          }
        })
        .catch((e) => {
          this.setState({ loading: false })
          console.log(e)
          Toast.showFail("网络异常~。~")
        })

      // ajax.post('login', { userName: userName, password: psw, resource: "intranet" }).then((res) => {
      //   this.setState({ loading: false })
      //   console.log(res)
      //   if (res.msg) {
      //     this.setState({ errorInfo: res.msg })
      //     this.refs.pswName.shake();
      //   } else {
      //     //登陆成功
      //     PersistanceManger.ShareInstance().saveLoginInfos(userName, psw, res)
      //     XGPushManager.bindXGAccount(res.empCode)
      //     DeviceEventEmitter.emit(global.NotificationIdentify.loginNotice, "login");
      //     // console.log(PersistanceManger.ShareInstance())
      //   }
      // }).catch((e) => {
      //   this.setState({ loading: false })
      //   console.log(e)
      //   Toast.showFail("网络异常~。~")
      // })
    }
  }


  verifyFormData() {
    const { userName, psw, errorInfo } = this.state
    if (userName.length == 0 || psw.length == 0) {
      this.setState({
        errorInfo: "账号密码不可为空！"
      })
      this.refs.pswName.shake();
      return false
    }
    this.setState({
      errorInfo: ""
    })
    return true
  }

  // async loginTapped() {
  //   PersistanceManger.ShareInstance().userName = "Test_Name" //{"key": "Value"}
  //   var a = await PersistanceManger.ShareInstance().userName
  //   console.log(a)
  // }

  forgetPsw() {
    Alert.alert(
      '不知道账号密码？',
      '\n 1. 账号为公司邮箱前缀，\n 如杨林的公司邮箱为： yanglin@guoshengtianfeng.com \n 那么他的账号则为yanglin。\n \n 2. 密码默认为wxb123!@; \n \n 3. 有其它问题联系EP',
      [
        { text: '我知道了', onPress: () => 1 },
      ],
      { cancelable: false }
    )
  }

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleLabel: {
    marginTop: 120,
    marginLeft: 30,
    fontSize: 24,
    textAlign: 'left',
    color: "#353535"
  },
  inputBox: {
    // flex: 1,
    marginLeft: 0,
    marginRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    height: 55,
  },
  loginInputContent: {
    marginLeft: 30,
    marginRight: 0,
    height: 55,
    borderBottomColor: '#e8e8e8',
    flex: 0.9,
  },
  loginInput: {
    color: '#808080',
    width: '100%',
    height: '100%',
  },
  clearIcon: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5,
  },
  errorInfoLab: {
    marginLeft: 40,
    marginRight: 30,
    color: 'red'
  },
  submitBtn: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    height: 55,
    backgroundColor: '#4D66FD'
  },
  textBtn: {
    fontSize: 14,
    color: '#808080',
    marginTop: 30,
    textAlign: 'center',
  }
});
