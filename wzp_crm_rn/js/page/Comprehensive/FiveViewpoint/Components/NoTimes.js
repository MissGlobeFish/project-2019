/*
 * @Description: 用光次数
 * @Author:  renchaoqiong
 * @Date: 2019-12-30 15:32:53
 * @LastEditTime : 2020-01-04 12:02:30
 */
import React, { Component } from 'react'
import {  StyleSheet, Text,Dimensions, Image,View,TouchableOpacity,ImageBackground,Modal,ScrollView  } from 'react-native'
import ModalComponent from "./Modal"
const { width } = Dimensions.get('window');
export default class NoTimes extends Component {
  static defaultProps = {
    shareMoreTime: false,// 是否提示分享多一次
    visible: false
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.visible,
      msg: {
        title: "今日摇一摇次数用光了",
        subTitle: "要不去找找线索或者明天再来吧",
        tip: "小提示：每日5次摇一摇机会，0点刷新次数"
      },
      shareMsg: {
        title: "今日摇一摇次数用光了",
        subTitle: "点击首页右上方分享可以额外获得1次机会",
        tip: "小提示：邀请同事来参加，向他索要五观卡"
      }
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      modalVisible: this.props.visible
    })
  }
  
  // 弹框插槽内容
  modalContent() {
    const { shareMoreTime } = this.props
    const {msg, shareMsg} = this.state;
    // 计算图片高度 实际宽度/实际高度 : （宽度*0.7 / 高度） ==  ((宽度*0.7)*实际高度) / 实际宽度
    const autoImageHeight = {
      height: ((width*0.7)*140)/269
    };
    const autoContentHeight = {
      height: ((width*0.7)*180)/269
    };
    return (
      <View style={styles.modalContent}>
        <View style={styles.imageWrap}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-none.png')} style={[styles.imageStyle,autoImageHeight]}></Image>
        </View>

        <View style={[styles.picTextWrap,autoContentHeight]}>
          <Text style={styles.picTextTitle}>{ shareMoreTime ? shareMsg.title : msg.title}</Text>
          <Text style={styles.picTextSubTitle}>{ shareMoreTime ? shareMsg.subTitle : msg.subTitle}</Text>
          <Text style={styles.picTextTip}>{ shareMoreTime ? shareMsg.tip : msg.tip}</Text>
        </View>
        <View>

        <TouchableOpacity activeOpacity={1} onPress={()=>{this.clickConfirm()}} style={styles.confirmBtn}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-button.png')} style={styles.btnImage}></Image>
        </TouchableOpacity>
        </View>
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

  // 开启弹框
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
  imageWrap: {
    overflow: 'hidden',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  imageStyle: {
    width: '100%',
  },
  picTextWrap: {
    width: '100%',
    backgroundColor: '#B41727',
    alignItems: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  picTextTitle: {
    color: '#FFD5A9',
    fontSize: 20,
    marginTop: 30
  },
  picTextSubTitle: {
    color: '#DFAC77',
    fontSize: 11,
    marginTop: 14
  },
  picTextTip: {
    fontSize: 11,
    color: '#D57B84',
    marginTop: 40
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