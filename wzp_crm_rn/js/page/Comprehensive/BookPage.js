/**
 * book 藏宝阁综合
 * redux 简单实现过程
 */

import React, { Component } from 'react';
import { StyleSheet, Text, Image, SafeAreaView, View, TouchableOpacity } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
// import { createStackNavigator } from 'react-navigation';
export default class Book extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infoListData: PersistanceManger.ShareInstance().isGuest ?
        [
          // { title: '黑马大赛', icon: require('../../res/imgs/book_game.png'), pageIdentify: "Game" },
        ]
        :
        [
          { title: '图书馆', icon: require('../../res/imgs/library.png'), pageIdentify: "Library" },
          { title: '制度', icon: require('../../res/imgs/regulations.png'), pageIdentify: "Regulations" },
          // { title: '黑马大赛', icon: require('../../res/imgs/book_game.png'), pageIdentify: "Game" },
          { title: '地产排行榜', icon: require('../../res/imgs/real_estate_icon.png'), pageIdentify: "EstateRankPage" },
          // { title: '餐饮排行榜', icon: require('../../res/imgs/restaurant_icon.png'), pageIdentify: "FoodEstateRankPage" },
          { title: '小宝社区', icon: require('../../res/imgs/Community.png'), pageIdentify: "CommunityIndex" },
          { title: '小宝集五观', icon: require('../../res/imgs/Community.png'), pageIdentify: "FiveViewpointIndex" },
          // { title: '小宝年会', icon: require('../../res/imgs/NewYear.png'), pageIdentify: "NewYearIndex" }
        ]
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { infoListData } = this.state;

    let infoIterms = infoListData.map((info, index) => {
      return <View style={styles.mianItem} key= { index }>
        <TouchableOpacity onPress={() => { navigate(info.pageIdentify) }} style={styles.touchItem}>
          <Image
            style={{ width: 30, height: 32 }}
            source={info.icon}
          />
          <Text style={{ marginTop: 10 }}>{info.title}</Text>
        </TouchableOpacity>
        {/* <View style={styles.footer}>
          <TouchableOpacity activeOpacity={1} style={styles.footerBox} onPress={this._goRankPage.bind(this, { realTime: false })}>
              <Text style={styles.footerText}>上月排行榜</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[styles.footerBox, styles.footerBoxNext]} onPress={this._goRankPage.bind(this, { realTime: true })}>
              <Text style={styles.footerText}>实时排行榜</Text>
          </TouchableOpacity>
      </View> */}
      </View>
    });

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mian}>
        { infoIterms }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mian: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  touchItem: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 25,
    paddingBottom: 25,
  },
  mianItem: {
    fontSize: 16,
    width: '33.33%',
    flexDirection: 'row',
    justifyContent: 'center',
  }
});
