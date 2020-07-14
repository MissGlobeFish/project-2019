
/*
 * @Description: 五观卡
 * @Author:  renchaoqiong
 * @Date: 2019-12-30 15:32:53
 * @LastEditTime : 2020-01-04 11:50:26
 */
import React, { Component } from 'react'
import {  StyleSheet, Text,Dimensions, Image,View,TouchableOpacity,ImageBackground,Modal,ScrollView  } from 'react-native'
import ModalComponent from "./Modal"
const { width } = Dimensions.get('window');
export default class FiveCard extends Component {
  static defaultProps = {
    visible: false,
    cardType: ""
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.visible,
      fiveCardImgs: {
        "A": {url: require("../../../../res/FiveViewpointImgs/wuguan-kehubig.png")}, // 客户观
        "B": {url: require("../../../../res/FiveViewpointImgs/wuguan-workbig.png")}, // 工作观
        "C": {url: require("../../../../res/FiveViewpointImgs/wuguan-lifebig.png")}, // 生命观
        "D": {url: require("../../../../res/FiveViewpointImgs/wuguan-renshengbig.png")}, // 人生观
        "E": {url:require( "../../../../res/FiveViewpointImgs/wuguan-succeedbig.png")} // 成功观
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
    const { cardType } = this.props;
    const {fiveCardImgs} = this.state;
    // 计算图片高度 实际宽度/实际高度 : （宽度*0.72 / 高度） ==  ((宽度*0.72)*实际高度) / 实际宽度
    const autoImageHeight = {
      height: ((width*0.72)*410)/270
    };
    return (
      <View style={styles.modalContent}>
        <View style={styles.imageWrap}>
          <Image source={fiveCardImgs[cardType].url} style={[styles.imageStyle,autoImageHeight]}></Image>
        </View>
        <View>
          <TouchableOpacity activeOpacity={1} onPress={()=>{this.clickConfirm()}} style={styles.confirmBtn}>
            <Image source={require('../../../../res/FiveViewpointImgs/cpm-button02.png')} style={styles.btnImage}></Image>
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

  clickConfirm() {
    this.setState({
      modalVisible: false
    },()=>{
      this.props.fn()
    })
    console.log("我知道啦")
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
  confirmBtn: {
    width: 121,
    height: 40,
    marginTop: -40,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  btnImage: {
    width: '100%',
    height: '100%'
  }
})