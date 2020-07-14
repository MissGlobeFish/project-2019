/**
 * ChargePage  钱包 -- 充值/提现
 */
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Dimensions, TextInput, DeviceEventEmitter, Alert } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import Toast from '../../common/Toast';
const { width, height } = Dimensions.get('window');

var WeChat = require('../../../nativeModules/react-native-wechat-master/index.js');

export default class ChargePage extends Component {

    static navigationOptions = ({ navigation }) => {
        let isCharge = navigation.getParam('isCharge')
        return {
            title: isCharge ? '充值' : '提现',
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            text: '',
            isCharge: this.props.navigation.getParam('isCharge'),
            hasOpenId: this.props.navigation.getParam('hasOpenId'),
            walletId: this.props.navigation.getParam('walletId')
        }
    }

    componentDidMount() {
        const { isCharge } = this.state
        if (!isCharge) {
            this.verifyOpenId()
        }

    }

    componentWillUnmount() {

    }


    render() {
        const { listDatas, text } = this.state
        const { navigate, getParam, hasOpenId } = this.props.navigation

        return (
            <View style={{ alignItems: 'center' }}>
                <View style={styles.controlPadStyle}>
                    <Text style={{ fontFamily: 'PingFangSC-Medium', fontSize: 18, color: '#323232' }}>
                        {getParam('isCharge') ? '余额充值' : '提现金额'}
                    </Text>
                    <View style={styles.ChargeInputBox}>
                        <Text style={{ fontFamily: 'ArialMT', fontSize: 34, color: '#323232' }}>
                            {'¥'}
                        </Text>
                        <TextInput
                            keyboardType='decimal-pad'
                            autoFocus={hasOpenId}
                            style={{ marginLeft: 16, height: 66, width: '90%', fontFamily: 'ArialMT', fontSize: 50, color: '#323232' }}
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text} />
                    </View>

                    <TouchableOpacity
                        style={[styles.submiuButtonStyle, text.length <= 0 ? styles.submiuDisabledStyle : {}]}
                        disabled={text.length <= 0}
                        onPress={() => {
                            getParam('isCharge') ? this.doCharge() : this.doEncash()
                        }}
                    >
                        <Image
                            style={{ width: 18, height: 18 }}
                            source={require('../../res/imgs/WechatPay.png')}
                        />
                        <Text style={{ fontFamily: 'PingFangSC-Medium', fontSize: 16, color: "#ffffff", marginLeft: 6 }}>
                            {getParam('isCharge') ? '微信充值' : '提现到微信零钱'}
                        </Text>
                    </TouchableOpacity>


                    {/* <Button
                        fontSize={18}
                        color="#ffffff"
                        backgroundColor='#C4EEC4' 
                        borderRadius={2}
                        title='微信充值'
                        
                        containerViewStyle={{ marginTop: 29}}
                        titleStyle={{ fontFamily: 'PingFangSC-Medium', fontSize: 14 , color: "#ffffff"}}
                        
                    /> */}

                </View>
            </View>
        );
    }



    /**
     *  充值
     */
    doCharge() {
        const { getParam, goBack } = this.props.navigation
        const { walletId } = this.state
        if (!walletId || walletId == "") {
            Toast.showFail("未能正确获取钱包 ID,尝试请重新进入钱包")
            return;
        }
        if (!this.verifyNumber()) {
            return
        }
        Toast.showLoading('加载中...', { mask: true })
        var reqObj = {
            "body": "充值",
            "totalFee": this.state.text,
            "empCode": PersistanceManger.ShareInstance().empCode,
            "walletId": walletId,
        }
        ajax.post('wx/unified-order', reqObj)
            .then((res) => {
                console.log('创建订单成功', res)
                Toast.hide()
                let payData = {
                    partnerId: res.partnerid,
                    prepayId: res.prepayid,
                    nonceStr: res.noncestr,
                    timeStamp: res.timestamp,
                    package: res.package,
                    sign: res.sign
                }
                return WeChat.pay(payData)
            }).then((res) => {
                //充值成功
                console.log(res)
                Toast.showSuccess('充值成功！')

                setTimeout(() => {
                    goBack()
                    DeviceEventEmitter.emit(global.NotificationIdentify.walletDataRefresh, true)
                }, 750);

            }).catch((e) => {
                if (e instanceof WeChat.WechatError) {
                    //支付错误 -2 取消支付
                    console.log(e.stack)
                    console.log(e.name)
                    console.log(e.code)
                } else {
                    //创建订单错误
                    console.log(e)
                    Toast.showFail("创建充值失败！")
                }
            })

    }

    /**
     * 提现
     */
    doEncash() {
        if (!this.verifyOpenId()) {
            return
        }
        if (!this.verifyNumber()) {
            return
        }
        const { walletId } = this.state
        const { getParam, goBack } = this.props.navigation
        Toast.showLoading('申请中...', { mask: true })
        let reqObj = {
            empCode: PersistanceManger.ShareInstance().empCode,
            id: walletId,
            transfers: this.state.text
        }
        console.log(reqObj)
        ajax.post('wx/transfers', reqObj)
            .then((res) => {
                if (res.code == '1') {
                    Toast.showSuccess(res.msg)
                    setTimeout(() => {
                        DeviceEventEmitter.emit(global.NotificationIdentify.walletDataRefresh, true)
                        goBack()
                    }, 750);
                } else {
                    Toast.showFail(res.msg)
                }
                console.log(res)
            }).catch((e) => {
                Toast.showFail("提现失败~")
            })

    }

    /**
     * 微信一次性订阅
     */
    weChatSubscribeMessage() {
        console.log("调起授权")
        //一次性授权
        WeChat.subscribeMessage(1, 'bKa1pUhcHHuzgshJSsuRTq9HzlisKFqMAWlvROcX_lw').then((res) => {
            console.log(res)
            if (res.openId) {
                console.log("获取 Openid 成功", res.openId)
                this.uploadUserOpenId(res.openId)
            } else {
                Toast.showFail("授权失败!")
            }
        }).catch((e) => {
            Toast.showFail("授权失败!")
            console.log(e)
            setTimeout(() => {
                this.props.navigate.goBack()
            }, 750);
        })

        // console.log(await WeChat)
        // WeChat.openWXApp()
        //登陆
        // WeChat.sendAuthRequest('snsapi_userinfo').then((res) => {
        //     console.log(res)
        // }).catch((e) => {
        //     console.log(e)
        // })
    }

    /**
     * 上传绑定 openId
     */
    uploadUserOpenId(openId) {
        var uploadObject = {
            id: this.state.walletId,
            wxOpenId: openId,
        }
        ajax.post('wallet/authorization-wechat', uploadObject)
            .then((res) => {
                if (res.code == '1') {
                    console.log("上传成功", res)
                    Toast.showSuccess("授权成功！")
                    this.setState({
                        hasOpenId: true
                    })
                } else {
                    Toast.showFail("绑定失败！")
                    console.log(res)
                }

            }).catch((e) => {
                Toast.showFail("绑定失败！")
                console.log(e)
            })
    }


    /**
     *
     * 验证 OpenId
     * @returns
     * @memberof ChargePage
     */
    verifyOpenId() {
        const { hasOpenId } = this.state
        if (!hasOpenId) {
            //无绑定 openId 信息
            //执行授权
            Alert.alert(
                '微信授权',
                '当前账户没有绑定任何微信账号，请先绑定微信账号。',
                [
                    {
                        text: '前往授权', onPress: () => {
                            this.weChatSubscribeMessage()
                        }
                    },
                    {
                        text: '取消', onPress: () => {
                            this.props.navigation.goBack()
                        }, style: 'cancel'
                    },
                ],
                { cancelable: false }
            )
            return false
        }
        return true
    }


    /**
     * 验证金额
     *
     * @returns
     * @memberof ChargePage
     */
    verifyNumber() {
        const { isCharge, text } = this.state
        let number = Number(text)
        if (isNaN(number)) {
            Toast.showFail("金额输入有误！")
            return false
        } else if ( number < 1 || number > 20000){
            Toast.showFail("金额须 >= 1元！")
            return false
        }
        return true
    }






}

const styles = StyleSheet.create({
    controlPadStyle: {
        top: 50,
        width: '91.5%',
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 26,
    },
    ChargeInputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#f3f3f3',
        borderBottomWidth: 1,
        marginTop: 21,
        minHeight: 66,
    },
    submiuButtonStyle: {
        marginTop: 29,
        width: '100%',
        height: 51,
        backgroundColor: '#6AD668',
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    submiuDisabledStyle: {
        opacity: 0.6
    }
});
