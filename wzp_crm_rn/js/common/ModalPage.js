/**
 * GroupItem 比赛开始下注阶段
 */
import React, { Component } from 'react';
import {  StyleSheet, Text, Image,View,TouchableOpacity,KeyboardAvoidingView,Modal,ScrollView } from 'react-native';
import {Button,Icon} from 'react-native-elements';
export default class Test extends Component {
  static defaultProps = {
    keyboard: false
  };
  constructor(props) {
    super(props)
    this.state = {
      animationType: 'none',
      isBetStatus: false, // 是否已经下注
      modalVisible: false, //弹框是是否显示
      transparent: true
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible }); //是否开启弹窗
  }
  render() {
    const {keyboard} =this.props
    let modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0,0)',
    };
    return (
      <View  style={{ alignItems: 'center', flex: 1 }}>
          <Modal
            keyboardShouldPersistTaps={'handled'}
             animationType={this.state.animationType}
             transparent={this.state.transparent}
             visible={this.state.modalVisible}   
              onRequestClose={() => {
                // alert("Modal has been closed.");
              }}
            >
            <TouchableOpacity 
              activeOpacity={1}
              style={[styles.modalWrap,modalBackgroundStyle, keyboard ? {}: {justifyContent: 'center'}]}
              onPress={()=>{this.setModalVisible(false)}}>
              <View>
                <TouchableOpacity activeOpacity={1} onPress={()=>{}}>
                  <View style={[styles.innerWrap,keyboard ? {marginTop: 150} : {marginTop: 0}]}>
                    <View style={styles.innerTitle}>
                      <Text style={{fontSize:18}}>{this.props.title}</Text>
                      <Icon iconStyle={styles.searchIcon}
                        name="close"
                        size={20}
                        onPress={()=>{
                          this.setModalVisible(false)
                        }}
                        color="#8B8B8B"/>
                    </View>
                    {this.props.componentDom}
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
      </View>
    
    )
  }
}
const styles = StyleSheet.create({
  groupItem: {
    // flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor:'#eee',
    backgroundColor: '#fff',
    position: 'relative',
    height: 125,
    width: '100%'
  },
  sortGroup: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  sortFont: {
    fontFamily:'Arial-BoldItalicMT',
    fontSize: 136,
    color: '#f5f2f5',
    fontWeight: 'bold'
  },
  groupName: {
    flexDirection: 'row',
    marginLeft:30,
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
  borderStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2
  },
  modalWrap: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  innerWrap: {
    borderRadius: 2,
    width: 310,
    backgroundColor:'#fff',
    // marginTop: 180
  },
  innerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    padding: 16,
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
  // betMoney: {
  //   flexDirection:'row',
  //   fontSize: 14,
  //   paddingTop: 10,
  //   paddingBottom: 32,
  //   marginLeft: 16,
  //   marginRight: 16
  // },
  // font14: {
  //   fontSize: 14,
  //   color: '#666',
  //   width: 100
  // },
  // operation: {
  //   flexDirection:'row',
  //   borderTopWidth: 1,
  //   borderTopColor: '#eee',
  //   justifyContent:'center',
  // },
  // operationBtn: {
  //   flex: 1,
  //   height: 45,
  //   justifyContent:'center',
  //   alignItems:'center'
  // },
  // borderLeft: {
  //   borderLeftWidth: 1,
  //   borderLeftColor:'#eee'
  // },
  // color: {
  //   color: '#FF6D14'
  // },
  // font16: {
  //   fontSize: 16
  // }
})