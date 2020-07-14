/*
 * @Description: 未中奖
 * @Author:  renchaoqiong
 * @Date: 2019-12-30 15:32:53
 * @LastEditTime : 2020-01-04 09:57:18
 */
import React, { Component } from 'react'
import {  StyleSheet, Text,Dimensions, Image,View,TouchableOpacity,ImageBackground,Modal,ScrollView  } from 'react-native'
import ModalComponent from "./Modal"
const { width } = Dimensions.get('window');
export default class NoPrize extends Component {
  static defaultProps = {
    visible: false
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.visible,
      cardData: {
        "card-1": {
          url: require('../../../../res/FiveViewpointImgs/cpm-1.png'),
          title: '一家人在一起才叫团圆',
          subTitle: '没有摇到五观卡，再试试吧～'  
        },
        "card-2": {
          url: require('../../../../res/FiveViewpointImgs/cpm-2.png'),
          title: '过年吃火锅，越吃越红火',
          subTitle: '没有摇到五观卡，再试试吧～'  
        },
        "card-3": {
          url: require('../../../../res/FiveViewpointImgs/cpm-3.png'),
          title: '年年如意，岁岁平安',
          subTitle: '没有摇到五观卡，再试试吧～'  
        },
        "card-4": {
          url: require('../../../../res/FiveViewpointImgs/cpm-4.png'),
          title: '浓情半月包，蜜意挚融交',
          subTitle: '没有摇到五观卡，再试试吧～'  
        },
        "card-5": {
          url: require('../../../../res/FiveViewpointImgs/cpm-5.png'),
          title: '瑞雪兆丰年，春带凯歌来',
          subTitle: '没有摇到五观卡，再试试吧～'  
        },
        "card-6": {
          url: require('../../../../res/FiveViewpointImgs/cpm-6.png'),
          title: '福满人间门，天下乐相融',
          subTitle: '没有摇到五观卡，再试试吧～'  
        }
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
    const {cardData} = this.state;
    // 计算图片高度 实际宽度/实际高度 : （宽度*0.7 / 高度） ==  ((宽度*0.7)*实际高度) / 实际宽度
    const autoImageHeight = {
      height: ((width*0.7)*175)/265
    };
    const autoContentHeight = {
      height: ((width*0.7)*145)/265
    };
    const random = Math.floor(Math.random()*6 +1)
    return (
      <View style={styles.modalContent}>
        <View style={styles.imageWrap}>
          <Image source={cardData['card-'+random].url} style={[styles.imageStyle,autoImageHeight]}></Image>
        </View>

        <View style={[styles.picTextWrap,autoContentHeight]}>
          <Text style={styles.picTextTitle}>{cardData['card-'+random].title}</Text>
          <Text style={styles.picTextSubTitle}>{cardData['card-'+random].subTitle}</Text>
        </View>
        <View>

        <TouchableOpacity activeOpacity={1} onPress={()=>{this.clickConfirm()}} style={styles.confirmBtn}>
          <Image source={require('../../../../res/FiveViewpointImgs/cpm-button.png')} style={styles.btnImage}></Image>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
  //  <TouchableOpacity activeOpacity={1} onPress={()=>{this.openModal()}}><Text>弹框</Text></TouchableOpacity>
  // 
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
    // this.props.fn()
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