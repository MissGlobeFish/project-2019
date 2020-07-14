/**
 * GroupItem 比赛准备阶段
 */
import React, { Component } from 'react';
import {  StyleSheet, Text, Image,View,TouchableOpacity,TextInput,FlatList , Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');

export default class GameItem extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
    <View style={styles.groupItem} key={this.props.index}>
      <View style={styles.sortGroup}><Text style={styles.sortFont}>{this.props.index}</Text></View>
      <View style={[styles.groupName, { width: width - 50 - 65 }]}>
        <View style={{ width: '45%' }}><Text style={[styles.nameItem,styles.left]}>{this.props.data.homeTeamName}</Text></View>
        <View style={styles.vsImg}>
          <Image
            style={{width: 22,height:18}}
            source={require('../res/imgs/vs.png')}
          />
        </View>
        <View style={{ width: '45%' }}><Text style={[styles.nameItem,styles.right]}>{this.props.data.visitorTeamName}</Text></View>
      </View>
    </View>
    )
  }
}
const styles = StyleSheet.create({
  groupItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor:'#eee',
    backgroundColor: '#fff',
    position: 'relative'
  },
  sortGroup: {
    position: 'absolute',
    top: 0,
    left: 10
  },
  sortFont: {
    fontFamily:'Arial-BoldItalicMT',
    fontSize: 50,
    color: '#f5f2f5'
  },
  groupName: {
    flexDirection: 'row',
    marginLeft:50,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  vsImg: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'flex-start',
  },
  nameItem: {
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15
  },
  left: {
    textAlign: 'right'
  }
})