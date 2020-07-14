/**
 * home 首页
 */


import React, { Component } from 'react';
import { Platform, StyleSheet, SafeAreaView, Text, View, Dimensions, Image, TouchableOpacity, FlatList, Animated, BackHandler, DeviceEventEmitter } from 'react-native';
import SplashScreen from 'react-native-splash-screen'; // 启动页三方库
import Banner from '../../common/Banner';
import LoadMore from '../../common/LoadMoreFooter';
// import { createStackNavigator } from 'react-navigation';
const { width, height } = Dimensions.get('window');
import ajax from '../../config/Fetch';
import New from '../../common/New';
import CompanySystem from '../../common/CompanySystem';
import EmpCrad from '../../common/EmpCrad';
import PersistanceManger from '../../util/PersistanceManger';
import XGPushManager from '../../util/XGPushManager';
import HomeRanking from '../../common/HomeRanking';
import NavigatorUtil from '../../util/NavigationUtil';
import codePush from 'react-native-code-push';
// import Toast from 'react-native-root-tips'
import Toast from '../../common/Toast'

type Props = {};
// import { Icon } from 'react-native-elements';
let routes = [];
let lastBackPressed = null;
export default class Home extends Component<Props> {
  static navigationOptions = {
    title: 'Home'
  };
  constructor(props) {
    super(props);
    this.state = {
      bannerList: [],
      pageNum: 1,
      pageSize: 10,
      list: [],
      total: 0,
      isLoadAll: false,
      message: 0,
      refreshing: false,
      isBg: false,
      fadeAnim: new Animated.Value(0),
      colorAnim: 0,
      orderList: [{}, {}, {}],//订单排行
      receivedList: [{}, {}, {}],// 回款排行
      // rankingList: [{}, {}, {}],
      rankingTime: '',// 时间
      type: 1
    }
  }

