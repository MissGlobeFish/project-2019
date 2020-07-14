
/**
 * DatePickList --- 上边栏 时间选择
 */
import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList } from 'react-native';
import TopSidebar from '../Sidebar/TopSidebar'
import propTypes from 'prop-types'
import DateTool from '../../util/DateTool'
import DatePicker from 'react-native-datepicker'

export default class DatePickList extends TopSidebar {

  static propTypes = Object.assign({
    handleSelectDates: propTypes.func
  }, TopSidebar.propTypes)


  static defaultProps = Object.assign({
    handleSelectDates: propTypes.func
  }, TopSidebar.defaultProps)

  constructor(props) {
    super(props ? props : {});
    this.props.backOpacity = 0
    this.state = Object.assign({
      choiceContent: [
        { label: "今天", code: "today" },
        { label: "昨天", code: "yesterday" },
        { label: "过去7天", code: "past7Days" },
        { label: "过去30天", code: "past30Days" },
        { label: "本周", code: "thisWeek" },
        { label: "本月", code: "thisMonth" },
        { label: "上月", code: "lastMontn" },
        { label: "本季度", code: "thisQuarter" },
        { label: "上季度", code: "lastQuarter" },
        // { label: "自定义", code: "custom" },
      ],
      customDate: [], //自定义时间选择
    }, this.state)
    this.startDatePicker = React.createRef();
    this.endDatePicker = React.createRef();
  }

  // render渲染父组件


  customDataPicker() {
    const {customDate } = this.state
    return (

      <View>
        <DatePicker
          ref={(ndoe) => this.startDatePicker = ndoe}
          locale="zh-cn"
          style={[styles.cellContentBox, styles.datepicker, { borderTopWidth: 1, borderTopColor: '#e1e1e1', }]}
          placeholder="自定义开始时间"
          date={customDate[0]}
          maxDate={new Date()}
          showIcon={false}
          format="YYYY.MM.DD"
          confirmBtnText={"确定"}
          cancelBtnText="取消"
          customStyles={{
            btnTextConfirm: { // 点击确定按钮样式
              color: '#4D66FD',
            },
            dateInput:{borderWidth: 0}
          }}
          onDateChange={ (res)=>{this.onPickerSelect(res, 0)}}
          onPressMask={() => {
            this.startDatePicker.onPressCancel()
          }} />
        <DatePicker
          ref={(ndoe) => this.endDatePicker = ndoe}
          locale="zh-cn"
          style={[styles.cellContentBox, styles.datepicker]}
          placeholder="自定义结束时间"
          date={customDate[1]}
          minDate={customDate[0]}
          maxDate={new Date()}
          showIcon={false}
          format="YYYY.MM.DD"
          confirmBtnText={"确定"}
          // confirmBtnText={this.state.customDate.length == 0 ? "下一步" : "确定"}
          cancelBtnText="取消"
          customStyles={{
            btnTextConfirm: { // 点击确定按钮样式
              color: '#4D66FD',
            },
            dateInput:{borderWidth: 0}
          }}
          onDateChange={ (res)=>{this.onPickerSelect(res, 1)}}
          onPressMask={() => {
            this.endDatePicker.onPressCancel()
          }} />
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.cellContentBox}
          disabled={ !customDate || customDate.length < 2}
          onPress={() => {
            this.handleDidSelectedItem({code: 'custom'})
          }}
        >
          <Text style={ (!customDate || customDate.length < 2) ? {color: '#808080'} : {color: '#306FFE'} }>{"确定"}</Text>
        </TouchableOpacity>
      </View>

    )
  }





  subRender() {
    const { choiceContent } = this.state
    var selectIterms = choiceContent.map(item => {
      return (
        <TouchableOpacity
          activeOpacity={0.75}
          key={item.label}
          style={styles.cellContentBox}
          onPress={() => {
            this.handleDidSelectedItem(item)
          }}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
      )
    });

    return (
      <View style={styles.btnBox}>
        {selectIterms}
        {this.customDataPicker()}
      </View>
    )
  }


  /**
   * 选定某一个项目
   *
   * @param {*} item
   * @memberof DatePickList
   */
  handleDidSelectedItem(item) {
    const { handleSelectDates } = this.props
    if (!handleSelectDates) {
      return;
    }
    let result = null
    let dateTool = new DateTool(".")
    switch (item.code) {
      case "today":
        result = dateTool.getToday()
        break;
      case "yesterday":
        result = dateTool.getYesterday()
        break;
      case "past7Days":
        result = dateTool.pastDaysFromNow(7)
        break;
      case "past30Days":
        result = dateTool.pastDaysFromNow(30)
        break;
      case "thisWeek":
        result = dateTool.thisWeek()
        break;
      case "thisMonth":
        result = dateTool.thisMonth()
        break;
      case "lastMontn":
        result = dateTool.lastMonth()
        break;
      case "thisQuarter":
        result = dateTool.thisQuarter()
        break;
      case "lastQuarter":
        result = dateTool.lastQuarter()
        break;
      case "custom":
        result = this.state.customDate
        break;
      default:
        break;
    }


    if (result != null) {
      this.hideModalByFadeIn()
      handleSelectDates(result)
    }
  }


  /**
   * datePicker 选择回调
   *
   * @param {*} date
   * @memberof DatePickList
   */
  onPickerSelect(date, index) {
   
    this.state.customDate[index] = date
    this.updateSibling()
  }


}

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'orange'
  },
  btnBox: {
    marginTop: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 10
  },
  cellContentBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5,
    height: 40,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  datepicker: {
    borderWidth: 0,
    // backgroundColor: 'orange',
    width: '100%'
  }

});
