/**
 * Payroll  我的 -- 工资单
 */
import React, { Component } from 'react';
import { StyleSheet,ScrollView,TouchableOpacity, Text, View, Image, FlatList, DatePickerIOS } from 'react-native';
import ajax from '../../config/Fetch';
import PersistanceManger from '../../util/PersistanceManger';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
import moment from 'moment';
import  ListCommon  from '../../common/ListCommon';
import URLS from '../../config/Fetch'

export default class Payroll extends Component {
  static navigationOptions = {
    title: '工资单'
  };
  _keyExtractor = (item, index) => item.listKey;
  constructor(props){
    super(props)
    this.state = {
      date: '',
      // date: moment(new Date()).format('YYYY') +'-'+ (moment(new Date()).format('MM') - 1),
      visible: false, // 是否隐藏模版，false隐藏，true显示
      infoData: '',
      securityCode: '',
      dataStatus: false,
      data: []
    }
  }
  showPicker=(isShow)=>{ // 时间选择器
    const { goBack, getParam } = this.props.navigation;
    this.setState({
      visible: isShow
    })
    let data = [];
    let year = [];
    let month = [];
    let length = moment(new Date()).format('YYYY');
    let currYear = moment(new Date()).format('YYYY')+'年';
    let currMonth = moment(new Date()).format('MM')+'月';
    for(var i=2016;i<=length;i++){
      year.push(i+'年');
    }
    for(var i=1;i<=12;i++){
      if (i< 10) {
        month.push('0'+i+'月');
      } else {
        month.push(i+'月');
      }
    }
    data[0]=year
    data[1]=month
    Picker.init({
        pickerData: data,
        selectedValue: [currYear,currMonth],
        pickerConfirmBtnText: '确认',
        pickerTitleText: '请选择日期',
        pickerCancelBtnText: '取消',
        onPickerConfirm: data => {
          let newselectdate = data[0]+data[1]
          this.setState({
            date: newselectdate,
            visible: false
          })
          this.getData(this.state.securityCode)
        },
        onPickerCancel: data => {
          this.setState({
            visible: false
          })
        },
        onPickerSelect: data => {
        }
    });
    if (isShow) {
      Picker.show()
    }
  }
  componentDidMount() {
    this.showPicker(false)
    const {getParam } = this.props.navigation;
    this.setState({
      securityCode: getParam('securityCode')
    })
    this.getData(getParam('securityCode'),true)
  }
  componentWillUnmount() { //组件销毁
    Picker.hide()
  }
  getData(securityCode,isFirst) { //获取数据
    console.log('securityCode',securityCode)
    let curdate;
    if (isFirst) { // isFirst是否是第一次请求。是--默认请求上一个月工资 否就请求用户自己选择日期工资
      let currentYear = moment(new Date()).format('YYYY');//获取当月的年份
      let currentMonth = moment(new Date()).format('M');//获取当月的月份
      if (currentMonth-1 <= 0) {
        currentYear = currentYear*1-1;
        currentMonth = 12;
      } else {
        currentMonth = currentMonth*1-1
        if (currentMonth <=9) {
          currentMonth = '0'+currentMonth
        }
      }
      this.setState({
        date: currentYear+'年'+currentMonth+'月'
      })
      curdate = currentYear+'-'+currentMonth;
      this.handleData(securityCode,curdate)
    } else {
      curdate = this.state.date;
      curdate = curdate.replace(/年/g,"-").replace(/月/g,"");
      this.handleData(securityCode,curdate)
    }
  }
  // 请求工资列表
  handleData(securityCode,curdate) {
    console.log(PersistanceManger.ShareInstance(),curdate,securityCode,'obj')
    ajax.get('/user/payroll',{empCode: PersistanceManger.ShareInstance().empCode,salaryPayMonth:curdate,securityCode: securityCode})
    .then((res)=>{
      if (res.data && res.data != null) {
        console.log(res,'工资')
        this.setState({
          dataStatus: true,
          infoData: res.data
        })
      } else {
        console.log('没有值')
        this.setState({dataStatus: false})
      }
    })
    .catch((error)=>{
      this.setState({dataStatus: false})
      console.log(error, 'error--Payroll--107')
    })
  }
  // 旺小宝工资模版
  wxbMoudle () {
    const {infoData} = this.state
    return (
      <View style={{flex: 1}}>

        <View style={{height:'100%'}}>
          <View><Text style={styles.payrolltext}>以下是您的工资明细表，请务必确认无误！如无疑问，即等同于亲自签收!(注意薪资保密，如果任何疑问，请咨询HR杨峥嵘)</Text></View>
          <ScrollView>
            <View style={styles.sectionTitle}>
              <Text>基本信息</Text>
            </View>
            <ListCommon  listKey='部门' listValue={infoData.deptName}/>
            <ListCommon  listKey='工号' listValue={infoData.empCode}/>
            <ListCommon  listKey='姓名' listValue={infoData.empName}/>
            <ListCommon  listKey='入职日期' listValue={infoData.lastHireDate}/>
            <ListCommon  listKey='基本工资' listValue={infoData.salaryBasic}/>
            {/* <ListCommon  listKey='补助' listValue={infoData.salarySubsidy}/> */}
            <ListCommon  listKey='工龄奖' listValue={infoData.salarySeniority}/>
            <ListCommon  listKey='本月应发工资:' listValue={infoData.salaryMonth}/>
            <View style={styles.sectionTitle}>
              <Text>考勤扣除项目</Text>
            </View>
            <ListCommon  listKey='病假' listValue={infoData.salarySickPay}/>
            <ListCommon  listKey='事假' listValue={infoData.salaryAbsencePay}/>
            <ListCommon  listKey='迟到' listValue={infoData.salaryLatePay}/>
            {/* <ListCommon  listKey='漏刷卡' listValue={infoData.salaryMissPay}/> */}
            <ListCommon  listKey='缺勤应扣合计：' listValue={infoData.salaryAbsenteeismCount}/>
            <View style={styles.sectionTitle}>
              <Text>补助/提成</Text>
            </View>
            <ListCommon  listKey='交通补助' listValue={infoData.salaryTrafficPay}/>
            <ListCommon  listKey='通讯补助' listValue={infoData.salaryContactPay}/>
            <ListCommon  listKey='电脑补助' listValue={infoData.salaryComputerPay}/>
            
            <ListCommon  listKey='销售提成' listValue={infoData.salarySale}/>
            {/* <ListCommon  listKey='支付返佣' listValue={infoData.salaryInstall}/> */}
            <ListCommon  listKey='绩效奖金' listValue={infoData.salaryAchievements}/>
            {/* <ListCommon  listKey='售后提成' listValue={infoData.salaryAfterSales}/> */}
            <ListCommon  listKey='仓管补贴' listValue={infoData.salaryDepot}/>
            <ListCommon  listKey='地产项目奖金' listValue={infoData.salaryEstate}/>
            <ListCommon  listKey='税前增加' listValue={infoData.salaryOther1}/>
            <ListCommon  listKey='税前扣除' listValue={infoData.salaryOther3}/>
            <ListCommon  listKey='应发小计：' listValue={infoData.salarySubtotal}/>
            <View style={styles.sectionTitle}>
              <Text>其他扣除项</Text>
            </View>
            <ListCommon  listKey='社保' listValue={infoData.salarySocialSecurity}/>
            <ListCommon  listKey='住房公积金' listValue={infoData.salaryAccumulationFund}/>
            <ListCommon  listKey='个税' listValue={infoData.salaryPersonalTax}/>
            <ListCommon  listKey='发票罚款' listValue={infoData.invoicePenalty}/>
            <ListCommon  listKey='税后减少' listValue={infoData.salaryOther2}/>
            <ListCommon  listKey='应扣小计：' listValue={infoData.salaryDeductible}/>
            <View style={styles.sectionTitle}>
              <Text>合计</Text>
            </View>
            <ListCommon  listKey='实发工资一：' listValue={infoData.salaryNinePay}/>
            <ListCommon  listKey='实发工资二：' listValue={infoData.salaryTwentyPay}/>
            <View style={styles.sectionTitle}>
              <Text>备注</Text>
            </View>
            <Text style={styles.remarkLab}>{ infoData.salaryDesc || "无"}</Text>
          </ScrollView>
          <View><Text style={styles.payrolltext}>实发工资=应发合计-应扣合计</Text></View>
        </View>
     </View>
    )
  }
  // 国盛天丰工资模版
  gstfMoudle () {
    const {infoData} = this.state
    return (
      <View style={{flex: 1}}>
        <View style={{height:'100%'}}>
          <View><Text style={styles.payrolltext}>以下是您的工资明细表，请务必确认无误！如无疑问，即等同于亲自签收!(注意薪资保密，如果任何疑问，请咨询HR杨峥嵘)</Text></View>
          <ScrollView>
            <ListCommon  listKey='部门' listValue={infoData.deptName}/>
            <ListCommon  listKey='工号' listValue={infoData.empCode}/>
            <ListCommon  listKey='姓名' listValue={infoData.empName}/>
            <ListCommon  listKey='入职日期' listValue={infoData.lastHireDate}/>
            <ListCommon  listKey='基本工资' listValue={infoData.salaryBasic}/>
            <ListCommon  listKey='补助' listValue={infoData.salarySubsidy}/>
            <ListCommon  listKey='工龄奖' listValue={infoData.salarySeniority}/>
            <ListCommon  listKey='本月应发工资' listValue={infoData.salaryMonth}/>
            <ListCommon  listKey='病假' listValue={infoData.salarySickPay}/>
            <ListCommon  listKey='事假' listValue={infoData.salaryAbsencePay}/>
            <ListCommon  listKey='迟到' listValue={infoData.salaryLatePay}/>
            <ListCommon  listKey='漏刷卡' listValue={infoData.salaryMissPay}/>
            <ListCommon  listKey='缺勤应扣合计：' listValue={infoData.salaryAbsenteeismCount}/>
            <ListCommon  listKey='电脑补助' listValue={infoData.salaryComputerPay}/>
            <ListCommon  listKey='交通补助' listValue={infoData.salaryContactPay}/>
            {/* <ListCommon  listKey='续费奖金' listValue={infoData.salaryRenew}/> */}
            <ListCommon  listKey='地产项目奖金' listValue={infoData.salaryEstate}/>
            <ListCommon  listKey='税前增加' listValue={infoData.salaryOther1}/>
            <ListCommon  listKey='税前扣除' listValue={infoData.salaryMember}/>
            <ListCommon  listKey='季度奖金' listValue={infoData.salaryQuarter}/>
            <ListCommon  listKey='社保' listValue={infoData.salarySocialSecurity}/>
            <ListCommon  listKey='住房公积金' listValue={infoData.salaryAccumulationFund}/>
            <ListCommon  listKey='个税' listValue={infoData.salaryPersonalTax}/>
            <ListCommon  listKey='其他（二）' listValue={infoData.salaryOther2}/>
            <ListCommon  listKey='应扣小计：' listValue={infoData.salaryDeductible}/>
            <ListCommon  listKey='实发工资：' listValue={infoData.salaryPay}/>
          </ScrollView>
          <View><Text style={styles.payrolltext}>备注：实发工资=应发合计-应扣合计</Text></View>
        </View>
      </View>
    )
  }
  emptyMoudle () {
    return (
      <View style={{marginTop:100,alignItems:'center',justifyContent:'center'}}><Text >暂无查询数据哦～</Text></View>
    )
  }
  render() {
    const { goBack, getParam } = this.props.navigation;
    const {infoData} = this.state;
    return (
      <View style={styles.listinfo}>
      {this.state.visible &&<View style={styles.maskView}>
            <TouchableOpacity onPress={(()=> {
              this.setState({ // 更改state数据的值
                visible: false
              })
              Picker.hide()
          })}>
              <View style={styles.fillView}></View>
             </TouchableOpacity>
        </View>} 
        <TouchableOpacity onPress={this.showPicker}>
          <View style={styles.datepicker}>
            <Text>{this.state.date}</Text>
            <Icon name="angle-down" size={20} color="#8B8B8B" style={{marginLeft: 10}}/>
          </View>
        </TouchableOpacity>
        {/* 旺小宝和国sheng */}
        <View style={{flex:1}}>
        {
        // infoData ? infoData.companyCode == "WXB" ? this.wxbMoudle() : this.gstfMoudle(): 'null'
          this.state.dataStatus ? infoData.companyCode == "WXB" ? this.wxbMoudle() : this.gstfMoudle() : this.emptyMoudle()
        }
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  listinfo:{
    flex: 1,
    backgroundColor: '#fff'
  },
  maskView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,.8)'
  },
  maskView: {
    position: 'absolute',
    width: '100%',
    height: '100%', 
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  fillView: {
      width:'100%',
      height:'100%',
  },
  sectionTitle: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E8E8E8',
    lineHeight: 18,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7 ,
    backgroundColor: '#F5F5F9',
    color: '#000000'
  },
  remarkLab: {
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 16,
    color: '#808080',
    paddingLeft: 15,
    paddingRight: 15
  },
  datepicker: {
    flexDirection: 'row',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  payrolltext: {
    lineHeight: 18,
    fontSize: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7 ,
    backgroundColor: '#F5F5F9',
    color: '#808080'
  }
});
