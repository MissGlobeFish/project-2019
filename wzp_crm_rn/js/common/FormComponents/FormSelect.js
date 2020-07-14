/**
 * FormSelect --- 表单单选  与 FormPicker 配合使用
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import FormBaseComponents from './FormBaseComponents'
import PropTypes from 'prop-types'
import FormPicker from './FormPicker'
import Toast from '../Toast'


export default class FormSelect extends FormBaseComponents {

  static propTypes = {
    title: PropTypes.string,       //表单项标题
    pickerDatas: PropTypes.array,  //备选数据 [{name: '', value: ''}]
    value: PropTypes.any,          //已选的值
    keyName: PropTypes.string,     //对应 form 字段名
    onValueChanged: PropTypes.func,//值改变的回调
  }
  static defaultProps = {
    title: "",
    pickerDatas: [{ name: "暂无数据" }],
    editEnable: true,
    value: null,
    onValueChanged: (text, keyName, sender ) => { }
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
    const { title, onValueChanged, value, keyName, editEnable, ...attributes } = this.props
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
    const { title, pickerDatas, editEnable, value } = this.props
    if (editEnable) {
      if (pickerDatas == null || pickerDatas.length == 0) {
        Toast.showFail("未能获取备选项！")
        return
      }
      FormPicker.config(title, pickerDatas, this.onPickerSelect.bind(this), this.onPickerCancel.bind(this))
      value ? FormPicker.showPicker(value) : FormPicker.showPicker()
    }
    return editEnable
  }


  //处理Picker回调
  onPickerSelect(data) {
    const { keyName, onValueChanged } = this.props
    // console.log("Select", data)
    onValueChanged( data, keyName, null)
  }

  //点击取消
  onPickerCancel() {
    // console.log("cancel")
  }


}

const styles = StyleSheet.create({

  container: {
    // backgroundColor: 'green',
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
