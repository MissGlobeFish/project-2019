

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView
} from 'react-native';

import propTypes from 'prop-types'

import RootSiblings from 'react-native-root-siblings';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const rightWidth = screenWidth - 100;
const leftSpace = 100;
export default class TopSidebar extends Component {

  static propTypes = {
    backOpacity: propTypes.number
  }
  static defaultProps = {
    backOpacity: 0.7
  };


  constructor(props) {
    super(props);
    // Object.assign(props, props)
    this.state = {
      siblings: null
    }
    this.siblings = null
    this.heightValue = new Animated.Value(0); // 左侧向右动画初始值，默认为0
    this.fadeInAnimated = new Animated.Value(0); // 渐隐动画初始值，默认为0，透明
    // this.state = {
    //     isShowModal: false,
    // };

    this.showModalByFadeIn = this.showModalByFadeIn.bind(this); // 打开抽屉
    this.hideModalByFadeIn = this.hideModalByFadeIn.bind(this); // 关闭抽屉
    this.showSibling = this.showSibling.bind(this)
  }

  /*显示浮层*/
  showModalByFadeIn() {
    let opacity = this.props.backOpacity
    // 组动画，组内动画同时执行
    Animated.parallel([
      // 移动动画
      Animated.timing(
        this.heightValue,
        {
          toValue: 1,
          duration: 250,
          easing: Easing.linear
        }
      ),
      // 透明度变化的动画效果
      Animated.timing(
        this.fadeInAnimated, {
          toValue: opacity != null ? opacity : 0.7,
          duration: 250,
          easing: Easing.linear
        }
      )]
    ).start()
  }
  /*隐藏浮层*/
  hideModalByFadeIn() {
    Animated.parallel([
      Animated.timing(
        this.heightValue,
        {
          toValue: 0,
          duration: 250,
          easing: Easing.linear
        }
      ),
      Animated.timing(
        this.fadeInAnimated, {
          toValue: 0, // 1为不透明
          duration: 250,
          easing: Easing.linear
        }
      )
    ]).start(() => {
      if (this.siblings != null) {
        this.siblings.destroy()
        this.siblings = null
      }
    });

  }
  subRender() {
    return null
  }

  showSibling() {
    this.showModalByFadeIn()
    let siblings = new RootSiblings(
      this.siblingView()
    )
    this.siblings = siblings;
  }
  updateSibling() {
    if (this.siblings != null) {
      this.siblings.update(this.siblingView())
    }
  }
  siblingView() {
    const movingHeight = this.heightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, screenHeight]
    });
    return (
      <View style={styles.modalStyle}
      >
        <Animated.View style={[styles.modalStyle,
        {
          position: 'absolute',
          backgroundColor: 'black',
          width: screenWidth,
          height: screenHeight,
          opacity: this.fadeInAnimated
        }]}>
        </Animated.View>
        {/*背景蒙版按钮 ---点击收起--- */}
        <TouchableOpacity style={styles.backStyle}
          onPress={() => {
            this.hideModalByFadeIn();
          }}
          activeOpacity={1}
        />

        <SafeAreaView
          pointerEvents={'box-none'}
          style={{
            marginTop: 0,
            marginLeft: 0,
            width: screenWidth,
            height: screenHeight,
            alignItems: 'center',
          }}>
          {/*动画View*/}
          <Animated.View
            pointerEvents={'box-none'}
            style={{
              marginTop: 42,
              width: '60%',
              height: movingHeight,
              paddingHorizontal: 15,
              // backgroundColor: '#efefef',
              overflow: 'hidden',
            }}>
            {this.subRender()}
          </Animated.View>
        </SafeAreaView>

      </View>
    )
  }


  render() {
    // if (this.siblings != null){
    //   this.siblings.update(this.siblingView())
    // }
    return null
  }
}


const styles = StyleSheet.create({
  textStyle: {
    marginTop: 200,
    marginLeft: 100,
    textAlign: 'center',
    height: 44,
    lineHeight: 44
  },
  modalStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
  },
  downViewStyle: {
    height: 50,
    marginHorizontal: 0,
    backgroundColor: 'green',
    marginTop: screenHeight - 50,
    alignItems: 'center',
  },
  backStyle: {
    position: 'absolute',
    // backgroundColor: 'green',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

});
