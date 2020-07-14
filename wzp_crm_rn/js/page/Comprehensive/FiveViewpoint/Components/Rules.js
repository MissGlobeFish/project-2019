
/*
 * @Description: 活动规则
 * @Author:  renchaoqiong
 * @Date: 2019-12-30 15:32:53
 * @LastEditTime : 2020-01-04 12:02:41
 */
import React, { Component } from 'react'
import {  StyleSheet, Text,Dimensions, Image,View,TouchableOpacity,ImageBackground,Modal,ScrollView  } from 'react-native'
import ModalComponent from "./Modal"
const { width } = Dimensions.get('window');
export default class Rules extends Component {
  static defaultProps = {
    visible: false
  }
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.visible,
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      modalVisible: this.props.visible
    })
  }
  // 弹框插槽内容
  modalContent() {
    // 计算图片高度 实际宽度/实际高度 : （宽度*0.7 / 高度） ==  ((宽度*0.7)*实际高度) / 实际宽度
    const autoContentHeight = {
      height: ((width*0.7)*320)/269
    };
    const autoIntroductHeight = {
      height: ((width*0.6)*215)/230 - 18
    };
    return (
      <View style={styles.modalContent}>
        <View style={[styles.ruleWrap,autoContentHeight]}>
          <View style={styles.ruleWrapHead}>
            <View style={styles.line}></View>
            <Text style={styles.title}>活动规则</Text>
            <View style={styles.line}></View>
          </View>
          <View style={[styles.introduction,autoIntroductHeight]}>
            <View style={styles.introductionItem}><View style={styles.number}><Text style={styles.itemText}>1.</Text></View><Text style={styles.itemText}>活动时间：1月25日-2月7日</Text></View>
            <View style={styles.introductionItem}><View style={styles.number}><Text style={styles.itemText}>2.</Text></View><Text style={styles.itemText}>摇一摇有几率获得五观卡片或新年红包，每天每人可以摇5次。</Text></View>
            <View style={styles.introductionItem}><View style={styles.number}><Text style={styles.itemText}>3.</Text></View><Text style={styles.itemText}>通过排行榜能够查看到小伙伴们拥有卡片的总数量</Text></View>
            <View style={styles.introductionItem}><View style={styles.number}><Text style={styles.itemText}>4.</Text></View><Text style={styles.itemText}>可以向企业好友索取五观卡片</Text></View>
            <View style={styles.introductionItem}><View style={styles.number}><Text style={styles.itemText}>5.</Text></View><Text style={styles.itemText}>五观卡片集齐并合成之后将会在2月7日年晚宴瓜分奖金池</Text></View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={()=>{this.clickConfirm()}}  style={styles.confirmBtn}>
            <Image source={require('../../../../res/FiveViewpointImgs/cpm-button.png')} style={styles.btnImage}></Image>
          </TouchableOpacity>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <ModalComponent visible={this.state.modalVisible} children={this.modalContent()}></ModalComponent>
      </View>
    )
  }

  componentDidMount() {
    
  }

  // // 开启弹框
  // openModal() {
  //   this.setState({
  //     modalVisible: true
  //   })
  // }
  clickConfirm() {
    this.setState({
      modalVisible: false
    },()=>{
      this.props.fn()
    })
  }
}

//Styles
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    width: '70%'
  },
  ruleWrap: {
    width: '100%',
    backgroundColor: '#B41727',
    borderRadius: 5
  },
  ruleWrapHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 21
  },
  title: {
    color: '#F5CE9E',
    marginHorizontal: 15,
    fontSize: 20,
    fontWeight: 'bold'
  },
  line: {
    width: 30,
    height: 1,
    backgroundColor: '#F5CE9E'
  },
  introduction: {
    width: '85%',
    // height: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    backgroundColor: '#F5CE9E',
    paddingTop: 18
  },
  introductionItem: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 20
  },
  number: {
    width: 15,
  },
  itemText: {
    fontSize: 12,
    color: '#B41727'
  },
  confirmBtn: {
    width: 121,
    height: 40,
    marginTop: -20,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  btnImage: {
    width: '100%',
    height: '100%'
  }
})