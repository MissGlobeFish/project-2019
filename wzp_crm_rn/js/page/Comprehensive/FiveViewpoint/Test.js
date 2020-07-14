/**
* *  我的五观卡
*/
import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Easing,Animated } from 'react-native';

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      demo: {
        width: 300,
        height: 300,
        backgroundColor: '#992211',
        position: 'relative'
      },
      rotateValue: new Animated.Value(0),
      item01: {
        left: 10,
        backgroundColor: 'yellow'
      },
      item02: {
        left:120,
        backgroundColor: 'grey'
      },
      item03: {
        left: 10,
        top: 80,
        backgroundColor: 'red'
      },
      item04: {
        left: 120,
        top: 80,
        backgroundColor: 'green'
      },
      topValue: new Animated.Value(0),
      top02Value: new Animated.Value(10),
      top03Value: new Animated.Value(20),
      leftValue: new Animated.Value(0),
      item01leftValueAnim:  new Animated.Value(0),
      item02leftValueAnim:  new Animated.Value(80),
      item03leftValueAnim:  new Animated.Value(160),
      item04leftValueAnim:  new Animated.Value(240),
    }
    
    
  }
  componentDidMount() {
    // this.startAnimation()
    // this.leftAmimation()
    // this.setState({
    //   item01leftValueAnim:  new Animated.Value(240),
    // })
  }

  leftAmimation() {
    var timing = Animated.timing;
    Animated.parallel(['item01leftValueAnim', 'item02leftValueAnim', 'item03leftValueAnim','item04leftValueAnim'].map(property => {
      return timing(this.state[property], {
      toValue: 50,
      duration: 1000,
      easing: Easing.linear
      });
    })).start((()=>{
      console.log(13213)
    }))
    // Animated.timing(this.state.item01leftValueAnim, {
    //   toValue: 50,
    //   duration: 1000,
    //   easing: Easing.linear
    // }).start()
  }
  topAmimation() {
    // top02Value
    var timing = Animated.timing;
    Animated.parallel(['top02Value','topValue','top03Value'].map(property => {
      return timing(this.state[property], {
        toValue: 50,
        duration: 1000,
        easing: Easing.linear
      });
    })).start()
    // Animated.timing(this.state.topValue, {
    //   toValue: 100,
    //   duration: 1000,
    //   easing: Easing.linear
    // }).start()
  }

  startAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.timing(this.state.rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear
    }).start(() => this.startAnimation());
}

  render() {
    const item = {
      position: 'absolute',
      width: '20%',
      height: '10%',
      backgroundColor: '#000'
    }
    const test= {
      top: 10
    }
    const {item01,item02,item03,item04} = this.state;
    return (
      <Animated.View style={[this.state.demo]}>
        <View style={{position: 'relative',width: '100%',height: '100%'}}>
          <Animated.View style={[item,{
            left: this.state.item01leftValueAnim.interpolate({
              inputRange:[0,100],
              outputRange:['0%','100%']
            }),
            top: this.state.topValue.interpolate({
                            inputRange:[0,100],
              outputRange:['0%','100%']
            })
          }]}>
          </Animated.View>
          {/* <Animated.View style={[item,{
            left: this.state.item02leftValueAnim,
            top: this.state.top02Value
          }]}>
          </Animated.View>
          <Animated.View style={[item,item03,{
            left: this.state.item03leftValueAnim,
            top: this.state.top03Value
          }]}>
          </Animated.View> */}
          {/* <Animated.View style={[item,item04,{
            left: this.state.item04leftValueAnim,
            top: this.state.topValue
          }]}>
          </Animated.View> */}
          
          {/* <Animated.View style={[item,item02,{transform: [{
          rotateZ: this.state.rotateValue.interpolate({
              inputRange: [0,1],
              outputRange: ['0deg', '360deg']
          })}]}]}>
          </Animated.View>
          
          <Animated.View style={[item,item03,{transform: [{
          rotateZ: this.state.rotateValue.interpolate({
              inputRange: [0,1],
              outputRange: ['0deg', '360deg']
          })}]}]}>
          </Animated.View>
          
          <Animated.View style={[item,item04,{transform: [{
          rotateZ: this.state.rotateValue.interpolate({
              inputRange: [0,1],
              outputRange: ['0deg', '360deg']
          })}]}]}>
          </Animated.View> */}
        </View>
        
        
        <TouchableOpacity style={{position: 'absolute',top: '50%',left: '50%', width: 40, height: 40, backgroundColor: 'yellow'} } onPress={()=>{
          this.test()
        }}></TouchableOpacity>
      </Animated.View>
    )
  }


  test() {
    this.leftAmimation()
    this.topAmimation()
    this.setState({
      // item01: {
      //   top: '50%',
      //   left: '50%'
      // },
      // item02: {
      //   top: '50%',
      //   left: '50%'
      // }
      // demo: {
      //   width: 100,
      //   height: 100,
      //   backgroundColor: '#992211'
      // }
    })
  }
}

