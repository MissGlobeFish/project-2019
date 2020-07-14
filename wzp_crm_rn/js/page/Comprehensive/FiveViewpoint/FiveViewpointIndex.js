/**
* *  小宝集五观首页
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground, Vibration, DeviceEventEmitter, Animated, Easing } from 'react-native';
import { Badge } from 'react-native-elements'
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNShake from 'react-native-shake';
// import AnswerWrong  from "../FiveViewpoint/AnswerWrong";
import NoPrize  from "../FiveViewpoint/Components/NoPrize";
import FiveCard from "../FiveViewpoint/Components/FiveCard";
import OpenLottery from "../FiveViewpoint/Components/OpenLottery";
import Rules from "../FiveViewpoint/Components/Rules";
import FiveViewTip from "../FiveViewpoint/Components/FiveViewTip";
import NoTimes from "../FiveViewpoint/Components/NoTimes";
import DateTool from '../../../util/DateTool'

var WeChat = require('../../../../nativeModules/react-native-wechat-master/index.js');

var shakeTimesDictionary = undefined

export default class  FiveViewpointIndex extends Component {

   static navigationOptions = ({ navigation }) => {
       let messageNumber = navigation.getParam('messageNumber')
       let shareFunction = navigation.getParam('shareFunction')
       let isGame = navigation.getParam('isGame')
       
        return {
            title: '小宝集五观',
            headerBackTitle: null,
            headerRight:
            <View style={styles.headerRightBox}>
                {isGame &&  
                    <TouchableOpacity style={styles.rightItem} onPress={() => { navigation.navigate('DemandCardList') }}>
                      <Image style={styles.rightImg} source={require('../../../res/FiveViewpointImgs/tongzhi.png')}></Image>
                      {messageNumber > 0 ? <View style={{ position: 'absolute', top: -7, right: -5, width: 30}}><Badge value={messageNumber} status="error"  /></View> : null}
                      {/* <Text style={styles.rightText}>{messageNumber}</Text> */}
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.rightItem} onPress={() => { shareFunction() }}>
                    <Image style={styles.rightImg} source={require('../../../res/FiveViewpointImgs/share.png')}></Image>
                </TouchableOpacity>
            </View>
        }
   }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            isRedEnvelope: false,
            isGame: true,
            visible: false, // 摇一摇弹框
            visibleType: "",
            messageNumber: 0,//消息个数
            mergeRanking: 0,//合成排名
            // rulesVisible: false, // 规则弹窗
            // fiveViewTipVisible: false, // 五诀窍弹框
            fiveView: ["A","B","C","D","E"], // 五观 A: 客户观 B：工作观 C:生命观 D:人生观 E:成功观
            fiveCardType: {
              "NOTIMES": "", // 次数用光 false 为后端返回次数用完 true 为本地检测需要分享后才可得
              "FIVEVIEW": "", // 五观
              "CASH": "", // 现金
              "NONE": ""
            },
            fadeInOpacity: new Animated.Value(0) // 初始值
        }
    }

   //Life Cycle 在渲染前调用,在客户端也在服务端
    componentWillMount() {
        console.log('添加摇一摇监听')
        RNShake.addEventListener('ShakeEvent', () => {
            Vibration.vibrate()
            console.log("SHAKE!!! ", '是否是当前界面：',this.props.navigation.isFocused())
            if (this.props.navigation.isFocused()) {
                this.sharkItOff()
            }
          });
    }

    // 在第一次渲染后调用，只在客户端
    async componentDidMount() {
        this.getMessageList()
        this.handleInit()
        let self = this
        // 传递分享方法
        this.props.navigation.setParams({ shareFunction: this.shareBtnTapped.bind(this) })
        this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.fiveViewpointIndexRefresh, function (refresh) {
            self.handleInit()
        });
        // 获取当天摇一摇次数
        await PersistanceManger.ShareInstance().shakeTimesDictionary.then(res => {
            if (res == null || res == undefined ) {
                shakeTimesDictionary = {}
            } else {
                shakeTimesDictionary = res
            }
        })
    }

    // 在组件从 DOM 中移除之前立刻被调用
    componentWillUnmount() {
        this.listener.remove()
        RNShake.removeEventListener('ShakeEvent');
    }

    //SubRenders
    // 摇一摇弹框组件
    _shakeshowModal() {
      const { fiveCardType,visible } = this.state;
      if (this.state.visibleType != 'shake' ) return;
      console.log(fiveCardType, fiveCardType.NOTIMES, fiveCardType.NOTIMES !== "")
      if ( fiveCardType.NOTIMES != undefined && fiveCardType.NOTIMES !== "" ) {
        console.log("没有次数", fiveCardType.NOTIMES)
        return <NoTimes visible={visible} shareMoreTime={fiveCardType.NOTIMES}  fn={this._resetVisityType.bind(this)}></NoTimes>
      } else if (fiveCardType.FIVEVIEW) {
        console.log("五观", fiveCardType.FIVEVIEW)
        return <FiveCard  visible={visible} cardType={fiveCardType.FIVEVIEW} fn={this._collectChild.bind(this)}></FiveCard>
      } else if(fiveCardType.CASH){
        console.log("现金")
        return <OpenLottery value={fiveCardType.CASH} visible={visible} fn={this._collectChild.bind(this)}></OpenLottery>
      } else if (fiveCardType.NONE) {
        console.log("未中奖")
        return <NoPrize visible={visible} fn={this._resetVisityType.bind(this)}></NoPrize>
      }
    }
    // 页面其他弹框
    _otherShowModal() {
      const {visibleType} = this.state;
       if (visibleType == "rules") {
        return <Rules visible={visibleType == "rules"} fn={this._resetVisityType.bind(this)}></Rules>
      } else if (visibleType == "fiveviewtip") {
        return <FiveViewTip visible={visibleType == "fiveviewtip"} fn={this._resetVisityType.bind(this)}></FiveViewTip>
      }
    }
    //Render
    render() {
        const { isGame } = this.state;
        return (
            <View style={styles.pageIndex}>
                { isGame ? this._continueGame() : this._openRedEnvelope() }
            </View>
        )
    }

    //首页
    _continueGame() {
        return(
            <View style={styles.pageBox}>
              {this._shakeshowModal()}
              {this._otherShowModal()}
                <Image style={styles.pageBackgroundImg} source={require('../../../res/FiveViewpointImgs/bg.png')}></Image>
                <View style={styles.pageTitleBox}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wenzi.png')}></Image>
                </View>
                <TouchableOpacity style={styles.shakeBox} onPress={()=>{ this.sharkItOff() }}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/yaoyiyao.png')}></Image>
                </TouchableOpacity>
                <View style={styles.shakeTextBox}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/shengyucishu.png')}></Image>
                </View>
                {this._entranceButtons()}
                {this._footerButtons()}
            </View>
        )
    }
    
    //游戏入口按钮组
    _entranceButtons() {
        return (
            <View style={styles.entranceBox}>
                <TouchableOpacity style={styles.entranceItem} onPress={()=>{this.props.navigation.navigate('AnswerPrize')}}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/anniu3.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.entranceItem} onPress={()=>{this.props.navigation.navigate('MyCardsPage',{})}}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/anniu1.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.entranceItem} onPress={()=>{this.shareBtnTapped()}}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/anniu2.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }
    
    //规则排行榜按钮组
    _footerButtons() {
        return (
            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.footerItem} onPress={()=>{this.props.navigation.navigate('CardsRankingList')}}>
                    <Text style={styles.footerText}>集卡榜</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}> | </Text>
                <TouchableOpacity style={styles.footerItem} onPress={()=>{this.setState({visibleType: "fiveviewtip"})}}>
                    <Text style={styles.footerText}>五观小诀窍</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}> | </Text>
                <TouchableOpacity style={styles.footerItem} onPress={()=>{this.setState({visibleType: "rules"})}}>
                    <Text style={styles.footerText}>活动规则</Text>
                </TouchableOpacity>
            </View>
        )
    }

    //拆红包
    _openRedEnvelope() {
        const { isRedEnvelope, mergeRanking } = this.state;
        return (
            <ScrollView>
                <View style={styles.redEnvelopeBox}>
                    <Image style={styles.redEnvelopeImg} source={require('../../../res/FiveViewpointImgs/redPacket-bg.png')}></Image>
                    <View style={styles.noOpenBox}>
                        <Text style={styles.rank01Text}>第 { mergeRanking } 名</Text>
                        <View style={styles.rank02Text}><Text style={styles.rank02InnerText}>太厉害了，你是全公司第 { mergeRanking } 位合成的勇士！</Text></View>
                        <Text style={styles.openDateText}>坐等2月7日晚宴开红包</Text>
                    </View>
                    { isRedEnvelope ? this._redEnvelopeED() : null } 
                    <View style={styles.redPacketBottomBox}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/redPacket-bottom.png')}></Image>
                    </View>
                    { isRedEnvelope ? null : this._redEnvelopeButton() } 
                    <TouchableOpacity style={styles.flauntBox} onPress={()=>{ console.log('点击') }}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-sharebutton.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.lookOverBox} onPress={()=>{this.props.navigation.navigate('CardsRankingList')}}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/redPacket-lookOver.png')}></Image>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    
    //拆红包按钮
    _redEnvelopeButton() {
        return (
            <TouchableOpacity style={styles.openButtonBox} onPress={()=>{ this.redEnvelopeClick() }}>
                <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/redPacket-button.png')}></Image>
            </TouchableOpacity>
        )
    }

    //已拆红包
    _redEnvelopeED() {
        const { NumberPeople } = this.state;
        return (
            <Animated.View style={[styles.openBox,{opacity: this.state.fadeInOpacity}]}>
                <Text style={styles.openTitleText}>恭喜获得新年红包</Text>
                <View style={styles.moneyBox}>
                    <Text style={styles.moneyNumber}>88.88</Text>
                    <Text style={styles.moneyUnit}>元</Text>
                </View>
                <Text style={styles.inWalletText}>红包已放入钱包</Text>
            </Animated.View>
        )
    }

    //UserFunction
    //打开红包
    redEnvelopeClick(){
        this.setState({
            isRedEnvelope: true,
        })
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1, // 目标值
            duration: 1000, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
    }

    // 接受弹框子组件方法
    _resetVisityType() {
      this.setState({
        visibleType: "",
        fiveCardType: {
          "NOTIMES": "", // 次数用光
          "FIVEVIEW": "", // 五观
          "CASH": "", // 现金
          "NONE": ""
        }
      })
    }

    // 收下礼品
    _collectChild(e) {
      this._saveShake()
      this._resetVisityType()
    }

    // 摇一摇收下
    _saveShake(e) {
      ajax.post("collectCard")
        .then(res=>{
          console.log(res,"摇一摇收下")
        })
        .catch(error=>{
          console.log(error,"摇一摇收下失败")
        })
    }
    

    //NetWorks
    //摇一摇
    sharkItOff(){
      const {fiveView} = this.state;
      // 本地检测摇一摇次数
      let dateTool = new DateTool("-")
      let todayKey = dateTool.getToday()[0]
      var timesToday = shakeTimesDictionary[todayKey]
      timesToday = timesToday ?? 0
      console.log("当天次数", timesToday)
      if (timesToday == 5) {
        // 第六次需要分享后才可进行
        this.setState({
            visible: true,
            visibleType: "shake",
            fiveCardType: {'NOTIMES': true}
          })
        return
      }

        Toast.showLoading("领取中...")
        ajax.get('collectSharkItOff', { empCode: this.state.empCode })
        .then((res) => {
            // 记录次数
            shakeTimesDictionary[todayKey] = timesToday + 1
            PersistanceManger.ShareInstance().shakeTimesDictionary = shakeTimesDictionary

            Toast.hide()
            console.log('抽卡结果', res)
            this.setState({
              visible: true,
              visibleType: "shake"
            })
            // 是否为五观
            let isFiveView = fiveView.includes(res.cardType);
            if (isFiveView) {
              this.setState({
                fiveCardType: {'FIVEVIEW': res.cardType}
              })
            } else if(res.cardType == "F"){
              this.setState({
                visible: true,
                fiveCardType: {'CASH': res}
              })
            } else if (res.cardType == "G") {
              this.setState({
                visible: true,
                fiveCardType: {'NONE': res.cardType}
              })
            }
        })
        .catch(error => {
            Toast.hide()
            if (error.code == -1) {
                // 次数使用完
                this.setState({
                    visible: true,
                    visibleType: "shake",
                    fiveCardType: {'NOTIMES': false}
                  })
            } else {
                
            }
        })
    }

    // 分享按钮点击
    async shareBtnTapped() {
        // 记录已分享
        let dateTool = new DateTool("-")
        let todayKey = dateTool.getToday()[0]
        shakeTimesDictionary[todayKey] = -1
        PersistanceManger.ShareInstance().shakeTimesDictionary = shakeTimesDictionary

        try {
            await WeChat.registerApp('wx2212611e5f51f71c');
        } catch (e) {
            console.error('微信注册', e);
        }
        var shareData = {
            type: 'news',
            thumbImage: 'https://tx-free-imgs.acfun.cn/style/image/201907/w7wveo85wtCLlyZW2LYCGTc8j7yJvD0C.jpg',
            webpageUrl: 'wx2212611e5f51f71c://www.baidu.com',
            title: '测试标题',
            description: '测试内容'
        }
        WeChat.shareToSession(shareData).then((res) => {
            console.log("分享成功：", res )
        }).catch((e) => {
            console.log("分享失败", e)
        })
    }


    // 初始加载-活动是否正在进行
    handleInit = ()=> {
      Toast.showLoading("获取活动状态中...")
      ajax.get('collectActiveStatus',{empCode: this.state.empCode}).then(res=>{
        Toast.hide()
        console.log(res,'活动正在进行')
        this.setState({
            isGame: res
        })
        this.props.navigation.setParams({ isGame: res })
      }).catch(error=>{
        if (error.code == 3002) {
            // 已集齐，不继续游戏
            this.setState({
                isGame: false
            })
            this.getRankNumber()
        }
      })
    }

    //获取消息通知展示消息提示
    getMessageList() {
        ajax.get('myMessageList',{empCode: this.state.empCode}).then((res) => {
            console.log("消息数量获取", res)
            this.props.navigation.setParams({ messageNumber: res.length })
        }).catch((error) => {
            //console.log(error)
        })
    }
    
    //获取合并卡片后的排名
    getRankNumber() {
        ajax.get('collectMergeRanking',{empCode: this.state.empCode}).then((res) => {
            Toast.hide()
            this.setState({
                mergeRanking: res.myNum
            })
        }).catch((error) => {
            Toast.hide()
            //console.log(error)
        })
    }
    //UserFunction
    

}

