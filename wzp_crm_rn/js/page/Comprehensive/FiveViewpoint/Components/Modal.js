/*
 * @Description: 
 * @Author:  
 * @Date: 2019-12-30 15:32:53
 * @LastEditTime : 2020-01-02 20:00:42
 */

import React, { Component } from 'react'
import {  StyleSheet, Dimensions,Text, Image,View,TouchableOpacity,KeyboardAvoidingView,Modal,ScrollView  } from 'react-native'

export default class ModalComponents extends Component {
  static defaultProps = {
    visible: false,
    transparent: true,
    children: ""
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { visible, transparent } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={transparent}
          visible = {visible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        > 
          <TouchableOpacity style={styles.chidlrenContent} activeOpacity={1}>
            {this.props.children}
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }

  componentDidMount() {
    
  }
}

//Styles
const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  chidlrenContent: {
    position: 'relative',
    backgroundColor: "rgba(0,0,0,.7)",
    width: '100%',
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  }
})