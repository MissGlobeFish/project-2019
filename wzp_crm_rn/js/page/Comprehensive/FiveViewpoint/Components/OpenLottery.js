/*
 * @Description: 开奖
 * @Author:  renchaoqiong
 * @Date: 2019-12-30 15:32:53
 * @LastEditTime : 2020-01-04 15:20:43
 */
import React, { Component } from 'react'
import {  StyleSheet, Text,Dimensions, Image,View,TouchableOpacity,ImageBackground,Modal,ScrollView  } from 'react-native'
import ModalComponent from "./Modal"
import PersistanceManger from '../../../../util/PersistanceManger';
import ajax from '../../../../config/Fetch';
const { width } = Dimensions.get('window');
export default class OpenLottery extends Component {
  static defaultProps = {
    visible: false,
    value: "",
    // alreadSave: false
  }
  constructor(props) {
    super(props)

    this.state = {
      alreadSave: false,
      empCode: PersistanceManger.ShareInstance().empCode,
      modalVisible: this.props.visible
    }
  }
 
  componentWillReceiveProps(props) {
    console.log(this.props.visible,'this.props.visible')
    this.setState({
      modalVisible: this.props.visible
    })
  }
  // 开奖DOM
  openDom() {
    // 计算图片高度 实际宽度/实际高度 : （宽度*0.7 / 高度） ==  ((宽度*0.7)*实际高度) / 实际宽度
    const autoImageHeight = {
      height: ((width*0.7)*266)/280
    };
    return (
      <View style={styles.modalContent}>
        <View style={styles.imageWrap}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-noOpen.png')} style={[styles.imageStyle,autoImageHeight]}></Image>
        </View>
        <TouchableOpacity style={styles.openBtnWrap} onPress={()=>{this.openLottery()}}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-unfold.png')} style={styles.openBtn}></Image>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={()=>{this.clickClose()}} style={styles.btnClose}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-close.png')} style={styles.btnCloseImage}></Image>
        </TouchableOpacity>
      </View>
    )
  }

  // 已经开奖后DOM
  alreadyDOM() {
    // 计算图片高度 实际宽度/实际高度 : （宽度*0.7 / 高度） ==  ((宽度*0.7)*实际高度) / 实际宽度
    const autoImageHeight = {
      height: ((width*0.7)*266)/280
    };
    return (
      <View style={styles.modalContent}>
        <ImageBackground source={require('../../../../res/FiveViewpointImgs/cpm-open.png')} style={[styles.imageStyle,styles.backgroungImageStyle,autoImageHeight]}>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>{this.props.value.cashBonus}</Text>
            <Text style={styles.tip}>红包已放入钱包</Text>
          </View>
        </ImageBackground>
        <TouchableOpacity activeOpacity={1} onPress={()=>{this.clickClose()}}  style={styles.clickClose}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-knowButt.png')} style={styles.clickCloseImg}></Image>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    const { alreadSave } = this.state;
    console.log(alreadSave,'alreadSave')
    return (
      <View style={styles.container}>
        <ModalComponent visible={this.state.modalVisible} children={alreadSave ? this.alreadyDOM() : this.openDom() }></ModalComponent>
      </View>
    )
  }

  componentDidMount() {
    
  }

  // 开奖
  openLottery() {
    console.log("开奖")
    
    // this.props.fn("CASH")
    ajax.post("collectCard")
    .then(res=>{
      this.setState({
        alreadSave: true
      })
      console.log(res,"现金摇一摇收下")
    })
    .catch(error=>{
      this.setState({
        alreadSave: true
      })
      console.log(error,"现金摇一摇收下失败")
    })
  }

  // 关闭开奖
  clickClose() {
    this.setState({
      modalVisible: false,
      alreadSave: false
    },()=>{
      // this.props.fn()
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
    position: 'relative',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  imageWrap: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20
  },
  imageStyle: {
    width: '100%',
    height: null
  },
  backgroungImageStyle: {
    alignItems: 'center'
  },
  priceWrap: {
    alignItems: 'center'
  },
  price: {
    fontSize: 52,
    // fontWeight: "bold",
    color: '#FC575A',
    marginTop: 47
  },
  tip: {
    fontSize: 12,
    color: '#FC575A',
    marginTop: 10
  },
  openBtnWrap: { 
    width: 95,
    height: 95,
    position: 'absolute',
    margin: 'auto'
  },
  openBtn: {
    width: 95,
    height: 95
  },
  btnClose: {
    width: 40,
    height: 40,
    marginTop: 38,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  btnCloseImage: {
    width: '100%',
    height: '100%'
  },
  clickClose: {
    width: 166,
    height: 36,
    marginTop: - 60,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  clickCloseImg: {
    width: '100%',
    height: '100%'
  }
})