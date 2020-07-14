/** 
 *  右抽屉
*/
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';

import RootSiblings from 'react-native-root-siblings';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const rightWidth = screenWidth - 100;
const leftSpace = 100;
export default class RightSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
          siblings : null
        }
        this.siblings = null

        this.marginLeftValue = new Animated.Value(0); // 左侧向右动画初始值，默认为0
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

            // this.marginLeftValue.setValue(0);
            // 组动画，组内动画同时执行
            Animated.parallel([
                // 从左向右的动画效果
                Animated.timing(
                    this.marginLeftValue,
                    {
                        toValue: 1,
                        duration:250,
                        easing: Easing.linear
                    }
                ),
                // 透明度变化的动画效果
                Animated.timing(
                    this.fadeInAnimated, {
                        toValue: 0.7, // 1为不透明
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
                this.marginLeftValue,
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
        ]).start(()=> {
            if (this.siblings != null){
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
  siblingView(){
    const movingMargin = this.marginLeftValue.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0,-rightWidth]
  });
    return(
      <View style={styles.modalStyle}
      >                             
      <Animated.View style={[styles.modalStyle,
          {
          position: 'absolute',
          backgroundColor: 'black',
          width: screenWidth,
          height: screenHeight,
          opacity: this.fadeInAnimated}]}>
      </Animated.View>
      {/*z左侧蒙版按钮*/}
      <TouchableOpacity style={styles.rightStyle}
      onPress={()=>{
          this.hideModalByFadeIn();
      }}
      activeOpacity={1}
      />

        <View style={{marginTop: 0,
                    marginLeft: screenWidth,
                    width: screenWidth,
                    height: screenHeight,
                    flexDirection: 'row',
            }}>
            {/*动画View*/}
            <Animated.View style={{marginTop: 0,
                        marginLeft: movingMargin,
                        width: rightWidth,
                        height: screenHeight,
                        backgroundColor: '#efefef',
                }}>
                {this.subRender()}
            </Animated.View>
        </View>

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
        left: 0
    },
    downViewStyle: {
        height: 50,
        marginHorizontal: 0,
        backgroundColor: 'green',
        marginTop: screenHeight - 50,
        alignItems: 'center',
    },
    rightStyle: {
      position: 'absolute',
      left: 0,
      width: leftSpace,
      height: screenHeight
    }

});