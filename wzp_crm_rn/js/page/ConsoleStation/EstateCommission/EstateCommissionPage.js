/**
*  地产提成页面
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, ScrollView, Image, DatePickerIOS } from 'react-native';
import SidebarSelect from '../../../common/FormComponents/SidebarSelect'
import LoadMore from '../../../common/LoadMoreFooter';
const { height } = Dimensions.get('window');
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
import moment, { months } from 'moment';

export default class  EstateCommissionPage extends Component {

    static navigationOptions = ({ navigation }) => {
        let showPicker = navigation.getParam('showPicker')
        let month = navigation.getParam('month')
       
        //时间选择按钮
        let dateSelectBtn = (
            <TouchableOpacity onPress={showPicker}>
                <View style={{flexDirection: 'row', height: 32, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{month}</Text>
                    <Icon name="angle-down" size={20} color="#8B8B8B" style={{marginLeft: 10}}/>
                </View>
            </TouchableOpacity>
        )
        return {
            headerTitle: dateSelectBtn, //时间
        }
    }

    //Interactive Data
    get month() {
        return this._month
    }

    set month(date) {
        this.props.navigation.setParams({ month: date })
        this._month = date
    }

   constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            month: '',
            dataDate: '',
            type: [0,1,2],
            listTotal: '',
            monthlyList: [],
            quarterList: [],
            commissionList: [],
            choiceContent: [ //筛选数据条件
                {
                    name: '显示符合下列条件的结果', paramKey: 'formId1', isCheckBox: true, children: [
                        { formId: '0', name: '满足提成条件', childselect: true },
                        { formId: '1', name: '不满足提成条件', childselect: true },
                        { formId: '2', name: '季度达到100%补差', childselect: true }]
                },
            ],
            monthlyListShow: false,// 是否显示月度完成率模块，false隐藏，true显示
            quarterListShow: false,// 是否显示季度完成率模块，false隐藏，true显示
            isQuarter: false,// 是否有季度列表模块，false隐藏，true显示
            visible: false, // 是否隐藏模版，false隐藏，true显示
            isShow: true, // 是否刷新
        }
     };

    //Life Cycle 
    componentWillMount() {//组件渲染之前
        this.showPicker(false)
        let mydate = new Date;
        let year = mydate.getFullYear(); 
        let month = mydate.getMonth()+1;
        let date = mydate.getDate();
        if (date < 10) {
            if (month == 1) {
                month = 12;
                year = year - 1;
            }else{
                month = month - 1;
            }
        }
        this.month = year+'年'+month+'月';
        this.setState({
            dataDate: year+'-'+month
        })
        this.judgeQuarter(year+'-'+month);
        this.handleRateInit(year+'-'+month);
        this.handleCommissionInit(year+'-'+month);
    }

    componentDidMount() {//组件已经渲染成功
        const { setParams } = this.props.navigation;
        setParams({
            showPicker: this.showPicker.bind(this),
            month: this.month,
        })
    }

    componentWillUnmount() {
        
    }

    //SubRenders

    //Render
    render() {
        return (
           <ScrollView>
                <View>
                    <SidebarSelect ref="sidebar" choiceContent={this.state.choiceContent} handleSelect={this.handleSelect.bind(this)} />
                </View>
                <FlatList
                    data={this.state.monthlyList}
                    extraData={this.state}
                    renderItem={({item}) => this._createMonthlyListItem(item)}//月度列表
                    ListHeaderComponent={this.state.monthlyListShow?this._monthlyListHeaderComponent:null} // 头部组件
                />
                <FlatList
                    data={this.state.quarterList}
                    extraData={this.state}
                    renderItem={({item}) => this._createQuarterListItem(item)}//季度列表
                    ListHeaderComponent={this.state.isQuarter && this.state.quarterListShow?this._quarterListHeaderComponent:null} // 头部组件
                />
                <FlatList
                    data={this.state.commissionList}
                    renderItem={({item}) => this._createListItem(item)}//列表
                    ListHeaderComponent={this._ListHeaderComponent.bind(this)} // 头部组件
                    ListEmptyComponent = {this.state.isShow? null:this._ListEmptyComponent}            
                />
                <View style={styles.listBottm}>
                    <Text style={styles.listItem}>合计：</Text>
                    <Text style={styles.fontStyle}>{this.state.listTotal}元</Text>
                </View>
           </ScrollView>
       );
    }

    //月度头部布局
    _monthlyListHeaderComponent() {
        return (
            <View style={styles.listTop}>
                <Text style={styles.fontStyle}>月度完成率</Text>
            </View>
        );
    }
    
    //季度头部布局
    _quarterListHeaderComponent() {
        return (
            <View style={styles.listTop}>
                <Text style={styles.fontStyle}>季度完成率</Text>
            </View>
        );
    }
        
    //提成列表头部布局
    _ListHeaderComponent() {
        return (
            <View>
                <View style={styles.listTop}>
                    <Text style={styles.fontStyle}>提成列表</Text>
                    <TouchableOpacity style={{ flexDirection: 'row' }}
                        onPress={() => {
                            this.refs.sidebar.showSibling() // 打开抽屉
                        }}
                    >
                        <Image style={{ width: 16, height: 16, marginHorizontal: 5 }} source={require('../../../res/imgs/show.png')} />
                        <Text style={styles.colorStyle}>显示</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.TabTitle}>
                    <Text style={styles.tabFont}>项目</Text>
                    <Text style={styles.tabFont}>提成单元</Text>
                    <Text style={styles.tabFont}>提成金额</Text>
                    <Text style={styles.tabFont}>回款金额</Text>
                </View>
            </View>
        );
    }

    // 月度列表布局
    _createMonthlyListItem(item){
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.monthlyList}>
                <View style={styles.monthlyListTop}>
                    <View>
                        <Text style={styles.cityStyle}>{item.deptName}</Text>
                    </View>
                    <Text style={styles.listItem}>完成率(回款/目标)</Text>
                </View>
                <View style={styles.monthlyListBottom}>
                    <Text style={styles.listItem}>{item.actualSum}/{item.planSum}({item.rate})</Text>
                    <Text style={styles.remark}>{parseFloat(item.rate)<parseFloat("60%")?'按60%执行':null}</Text>
                </View>
            </View>
        )
    }
    
    // 季度列表布局
    _createQuarterListItem(item){
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.monthlyList}>
            <View style={styles.monthlyListTop}>
                <View>
                    <Text style={styles.cityStyle}>{item.deptName}</Text>
                </View>
                <Text style={styles.listItem}>完成率</Text>
            </View>
            <View style={styles.monthlyListBottom}>
                <Text style={styles.listItem}>{item.rate}</Text>
                <Text style={styles.remark}>{parseFloat(item.rate)<parseFloat("60%")?'按60%执行':null}</Text>
            </View>
        </View>
        )
    }


    // 列表布局
    _createListItem(item){
        const { navigate } = this.props.navigation;
        return (
        <TouchableOpacity onPress={()=>{navigate('EstateCommissionDetail',{item:item,title:item.projectName})}}>
            <View style={styles.listwrap}>
                <Text style={styles.otherListItem} numberOfLines={2}>{item.projectName}</Text>
                <Text style={styles.otherListItem}>{item.unitName}</Text>
                <Text style={styles.otherListItem}>{item.finalSum}</Text>
                <Text style={styles.otherListItem}>{item.sum}</Text>
            </View>
        </TouchableOpacity>
        )
    }

    // 创建空布局
    _ListEmptyComponent() {
        return (
        <View style={styles.emptyContent}>
            <Text style={styles.emptyText}> 没有查询到任何信息... </Text>
        </View>
        )
    }


    //Action && Handeler

    

    //UserFunction

    // 时间选择器
    showPicker=(isShow)=>{ 
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
              this.month = newselectdate;
              this.setState({
                visible: false
              })
              this.getData();
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

    //组件销毁
    componentWillUnmount() { 
        Picker.hide()
    }

    //获取数据
    getData() { 
        let curdate;
        curdate = this.month;
        curdate = curdate.replace(/年/g,"-").replace(/月/g,"");
        this.setState({
            dataDate: curdate
        })
        this.judgeQuarter(curdate);
        this.handleRateInit(curdate);
        this.handleCommissionInit(curdate);
    }

    //判断季度
    judgeQuarter(month) {
        let quarterList = ['3','6','9','12'];
        let mon = month.split('-')[1];
        for (const i in quarterList) {
            if (quarterList[i] == mon) {
                this.setState({
                    isQuarter: true
                })
                return;
            }else{
                this.setState({
                    isQuarter: false
                })
            }
        }
    }

    // 获取完成率初始列表数据
    handleRateInit(curdate) {
        ajax.getOther('saleEstateCommissionRate', `${this.state.empCode}/${curdate}`,)
        .then((res) => {
            console.log('完成率初始列表',res)
            this.dataTreating(res);
        })
        .catch(error => {
            if (error.msg) {
                Toast.showFail(error.msg)
            }
        })
    }

    // 获取提成初始列表数据
    handleCommissionInit(curdate) {
        let param = {
            empCode: this.state.empCode,
            month: curdate,
            type: this.state.type,
        };
        console.log(param)
        ajax.post('saleEstateCommissionList', param)
        .then((res) => {
            console.log('提成初始列表',res)
            var commissionList = res ? res.list : []
            var listTotal = res ? res.count : 0
            var isShow = res ? true : false
            this.setState({
                commissionList: commissionList,
                listTotal: listTotal,
                isShow: isShow
            })
        }).catch(e => {
            console.log(e)
            Toast.showFail('数据加载失败！')
            this.setState({
                isShow: false
            })
        })
    }

    //完成率数据处理
    dataTreating(res){
        let monthlyList = [];
        let quarterList = [];
        for (const i in res) {
            let item = res[i];
            if (item.planSum == null) { item.planSum = 0 };
            if (item.actualSum == null) { item.actualSum = 0 };
            if (item.rate == null) { item.rate = 0; }
            item.rate = Number(item.rate*100).toFixed();
            item.rate += "%";
            if (item.isQuarter == 0) {
                monthlyList.push(item);
                if (monthlyList.length == 0) {
                    this.setState({
                        monthlyListShow : false
                    })
                }else{
                    this.setState({
                        monthlyListShow : true
                    })
                }
            }else{
                quarterList.push(item);
                if (quarterList.length == 0) {
                    this.setState({
                        quarterListShow : false
                    })
                }else{
                    this.setState({
                        quarterListShow : true
                    })
                }
            }
        }
        this.setState({
            monthlyList: monthlyList,
            quarterList: quarterList,
        })
    }
   
    // 筛选的单据类型数据
    handleSelect(val) {
        let type = [];
        let value = val[0].value;
        for (const i in value) {
            type.push(Number(value[i]));
        }
        console.log(this.state.dataDate)
        this.setState({
            type: type,
        }, () => {
            this.handleCommissionInit(this.state.dataDate);
        })

    }

    //NetWorks


}

//Styles
const styles = StyleSheet.create({
    listwrap: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 26,
        paddingHorizontal: 30,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    colorStyle: {
        fontSize: 16,
        color: '#808080',
    },
    fontStyle: {
        fontSize: 18,
        color: '#353535',
    },
    listItem: {
        fontSize: 16,
        color: '#353535',
    },
    otherListItem: {
        fontSize: 12,
        color: '#353535',
        width: '25%',
        textAlign: 'center',
    },
    tabFont: {
        fontSize: 14,
        color: '#888888',
        width: '25%',
        textAlign: 'center',
    },
    listTop: {
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderBottomWidth: 2,
        borderBottomColor: '#E8E8E8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 30,
        marginTop: 10,
    },
    monthlyList: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    monthlyListTop: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 6,
    },
    monthlyListBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cityStyle: {
        color: '#fff',
        backgroundColor: '#4D66FD',
        borderRadius: 4,
        padding: 3,
        marginRight: 6,
    },
    remark: {
        color: '#E01E1E',
    },
    TabTitle: {
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingVertical: 18,
        paddingHorizontal: 30,
    },
    listBottm: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 30,
    },
    emptyContent: {
        height: height - 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        color: '#353535',
    }
})