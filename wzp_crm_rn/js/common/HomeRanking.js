/**
 * HomeRanking 首页排行
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import NavigatorUtil from '../util/NavigationUtil';
import FastImage from 'react-native-fast-image'



export default class HomeRanking extends Component {
  static propTypes = {
    time: PropTypes.string,
    receivedList: PropTypes.any,
    orderList: PropTypes.any,
    typeClick: PropTypes.func,
    navigate: PropTypes.func,
    // children: PropTypes.any
  }
  static defaultProps = {
    time: '2018.10.01-2018.10.16',
    orderList: [{}, {}, {}],
    receivedList: [{}, {}, {}]
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [{}, {}, {}],
      type: 1,// 订单、回款
      industryType: 1 // 餐饮、地产
      // title: '',
      // type: '',
      // hide: false
    }
  }
  typeClick(index) {
    // console.log(index,'index')
    this.setState({
      type: index
    })
  }
  // 选择切换查看餐饮或者地产排行榜
  industryType(changeType) {
    if (changeType==1) { // 地产是1.餐饮是2
      this.setState({
        industryType: 2,
        type: 1 // 当切换餐饮和地产时，都让他先请求订单的数据。
      },()=>{
        this.props.industryType(this.state.industryType)
      })
    } else if (changeType==2) {
      this.setState({
        industryType: 1,
        type: 1,
      },()=>{
        this.props.industryType(this.state.industryType)
      })
    } else {
      return
    }
  }
  render() {
    const { time, orderList, receivedList} = this.props;
    const { data, type,industryType } = this.state;
    let imgUrl;
    if (type == 1) {
      imgUrl = orderList
    } else if (type == 2) {
      imgUrl = receivedList
    } else {
      return
    }
    return (
      <View style={[styles.container]}>
          <View style={styles.containerBox}>
            <View style={{paddingTop:12,flexDirection: 'row',justifyContent:'space-between'}}>
              <Text>{industryType==1 ? '地产排行榜':'餐饮排行榜'}</Text>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>{this.industryType(industryType)}}>
                <Image source={require('../res/imgs/change-icon.png')} style={{width: 10,height: 10,marginTop:2,marginRight:2}}></Image> 
                <Text>{industryType==1 ? '餐饮':'地产'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabs}>
              <View style={styles.tabBox}>
                <TouchableOpacity onPress={this.typeClick.bind(this, 1)}>
                    <Text style={[styles.tab, type === 1 && styles.active]}>订单</Text>
                    <View style={[styles.tabBoxBoder,type === 1 ? {borderBottomColor:'#4D66FD'} : {borderBottomColor:'transparent'}]}></View>  
                </TouchableOpacity>
              </View>
              <View style={styles.tabBox}>
                <TouchableOpacity onPress={this.typeClick.bind(this, 2)}>
                  {/* <ImageBackground source={type === 2 ? require('../res/imgs/rankings_select.png') : require('../res/imgs/rankings_select_on.png')} style={{ width: '100%', height: '100%' }}> */}
                    <Text style={[styles.tab, type === 2 && styles.active]}>回款</Text>
                    <View style={[styles.tabBoxBoder,type === 2 ? {borderBottomColor:'#4D66FD'} : {borderBottomColor:'transparent'}]}></View>  
                  {/* </ImageBackground > */}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.content}>
                <View style={styles.contentBox}>
                    <View style={styles.userBox}>
                      <Image 
                      source={require('../res/imgs/rank2.png')} style={{width: 29,height: 18}}></Image> 
                      <FastImage
                      source={imgUrl[1]?.photo ? {uri:imgUrl[1].photo}: require('../res/imgs/user01.png')} style={styles.img}/>
                      <Text style={styles.rankingText}>亚军</Text>
                      <Text style={styles.userText}>{(type === 1 ? orderList[1]?.empName : receivedList[1]?.empName) ?? "虚位以待"}</Text>
                    </View>
                    <View style={styles.userBox}>
                      <Image source={require('../res/imgs/rank1.png')} style={{width: 29,height: 18}}></Image>
                      {/* <FastImage 
                      defaultSource={require('../res/imgs/user01.png')}
                      source={
                        {
                        uri:type === 1 ? orderList[0]?.photo : receivedList[0]?.photo
                        }}  style={{width: 60,height: 60,borderRadius:30}}/> */}
                      
                      <FastImage 
                      defaultSource={require('../res/imgs/user01.png')}
                      source={imgUrl[0]?.photo ? {uri:imgUrl[0].photo}: require('../res/imgs/user01.png')}  style={{width: 60,height: 60,borderRadius:30}}/>
                      <Text style={styles.rankingText}>冠军</Text>
                      <Text style={styles.userText}>{(type === 1 ? orderList[0]?.empName : receivedList[0]?.empName) ?? "虚位以待"}</Text>
                    </View>
                    <View style={styles.userBox}>
                      <Image source={require('../res/imgs/rank3.png')} style={{width: 29,height: 18}}></Image>
                      <FastImage
                      source={imgUrl[2]?.photo ? {uri:imgUrl[2].photo}: require('../res/imgs/user01.png')} style={styles.img}/>
                      <Text style={styles.rankingText}>季军</Text>
                      <Text style={styles.userText}>{(type === 1 ? orderList[2]?.empName : receivedList[2]?.empName) ?? "虚位以待"}</Text>
                    </View>
                </View>
            </View>
            {/*老版本排行版*/}
          </View>
  

      </View >
    )
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 230,
    // padding: 15,
    marginTop: 10,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    marginTop: 12,
    marginBottom: 2
  },
  time: {
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
    marginTop: 2,
  },
  tabBox: {
    width: 50,
    height: 50,
    justifyContent:'center',
    alignContent:'center'
    // marginLeft: 2.5,
    // marginRight: 2.5
  },
  tab: {
    color: '#808080', 
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 18, // 解决头部被削
    // marginTop: 7
  },
  tabs: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 8
  },
  tabBoxBoder: {
    borderBottomWidth: 3,
    width: 20, 
    alignSelf:'center',
    paddingTop: 10
  },
  containerBox: {
    // flex: 1,
    paddingLeft: 12.5,
    paddingRight: 12.5,
    flexDirection: 'column',
  },
  active: {
    color: '#000'
  },
  content: {
    width: '100%',
    height: 130,
    backgroundColor: '#FFF',
    borderRadius: 10,
    // backgroundColor:'#808080'
    // marginLeft: 12.5,
    // marginRight: 12.5
  },
  contentBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end'
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  userBox: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',

    alignItems: 'center'
  },
  rankingText: {
    color:'#E29732',
    lineHeight: 24
  },
  userText: {
    color: '#323232',
    fontSize: 14,
    // marginTop: 4
  },
  footer: {
    height: 35,
    marginTop: 10,
    flexDirection: 'row',
  },
  footerBox: {
    height: 35,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#0671FE',
    alignItems: 'center'
  },
  footerBoxNext: {
    backgroundColor: '#FB795E',
  },
  footerText: {
    fontSize: 14,
    color: '#fff'
  }
})