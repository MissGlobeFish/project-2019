/**
 * FormSection --- 表单单元项
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types'

export default class FormSection extends Component {

  static propTypes = {
    title: PropTypes.string,
    rightBtnTitle: PropTypes.string,
    enable: PropTypes.bool,
    onRightBtnTapped: PropTypes.func,
  }
  static defaultProps = {
    title: "",
    rightBtnTitle: "",
    enable: true,
    onRightBtnTapped: () => { }
  };


  constructor(props) {
    super(props)
  }
  render() {
    const { title, children, enable, rightBtnTitle, onRightBtnTapped } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.titleLabContainer}>
        <Text style={styles.titleText}>{title}</Text>
          {!enable || (
            <TouchableOpacity
              onPress={() => {
                if (onRightBtnTapped != null) {
                  onRightBtnTapped()
                }
              }}
            >
              <Text style={styles.rightBtnText}>{rightBtnTitle}</Text>
            </TouchableOpacity>
            )
          }
        </View>
        {children}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F9',
    paddingTop: 10,
  },
  titleLabContainer: {
    height: 42,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    color: '#353535',
    lineHeight: 42,
    fontWeight: 'bold'
  },
  rightBtnText: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 14,
    color: "#306FFE",
    textAlign: "right",
    lineHeight: 42,
  }
})