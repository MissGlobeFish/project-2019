/**
 * Game 黑马比赛
 */
import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Text, Image, View, Modal, TextInput, SectionList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import Toast from '../../common/Toast'
import GameItem from '../../common/GameItem'
import GameBet from '../../common/GameBet'
import GameEnd from '../../common/GameEnd'
import URLS from '../../config/Api';


export default class Game extends Component {

  // static navigationOptions = {
  //   title: '黑马大赛',
  //   headerBackTitle: null
  // };


  static navigationOptions = ({ navigation }) => {
    let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
    return {
      title: '黑马大赛',
      headerBackTitle: null,
      headerRight: (
        <TouchableOpacity style={{ marginRight: 23 }}
          onPress={rightNavigateBtnTapped}
        ><Text style={{ fontSize: 14 }}>规则说明</Text></TouchableOpacity>
      )

    };
  };

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      startStatus: true, //比赛是否开始
      animationType: 'none',//弹框是是否效果
      modalVisible: false, //弹框是是否显示
      transparent: true, //弹框
      data: [], // 分组数据
      isStart: false, //活动是否开始
      refreshing: false,// 刷新

      ws: null, //socekt
      reTry: true //是否重试连接
    }
  }

  /**
   * //是否开启弹窗
   * @param {Boolean} visible 
   */
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentWillMount() {
    const { setParams } = this.props.navigation;
    setParams({
      rightNavigateBtnTapped: () => {
        Alert.alert(
          '规则说明',
          '\n' +
          '1.在每场比赛开始前选择一方下注，可以多次下注。\n\n' +
          '2.下注金额不得大于钱包余额。\n\n' +
          '3.比赛结束后，可以查看本场下注输赢情况（胜的一方为赢，负的一方为输），比赛中如果为平局，则需重新开赛直到分出胜负才算结束。\n\n' +
          '4.每场比赛结束后，输家输掉下注金额，赢家的钱会返还到余额中。\n赢家的钱=本金+（下注金额/赢家奖金池）* （输家奖金池-10%抽成）\n\n' +
          '5.本次活动采取预充值形式，如果需要增加金额请联系组委会，活动结束后财务人员会统计并跟进。',
          [
            { text: '我知道了', onPress: () => 1 },
          ],
          { cancelable: false }
        )
      }
    })

  }

  componentDidMount() {
    this.handelRefresh()
  }

  componentWillUnmount() {
    this.closeSocket()
  }




  /**
   * 处理下拉刷新操作 
   * 刷新数据，如果 sokect 断开则发起重连
   */
  handelRefresh() {
    const { ws } = this.state;
    this.getMatchTeams()
    if (ws == null || ws.readyState == 3) {
      this.socketConnect()
    }
  }

  /**
   *  获取数据更新界面
   */
  fn() { //向子 组件发送请求分组信息
    this.getMatchTeams()
  }

  /**
   *  获取数据更新界面
   */
  getMatchTeams() { //获取分组信息
    Toast.showLoading('网络加载中', { mask: true })
    this.setState({ refreshing: true })
    ajax.get('program/match-teams', { matchId: 1, empCode: PersistanceManger.ShareInstance().empCode }).then((res) => {
      Toast.hide()
      if (res && res.length > 0) {
        this.setState({ data: res, refreshing: false, isStart: false })
      } else {
        this.setState({ data: [], isStart: true })
      }
      // console.log(res,'获取分组信息')
    })
      .catch((error) => {
        this.setState({ refreshing: false })
        Toast.showMessage("请求超时请重试~。~")
      })
  }
  /**
   *  获取当前余额
   */
  getMoney() {
    ajax.get('wallet', { empCode: PersistanceManger.ShareInstance().empCode }).then((res) => {
      // console.log(res,'余额')
      this.setState({ amount: res.amount })
    }).catch((error) => {
      console.log(error)
    })
  }


  /**
   *  Socket 相关
   */
  socketConnect() {
    var ws = new WebSocket(URLS['ws'] + PersistanceManger.ShareInstance().empCode)
    var self = this
    ws.onopen = () => {
      // connection opened
      console.log('socketConnect--连接成功---', (URLS['ws'] + PersistanceManger.ShareInstance().empCode))
      this.getMatchTeams()
      this.pingSocket(this.state.ws)
    };

    ws.onmessage = e => {
      // a message was received
      console.log(e.data);
      self.didReceivedMsg(e.data)
      console.log('客户端收到服务端发来的消息')
    };

    ws.onerror = e => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
      console.log('客户端收到服务端发送的关闭连接')
      //重连
      if (e.code != 1001 && this.state.reTry) {
        setTimeout(() => {
          console.log('重连')
          self.socketConnect()
        }, 20000)
      }
    };

    // this.state.ws = ws
    this.setState({
      ws: ws
    })
  }


  /**
   *  收到 JSON 类型消息
   * @param {String} msgString 
   */
  didReceivedMsg(msgString) {
    var jsonObject = JSON.parse(msgString)
    if (jsonObject == null) {
      return;
    }

    let code = jsonObject.code
    switch (code) {
      case 'REFRESH':
        //刷新界面
        this.getMatchTeams()
        break;
      default:
        break;
    }

  }

  /**
   * 关闭连接
   */
  closeSocket() {
    const { ws } = this.state
    if (ws != null) {
      console.log("处理关闭11")
      ws.close(1001, 'Closed Game page !!!')
      this.state.ws = null
      this.state.reTry = false
    }
  }


  /**
   * 定时发心跳，保持活跃
   */
  pingSocket(curreWS) {
    const { ws } = this.state;
    if (ws == null || ws !== curreWS) {
      console.log("停止该次 Ping");
      return
    }
    // if (ws === curreWS) {
    let pingObject = {
      code: 'PING',
      data: "我还活着" + PersistanceManger.ShareInstance().empCode
    }
    ws.send(JSON.stringify(pingObject))
    console.log("SocketConnect----- [Ping] ----")

    /**
     * 0 (CONNECTING) 正在链接中
     * 1 (OPEN)  已经链接并且可以通讯
     * 2 (CLOSING) 连接正在关闭
     * 3 (CLOSED) 连接已关闭或者没有链接成功
     *  */
    if (ws.readyState == 3) {
      //重连
      console.log("SocketConnect 心跳检测连接断开，执行重新连接!")
      this.socketConnect()
      this.getMatchTeams()
    }
    // }
    setTimeout(() => {
      this.pingSocket(curreWS)
    }, 30000);
  }


  /**
   * 发送弹幕
   * @param { String } msg 
   */
  sendMessage(msg) {
    const { ws } = this.state;
    if (msg.length < 1 || msg == '\n') {
      return
    }
    if (ws == null || ws.readyState == 3) {
      Toast.showFail("未能连接到服务器，请刷新后重试！")
      return
    }
    let chatObject = {
      code: 'CHAT',
      data: {
        name: PersistanceManger.ShareInstance().userName,
        msg: ': ' + msg,
      }
    }

    // let chatObject = {
    //   code: 'PHOTO',
    //   data: 
    //     [
    //       {
    //       empCode: "GS0286",
    //       empName: "张6豪",
    //       sign: 0,
    //       photo:
    //         "https://gstf-merchantkey.oss-cn-beijing.aliyuncs.com/stage/RecognitionPortrait/20181129/1543477950429.jpg"
    //     }
    //   ]
    // }

    console.log('发送弹幕', chatObject)
    
    try {
      ws.send(JSON.stringify(chatObject))
    } catch (error) {
      console.log('发送弹幕ERROR', error)
    }
    

    this.setState({
      text: ''
    })
  }





  createListItem(item, index) { //列表布局（渲染）
    let component;

    switch (item.status) { //未开始:-2,准备: -1,进行中: 0,暂停: 1,结束: 2
      case -2:
        component = <GameItem data={item} index={index + 1} fn={this.fn.bind(this)} />
        break;
      case -1:
        component = <GameBet data={item} index={index + 1} fn={this.fn.bind(this)} />
        break;
      case 0:
        component = <GameBet data={item} index={index + 1} fn={this.fn.bind(this)} />
        break;
      case 1:
        component = <GameBet data={item} index={index + 1} fn={this.fn.bind(this)} />
        break;
      case 2:
        // component = <GameEnd data={item} index={index+1}/>
        component = <GameEnd data={item} index={index + 1} fn={this.fn.bind(this)} />
        break;
    }

    return (
      <View>
        {component}
      </View>
    )
  }
  _renderSectionHeader = ({ section }) => (
    <View>
      {section.data.length > 0 ? <View style={styles.round}>
        <Text style={styles.roundText}>第{section.title}轮</Text>
      </View> : null}
    </View>
  );
  render() {
    const { data, isStart } = this.state
    let modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
    };
    return (
      <View style={styles.containerView}>
        {/* 比赛未开始 */}
        {
          isStart && <View style={styles.preContainer}>
            <Image
              style={{ width: 177, height: 177, marginTop: 128 }}
              source={require('../../res/imgs/unStart.png')}
            />
            <Text>比赛未开始～</Text>
          </View>
        }
        {
          data.length > 0 &&
          <View style={styles.startContainer}>
            <SectionList
              extraData={this.state}
              keyboardShouldPersistTaps={'always'}
              style={{ marginBottom: 50 }}
              renderItem={({ item, index, section }) => this.createListItem(item, index)}
              // renderSectionHeader={({ section: { title }}) =>this.roundItem(title)}
              renderSectionHeader={this._renderSectionHeader}
              sections={this.state.data}
              keyExtractor={(item, index) => item + index}
              onRefresh={() => { this.handelRefresh() }}
              refreshing={this.state.refreshing}
            />
          </View>
        }
        <View style={styles.sendWrap}>
          <TouchableOpacity onPress={() => {
            this.setModalVisible(true)
          }}>
            <Text style={styles.sendText}>发表评论</Text>
          </TouchableOpacity>
        </View>
        {/*发言弹框*/}
        <View>
          <Modal
            animationType={this.state.animationType}
            transparent={this.state.transparent}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              // alert("Modal has been closed.");
            }}
          >
            <View style={[styles.modalWrap, modalBackgroundStyle]}>
              <View style={[styles.innerWrap]}>
                <View style={styles.innerTitle}>
                  <TouchableOpacity onPress={() => {
                    this.setModalVisible(false)
                  }}>
                    <Text style={[styles.font16, { color: '#666' }]}>取消</Text>
                  </TouchableOpacity>
                  <Text style={[styles.font16]}>评论</Text>
                  <TouchableOpacity onPress={() => {
                    this.setModalVisible(false)
                    this.sendMessage(this.state.text)
                  }}>
                    <Text style={[styles.font16, { color: '#FF6D14' }]}>发表</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TextInput autoFocus={true} autoCapitalize='none' placeholder="请发言" multiline={true} style={[{ padding: 16 }]}
                    returnKeyType="send"
                    maxLength={30}
                    onSubmitEditing={() => {
                      this.setModalVisible(false)
                      this.sendMessage(this.state.text)
                    }}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                  /></View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    )
  }

}
const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    flex: 5,
    backgroundColor: '#f4f4f4',
    position: 'relative'
  },
  preContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  startContainer: {
    flex: 5
  },
  round: {
    height: 36,
    paddingLeft: 18,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  roundText: {
    fontSize: 12,
    color: '#aaa'
  },
  infoView: {
    marginBottom: 50
  },
  sendWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    height: 49,
    backgroundColor: '#fff',
    shadowColor: '#000'
  },
  sendText: {
    borderRadius: 5,
    height: 35,
    backgroundColor: "#f2f2f2",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
    lineHeight: 35,
    color: '#666'
  },
  font16: {
    fontSize: 16
  },
  left: {
    textAlign: 'right'
  },
  betBtn: {
    height: 32,
    padding: 0,
    marginRight: -14
  },
  betBtnRight: {
    marginLeft: -14
  },
  borderStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2
  },
  modalWrap: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  innerWrap: {
    width: '100%',
    borderRadius: 2,
    height: '60%',
    backgroundColor: '#fff'
  },
  innerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    padding: 16,
  },
  balance: {
    flexDirection: 'row',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginLeft: 16,
    marginRight: 16
  }
})