  componentWillMount() {
    this._init();
    this.setState(
      { rankingTime: NavigatorUtil._findTime() }
    )
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      // this.listener = BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    let self = this
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.homePageNewDidFavorited, function (index) {
      if (index >= 0) {
        self.handleFavorited(index)
      }
    });

  }



  componentWillUnmount() {
    if (Platform.OS === 'android') {
      // this.listener.remove('hardwareBackPress');
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      lastBackPressed = null;
    }
    this.listener.remove();
  }
  handleBackPress = () => {
    if (routes.length === 1) { // 根界面
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      lastBackPressed = Date.now();
      Toast.showWarn('再点击一次退出应用');
      return true;
    }
  };
  
  _init() {
    this.setState({
      refreshing: true
    })

    ajax.get.call(this, 'banner', { size: 7 }).then(res => {
      console.log(res)
      this.setState({
        bannerList: res,
        refreshing: false
      })
    }).catch(err => {
      this.setState({
        refreshing: false
      })
    });
    // 请求订单排行榜单
    this.orderAjax()
    // 请求回款排行榜单
    this.receivedAjax()
    ajax.get.call(this, 'consult-list', { pageNum: 1, pageSize: 15 }).then(res => {
      this.setState({
        list: res.list,
        total: res.total,
        pageNum: 1,
        pageSize: 15,
        refreshing: false,
        isLoadAll: false
      })
    }).catch(err => {
      this.setState({
        refreshing: false
      })
    });

    if (!PersistanceManger.ShareInstance().isGuest) {
      ajax.get.call(this, 'unread-message-count', { empCode: PersistanceManger.ShareInstance().empCode }).then(res => {
        console.log("未读消息数",res)
        this.setState({
          message: res
        })
      }).catch(err => {
        this.setState({
          refreshing: false
        })
      });
    }
  }
  //请求地产订单排行榜 type：0为订单，type: 1为汇款
  orderAjax() {
    ajax.get.call(this, 'ranking', { startDate: NavigatorUtil._findFirstDayOfThisMonth(), endDate: NavigatorUtil._findToday(), type: '0' }).then(res => {
      this.setState({
        orderList: res.values,
        rankingList: res.values, // 暂时注释一下，感觉灭有用
      })
      // console.log(res.values,'请求地产订单排行榜')
    }).catch(err => {
      console.log(err, 'err')
      this.setState({
        refreshing: false
      })
    });
  }

  //请求地产回款排行榜
  receivedAjax() {
    ajax.get.call(this, 'ranking', { startDate: NavigatorUtil._findFirstDayOfThisMonth(), endDate: NavigatorUtil._findToday(), type: '1' }).then(res => {
      this.setState({
        receivedList: res.values
      })
      // console.log(res.values,'请求地产回款排行榜')
    }).catch(err => {
      this.setState({
        refreshing: false
      })
    });
  }

  //请求餐饮订单排行榜 type：0为订单，type: 1为回款
  cateringorderAjax() {
    ajax.get.call(this, 'catering-ranking', { startDate: NavigatorUtil._findFirstDayOfThisMonth(), endDate: NavigatorUtil._findToday(), type: '0' }).then(res => {
      this.setState({
        orderList: res.values
      })
      console.log(res.values, '请求餐饮订单排行榜')
    }).catch(err => {
      console.log(err, 'err')
      this.setState({
        refreshing: false
      })
    });
  }

  //请求餐饮回款排行榜
  cateringreceivedAjax() {
    ajax.get.call(this, 'catering-ranking', { startDate: NavigatorUtil._findFirstDayOfThisMonth(), endDate: NavigatorUtil._findToday(), type: '1' }).then(res => {
      this.setState({
        receivedList: res.values
      })
      // console.log(res.values,'请求餐饮回款排行榜')
    }).catch(err => {
      this.setState({
        refreshing: false
      })
    });
  }



  industryType(val) { // 请求地产排行or餐饮排行；地产：1 餐饮：2 ；orderAjax：订单排行；receivedAjax：回款排行
    console.log(val, 'val')
    if (val == 1) {
      this.orderAjax();
      this.receivedAjax();
    } else {
      this.cateringorderAjax();
      this.cateringreceivedAjax();
    }
    // // 请求餐饮排行榜
    //   ajax.get.call(this, 'catering-ranking', { startDate: NavigatorUtil._findFirstDayOfThisMonth(), endDate: NavigatorUtil._findToday(), type: '0' }).then(res => {
    //     this.setState({
    //       orderList: res.values,
    //     })
    //     console.log(res.values,'请求餐饮排行榜--订单')
    //   }).catch(err => {
    //     console.log(err,'err')
    //     this.setState({
    //       refreshing: false
    //     })
    //   });
  }

  _onPressItem(label, id, index = -1) {
    const { navigate } = this.props.navigation;
    navigate('DetailsPage', { label: label, id: id, index: index })
  }
  _onBannerClick(data) {
    this._onPressItem(data.label, data.id);
  }
  _renderItem = (item, index) => {
    const label = item.label;
    let component;
    if (label === 'NEWS' || label === 'RANKING') {
      component = <New data={item} likes={true} browse={true} />
    } else if (label === 'EMP') {
      component = <EmpCrad data={item} />
    } else if (label === 'SYSTEM') {
      component = <CompanySystem />
    } else if (label === 'NOTICE') {
      component = <New data={item} type={label} />
    }
    return <TouchableOpacity activeOpacity={1} onPress={() => this._onPressItem(label, item.id, index)}>
      {component}
    </TouchableOpacity>

  }
  _onEndReached = () => {
    const { list, pageNum, pageSize,
      total } = this.state;
    if (pageNum >= Math.ceil(total / pageSize)) {
      this.setState({
        isLoadAll: true
      });
      return;
    }
    ajax.get('consult-list', { pageNum: pageNum + 1, pageSize: 15 }).then(res => {
      this.setState({
        list: list.concat(res.list),
        pageNum: pageNum + 1
      })
    })
  }
  _ListFooterComponent = () => {
    // if (this.state.isLoadAll) return null;
    return (
      <LoadMore isLoadAll={this.state.isLoadAll} />
    );
  };

  // onMomentumScrollBegin(event) {
  //   let offsetY = event.nativeEvent.contentOffset.y
  //   let opacity = offsetY;
  //   if (this.state.isBg || opacity < 10) {
  //     return;
  //   }
  //   this.setState({
  //     isBg: true
  //   })
  // }
  // onMomentumScrollEnd(event) {
  //   let offsetY = event.nativeEvent.contentOffset.y
  //   let opacity = offsetY;
  //   if (opacity > 10) {
  //     return;
  //   }
  //   this.setState({
  //     isBg: false
  //   })
  // }
  _readMsg() {
    // if (this.state.message == 0) {
    //   this.props.navigation.navigate('MessageCenter');
    //   return;
    // }
    if (PersistanceManger.ShareInstance().isGuest) {
      Toast.showWarn('访客模式暂无法使用该功能')
      return;
    }
    let self = this;
    ajax.post('read-msg', { empCode: PersistanceManger.ShareInstance().empCode }).then(res => {
      // console.log(res)
      self.setState({
        message: 0
      })
    }).catch(error => {
      console.log(error, 'error')
    })

    self.props.navigation.navigate('MessageCenter');
  }

  _navigateClick(obj) {
    // console.log(obj);
    const { navigate } = this.props.navigation;
    // navigate('MyPage', obj)
    // navigate('EstateRankPage',  obj)
  }
  _keyExtractor = (item, index) => index.toString();


  //处理点赞计数
  handleFavorited(index) {
    const { list } = this.state
    list[index].favoriteCount += 1
    this.setState({
      list: list
    })
  }



  render() {
    const { navigate } = this.props.navigation;
    const { bannerList, list, isLoadAll, message, refreshing, isBg, rankingTime, receivedList, orderList, fadeAnim } = this.state;
    const obj = {
      itemId: 86,
      otherParam: '数据过来了',
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.headerContainer]}>
          <View style={[styles.header]}>
            <View style={styles.massage}>
              <TouchableOpacity onPress={this._readMsg.bind(this)}>
                <Image
                  style={{ width: 20, height: 24 }}
                  source={require('../../res/imgs/message.png')}
                ></Image>
                {message > 0 && <View style={styles.massageNum}>
                </View>}
              </TouchableOpacity>
            </View>
            <View style={styles.search}>
              <TouchableOpacity style={styles.searchClick} onPress={() => navigate('SearchPage', obj)}>
                <Image
                  style={{ width: 11, height: 11 }}
                  source={require('../../res/imgs/seach.png')}
                ></Image>

                <Text style={styles.searchText}>搜索通知、新闻</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.QRCode}>
              <TouchableOpacity onPress={() => {
                navigate('QRCodeScanPage')
              }
              }>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require('../../res/imgs/QRcode.png')}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          style={{ backgroundColor: '#f5f5f5' }}
          ListHeaderComponent={<View>
            <View style={styles.banner}>
              <Banner data={bannerList} onBannerClick={this._onBannerClick.bind(this)}></Banner>
            </View>
            <HomeRanking receivedList={receivedList} orderList={orderList} time={rankingTime} navigate={navigate} industryType={this.industryType.bind(this)}></HomeRanking>
          </View>}
          extraData={this.state}
          // onScroll={(event)=>{this.onScroll(event)}}
          // onMomentumScrollBegin={this.onMomentumScrollBegin.bind(this)}
          // onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
          onRefresh={this._init.bind(this)}
          ListFooterComponent={this._ListFooterComponent}
          data={list}
          onEndReachedThreshold={0.1}
          onEndReached={this._onEndReached}
          refreshing={refreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (this._renderItem(item, index))}>
        </FlatList>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  headerContainer: {
    height: 44,
    backgroundColor: '#fff',
    width: width,
    // shadowColor:'#999', 
    // shadowOffset:  {width: 2, height: 2},
    // shadowOpacity:  1,
    position: 'relative',
    zIndex: 999
  },
  header: {
    height: 33,
    width: width,
    // marginTop: 35,
    position: 'absolute',
    top: 5,
    left: 0,
    zIndex: 99,
    flex: 1,
    flexDirection: 'row-reverse'
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  banner: {
    position: 'relative',
    zIndex: -1
  },
  QRCode: {
    width: 50,
    // flex: 1,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center'
  },
  search: {
    flex: 5.5,
    height: 33,
    backgroundColor: '#f2f2f2',
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'row'
  },
  searchClick: {
    flex: 1,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  searchText: {
    fontSize: 12,
    paddingLeft: 10,
    color: '#808080'
  },
  massage: {
    // flex: 1,
    height: 33,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  massageNum: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: -7,
    right: -2,
    backgroundColor: '#F23030',
    borderRadius: 100
  }
});
