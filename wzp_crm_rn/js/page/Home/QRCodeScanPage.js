/**
 * QRCode 扫码界面
 */

import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { RNCamera } from 'react-native-camera';

type Props = {};
export default class QRCode extends Component<Props> {

  static defaultProps = {
    rectHeight: 280,
    rectWidth: 280,
  };


  static navigationOptions = {
    title: '扫一扫',
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      scanViewX: 0,
      scanViewY: 0,
      totalWidth: 0,
      totalHeight: 0,
      openFlash: false,
      flashText: '轻触开启',
      moveAnim: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    this.state.moveAnim.setValue(-this.props.rectHeight);
    Animated.timing(
      this.state.moveAnim,
      {
        toValue: 0,
        duration: 1500,
        easing: Easing.linear
      }
    ).start(() => this.startAnimation());
  };

  render() {
    const { navigate } = this.props.navigation;
    const { openFlash, totalHeight, totalWidth, scanViewX, scanViewY } = this.state;
    const { rectHeight, rectWidth } = this.props
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={openFlash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
        >

          <View
            style={styles.rectangleContainer}
            onLayout={({ nativeEvent: e }) => this.measureTotalSize(e)}
          >
            <View style={[styles.scanMask, styles.topMask, { height: scanViewY }]} />
            <View style={[styles.scanMask, styles.leftMask,
            { width: scanViewX, height: rectHeight ,top: scanViewY}]}
            />
            <View style={[styles.scanMask, styles.rightMask,
            { width: scanViewX, height: rectHeight ,top: scanViewY}]}
            />
            <View style={[styles.scanMask, styles.bottomMask, { height: totalHeight - scanViewY - rectHeight }]} />
            {/* 扫描框 */}
            <View
              style={[
                styles.rectangle,
                {
                  width: rectWidth,
                  height: rectHeight
                }]}
              onLayout={({ nativeEvent: e }) => this.measureRectPosition(e)}
            >
              {/* 扫描框角标 */}
              <View style={[styles.topCorner, styles.leftCorner, styles.rectCorner]} />
              <View style={[styles.topCorner, styles.rightCorner, styles.rectCorner]} />
              <View style={[styles.bottomCorner, styles.leftCorner, styles.rectCorner]} />
              <View style={[styles.bottomCorner, styles.rightCorner, styles.rectCorner]} />
            </View>
            {/* 扫描线 */}
            <Animated.Image
              source={require('../../res/imgs/ScanLine.png')}
              style={[
                styles.scanLine,
                { transform: [{ translateY: this.state.moveAnim }] }
              ]}
            />
            {/* 提示语 */}
            {/* <Text style={styles.rectangleText} onPress={() => navigate('DeviceInfoPage', { deviceId: "CB02216080001675"})}>text infos</Text> */}
            <TouchableOpacity onPress={this._changeFlash.bind(this)}>
              <View style={styles.flash}>
                <Image
                  source={require('../../res/imgs/Light.png')}
                  style={styles.flashIcon}
                />
                <Text style={styles.rectangleText}>
                  {this.state.flashText}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View >
    );
  }


  //测量整个扫描组件的大小
  measureTotalSize(e) {
    let totalSize = e.layout;
    this.setState({
      totalWidth: totalSize.width,
      totalHeight: totalSize.height,
    })
  }
  //测量扫描框的位置
  measureRectPosition(e) {
    let rectSize = e.layout;
    this.setState({
      scanViewY: rectSize.y,
      scanViewX: rectSize.x,
    })
  }

  //开灯关灯
  _changeFlash() {
    this.setState({
      openFlash: !this.state.openFlash,
      flashText: this.state.openFlash ? '轻触开启' : '点击关闭'
    });
  }

  //识别二维码
  onBarCodeRead = (result, type) => {
    const { navigate } = this.props.navigation;
    const { data } = result; //只要拿到data就可以了
    const obj = {
      deviceId: data,
    }
    navigate('DeviceInfoPage', obj)
  };

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  rectangle: {
    borderWidth: 1,
    borderColor: '#484848',
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10
  },
  scanLine: {
    flex: 0,
    width: 280,
    height: 2,
    // backgroundColor: '#4D66FD',
  },

  //扫描框边角
  rectCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#4D66FD'
  },
  topCorner: {
    top: 0,
    borderTopWidth: 2,
  },
  bottomCorner: {
    bottom: 0,
    borderBottomWidth: 2,
  },
  leftCorner: {
    left: 0,
    borderLeftWidth: 2,
  },
  rightCorner: {
    right: 0,
    borderRightWidth: 2,
  },

  //闪光灯开关
  flash: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 60,
  },
  flashIcon: {
    width: 12,
    height: 20
  },

  //界面遮罩
  scanMask: {
    position: 'absolute',
    backgroundColor: '#0000004D',
  },
  topMask: {
    top: 0,
    width: '100%',
  },
  bottomMask: {
    bottom: 0,
    width: '100%',
  },
  leftMask: {
    left: 0
  },
  rightMask: {
    right: 0
  },
});
