/**
 * 我发起的-待办--处理详情
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, SafeAreaView, KeyboardAvoidingView, Keyboard, findNodeHandle, UIManager, DeviceEventEmitter } from 'react-native';
import { Icon } from 'react-native-elements'
import { Header } from 'react-navigation';
import PersistanceManger from '../../util/PersistanceManger';
import Toast from '../../common/Toast'
import ajax from '../../config/Fetch';
import Btn from '../../common/Btn.js';
import FormTextArea from '../../common/FormComponents/FormTextArea'
// 用屏幕总高度-键盘高度-试图高度 = 需要移动的高度
// let windowHeight = Dimensions.get('window').height;
// console.log(windowHeight)
const formIdObj = {
  expenses: 'ER_ExpReimbursement', //费用报销
}
export default class DealtDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '处理',
      headerBackTitle: null,
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      remark: '', //建议
      keyboardHeight: '',
      offsetHeight: 2,
      componentHeight: '',
      loading: false,
      selectItem: '', // 选择的选项
      choiceList: [
        { info: '审核通过', result: 'Consent' }, { info: '驳回到上个处理人', result: 'Reject' }, { info: '驳回到发起人', result: 'Dissent' }
      ],
    }
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="position">
        <SafeAreaView>
          <ScrollView>
            {/* keyboardVerticalOffset={this.state.keyboardHeight} */}
            <View style={[styles.container, { position: 'relative', bottom: 0 }]}>
              <View style={[styles.dealtWay, styles.dealSection]}>
                <View style={[styles.title]}>
                  <Text style={styles.titleText}>如何处理</Text><Text style={{ fontSize: 14, color: '#808080', marginLeft: 5 }}>(必选)</Text>
                </View>
                <View style={[styles.dealtWayItem]}>
                  {this.handleChoice()}
                </View>
              </View>
              <View style={[{ marginTop: 10 }]}>
                <FormTextArea placeholder="请输处理意见" maxLength={100} title="处理意见" value={this.state.remark} subTitleLab={{ fontSize: 18, fontWeight: 'normal' }} // 接受子组件传过来的方法onValueChanged  传一个value给子组件
                  onValueChanged={this.formItemValueChanged.bind(this)}
                />
              </View>
              <Btn 
              title={this.state.loading ? "" : "提交"}
              btnContainer={{ marginTop: 35 }} 
              loading={this.state.loading} 
              
              handleBtn={this.handleBtn.bind(this)} 
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  formItemValueChanged(text, keyName, component) {
    this.setState({
      remark: text
    })
  }

  /**
   *  单项选择
   *
   * @returns
   * @memberof DealtDetail
   */
  handleChoice() {
    const { choiceList } = this.state;
    let Component = [];
    choiceList.forEach((item, index) => {
      Component.push(
        <TouchableOpacity key={index} style={{ flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 13 }}
          onPress={() => {
            this.setState({
              currChoice: index,
              selectItem: item.result
            })
            console.log(item)
          }}
        >
          <View style={[styles.choiceItem]}>{this.state.currChoice === index && <Image source={require('../../res/imgs/currChoice.png')} style={styles.currChoice}></Image>}</View>
          <Text style={{ fontSize: 16, marginLeft: 15 }}>{item.info}</Text>
        </TouchableOpacity>
      )
    })
    return Component;
  }

  /**
   * 提交处理
   *
   * @returns
   * @memberof DealtDetail
   */
  handleBtn() {
    const { getParam } = this.props.navigation;
    let fid = getParam('fid') // 单据号id
    let formId = getParam('formId') //单据类型
    let obj = {
      fid: fid,
      formId: formId,
      userId: PersistanceManger.ShareInstance().userId,
      result: this.state.selectItem,
      description: this.state.remark
    }
    if (this.state.selectItem.length <= 0) {
      Toast.showWarn('请勾选处理项')
      return;
    }
    this.setState({
      loading: true
    })
    ajax.post('process/submit', obj)
      .then((res) => {
        this.setState({
          loading: false
        })
        DeviceEventEmitter.emit(global.NotificationIdentify.listPageNeedRefresh, true)
        DeviceEventEmitter.emit(global.NotificationIdentify.consolePageNeedRefresh, true)
        this.props.navigation.navigate('Dealt')
        Toast.showSuccess('处理成功')
        // console.log(this,'res')
      })
      .catch((err) => {
        this.setState({
          loading: false
        })
        console.log(err)
        if ( err.msg ) {
          Toast.showFail(err.msg)
        }
      })
  }
}
const styles = StyleSheet.create({
  container: {
    // flex:1,
  },
  dealSection: {
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  title: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 15
  },
  titleText: {
    fontSize: 17,
    color: '#000'
  },
  choiceItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#808080',
    position: 'relative',
  },
  currChoice: {
    position: 'absolute',
    width: 21,
    height: 21,
    left: -1,
    top: -1,
    right: 0
  },
  dealtWayItem: {
    paddingBottom: 13
  },
  // advice: {
  //   marginBottom: 20,
  //   backgroundColor:'#f5f5f5',
  //   height: 120,
  //   padding: 15
  // }
})
