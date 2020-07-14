/**
* *  我的五观卡
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground, DeviceEventEmitter, Easing,Animated } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Carousel from 'react-native-snap-carousel';

var WeChat = require('../../../../nativeModules/react-native-wechat-master/index.js');
// const horizontalMargin = 20;
// const slideWidth = 280;
 
const sliderWidth = Dimensions.get('window').width;
const sliderHeight = Dimensions.get('window').height;
const sliderTrans = ( 1 - sliderWidth / sliderHeight) * 1.27
// const itemHeight = 200;
const itemWidth = width * sliderTrans;
const itemHeight = ((width * sliderTrans)*410)/270;

export default class  MyCardsPage extends Component {

   static navigationOptions = ({ navigation }) => {
    let shareFunction = navigation.getParam('shareFunction')
        return {
         title: '我的五观卡',
         headerBackTitle: null,
         headerRight:
         <View style={styles.headerRightBox}>
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
            mergeRankCount: 0,
            iscollectAllFive: '未集齐',
            askCardId: "", // 请求赐卡ID
            cardList: [
              {
                num: 0,
                type: "C",
                url: require('../../../res/FiveViewpointImgs/wuguan-lifebig.png')
              },
              {
                num: 0,
                type: "D",
                url: require('../../../res/FiveViewpointImgs/wuguan-renshengbig.png')
              },
              {
                num: 0,
                type: "E",
                url: require('../../../res/FiveViewpointImgs/wuguan-succeedbig.png')
              },
              {
                num: 0,
                type: "A",
                url: require('../../../res/FiveViewpointImgs/wuguan-kehubig.png')
              },
              {
                num: 0,
                type: "B",
                url: require('../../../res/FiveViewpointImgs/wuguan-workbig.png')
              }
            ],
            carouselCurrIndex: 0,
            fadeInOpacity: new Animated.Value(1),

            itemleft01: new Animated.Value(37.5), // （屏幕宽度一半/5 - 图片宽度的一半）
            itemtop01: new Animated.Value(0),

            itemleft02: new Animated.Value(0),
            itemtop02: new Animated.Value(20),

            itemleft03: new Animated.Value(75),
            itemtop03: new Animated.Value(20),

            itemleft04: new Animated.Value(10),
            itemtop04: new Animated.Value(60),
            itemleft05: new Animated.Value(65),
            itemtop05: new Animated.Value(60)
        }
    }
    // 渐渐消失动画
    fadeInOpacityAnimate() {
      Animated.timing(this.state.fadeInOpacity, {
        toValue:0, // 目标值
        duration: 600, // 动画时间
        easing: Easing.linear // 缓动函数
      }).start(()=>{
        this.mergeCardsRequest()
      });
    }

    // 左右合成动画
    leftAnimation() {
      var timing = Animated.timing;
      Animated.parallel(['itemleft01','itemleft02','itemleft03','itemleft04','itemleft05'].map(property => {
        return timing(this.state[property], {
        toValue: 37.5,
        duration: 600,
        easing: Easing.linear
        });
      })).start((()=>{
        console.log(13213)
      }))
    }
    // 上下合成动画
    topAnimation() {
      var timing = Animated.timing;
      Animated.parallel(['itemtop01','itemtop02','itemtop03','itemtop04','itemtop05'].map(property => {
        return timing(this.state[property], {
        toValue: 34.5,
        duration: 600,
        easing: Easing.linear
        });
      })).start((()=>{
        console.log(13213)
      }))
    }

   //Life Cycle
    componentWillMount() {
        this.getMyCards()
        this.getMessageList()
    }

    componentDidMount() {
        // 传递分享方法
        this.props.navigation.setParams({ shareFunction: this.shareBtnTapped.bind(this) })
    }

    componentWillUnmount() {

    }

   //SubRenders
   // 轮播subRender
   _renderItem =  ({item, index})=> {
     if (item.num>0) {
       return (
        <View style={styles.slide}>
          <Image source={item.url} style={styles.slideImg}></Image>
        </View>
       )
     } else {
       return (
         <View style={styles.slide}>
            <ImageBackground source={require('../../../res/FiveViewpointImgs/wuguan-bigcard.png')} style={styles.slideImg}>
              <TouchableOpacity onPress={()=>{this._requestGiveCard(item)}} style={styles.requestButton}>
                  <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-button.png')}></Image>
              </TouchableOpacity>
            </ImageBackground>
         </View>
       )
     }
      return (
          <View style={styles.slide}>
            {/* <Text style={{color: '#fff'}}>{item.num || "000000"}</Text> */}
              <Image source={item.url} style={styles.slideImg}></Image>
              
          </View>
      );
    }
    //Render
    render() {
        const { iscollectAllFive } = this.state;
        var loadModule = "";
        switch (iscollectAllFive) {
            case "未集齐":
                loadModule = this._collectCardsING();
                break;
            case "已集齐":
                loadModule = this._collectCardsED();
                break;
            default:
                loadModule = this._collectCardsING();
                break;
        }
        return (
            <View>
                { loadModule }
            </View>
        )
    }
    
    //未集卡&已集卡
    _collectCardsING() {
        const { mergeRankCount } = this.state;
        return (
            <View style={styles.cardPageBox}>
                <Image style={styles.cardPageImg} source={require('../../../res/FiveViewpointImgs/wuguan-bg.png')}></Image>
                <View style={styles.topBox}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-fenxianjin.png')}></Image>
                </View>
                <View style={styles.centerBox}>
                    <Text style={styles.centerText}>{ mergeRankCount }位同事已集齐，2月7日晚宴拆红包</Text>
                </View>
                <View style={styles.bottomBox}> 
                    <Image style={styles.bottomImg} source={require('../../../res/FiveViewpointImgs/wuguan-halfbg.png')}></Image>
                </View>
                
                {/* 轮播 */}
                <View style={styles.carousel}>
                <Carousel 
                    ref={(c) => { this._carousel = c; }}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={0.7}
                    firstItem={0}
                    removeClippedSubviews={false}
                    data={this.state.cardList}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    onSnapToItem={()=>{this._onSnapToItem()}}
                    />
                </View>
                {this._cardList()} 
            </View>
        )
    }
    
    //卡片列表
    _cardList() {
        const {carouselCurrIndex,cardList } = this.state;
        const nomalStyle = { opacity: .7 }
        const currentLightStyle= { opacity: 1 }        // 当前选中元素高亮
        return (
            <View style={styles.cardListBox}>
                <View style={styles.cardItemClick}>
                    <TouchableOpacity style={styles.cardItemBox} onPress={ () => { this._selectCard('C',0)} }>
                        { cardList[0].num > 0 ? 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 0 && currentLightStyle]} source={require('../../../res/FiveViewpointImgs/wuguan-lifesmall.png')}></Image> : 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 0 && currentLightStyle]} source={require('../../../res/FiveViewpointImgs/wuguan-weixuan01.png')}></Image>
                        }
                        { cardList[0].num > 0 ? <View style={styles.cardSignBox}><Text style={styles.cardSignBoxText}>{ cardList[0].num }</Text></View> : null }
                    </TouchableOpacity>
                    <Text style={[styles.cardItemText, carouselCurrIndex == 0 && currentLightStyle]}>生命观</Text>
                </View>
                <View style={styles.cardItemClick}>
                    <TouchableOpacity style={styles.cardItemBox} onPress={ () => { this._selectCard('D',1) }}>
                        { cardList[1].num > 0 ? 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 1 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-renshengsmall.png')}></Image> : 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 1 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-weixuan01.png')}></Image>
                        }
                        { cardList[1].num > 0 ? <View style={styles.cardSignBox}><Text style={styles.cardSignBoxText}>{ cardList[1].num }</Text></View> : null }
                    </TouchableOpacity>
                    <Text style={[styles.cardItemText, carouselCurrIndex == 1 && currentLightStyle]}>人生观</Text>
                </View>
                <View style={styles.cardItemClick}>
                    <TouchableOpacity style={styles.cardItemBox} onPress={ () => { this._selectCard('E',2) }}>
                        { cardList[2].num > 0 ? 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 2 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-succeedsmall.png')}></Image> : 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 2 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-weixuan01.png')}></Image>
                        }
                        { cardList[2].num > 0 ? <View style={styles.cardSignBox}><Text style={styles.cardSignBoxText}>{ cardList[2].num }</Text></View> : null }
                    </TouchableOpacity>
                    <Text style={[styles.cardItemText, carouselCurrIndex == 2 && currentLightStyle]}>成功观</Text>
                </View>
                <View style={styles.cardItemClick}>
                    <TouchableOpacity style={styles.cardItemBox} onPress={ () => { this._selectCard('A',3) }}>
                        { cardList[3].num > 0 ? 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 3 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-kehusmall.png')}></Image> : 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 3 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-weixuan01.png')}></Image>
                        }
                        {cardList[3].num > 0 ? <View style={styles.cardSignBox}><Text style={styles.cardSignBoxText}>{ cardList[3].num }</Text></View> : null }
                    </TouchableOpacity>
                    <Text style={[styles.cardItemText, carouselCurrIndex == 3 && currentLightStyle]}>客户观</Text>
                </View>
                <View style={styles.cardItemClick}>
                    <TouchableOpacity style={styles.cardItemBox} onPress={ () => { this._selectCard('B',4) }}>
                        { cardList[4].num > 0 ? 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 4 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-worksmall.png')}></Image> : 
                            <Image style={[styles.unifyImg, nomalStyle,carouselCurrIndex == 4 && currentLightStyle]}  source={require('../../../res/FiveViewpointImgs/wuguan-weixuan01.png')}></Image>
                        }
                        { cardList[4].num > 0 ? <View style={styles.cardSignBox}><Text style={styles.cardSignBoxText}>{ cardList[4].num }</Text></View> : null }
                    </TouchableOpacity>
                    <Text style={[styles.cardItemText, carouselCurrIndex == 4 && currentLightStyle]}>工作观</Text>
                </View>
            </View>
        )
    }
    
    //已集齐
    _collectCardsED() {
        return (
            <View style={styles.cardPageBox}>
                <Image style={styles.cardPageImg} source={require('../../../res/FiveViewpointImgs/wuguan-bg.png')}></Image>
                <View style={styles.topBox}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-jiqi.png')}></Image>
                </View>
                <View style={styles.centerBox}>
                    <Text style={styles.centerText}>速度杠杠的，快去合成吧</Text>
                </View>
                {this._compoundCards()}
                <TouchableOpacity style={styles.flauntBox} onPress={()=>{this.props.navigation.navigate('#')}}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-sharebutton.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    //卡片合成
    _compoundCards() {
        const { cardList } = this.state;
        const imgBoxStyle = {
          width: width*0.25,
          height: (width*0.25)*1.6
        }
        const compoundCardsBoxStyle = {
          height: width
        }
        console.log((width*0.25)*1.6)
        return (
            <Animated.View style={[styles.compoundCardsBox,compoundCardsBoxStyle]}>
                <TouchableOpacity style={[styles.compoundBox]} onPress={()=>{ this.mergeCards() }}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-hecheng.png')}></Image>
                </TouchableOpacity>
                <Animated.View style={[styles.lifeBox,styles.unifyCardsBox,imgBoxStyle,{
                  opacity: this.state.fadeInOpacity,
                  left: this.state.itemleft01.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  }),
                  top: this.state.itemtop01.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  })
                }]}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-lifesmall.png')}></Image>
                    <View style={styles.signBox}><Text style={styles.signBoxText}>{ cardList[0].num }</Text></View>
                </Animated.View>
                <Animated.View style={[styles.unifyCardsBox,styles.secondBoxLeft,imgBoxStyle,{
                  opacity: this.state.fadeInOpacity,
                   left: this.state.itemleft02.interpolate({
                      inputRange:[0,100],
                      outputRange:['0%','100%']
                    }),
                    top: this.state.itemtop02.interpolate({
                      inputRange:[0,100],
                      outputRange:['0%','100%']
                  })
                }]}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-renshengsmall.png')}></Image>
                    <View style={styles.secondSignBox}><Text style={styles.signBoxText}>{ cardList[1].num }</Text></View>
                </Animated.View>
                <Animated.View style={[styles.unifyCardsBox,styles.secondBoxRight,imgBoxStyle,{
                  opacity: this.state.fadeInOpacity,
                  left: this.state.itemleft03.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  }),
                  top: this.state.itemtop03.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  })
                }]}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-succeedsmall.png')}></Image>
                    <View style={styles.secondSignBox}><Text style={styles.signBoxText}>{ cardList[2].num }</Text></View>
                </Animated.View>
                <Animated.View style={[styles.unifyCardsBox,styles.thirdBoxLeft,imgBoxStyle,{
                  opacity: this.state.fadeInOpacity,
                  left: this.state.itemleft04.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  }),
                  top: this.state.itemtop04.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  })
                }]}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-kehusmall.png')}></Image>
                    <View style={styles.secondSignBox}><Text style={styles.signBoxText}>{ cardList[3].num }</Text></View>
                </Animated.View>
                <Animated.View style={[styles.unifyCardsBox,styles.thirdBoxRight,imgBoxStyle,{
                  opacity: this.state.fadeInOpacity,
                  left: this.state.itemleft05.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  }),
                  top: this.state.itemtop05.interpolate({
                    inputRange:[0,100],
                    outputRange:['0%','100%']
                  })
                }]}>
                    <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-worksmall.png')}></Image>
                    <View style={styles.secondSignBox}><Text style={styles.signBoxText}>{ cardList[4].num }</Text></View>
                </Animated.View>

                {/* <View style={[styles.secondBox]}>
                    <View style={[styles.unifyCardsBox]}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-renshengsmall.png')}></Image>
                        <View style={styles.secondSignBox}><Text style={styles.signBoxText}>{ cardList[1].num }</Text></View>
                    </View>
                    <View style={styles.unifyCardsBox}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-succeedsmall.png')}></Image>
                        <View style={styles.secondSignBox}><Text style={styles.signBoxText}>{ cardList[2].num }</Text></View>
                    </View>
                </View>
                <View style={[styles.thirdBox]}>
                    <View style={styles.unifyCardsBox}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-kehusmall.png')}></Image>
                        <View style={styles.thirdSignBox}><Text style={styles.signBoxText}>{ cardList[3].num }</Text></View>
                    </View>
                    <View style={styles.unifyCardsBox}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-worksmall.png')}></Image>
                        <View style={styles.thirdSignBox}><Text style={styles.signBoxText}>{ cardList[4].num }</Text></View>
                    </View>
                </View> */}
            </Animated.View>
        )
    }


 
    //NetWorks
    //获取我的五观卡
    getMyCards() {
        Toast.showLoading('加载中')
        ajax.get('getMyCardsData',{empCode: this.state.empCode}).then((res) => {
            Toast.hide()
            let collectFiveNum = 0;
            res.forEach(item => {
              this.state.cardList.find((value, index)=>{
                if (item.cardType == value.type ) {
                  if (item.num > 0) {
                    collectFiveNum++
                  }
                  this.state.cardList[index].num = item.num
                  this.state.cardList[index].cardId = item.cardId
                  console.log(item.cardId,"cardId")
                  this.setState({
                    cardList: this.state.cardList
                  })
                }
              })
            });
            console.log(collectFiveNum,'collectFiveNum')
            if (collectFiveNum == 5) {
                this.setState({
                    iscollectAllFive: '已集齐',
                })
            }else if(collectFiveNum > 0){
                this.setState({
                    iscollectAllFive: '未集齐',
                })
            }else{
                this.setState({
                    iscollectAllFive: '未集卡',
                })
            }
        }).catch((error) => {
            Toast.showFail(error.msg || "加载失败")
            this.props.navigation.goBack()
        })
    }

    mergeCards() {
      console.log("合成")
      this.leftAnimation();
      this.topAnimation();
      this.fadeInOpacityAnimate();
       
    }
    mergeCardsRequest() {
      console.log("合成")
      // MARK: 测试合成，未请求
      DeviceEventEmitter.emit(global.NotificationIdentify.fiveViewpointIndexRefresh, false)
      this.props.navigation.navigate('FiveViewpointIndex')
      // ajax.get('collectMergeMyCards',{empCode: this.state.empCode}).then(res=>{
      //   DeviceEventEmitter.emit(global.NotificationIdentify.fiveViewpointIndexRefresh, false)
      //     this.props.navigation.navigate('FiveViewpointIndex')
      // }).catch(error=>{
      //     console.log(error,'合成失败')
      // })
    }

    //获取合并卡片的人数
    getMessageList() {
        ajax.get('collectMergeRanking',{empCode: this.state.empCode}).then((res) => {
            console.log(res)
            this.setState({
                mergeRankCount: res.countNum
            })
        }).catch((error) => {
            //console.log(error)
        })
    }

    //UserFunction
    _selectCard(item, index) {
      console.log(item)
      this._carousel.snapToItem(index)
    }


    //  轮播回调
    _onSnapToItem() {
      // 当前滚动的index
      let currIndex = this._carousel.currentIndex;
      this.setState({
        carouselCurrIndex: currIndex 
      },()=>{
        console.log(currIndex, 'currIndex')
      })
    }
    _requestGiveCard(item) {
      console.log(item, '_requestGiveCard')
      this.setState({
        askCardId: item.cardId
      })
      this.props.navigation.navigate('HumanSearchPage', { callBack: this._didSelectHumen.bind(this)})
    }
    // 选择完成人员回调&& 请求赐卡
    _didSelectHumen(humenInfo) {
        console.log("搜索页面返回值", humenInfo.empCode)
        ajax.get("cardsAskFor",{giveEmpCode:  humenInfo.empCode,cardId: this.state.askCardId})
          .then(res=>{
            console.log(res)
            Toast.showSuccess("发送成功")
          })
          .catch(error=>{
            console.log(error)
            Toast.showFail("发送失败")

          })
    }

    // 分享按钮点击
    async shareBtnTapped() {
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
    

}

