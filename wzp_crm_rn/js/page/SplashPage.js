/**
 *  SplashPage 起始页
 */
import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AppNavigation from '../navigations/AppNavigation';
import LoginPage from './LoginPage';
import SplashScreen from 'react-native-splash-screen'; // 启动页三方库
import PersistanceManger from '../util/PersistanceManger';
import XGPushManager from '../util/XGPushManager'
import '../config/GlobalContants';
import NavigationService from '../navigations/NavigationService';

export default class SplashPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }

  componentDidMount() {
    PersistanceManger.ShareInstance().loadLocalDatas().then((value) => {
      var islogin = PersistanceManger.ShareInstance().isLogin
      if (islogin) {
        XGPushManager.bindXGAccount(PersistanceManger.ShareInstance().empCode)
      }
      this.setState({ isLogin: islogin }, () => {
        SplashScreen.hide(); // 关闭启动页
        console.log("Go ~~")
      })
    })

    var self = this
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.loginNotice, function (value) {
      if (value === "login") {
        self.setState({ isLogin: true })
        PersistanceManger.ShareInstance().isLogin = true
      } else if (value === "logout") {
        self.setState({ isLogin: false })
        XGPushManager.bindXGAccount("")
        PersistanceManger.ShareInstance().deleteAllDatas()
        PersistanceManger.ShareInstance().isLogin = false
      }
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    if (this.state.isLogin) {
      return <AppNavigation
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    }
    return <LoginPage />
  }
}