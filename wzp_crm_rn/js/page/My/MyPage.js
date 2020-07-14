/**
 * my 我的
 */

// import Expo from 'expo';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  DeviceEventEmitter,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';

import MyInfoListCell from '../../common/MyInfoListCell';
import '../../config/GlobalContants';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import Toast from '../../common/Toast'
import FastImage from 'react-native-fast-image'

export default class My extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infoListData: PersistanceManger.ShareInstance().isGuest ?
        [
          // { title: '钱包', icon: require('../../res/imgs/My_wallet.png'), pageIdentify: "WalletPage" },
          // { title: '人像采集', icon: require('../../res/imgs/My_portrait.png'), pageIdentify: "PortraitCollectPage" }
        ]
        :
        [
          { title: '钱包', icon: require('../../res/imgs/My_wallet.png'), pageIdentify: "WalletPage" },
          { title: '工资单', icon: require('../../res/imgs/My_pay.png'), pageIdentify: "PayrollLogin" },
          { title: '个人信息', icon: require('../../res/imgs/My_Info.png'), pageIdentify: "MyInfo" },
          { title: '修改密码', icon: require('../../res/imgs/My_Pwd.png'), pageIdentify: "EditPwd" },
          // { title: '人像采集', icon: require('../../res/imgs/My_portrait.png'), pageIdentify: "PortraitCollectPage" }
        ],
      avatarSource: require('../../res/imgs/defaultAvatar.png'),
      empName: "...",
      jobDesc: "..."
    }
  }
  componentWillMount() {
    var name = PersistanceManger.ShareInstance().userName
    var photo = PersistanceManger.ShareInstance().photo
    var jobDesc = PersistanceManger.ShareInstance().jobDesc
    this.setState({
      avatarSource: (photo && photo != "") ? { uri: photo } : require('../../res/imgs/defaultAvatar.png'),
      empName: name ? name : "...",
      jobDesc: jobDesc ? jobDesc : "..."
    })
    this.loadUsrInfo()
  }

  componentDidMount() {
    var self = this
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.userInfoUpdate, function (value) {
      self.setState({
        avatarSource: (value.photo && value.photo != "") ? { uri: value.photo } : require('../../res/imgs/defaultAvatar.png'),
        empName: value.empName,
        jobDesc: value.jobDesc
      })
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  // MyInfoCard
  renderHeader() {
    const { jobDesc, empName, avatarSource } = this.state
    return (
      <View style={styles.myInfoCard}>
        {/* <Avatar
          large
          source={avatarSource}
          onPress={() => console.log("Avatar!")}
          activeOpacity={0.7}
        /> */}
        <TouchableOpacity
          onPress={() => console.log("Avatar!")}
          activeOpacity={0.7}
        >
          <FastImage
            style={{ width: 75, height: 75 }}
            source={avatarSource}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>

        <View style={styles.infoLabBox}>
          <Text style={styles.nameLabel}>
            {empName}
          </Text>
          <Text style={styles.positionLabel}>
            {jobDesc}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const { navigate } = this.props.navigation;
    let infoIterms = this.state.infoListData.map((info, index) => {
      return <MyInfoListCell
        title={info.title}
        icon={info.icon}
        key={info.title}
        onPress={() => { this.selectIterms(index) }}
      />
    });

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ backgroundColor: '#f5f5f5', flex: 1 }}>
          {this.renderHeader()}
          <View style={styles.infoCellBox}>
            {infoIterms}
          </View>
          {/* 这里用于测试 */}
          <Button
            fontSize={18}
            buttonStyle={styles.entryButton}
            containerStyle={{borderRadius: 5}}
            title='退出登录'
            onPress={() => {
              DeviceEventEmitter.emit(global.NotificationIdentify.loginNotice, "logout");
            }}
          />
          <Text style={{ bottom: 0, width: '100%', textAlign: 'center', fontSize: 12, color: 'gray' }}>
            {"Copyright © 2014 - 2020 \n 成都旺小宝科技有限公司"}
          </Text>
          {/* <Button loading={false} backgroundColor='#4D66FD' borderRadius={5} buttonStyle={styles.entryButton} title='确认' containerViewStyle={styles.containerFormStyle} 
            loading = {this.state.loading}
            onPress = {()=>{this.submitForm()}}
        /> */}
        </View>
      </SafeAreaView>
    );
  }


  //加载用户信息
  loadUsrInfo() {
    ajax.getOther('user', PersistanceManger.ShareInstance().empCode).then((res) => {
      PersistanceManger.ShareInstance().saveUserInfo(res)
      DeviceEventEmitter.emit(global.NotificationIdentify.userInfoUpdate, res);
    }).catch((e) => { console.log(e) })
  }

  //点击进入不同界面
  selectIterms(index) {

    pageIdentify = this.state.infoListData[index].pageIdentify

    this.props.navigation.navigate(pageIdentify)

  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  myInfoCard: {
    // marginTop: 20,
    backgroundColor: '#ffffff',
    paddingBottom: 19,
    paddingLeft: 15,
    paddingTop: 14,
    flexDirection: 'row',
  },
  infoLabBox: {
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 9,
  },
  nameLabel: {
    fontSize: 20,
    color: '#353535',
    lineHeight: 24,
  },
  positionLabel: {
    fontSize: 14,
    color: '#808080',
    lineHeight: 24,
  },
  infoCellBox: {
    marginTop: 15,
    backgroundColor: '#f5f5f5',
  },
  entryButton: {
    marginLeft: 15,
    paddingLeft: 0,
    height: 55,
    margin: 20,
    backgroundColor: '#4D66FD'
  }
});