//Styles
const styles = StyleSheet.create({
    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
    },
    rightItem: {
        marginRight: 23,
    },
    rightImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    /* 公共style */
    unifyCardsBox: {
        flex: 1,
        position: 'absolute',
    },
    unifyImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'contain'
    },

    /* 未集齐 */
    cardPageBox: {
        width: width,
        height: '100%',
    },
    //背景图
    cardPageImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    
    //顶部标题背景图
    topBox: {
        width: '100%',
        height: '4%',
        position: 'absolute',
        top: '5%',
    },
    
    //集齐人数
    centerBox: {
        width: '100%',
        height: '2.3%',
        position: 'absolute',
        top: '11%',
    },
    centerText: {
        color: '#FFEDBD',
        textAlign: 'center',
        fontWeight:'900',
    },

    //底部半圆背景图
    bottomBox: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        bottom: 0,
    },
    bottomImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'stretch',
    },
    
    //可滑动卡片
    cardSlideBox: {
        width: '100%',
        height: '60%',
        position: 'absolute',
        top: '16%',
    },
    
    //请求赐卡
    // requestButton: {
    //     width: '100%',
    //     height: '12%',
    //     position: 'absolute',
    //     top: '68%',
    // },
    requestButton: {
      position: 'absolute',
      width: '52%',
      height: '12%',
      bottom: '18%'
    },
    
    //卡片列表
    cardListBox: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        top: '74%',
        left: 0,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
    },
    cardItemClick: {
        width: '20%',
        height: 100
        // height: '46%'
    },
    cardItemBox: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    cardItemText: {
        color: '#FFE1BE',
        textAlign: 'center',
        fontWeight:'900',
        opacity: 0.7
    },

    cardSignBox: {
        width: 20,
        height: 20,
        borderRadius: 15, 
        backgroundColor: '#FFE6C5', 
        position: 'absolute',
        top: 5,
        right: 5,
        // top: '4%',
        // left: '69%',
    },

    cardSignBoxText: {
      fontSize: 10,
      lineHeight: 20,
      textAlign: 'center',
      fontWeight:'900',
      color: '#E82C40',
    },

    
    /* 已集齐 */
    //合成
    compoundCardsBox: {
        width: '100%',
        height: '54%',
        position: 'absolute',
        top: '20%',
        flex: 1,
        alignItems:'center',
        justifyContent: 'center'
    },
    compoundBox: {
        width: '100%',
        height: '56%',
        position: 'absolute',
        top: '24%',
    },
    lifeBox: {
        // width: '100%',
        // width: 100,
        // height: '33%',
        position: 'absolute',
        top: 0,
        left: '40%'
        // backgroundColor: '#992211'
    },
    secondBox: {
        width: '114%',
        height: '34%',
        position: 'absolute',
        top: '20%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    thirdBox: {
        width: '80%',
        height: '33%',
        position: 'absolute',
        top: '70%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signBox: {
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 15,
        // fontSize: 10,
        // lineHeight: 20,
        // textAlign: 'center',
        // color: '#E82C40',
        backgroundColor: '#FFE6C5',
        position: 'absolute',
        top: '10%',
        right: '4%'
    },
    secondSignBox: {
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 15,
        // fontSize: 10,
        // lineHeight: 20,
        // textAlign: 'center',
        // color: '#E82C40',
        backgroundColor: '#FFE6C5',
        position: 'absolute',
        top: '10%',
        right: '4%'
    },
    thirdSignBox: {
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: '#FFE6C5',
        position: 'absolute',
        top: '10%',
        right: '4%'
    },
    signBoxText: {
      fontSize: 10,
      // lineHeight: 20,
      fontWeight:'900',
      textAlign: 'center',
      color: '#E82C40',
    },
    //晒卡按钮
    flauntBox: {
        width: '100%',
        height: '9%',
        position: 'absolute',
        bottom: '10%',
    },
    slide: {
      width: itemWidth,
      height: itemHeight,
      // backgroundColor: '#992211',
      borderRadius: 10
      // other styles for your item's container
    },
    carousel: {
      position: 'absolute',
      top: '16%'
    },
    slideImg: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center'
    },
    secondBoxLeft: {
      width: 100,
      height: '33%',
      left: 0,
      top: '20%'
    },
    secondBoxRight: {
      width: 100,
      height: '33%',
      right: 0,
      top: '20%'
    },
    thirdBoxLeft: {
      width: 100,
      height: '33%',
      left: '10%',
      bottom: 0
    },
    thirdBoxRight: {
      width: 100,
      height: '33%',
      right: '10%',
      bottom: 0
    },
})