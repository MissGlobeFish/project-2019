/**
 * SearchCard 新闻列表
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import NavigatorUtil from '../util/NavigationUtil';

// const NAV_BAR_HEIGHT_ANDROID = 50;
// const NAV_BAR_HEIGHT_IOS = 44;
// const STATUS_BAR_HEIGHT = 20;

export default class SearchCard extends Component {
  static propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    imgUrl: PropTypes.string,
    likes: PropTypes.bool,
    browse: PropTypes.bool,
    search: PropTypes.string,
    data: PropTypes.object
    // children: PropTypes.any
  }
  static defaultProps = {
    title: '',
    data: {}
  }
  constructor(props) {
    super(props);
    this.state = {
      // title: '',
      // type: '',
      // hide: false
    }
  }
  render() {
    const { type, title, children, date, department, search, likes, data, browse} = this.props;
    return (
      <View style={[styles.container, !!!likes && styles.containerNotice]}>
        <View style={styles.content}>
          <View style={styles.topBox}>
            <View style={styles.textBox}>

              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail" >
                {
                  type === 'NOTICE' && <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                }
                <Text>{NavigatorUtil._findTitle(data.title, search)}</Text>
              </Text>
                {
                type === 'NOTICE' && <View style={styles.noticeBox}>
                <Text style={styles.notice}>通知</Text> 
                </View>
                } 
            </View>
            <View>
              {
                data.thumbnail ? <Image style={styles.image} source={{ uri: data.thumbnail }}></Image> : data.subList && data.subList.length > 0 ? <Image style={styles.image}
                  source={{ uri: data.subList[0].image }}
                ></Image> : <Image style={styles.image} ></Image>
              }
            </View>
          </View>
          <View style={likes ? styles.bottomBox : styles.bottomBoxNotice}>
            <View style={[styles.leftBox]}>

              <Text style={[styles.text]}>{NavigatorUtil._formatDate(data.createdTime)}</Text>
              <Text style={[styles.text, { paddingLeft: 20 }]}>{data.deptName}</Text>
            </View>
            <View style={{flex:1,flexDirection: 'row',justifyContent:'flex-end'}}>
            {/* 浏览量 */}
             {browse && <View style={{flexDirection: 'row',width: 45,alignItems: 'flex-end'}}>
                <Image resizeMode="contain"
                  style={{ width: 20, height: 16, marginRight: 4 }} source={require('../res/imgs/look.png')}></Image>
                <Text style={[styles.text]}>{data.browseCount}</Text>
              </View>}
              {/* 点赞 */}
              {
                likes && <View style={{flexDirection: 'row', width: 45,alignItems: 'center'}}><Image resizeMode="contain"
                style={{ width: 16, height: 12, marginRight: 4 }} source={require('../res/imgs/laud.png')}></Image><Text style={[styles.text]}>{data.favoriteCount || 0}</Text></View>
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 125,
    padding: 15,
    borderBottomWidth: 0.5,
    // paddingBottom: 5,
    borderBottomColor: '#E8E8E8',
  },
  containerNotice: {
    height: 105,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  topBox: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
  },
  bottomBox: {
    // flex: 1,
    flexDirection: 'row',
    //  flex: 1,
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noticeBox: {
    paddingTop: 1,
    paddingBottom: 1,
    position: "absolute",
    left: 0,
    borderRadius: 2,
    backgroundColor: '#4D66FD',
    // top: 1
  },
  notice: {
    width: 32,
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomBoxNotice: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'space-between'
  },
  leftBox: {
    flexDirection: 'row',
    // justifyContent: 'space-between'
    alignItems: 'center'
  },
  textBox: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    // marginBottom: 5,
    lineHeight: 22,
    // lineHeight: 32,
    // textAlign: 'auto',
    // textAlign: 'center',
    height: 48,
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlignVertical: 'center',
    // overflow: 'hidden',
  },
  image: {
    // flex: 1,
    width: 90,
    height: 70,
    marginLeft: 15,
    backgroundColor: '#ffffff'
  },
  text: {
    color: '#808080',
    fontSize: 14
  }

})