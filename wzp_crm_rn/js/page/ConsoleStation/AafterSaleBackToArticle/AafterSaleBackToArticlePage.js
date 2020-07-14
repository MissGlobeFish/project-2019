/**
*  地产提成页面
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, ScrollView, Image, DatePickerIOS } from 'react-native';
import LoadMore from '../../../common/LoadMoreFooter';
const { height } = Dimensions.get('window');
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
import moment, { months } from 'moment';

export default class  AafterSaleBackToArticlePage extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '售后回款',
            headerBackTitle: null,
        }
    }   

    //Interactive Data

   constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            moneyList: [],
            isShow: true, // 是否刷新
            isLoadAll: false,
            loadingMore: false,
        }
     };

    //Life Cycle 
    componentWillMount() {//组件渲染之前
        let moneyData = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            empCode: this.state.empCode,
        }
        this.handleMoneyInit(moneyData);
    }

    componentDidMount() {//组件已经渲染成功
        
    }

    componentWillUnmount() {
        
    }

    //SubRenders

    //Render
    render() {
        return (
           <ScrollView>
                <FlatList
                    data={this.state.moneyList}
                    renderItem={({item}) => this._createListItem(item)}//列表
                    ListHeaderComponent={this._ListHeaderComponent.bind(this)} // 头部组件
                    ListEmptyComponent = {this.state.isShow? null:this._ListEmptyComponent}   
                    ListFooterComponent={this._ListFooterComponent}//上拉加载更多     
                    onEndReachedThreshold={0.1}
                    onEndReached={this.onEndReached.bind(this)}    
                />
           </ScrollView>
       );
    }
        
    //提成列表头部布局
    _ListHeaderComponent() {
        return (
            <View>
                <View style={styles.listTop}>
                    <Text style={styles.fontStyle}>回款列表</Text>
                </View>
                <View style={styles.TabTitle}>
                    <Text style={styles.tabFont}>项目名</Text>
                    <Text style={styles.tabFont}>提成</Text>
                    <Text style={styles.tabFont}>订单编号</Text>
                    <Text style={styles.tabFont}>合同</Text>
                    <Text style={styles.tabFont}>回款</Text>
                </View>
            </View>
        );
    }


    // 列表布局
    _createListItem(item){
        return (
            <View style={styles.listwrap}>
                <Text style={styles.otherListItem} numberOfLines={2}>{item.projectName}</Text>
                <Text style={styles.otherListItem}>{item.result == '1'?'有':'无'}</Text>
                <Text style={styles.otherListItem}>{item.orderBillno}</Text>
                <Text style={styles.otherListItem}>{item.contact == '1'?'有':'无'}</Text>
                <Text style={styles.otherListItem}>{item.received == '1'?'有':'无'}</Text>
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

    
    //上拉加载更多控件
    _ListFooterComponent = () => {
        return (
            <LoadMore isLoadAll={this.state.isLoadAll} isAction={this.state.loadingMore} />
        );
    };


    //Action && Handeler

    

    //UserFunction

    // 获取回款初始列表数据
    handleMoneyInit(moneyData) {
        Toast.showLoading()
        ajax.post('AafterSaleBackToArticleList', moneyData)
        .then((res) => {
            Toast.hide()
            var moneyList = res ? res.list : []
            var isShow = res ? true : false
            this.setState({
                moneyList: moneyList,
                isShow: isShow,
                total: res.total,
                loadingMore: false,
                isLoadAll: false,
            })
        }).catch(e => {
            Toast.showFail('数据加载失败！')
            this.setState({
                isShow: false
            })
        })
    }

    
    //上拉加载更多
    onEndReached = () => {
        const { empCode, moneyList, pageNum, pageSize, total } = this.state;
        this.setState({ loadingMore: true });
        if (pageNum >= Math.ceil(total / pageSize)) {
            this.setState({
                isLoadAll: true
            });
            setTimeout(() => {
                this.setState({ loadingMore: false });
            }, 2000);
            return;
        }
        ajax.post('AafterSaleBackToArticleList',
            {
                empCode: empCode,
                pageNum: pageNum + 1,
                pageSize: pageSize,
            }).then(res => {
                this.setState({
                    moneyList: this.state.moneyList.concat(res.list),
                    pageNum: pageNum + 1,
                    loadingMore: false
                })
            }).catch(error => {
                this.setState({ loadingMore: false })
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
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    fontStyle: {
        fontSize: 16,
        color: '#353535',
    },
    listItem: {
        fontSize: 16,
        color: '#353535',
    },
    otherListItem: {
        fontSize: 12,
        color: '#353535',
        width: '20%',
        textAlign: 'center',
    },
    tabFont: {
        fontSize: 12,
        color: '#888888',
        width: '20%',
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
    TabTitle: {
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingVertical: 18,
        paddingHorizontal: 20,
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