

/**
 * wallet 钱包首页
 */
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, TextInput, FlatList, DeviceEventEmitter } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import ModalPage from '../../common/ModalPage'
import ajax from '../../config/Fetch';
import PersistanceManger from '../../util/PersistanceManger';
import Toast from '../../common/Toast'

var WeChat = require('../../../nativeModules/react-native-wechat-master/index.js');


export default class WalletPage extends Component {

  static navigationOptions = ({ navigation }) => {
    let needOpenWallet = navigation.getParam('needOpenWallet')
    let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
    return {
      title: '钱包',
      headerBackTitle: null,
      headerRight: needOpenWallet ? null : (
        <TouchableOpacity style={{ marginRight: 23 }}
          onPress={rightNavigateBtnTapped}
        ><Text style={{ fontSize: 18 }}>明细</Text></TouchableOpacity>
      )

    };
  };


  constructor(props) {
    super(props)
    this.state = {
      isFirstEnter: false,
      amount: 0.0,
      walletId: '',
      hasOpenId: false
    }
  }


  componentWillMount() {
    const { setParams } = this.props.navigation;
    setParams({
      rightNavigateBtnTapped: () => {
        this.props.navigation.navigate('TransactionListPage', { id: this.state.walletId })
      }
    })

  }

  async componentDidMount() {
    this.loadWalletDatas()

    var self = this
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.walletDataRefresh, function (value) {
      self.loadWalletDatas()
    });

    //注册 WeChat 
    try {
      await WeChat.registerApp('wx2212611e5f51f71c');
      let Version = await WeChat.getApiVersion()
      // let wxAppInstallUrl = await WeChat.getWXAppInstallUrl()
      // let isWXAppSupportApi = await WeChat.isWXAppSupportApi()
      let isWXAppInstalled = await WeChat.isWXAppInstalled()
      console.log('Version:', Version)
      // console.log('wxAppInstallUrl:',wxAppInstallUrl)
      // console.log('isWXAppSupportApi:',isWXAppSupportApi)
      console.log('isWXAppInstalled:', isWXAppInstalled)
    } catch (e) {
      console.error(e);
    }
    console.log(WeChat);
  }

  componentWillUpdate(props, state) {
    const { getParam, setParams } = this.props.navigation;
    if (getParam('needOpenWallet') != state.isFirstEnter) {
      setParams({ needOpenWallet: state.isFirstEnter })
    }
  }

  componentWillUnmount() {
    this.listener.remove();
  }




  /**
   * 开启钱包弹窗内容
   *
   * @returns
   * @memberof WalletPage
   */
  ItemChild() { //弹框内容
    return (
      <View style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 32 }}>
        <Text style={[styles.fontSize16, { color: '#5e5e5e', lineHeight: 24 }]}>钱包功能使用过程中遇到的所有问题解释权归EP组</Text>
      </View>
    )
  }


  /**
   * 开启钱包
   *
   * @returns
   * @memberof WalletPage
   */
  openWalletComponent() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.containerView}>
        <View style={styles.preContainer}>
          <Image
            style={{ width: 177, height: 177, marginTop: 128 }}
            source={require('../../res/imgs/unWallet.png')}
          />
          <Text style={[styles.fontSize16, { marginTop: 12 }]}>你的钱包功能还未开启</Text>
        </View>
        <View style={{ marginTop: 100, width: '100%', alignItems: 'center' }}>
          <Button
            titleStyle={{fontSize: 18}}
            buttonStyle={styles.entryButton} 
            containerStyle={styles.btnWrap}
            title='开启钱包'
            onPress={() => {
              this.openWallet()
            }}
          />
          <View style={{ width: '80%', flexDirection: 'row', marginTop: 25 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                this.refs.walletDom.setModalVisible(true)
              }}
            >
              <Image
                style={{ width: 16, height: 16, alignItems: 'flex-start', justifyContent: 'flex-start' }}
                source={require('../../res/imgs/yixuanze.png')}
              />
              <Text style={{ fontSize: 14, marginLeft: 6 }}>钱包功能使用协议</Text>

            </TouchableOpacity>
          </View>
        </View>
        <ModalPage ref="walletDom" componentDom={this.ItemChild()} title="钱包功能使用协议" />
      </View>
    )
  }


  /**
   * 钱包首页主页面
   *
   * @memberof WalletPage
   */
  walletHomeComponent() {
    const { amount } = this.state
    return (
      <View style={styles.containerView}>
        <Image
          style={{ width: 90, height: 90, marginTop: 32 }}
          source={require('../../res/imgs/yuerIcon.png')}
        />
        <View style={{ marginTop: 32, marginBottom: 54, justifyContent: 'center', alignItems: 'center' }}>
          <Text>余额(元)</Text>
          <Text style={{ fontSize: 50, marginTop: 10 }}>{amount}</Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Button
            fontSize={18}
            titleStyle={{fontSize: 18}} 
            buttonStyle={styles.entryButton} 
            containerStyle={styles.btnWrap}
            title='充值'
            onPress={() => {
              this.buttonTapped(true)
            }}
          />
          <Button
            titleStyle={{fontSize: 18, color:"#000"}} 
            buttonStyle={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff', width: '100%', height: 50, marginBottom: 16, }} 
            containerStyle={styles.btnWrap}
            title='提现'
            onPress={() => {
              this.buttonTapped(false)
            }}
          />
        </View>
      </View>
    )
  }



  render() {
    return this.state.isFirstEnter ? this.openWalletComponent() : this.walletHomeComponent()
  }


  /**
   * 处理充值提现按钮点击
   * @param {Bool} isCharge 
   */
  buttonTapped(isCharge) {
    const { navigate } = this.props.navigation
    const { amount, walletId, hasOpenId } = this.state
    if (!walletId || this.state.walletId == '') {
      Toast.showFail("获取钱包 ID 信息错误，请刷新重试")
      return
    }
    navigate('ChargePage', {
      isCharge: isCharge,
      walletId: walletId,
      amount: amount,
      hasOpenId: hasOpenId
    })
  }


  /**
   * 开启钱包
   *
   * @memberof WalletPage
   */
  openWallet() {
    Toast.showLoading('开启中', { mask: true })
    var self = this
    console.log(PersistanceManger.ShareInstance().empCode)
    ajax.post('wallet/open', { empCode: PersistanceManger.ShareInstance().empCode }).then((res) => {
      Toast.showSuccess("成功开启")
      self.setState({
        isFirstEnter: false
      }, () => {
        self.loadWalletDatas()
      })
    }).catch((error) => {
      Toast.showFail("开启失败")
    })
  }

  /**
   * 加载钱包详情
   *
   * @memberof WalletPage
   */
  loadWalletDatas() {
    var self = this
    ajax.get('wallet', { empCode: PersistanceManger.ShareInstance().empCode })
      .then((res) => {
        console.log(res)
        if (res == "" || res.status == -1) {
          self.setState({
            isFirstEnter: true
          })
          return
        }
        self.setState({
          amount: res.amount,
          walletId: res.id,
          hasOpenId: res.hasWeChatOpenId
        })

      }).catch((error) => {
        Toast.showFail("加载信息失败~")
      })

  }

}






const styles = StyleSheet.create({
  fontSize16: {
    fontSize: 16
  },
  containerView: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    alignItems: 'center'
    // paddingLeft: 16,
    // paddingRight: 16
  },
  preContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnWrap: {
    width: '80%',
    borderRadius: 5
  },
  fontSize16: {
    fontSize: 16
  },
  entryButton: {
    width: '100%',
    height: 50,
    marginBottom: 16,
    backgroundColor: '#4D66FD'
  }
})
