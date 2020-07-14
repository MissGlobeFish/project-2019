/**
 * TransactionListPage  钱包 -- 明细列表
 */
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import LoadMore from '../../common/LoadMoreFooter';
const { width, height } = Dimensions.get('window');

export default class TransactionListPage extends Component {

    _keyExtractor = (item, index) => item.id;

    static navigationOptions = {
        title: '钱包明细',
        headerBackTitle: null, 
    };

    constructor(props) {
        super(props)
        this.state = {
            listDataSource: [],
            pageNum: 0,
            pageSize: 15,
            total: 0,
            refreshing: true,
            loadingMore: false,
            isLoadAll: false,
        }
    }

    componentDidMount() {
        this.loadListDatas()
    }

    componentWillUnmount() {

    }


    //列表为空的时候
    _ListEmptyComponent = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={{ fontSize: 16 }}>暂无钱包明细</Text>
            </View>
        );
    }
    //上拉加载更多控件
    _ListFooterComponent = () => {
        // if (this.state.isLoadAll) return null;
        return (
            <LoadMore isLoadAll={this.state.isLoadAll} isAction={this.state.loadingMore} />
        );
    };

    cellIterm(item) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.didSelectItem(item.index)}
            >
                <View style={{ height: 64, width: width - 16, marginLeft: 16, paddingRight: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }}>
                    <View style={{ height: '100%', justifyContent: 'space-evenly' }}>
                        <Text style={{ fontFamily: 'PingFangSC-Medium', fontSize: 16, color: '#323232' }}>
                            {item.item.description}
                        </Text>
                        <Text style={{ fontFamily: 'PingFangSC-Regular', fontSize: 14, color: '#888888' }}>
                            {item.item.createTime}
                        </Text>
                    </View>
                    <View style={{ height: '100%', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'PingFangSC-Medium', fontSize: 16, color: '#323232', textAlign: 'right' }}>
                            {item.item.flowingWater > 0 ? ("+" + item.item.flowingWater) : item.item.flowingWater}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )

    }

    render() {
        const { refreshing, listDataSource } = this.state
        return (
            <View style={styles.containerViewStyle}>
                <FlatList
                    ListEmptyComponent={this._ListEmptyComponent}
                    ListFooterComponent={this._ListFooterComponent}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this.loadListDatas.bind(this)}
                    refreshing={refreshing}
                    style={{}}
                    data={listDataSource}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.cellIterm.bind(this)}
                />

            </View>
        );
    }


    /**
     * 加载数据
     *
     * @memberof TransactionListPage
     */
    loadListDatas() {

        var self = this
        const { getParam } = this.props.navigation;
        const { pageSize } = this.state;
        this.setState({ refreshing: true })
        ajax.get('wallet/details', { spageNum: 1, pageSize: pageSize, walletId: getParam('id') })
            .then((res) => {
                this.setState({
                    listDataSource: res.list,
                    total: res.total,
                    pageNum: 1,
                    loadingMore: false,
                    refreshing: false,
                    isLoadAll: false,
                })
            }).catch((error) => {
                this.setState({ refreshing: false })
            })
    }

    /**
     * 上拉加载更多
     *
     * @memberof TransactionListPage
     */
    _onEndReached = () => {
        const { getParam } = this.props.navigation;
        const { pageNum, pageSize, total } = this.state;
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
        ajax.get('wallet/details', { pageNum: pageNum + 1, pageSize: pageSize, walletId: getParam('id') })
            .then(res => {
                this.setState({
                    listDataSource: this.state.listDataSource.concat(res.list),
                    pageNum: pageNum + 1,
                    loadingMore: false
                })
            }).catch(error => {
                this.setState({ loadingMore: false })
            })

    }

    /**
     * 点击第几个 Iterm
     *
     * @param {*} index
     * @memberof TransactionListPage
     */
    didSelectItem(index) {
        let data = this.state.listDataSource[index]
        this.props.navigation.navigate('TransactionDetail', { title: data.description , data: data})
    }


}

const styles = StyleSheet.create({
    containerViewStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    emptyView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    emptyView: {
        height: height - 64 - 60,
        justifyContent: 'center',
        alignItems: 'center',
    }

});
