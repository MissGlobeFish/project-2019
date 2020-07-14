/**
 * FormDate --- 表单日期选择 与 DatePicker 配合使用
 */

import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity ,View, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import FormBaseComponents from './FormBaseComponents'
import PropTypes from 'prop-types'
import DatePicker from 'react-native-datepicker'

export default class FormDate extends FormBaseComponents {

  static propTypes = {
    title: PropTypes.string,       //表单项标题
    pickerDatas: PropTypes.array,  //备选数据 [{name: '', value: ''}]
    value: PropTypes.any,          //已选的值
    keyName: PropTypes.string,     //对应 form 字段名

    datePickerOption: PropTypes.object,          //时间选择器 DatePicker 参数

    onValueChanged: PropTypes.func,//值改变的回调
  }
  static defaultProps = {
    title: "",
    pickerDatas: [{ name: "暂无数据" }],
    editEnable: true,
    value: null,
    datePickerOption: {
      mode: "date", //时间模式
      placeholder: "",
      // minDate: "2016-05-01",
      // maxDate: "2016-06-01",
    },

    onValueChanged: (date, keyName, sender ) => { }
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
    const { title, onValueChanged, value, keyName, editEnable, datePickerOption, ...attributes } = this.props
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={this.itemOnClicked.bind(this)}>
        <Text style={styles.titleLab}>{title}</Text>
        <Text style={styles.valueLab}>{value}</Text>
        <DatePicker
          {...datePickerOption}
          ref="datePicker"
          locale="zh-cn"
          date={value}
          hideText={true}
          disabled={!editEnable}
          style={styles.pickerStyle}
          showIcon={false}
          format="YYYY-MM-DD"
          confirmBtnText="确定"
          cancelBtnText="取消"
          customStyles={{
            btnTextConfirm: { // 点击确定按钮样式
              color: '#4D66FD',
            },
            dateText: {
              lineHeight: 24,
              textAlign: 'right',
              fontFamily: 'PingFangSC-Regular',
              fontSize: 14,
              color: '#353535',
            },
            dateInput: {
              borderWidth: 0
            },
            disabled: {
              backgroundColor: '#fff'
            }
          }}
          //选择回调
          onDateChange={this.onPickerSelect.bind(this)}
          onOpenModal={() => {
            // console.log('打开')
          }}
          onCloseModal={() => {
            // console.log('关闭')
          }}
          onPressMask={() => {
            // console.log('点击蒙版')
            this.refs.datePicker.onPressCancel()
          }}
        />
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
    const { editEnable } = this.props
    if (editEnable) {
      this.refs.datePicker.onPressDate()
    }
    return editEnable
  }


  //处理Picker回调
  onPickerSelect(data) {
    const { keyName } = this.props
    // console.log("Select", data)
    this.props.onValueChanged(data, keyName, null )
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
    // backgroundColor: 'red',
    flex: 5,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#353535',
  },
  pickerStyle: {
    width: 0
  },
  arrowIcon: {
    paddingLeft: 5,
  }

});
