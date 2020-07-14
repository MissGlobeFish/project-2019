/**
* *  地产提成详情页面
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class  EstateCommissionDetail extends Component {

   static navigationOptions = ({ navigation }) => {
        return {
         title: navigation.getParam('title'),
         headerBackTitle: null,
       }
   }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            data: {},
            selectIndex: -1, //-1为收起状态
            currSection: null,
            isshow: false,
        }
    };

   //Life Cycle
    componentWillMount() {
        console.log(this.props.navigation.state.params)
    }

    componentDidMount() {
        this.handleCommissionDetailInit();
    }

    componentWillUnmount() {

    }

   //SubRenders

   //Render
   render() {
       const {isshow} = this.state
        return (
            <View>
                {isshow ? this._CommissionDetail() : this._ListEmptyComponent()}
            </View>
        );
    }

    //详情列表
    _CommissionDetail() {
        return (
            <ScrollView>
                <View style={styles.basicBox}>
                    <Text style={styles.basicTitle}>基本</Text>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>回款单号</Text>
                        <Text style={styles.fontText}>{this.state.data.receiveBillNo}</Text>
                    </View>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>回款日期</Text>
                        <Text style={styles.fontText}>{this.state.data.receiveDate}</Text>
                    </View>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>订单号</Text>
                        <Text style={styles.fontText}>{this.state.data.orderBillNo}</Text>
                    </View>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>下单日期</Text>
                        <Text style={styles.fontText}>{this.state.data.orderDate}</Text>
                    </View>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>出库日期</Text>
                        <Text style={styles.fontText}>{this.state.data.outDate}</Text>
                    </View>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>销售员</Text>
                        <Text style={styles.fontText}>{this.state.data.salerName}</Text>
                    </View>
                    <View style={styles.basicList}>
                        <Text style={styles.fontText}>合同</Text>
                        <Text style={styles.fontText}>{this.state.data.contact == 0?'无':'有'}</Text>
                    </View>
                </View>
                <View style={{backgroundColor: '#fff'}}>
                    <Text style={styles.basicTitle}>提成明细</Text>
                    <FlatList
                        data={this.state.data.materialList}
                        extraData={this.state}
                        renderItem={({item}) => this._componentDom(item)}//提成明细列表
                    />
                </View>
                <View style={styles.basicList}>
                    <Text style={styles.fontText}>提成总计：</Text>
                    <Text style={styles.fontText}>{this.state.data.total} 元</Text>
                </View>
            </ScrollView>
        )
    }
    
    // 一级菜单Dom
    _componentDom(item) {
        return(
            <ScrollView>   
                <TouchableOpacity style={styles.basicList} activeOpacity={0.75} onPress={()=>{this.itemTap(item)}}>
                    <Text style={styles.fontText}>{item.materialName}</Text>
                    <View style={styles.flexBox}>
                        <Text style={{ paddingRight: 15, fontSize: 16, color: '#353535'}}>{item.finalSum} 元</Text>
                        {/*手风琴效果：展开一条列表，其余列表皆为收起状态 this.state.selectIndex == -1*/}
                        <Image style={styles.arrowIcon}
                            source={ this.state.selectIndex != item.seq ? require('../../../res/imgs/arrow-icon.png') : require('../../../res/imgs/ico_down.png')} >
                        </Image>
                    </View>
                </TouchableOpacity>
                { this.state.selectIndex != item.seq ? null :this._childDom(item) }
            </ScrollView>
        )
    }

    // 二级菜单Dom
    _childDom(item) {
        return (
        <View style={styles.itemChoice} activeOpacity={0.75}>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>案场类型</Text>
                <Text style={styles.fontText}>{item.caseModelName}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>单项回款数额</Text>
                <Text style={styles.fontText}>{item.sum}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>提成单元</Text>
                <Text style={styles.fontText}>{item.unitName}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>提成比例</Text>
                <Text style={styles.fontText}>{item.scaleValue}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>月度完成率</Text>
                <Text style={styles.fontText}>{item.rate}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>设备成本</Text>
                <Text style={styles.fontText}>{item.deviceSum}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>异地装机费</Text>
                <Text style={styles.fontText}>{item.exTravelSum}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>明源接口费</Text>
                <Text style={styles.fontText}>{item.mySum}</Text> 
            </View>
            <View style={styles.otherBasicList}>
                <Text style={styles.otherFontText}>其他费用</Text>
                <Text style={styles.fontText}>{item.otherSum}</Text> 
            </View>
        </View>
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
    //列表展开收起事件
    itemTap(item){
        console.log(item)
        if(this.state.selectIndex == item.seq){
            this.setState({
                selectIndex: -1
            })
        }else{
            this.setState({
                selectIndex: item.seq,
            })
        }
    }

    // 获取提成初始列表数据
    handleCommissionDetailInit() { 
        let item = this.props.navigation.state.params.item;
        let param = {
            id: item.id,
            empCode: this.state.empCode,
            projectName: item.projectName,
            unitName: item.unitName,
            orderTypeCode: item.orderTypeCode
        };
        console.log("提成详情参数", param)
        ajax.post('saleEstateCommissionDetail', param)
        .then((res) => {
            console.log(res, '成功')
            let mater = res.materialList;
            for (const i in mater) {
                if (mater[i].scaleValue.substr(mater[i].scaleValue.length-1,1) == '%') {
                    
                }else if (mater[i].scaleValue == 0) {
                    mater[i].scaleValue += "%";
                }else{
                    mater[i].scaleValue = Number(mater[i].scaleValue*100).toFixed();
                    mater[i].scaleValue += "%";
                }
                
                if (mater[i].rate.substr(mater[i].rate.length-1,1) == '%') {
                    
                }else if (mater[i].rate == 0) {
                    mater[i].rate += "%";
                }else{
                    mater[i].rate = Number(mater[i].rate*100).toFixed();
                    mater[i].rate += "%";
                }
            }
            if (res.orderBillNo) {
                this.setState({
                    data: res,
                    isshow: true
                })
            }
        }).catch(e => {
            Toast.showFail('数据加载失败！')
        })
    }

    //NetWorks


}

//Styles
const styles = StyleSheet.create({
    fontText: {
        fontSize: 16,
        color: '#353535',
    },
    otherFontText: {
        fontSize: 16,
        color: '#808080',
    },
    flexBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    basicBox: {
        backgroundColor: '#fff',
        marginVertical: 20,
    },
    basicTitle: {
        fontSize: 18,
        color: '#353535',
        paddingVertical: 18,
        paddingHorizontal: 30,
    },
    basicList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingVertical: 26,
        paddingHorizontal: 30,
    },
    otherBasicList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingVertical: 26,
        paddingHorizontal: 50,
    },
    arrowIcon: {
      width: 12,
      height: 18,
      transform: [{rotate:'180deg'}]
    },
    transform180: {
        transform: [{rotate:'360deg'}]
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