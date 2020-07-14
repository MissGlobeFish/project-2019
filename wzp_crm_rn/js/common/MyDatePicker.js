import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
 
export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {date:"2016-05-15"}
  }
 
  render(){
    return (
      <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode="date"
        showIcon={false}
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="2016-05-01"
        maxDate="2016-06-01"
        confirmBtnText="确定"
        cancelBtnText="取消"
        customStyles={{
          btnTextConfirm: { // 点击确定按钮样式
              color: '#4D66FD',
          },
          dateInput: {
            borderWidth: 0
          }
      }}
        onDateChange={(date) => {this.setState({date: date})}}
        onOpenModal={()=>{
          console.log('打开')
        }}
        onCloseModal={()=>{
          console.log('关闭')
        }}
        onPressMask={()=>{
          console.log('点击蒙版')
        }}
      />
    )
  }
}