//Styles
const styles = StyleSheet.create({
    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
    },
    rightItem: {
        marginRight: 15,
        width: 30,
        height: 30
    },
    rightImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    // rightText: {
    //     width: 18,
    //     height: 15,
    //     color: '#fff',
    //     textAlign: 'center',
    //     lineHeight: 15,
    //     fontSize: 10,
    //     fontWeight:'900',
    //     backgroundColor: '#E51516',
    //     borderRadius: 100,
    //     position: 'absolute',
    //     top: -5,
    //     right: -4,
    // },

    //公共style
    unifyImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'contain',
    },
    pageIndex: {
        width: '100%',
        height: '100%',
    },

    pageBox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#AC1323',
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
    },

    //背景图
    pageBackgroundImg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: -2,
    },
    pageTitleBox: {
        width: '95%',
        height: '82%',
    },

    //摇一摇图片
    shakeBox: {
        width: '100%',
        height: '36%',
        position: 'absolute',
        top: '27%',
    },

    //摇一摇机会次数
    shakeTextBox: {
        width: '100%',
        height: '5%',
        position: 'absolute',
        top: '62%',
    },
    chanceTextBox: {
        width: '100%',
        height: '2%',
        position: 'absolute',
        top: '65%',
    },
    chanceText: {
        fontSize: 10,
        color: '#FBD6A9',
        textAlign: 'center',
        fontWeight:'900',
    },
    
    //游戏入口按钮组
    entranceBox: {
        width: '90%',
        height: '18%',
        position: 'absolute',
        top: '70%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    entranceItem: {
        flex: 1,
        marginHorizontal: 3,
    },

    //规则排行榜按钮组
    footerButtons: {
        width: '50%',
        height: '16%',
        position: 'absolute',
        top: '90%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    footerText: {
        color: '#FBD6A9',
        fontWeight:'900',
        fontFamily: "PingFangSC-Regular",
    },

    //晒卡按钮
    flauntBox: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        bottom: '20%',
    },
    //查看集卡榜
    lookOverBox: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        bottom: '10%',       
    },

    /* 拆红包 */
    redEnvelopeBox: {
        width: width,
        height: width/750 * 1448,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    redEnvelopeImg: {
        width: '100%',
        height: '100%',
    },
    redPacketBottomBox: {
        width: width * 0.6333,
        height: width * 0.6333 * (268 / 476),
        position: 'absolute',
        top: 632.5 * width/750 ,
    },
    noOpenBox: {
        width: '100%',
        height: '35%',
        position: 'absolute',
        top: '11%',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    openButtonBox: {
        width: '100%',
        height: '18%',
        position: 'absolute',
        top: '38%',
    },
    rank01Text: {
        fontSize: 28,
        color: '#FBE5C0',
    },
    rank02Text: {
        borderRadius: 15,
        backgroundColor: '#DD322A',
        paddingVertical: '1%',
        paddingHorizontal: '2%',
        marginVertical: '2.5%',
    },
    rank02InnerText: {
        fontSize: 10,
        color: '#FDB38B',
    },
    openDateText: {
        fontSize: 16,
        color: '#FFB36E',
    },
    openBox: {
        width: '54%',
        height: '32%',
        borderRadius: 5,
        position: 'absolute',
        top: '22%',
        flex:1,
        alignItems:'center',
        backgroundColor: '#FFFFFF',
    },
    openTitleText: {
        color: '#FE5A57',
        fontSize: 15,
        marginTop: '13%',
    },
    moneyBox: {
        width: '80%',
        marginTop: '8%',
        marginBottom: '2%',
    },
    moneyNumber: {
        width: '100%',
        color: '#FC575A',
        fontSize: 48,
        textAlign: 'center',
        fontWeight:'bold'
    },
    moneyUnit: {
        position: 'absolute',
        bottom: '8%',
        right: -6,
        color: '#DD3F24',
        fontSize: 16,
        fontWeight:'900',
    },
    inWalletText: {
        color: '#FC575A',
        fontSize: 12,
        fontWeight:'900',
        marginTop: 10
    },
})