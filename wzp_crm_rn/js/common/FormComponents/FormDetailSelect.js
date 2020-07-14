/**
 * FormDetailSelect --- 表单详情选择
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import FormBaseComponents from './FormBaseComponents'
import PropTypes from 'prop-types'


export default class FormDetailSelect extends FormBaseComponents {

  static propTypes = {
    title: PropTypes.string,       //表单项标题
    value: PropTypes.any,          //已选的值
    editEnable: PropTypes.bool,    //可否编辑
    onItermClicked: PropTypes.func,//点击回调
  }
  static defaultProps = {
    title: "",
    editEnable: true,
    value: null,
  };

  constructor(props) {
    super(props)
    this.state = Object.assign({

    }, this.state)
  }


  render() {
    return super.render();
  }

  subRender() {
    const { title, value, editEnable } = this.props
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={this.itemOnClicked.bind(this)}>
        <Text style={styles.titleLab}>{title}</Text>
        <Text style={styles.valueLab}>{value}</Text>
        {!editEnable || <Icon iconStyle={styles.arrowIcon}
          name="chevron-thin-right"
          type='entypo'
          size={18}
          color="#8B8B8B" />}
      </TouchableOpacity>
    )
  }


  //点击弹出 Picker
  itemOnClicked(event) {
    const {editEnable, onItermClicked } = this.props
    if (editEnable && typeof onItermClicked == "function" ) {
        onItermClicked()
    }
    return editEnable
  }

}

const styles = StyleSheet.create({

  container: {
    width: "100%",
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },

  titleLab: {
    maxWidth: "30%",
    marginRight: 10,
    fontFamily: "PingFangSC-Medium",
    fontSize: 14,
    color: "#353535",
  },
  valueLab: {
    fontSize: 14,
    flex: 5,
    textAlign: 'right',
    lineHeight: 24,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#353535',
  },
  arrowIcon: {
    paddingLeft: 5,
  }

});
