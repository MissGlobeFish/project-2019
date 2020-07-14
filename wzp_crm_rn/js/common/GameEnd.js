/**
 * GroupItem 下注完成||比赛完成
 */
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import ajax from '../config/Fetch';
import ModalPage from '../common/ModalPage'
import PersistanceManger from '../util/PersistanceManger';
const { width, height } = Dimensions.get('window');
export default class GameEnd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false, // 弹框是否开启
      resultData: ''
    }
  }
  ItemChild(data) { //弹框内容
    const { resultData } = this.state
    return (
      <View>
        <View style={styles.tabel}>
          <View style={styles.ScoreWrap}><Text style={[styles.colorGrey, { fontSize: 20, alignSelf: 'center' }]}>大</Text><Text style={[styles.colorGrey, { fontSize: 20, alignSelf: 'center' }]}>盘</Text></View>
          <View style={styles.groupScore}>
            <View style={styles.scoreItem}>
              <View style={styles.name}><Text style={[styles.colorGrey, styles.font14]}>{resultData.homeTeamName}</Text></View>
              <View style={styles.score}><Text style={[styles.colorGrey, styles.font14]}>{resultData.homeTeamAmount}</Text></View>
            </View>
            <View style={[styles.scoreItem, { borderBottomWidth: 0 }]}>
              <View style={styles.name}><Text style={[styles.colorGrey, styles.font14]}>{resultData.visitorTeamName}</Text></View>
              <View style={styles.score}><Text style={[styles.colorGrey, styles.font14]}>{resultData.visitorTeamAmount}</Text></View>
            </View>
          </View>
        </View>
        <View style={styles.scoreMoney}>
          <Text style={[styles.font16, styles.colorGrey]}>下注</Text>
          <Text style={[styles.font16, { marginLeft: 20, marginRight: 20 }]}>{resultData.betTeamName}</Text>
          <Text style={[styles.font16]}>{resultData.bet} </Text>
        </View>
        <View style={[styles.scoreMoney, { paddingBottom: 10 }]}>
          <Text style={[styles.font16, styles.colorGrey]}>输赢</Text>
          <Text style={[styles.font16, { marginLeft: 20, marginRight: 20, color: '#FF6D14' }]}>{resultData.amount > 0 ? `+${resultData.amount}` : resultData.amount}</Text>
        </View>
      </View>
    )
  }
  // 查询比赛结果
  getGameResult(dataObj) {
    ajax.get('program/result', dataObj).then((res) => {
      if (res.flag) {
        this.setState({
          resultData: res
        })
        // console.log("比赛结果: ", res)
      }
    }).catch((error) => {
      Toast.showFail("查询失败")
    })
  }
  render() {
    const { index, data } = this.props
    return (
      <View style={styles.groupItem}>
        <View style={styles.sortGroup}><Text style={styles.sortFont}>{index}</Text></View>
        <View style={[styles.groupName, { width: width - 50 - 65 }]}>
          <View style={{ width: '45%' }}>
            <Text style={[styles.nameItem, styles.left]}>{data.homeTeamName}</Text>
            <View style={styles.betContainer}>
              <Text style={styles.betNum}>{(data.betAmount > 0 && data.homeTeam == data.betTeamId) ? '已下注' + data.betAmount : ''}</Text>
              {data.winTeamId == data.homeTeam && <Text style={[styles.Right, styles.betNum, styles.win, { marginLeft: 28 }]}>胜</Text>}
            </View>
          </View>
          <View style={styles.vsImg}>
            <Image
              style={{ width: 22, height: 18, marginTop: 18 }}
              source={require('../res/imgs/gameend.png')}
            />
          </View>
          <View style={{ width: '45%' }} >
            <Text style={[styles.nameItem, styles.right]}>{data.visitorTeamName}</Text>
            <View style={styles.betContainer}>
              {data.winTeamId == data.visitorTeam && <Text style={[styles.betNum, styles.win]}>胜</Text>}
              <Text style={[styles.betNum, { marginRight: 10 }]}> { (data.betAmount > 0 && data.visitorTeam == data.betTeamId) ? '已下注' + data.betAmount : ''}</Text>
              
            </View>
          </View>
        </View>
        <View style={{justifyContent: 'center'}}>
            <Button
              fontSize={12}
              color="#FF6D14"
              title="结果"
              backgroundColor="transparent"
              borderRadius={20} 
              buttonStyle={[styles.resultBtn]}

              onPress={() => {
                this.refs.modalDom.setModalVisible(true)
                let dataObj = { matchId: data.id, empCode: PersistanceManger.ShareInstance().empCode }
                this.getGameResult(dataObj)
              }}
            />
          </View>
        <ModalPage ref="modalDom" componentDom={this.ItemChild()} title="比赛结果" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  groupItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    position: 'relative'
  },
  sortGroup: {
    position: 'absolute',
    top: 0,
    left: 10
  },
  sortFont: {
    fontFamily: 'Arial-BoldItalicMT',
    fontSize: 70,
    color: '#f5f2f5'
  },
  groupName: {
    flexDirection: 'row',
    marginLeft: 50,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  vsImg: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'flex-start',
  },
  nameItem: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    color: '#aaa'
  },
  left: {
    textAlign: 'right'
  },
  betNum: {
    fontSize: 12,
    color: '#aaa'
  },
  win: {
    width: 14,
    height: 14,
    lineHeight: 14,
    textAlign: 'center',
    color: '#FF6D14',
    backgroundColor: '#FFBF41'
  },
  betContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10
  },
  resultBtn: {
    margin: 0,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: '#FF6D14',
    justifyContent: 'flex-end',
  },
  tabel: {
    height: 88,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'row'
  },
  ScoreWrap: {
    width: 44,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee'
  },
  groupScore: {
  },
  scoreItem: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  name: {
    width: 151,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreMoney: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20
  },
  colorGrey: {
    color: '#5E5E5E'
  },
  font14: {
    fontSize: 14
  },
  font16: {
    fontSize: 16
  }
})