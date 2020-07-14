/**
 * GroupItem 比赛开始下注阶段
 */
import React, { Component } from 'react';
import {  StyleSheet, Text, Image,View,TouchableOpacity,TextInput,Modal,ScrollView,Dimensions } from 'react-native';
import {Button,Icon} from 'react-native-elements';
import ajax from '../config/Fetch';
import Toast from '../common/Toast'
import ModalPage from '../common/ModalPage'
import PersistanceManger from '../util/PersistanceManger';
const { width, height } = Dimensions.get('window');

export default class GroupBet extends Component {
//   static defaultProps = {
//     status: 1
// }
  constructor(props) {
    super(props)
    this.state = {
      isBetStatus: false, // 是否已经下注
      betTeamId: '',// 下注队伍id
      betMoney: 0, //下注金额
      amount: 0
    }
  }
  ItemChild(data) { //弹框内容
    const {betTeamId,betMoney,amount} = this.state
    // const {amount} = this.props
    return (
      <View>
        <View style={styles.balance}>
          <Text style={styles.font14}>余额(元)</Text><Text style={[styles.font14,{color:'#FF6D14'}]}>{amount}元</Text>
        </View>
        <ScrollView keyboardShouldPersistTaps={'always'}> 
        <View style={styles.betMoney}>
          <Text style={styles.font14}>下注金额(元)</Text>
          
          <TextInput placeholder="请输入金额(元)" autoFocus={true}
           keyboardType='numeric'
            onChangeText ={(text)=>{
              this.setState({
                betMoney:text
              })
            }}
          />
        </View>
        </ScrollView>
          <View style={styles.operation}>
            <TouchableOpacity style={[styles.operationBtn,styles.font16] }
              onPress = {()=>{this.refs.modalDomBet.setModalVisible(false)}}
            ><Text>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.operationBtn,styles.borderLeft]}
              onPress={()=>{
                this.refs.modalDomBet.setModalVisible(false) 
                let betMoneyData = {
                  betTeamId: betTeamId,
                  betMatchId: data.id,
                  amount: betMoney,
                  empCode: PersistanceManger.ShareInstance().empCode,
                  matchId: 1}
                if (betMoney>amount) {
                  Toast.showWarn('余额不足')
                } else if (betMoney <= 0) {
                  Toast.showWarn('请输入金额大于零的整数')
                } else if (betMoney%1 !== 0) {
                  Toast.showWarn('请输入金额大于零的整数')
                } else {
                  this.sendBet(betMoneyData)
                }
                
              }}
            ><Text style={[styles.color,,styles.font16]}>下注</Text></TouchableOpacity>
          </View>
      </View>
  )
}
componentDidMount() {
}
// 请求余额
getMoney() {
  // console.log('请求余额')
  ajax.get('wallet', { empCode: PersistanceManger.ShareInstance().empCode }).then((res) => {
    // console.log(res,'余额')
    this.setState({ amount: res.amount })
  }).catch((error) => {
    // console.log(error)
  })
}
// 点击下注
sendBet(betMoneyData) {

  ajax.post('program/bet',betMoneyData).then((res)=>{
    Toast.showLoading('下注中',{mask: true})
    if(res.flag) {
      this.props.fn() //重新刷新页面
      Toast.showSuccess("下注成功")
    } else {
      Toast.showWarn(res.msg)
    }
  }).catch((error)=>{
    // console.log('下注失败') 
  })
}
  render() {
    const {betTeamId} = this.state
    const {index,data} = this.props
    return (
    <View style={styles.groupItem}>
    {/* 分组编号 */}
      <View style={styles.sortGroup}>
        <Text style={styles.sortFont}>{index}</Text>
      </View>
      {/* 分组信息 */}
      <View style={styles.groupName}>
        <View style={[styles.nameWrap,{alignItems:'flex-end'}]}>
          {/* <Text style={{fontSize:50}}>12313</Text> */}
          <Text style={[styles.nameItem,styles.left]}>{data.homeTeamName}</Text>
          {((data.status == 0 || data.status == 1) && data.homeTeam == data.betTeamId)? <Text style={styles.left}>已下注{data.betAmount}</Text> : null}
          {/* 下注按钮显示： 比赛为准备阶段 主队客队都存在 已下注情况下的该队   */}
          {(data.status == -1 && data.homeTeam != null && data.visitorTeam != null && (data.betAmount <= 0 || data.homeTeam == data.betTeamId))  ?
            <TouchableOpacity style={styles.betBtnTouch}
              onPress={()=>{
                this.getMoney()
                this.setState({betTeamId: data.homeTeam,betMoney: 0})
                this.refs.modalDomBet.setModalVisible(true)
              }}
            >
              <Text style={{color:'#FFF', alignSelf:'center',fontSize:14}}>
              {data.betAmount > 0 ? ('已下注' + data.betAmount) : '下注'}
              </Text>
            </TouchableOpacity> 
          : null}

        </View>
        <View style={styles.vsImg}>
          <Image
            style={{width: 28,height:20,marginTop: 26}}
            source={require('../res/imgs/vs.png')}
          />
          {/* {data.status==1 && <Text style={{marginTop: 10,color: '#aaa'}}>暂停</Text>} */}
        </View>
        
        <View style={{alignItems:'flex-start'}}>
          <Text style={[styles.nameItem]}>{data.visitorTeamName}</Text>
          {((data.status == 0 || data.status == 1) && data.visitorTeam == data.betTeamId)? <Text style={styles.right}>已下注{data.betAmount}</Text>:null}
          {(data.status == -1 && data.visitorTeam != null && data.homeTeam != null && (data.betAmount <= 0 || data.visitorTeam == data.betTeamId) ) ? 
          <TouchableOpacity style={styles.betBtnTouch}
            onPress={()=>{
              this.getMoney()
              this.setState({betTeamId: data.visitorTeam,betMoney: 0})
              this.refs.modalDomBet.setModalVisible(true)
            }}
          >
            <Text style={{color:'#FFF', alignSelf:'center',fontSize:14}}>
              {data.betAmount > 0 ? ('已下注' + data.betAmount) : '下注'}
              </Text>
          </TouchableOpacity> : null}
          {/* {(data.betAmount>0 && data.visitorTeam == data.betTeamId)? <Text style={styles.right}>已下注{data.betAmount}</Text>:null}
           {(data.betAmount<=0 && data.status == -1 && data.visitorTeam != null && data.homeTeam != null) ? <Button
            fontSize={14}
            title="下注"
            backgroundColor='#FFBF41' borderRadius={5} buttonStyle={styles.betBtn}
            onPress={()=>{
              this.getMoney()
              this.setState({betTeamId: data.visitorTeam,betMoney: 0})
              this.refs.modalDomBet.setModalVisible(true)
            }}
          />: null} */}
        </View>
      </View>
      {/* 彩色边框 */}
      <View style={styles.borderStyle}> 
          <Image
            style={{width: '100%',height:5}}
            source={require('../res/imgs/border.png')}
          />
      </View>
      {/* 下注弹框 */}
      <ModalPage ref="modalDomBet" componentDom={this.ItemChild(data)} title="下注" keyboard={true}/>   
    </View>
    
    )
  }
}
const styles = StyleSheet.create({
  groupItem: {
    borderBottomWidth: 1,
    borderBottomColor:'#eee',
    backgroundColor: '#fff',
    // position: 'relative',
    height: 125,
    width: '100%'
  },
  sortGroup: {
    position: 'absolute',
    top:0,
    backgroundColor: '#000',
    left: 0,
  },
  sortFont: {
    position: 'absolute',
    top:-20,
    fontFamily:'Arial-BoldItalicMT',
    fontSize: 136,
    color: '#f5f2f5',
    fontWeight: 'bold'
  },
  groupName: {
    flexDirection: 'row',
    marginLeft:30,
    position: 'relative',
  },
  vsImg: {
    marginLeft: 18,
    marginRight: 12
  },
  nameItem: {
    fontSize: 18,
    width: 120,
    paddingTop: 23,
    paddingBottom: 10,
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

  betBtnTouch: {
    height: 32,
    width:90,
    backgroundColor: '#FFBF41',
    borderRadius: 5,
    justifyContent: 'center',
  },
  borderStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2
  },
  balance: {
    flexDirection:'row',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginLeft: 16,
    marginRight: 16
  },
  betMoney: {
    flexDirection:'row',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 32,
    marginLeft: 16,
    marginRight: 16
  },
  font14: {
    fontSize: 14,
    color: '#666',
    width: 100
  },
  operation: {
    flexDirection:'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent:'center',
  },
  operationBtn: {
    flex: 1,
    height: 45,
    justifyContent:'center',
    alignItems:'center'
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor:'#eee'
  },
  color: {
    color: '#FF6D14'
  },
  font16: {
    fontSize: 16
  }
})