/**
 * MessageCenter  消息列表
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import MessageListCell from '../../common/MessageListCell';
import LoadMore from '../../common/LoadMoreFooter';
import ajax from '../../config/Fetch';
import PersistanceManger from '../../util/PersistanceManger';
const { width, height } = Dimensions.get('window');


export default class MessageCenter extends Component {
    _keyExtractor = (item, index) => item.id;

    static navigationOptions = {
        title: '消息',
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


    //列表为空的时候
    _ListEmptyComponent = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={{ fontSize: 16 }}>暂无消息</Text>
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
    //上拉加载更多
    _onEndReached = () => {
        const { list, pageNum, pageSize, total } = this.state;
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
        console.log("加载更多")
        ajax.get('message', { pageNum: pageNum + 1, pageSize: pageSize, empCode: PersistanceManger.ShareInstance().empCode }).then(res => {
            this.setState({
                listDataSource: this.state.listDataSource.concat(res.list),
                pageNum: pageNum + 1,
                loadingMore: false
            })
        }).catch(error => {
            this.setState({ loadingMore: false })
        })

    }

    //组件成功加载
    componentDidMount() {
        this.loadMessageData()
    }


    render() {
        const { refreshing, listDataSource } = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    ListEmptyComponent={this._ListEmptyComponent}
                    ListFooterComponent={this._ListFooterComponent}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this.loadMessageData.bind(this)}
                    refreshing={refreshing}
                    style={styles.flatListStyle}
                    data={listDataSource}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item, index }) =>
                        <MessageListCell
                            key={item.id}
                            title={item.title}
                            detail={item.content}
                            onPress={ () =>
                                this.props.navigation.navigate('PayrollLogin')
                            }
                        />}
                />
            </View>
        );
    }

    loadMessageData() {
        const { pageSize } = this.state;
        console.log("加载列表")
        this.setState({ refreshing: true })
        ajax.get('message', { spageNum: 1, pageSize: pageSize, empCode: PersistanceManger.ShareInstance().empCode }).then(res => {
            this.setState({
                listDataSource: res.list,
                total: res.total,
                pageNum: 1,
                loadingMore: false,
                refreshing: false,
                isLoadAll: false,
            })
        }).catch(error => {
            this.setState({ refreshing: false })
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    flatListStyle: {
        top: 8,

    },
    emptyView: {
        height:height - 64 - 60,
        justifyContent: 'center',
        alignItems: 'center',
      }
});
