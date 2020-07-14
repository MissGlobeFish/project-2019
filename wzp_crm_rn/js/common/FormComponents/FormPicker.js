/**
 * FormPicker--选择器
 */
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Picker from 'react-native-picker';
import RootSiblings from 'react-native-root-siblings';
import Toast from '../Toast';

let pickerSilbling = null;

export default class FormPicker extends Component {

  constructor(props) {
    super(props)
  }

  static _titleName = ''  //标题
  static _pickerDatas = [{ name: "暂无数据" }] //备选项目
  static _onPickerSelected = (data) => { }   //选择回调
  static _onPickerCanceled = () => { }   //取消回调

  /**
   * 配置选择器数据
   *
   * @param {String} titleName
   * @param {Array} pickerDatas
   * @param {func} onPickerSelected
   * @param {func} onPickerCanceled
   * @memberof FormPicker
   */
  static config(titleName, pickerDatas, onPickerSelected, onPickerCanceled) {
    _titleName = titleName,
    _onPickerSelected = onPickerSelected
    _onPickerCanceled = onPickerCanceled
    _pickerDatas = pickerDatas
  }

  /**
   * 显示选择器
   *
   * @memberof FormPicker
   */
  static showPicker(selectedValue = _pickerDatas[0].name) {
    if (pickerSilbling != null) {
      pickerSilbling.destroy()
    }
    let data = _pickerDatas.map((item) => {
      return item.name
    })
    Picker.init({
      pickerData: data, // 选择器的选项
      pickerTitleText: _titleName, // 选择器title文字
      selectedValue: [selectedValue],// 默认选择的数据
      pickerConfirmBtnColor: [81, 138, 253, 1],// 确定按钮颜色
      pickerCancelBtnColor: [170, 170, 170, 1],// 取消按钮颜色
      pickerToolBarBg: [255, 255, 255, 1],//选择器工具栏背景颜色
      pickerBg: [255, 255, 255, 1],// 选择器颜色
      pickerConfirmBtnText: '确定', // 确定按钮的文字显示
      pickerCancelBtnText: '取消',//取消按钮文字描述
      pickerTextEllipsisLen: 14, //android 省略字数
      //确认选择
      onPickerConfirm: data => {
        if (pickerSilbling != null) {
          pickerSilbling.destroy()
        }
        let result = _pickerDatas.find((item) => {
          return item.name == data[0]
        })
        if (result && _onPickerSelected) {
          _onPickerSelected(result)
        } else if (result) {
          console.log("未设置回调！")
        } else {
          Console.log("ERROR; 找不到对应数据")
        }
      },
      //取消选择
      onPickerCancel: (data) => {
        if (pickerSilbling != null) {
          pickerSilbling.destroy()
        }
        _onPickerCanceled && _onPickerCanceled()
      },
      //滚动至某一项回调
      onPickerSelect: (data) => { }
    });
    let silbling = new RootSiblings(
      <TouchableOpacity
        activeOpacity={1}
        style={styles.pickerContainer}
        onPress={() => {
          this.closePicker()
        }}
      >
      </TouchableOpacity>
    );
    pickerSilbling = silbling;
    Picker.show()
  }

  /**
   * 隐藏选择器
   *
   * @memberof FormPicker
   */
  static closePicker() {
    Picker.hide()
    if (pickerSilbling != null) {
        pickerSilbling.destroy()
    }
  }


  componentDidMount() {

  }
  componentWillUnmount() { //组件销毁
  }
  render() {
    return null
  }
}

const styles = StyleSheet.create({
  pickerContainer: {
    // height: 1000,
    // width: 375,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.4)',
    zIndex: 9,
    position: 'absolute'
  }
})