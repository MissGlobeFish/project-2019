/**
 * CommunityIndex 综合--小宝社区
 */
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, FlatList, TouchableOpacity, SafeAreaView, DeviceEventEmitter } from 'react-native';
import ajax from '../../../config/Fetch';
import LoadMore from '../../../common/LoadMoreFooter';
import CommunityAvatar from '../../../common/ComprehensComponent/CommunityAvatar'
import CommunityInput from '../../../common/ComprehensComponent/CommunityInput'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast';
const { width, height } = Dimensions.get('window');
export default class CommunityIndex extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '小宝社区',
            headerBackTitle: null,
            headerRight:
                <TouchableOpacity style={{ marginRight: 23 }}
                    onPress={() => {
                        navigation.navigate('MyProblemList')
                    }}
                >
                    <Text style={{ fontSize: 16, color: '#353535' }}>我的提问</Text>
                </TouchableOpacity>
        }
    }
    constructor(props) {
        super(props);
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

    //组件成功加载
    componentDidMount() {
        this.loadListData()
        let self = this
        this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.CommunityQuestionDidDelete, function (entry, index) {
            if (entry == 'index') {
                self.handleDeleted(index)
            }
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    //列表为空的时候
    _ListEmptyComponent = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={{ fontSize: 16 }}>暂无内容</Text>
            </View>
        );
    }
    //上拉加载更多控件
    _ListFooterComponent = () => {
        return (
            <LoadMore isLoadAll={this.state.isLoadAll} isAction={this.state.loadingMore} />
        );
    };

    _cellComponent(item, index) {
        return (
            <TouchableOpacity style={styles.cellContainer}
                activeOpacity={0.7}
                onPress={() => {
                    this.didSelectCellAtIndex(index, item)
                }}>
                <View style={styles.cellHeader}>
                    <CommunityAvatar name={item.createdName} avatarUrl={item.photo} department={item.deptName} creatTime={item.lastCreateTime} />
                    {/* <TouchableOpacity
                        onPress={() => {
                        }}
                    >
                        <Text style={{ fontSize: 14, color: "#808080" }}>删除</Text>
                    </TouchableOpacity> */}
                </View>

                <Text style={styles.contentTextLabel}>{item.title}</Text>

                <View style={styles.cellFooter}>
                    <Image style={{ width: 15, height: 13.4 }} source={require('../../../res/imgs/replyNumber.png')}></Image>
                    <Text style={{ fontSize: 14, color: "#808080" }}> {item.answerCount + "条回复"}</Text>
                </View>

            </TouchableOpacity>
        )
    }


    render() {
        const { refreshing, listDataSource } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ListEmptyComponent={this._ListEmptyComponent}
                    ListFooterComponent={this._ListFooterComponent}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.onEndReached.bind(this)}
                    onRefresh={this.loadListData.bind(this)}
                    refreshing={refreshing}
                    style={styles.flatListStyle}
                    data={listDataSource}
                    keyExtractor={(item, index) => item.lastCreateTime + index}
                    renderItem={({ item, index }) =>
                        this._cellComponent(item, index)
                    }
                />
                <TouchableOpacity style={styles.putQuestionBtn}
                    activeOpacity={1}
                    onPress={this.putQuestOnPress.bind(this)}>
                    <Text style={styles.putQuestionLabel}>输入问题...</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }


    /**
     * 点击列表项
     *
     * @param {*} index
     * @param {*} item
     * @memberof CommunityIndex
     */
    didSelectCellAtIndex(index, item) {
        this.props.navigation.navigate('ProblemDetail', { questionInfo: item, entry: 'index', index: index })
    }

    /**
     * 点击提问按钮
     *
     * @memberof CommunityIndex
     */
    putQuestOnPress() {
        CommunityInput.show("Q", "", (text) => {
            Toast.showLoading("提交中...")
            ajax.post('newProblem', {
                title: text,
                creator: PersistanceManger.ShareInstance().empCode
            })
                .then((res) => {
                    Toast.showSuccess("提交成功")
                    this.loadListData()
                }).catch((err) => {
                    Toast.showFail(err.msg)
                })
        }, () => {
            //取消

        })
    }

    /**
     * 处理删除某一条数据
     *
     * @param {*} index
     * @memberof CommunityIndex
     */
    handleDeleted(index) {
        const { listDataSource } = this.state
        listDataSource.splice(index, 1)
        this.setState({
            listDataSource: listDataSource
        })
    }



    //加载数据
    loadListData() {
        const { pageSize } = this.state;
        this.setState({ refreshing: true })
        ajax.get('problemList',
            {
                spageNum: 1,
                pageSize: pageSize,
            }).then(res => {
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

    //上拉加载更多
    onEndReached = () => {
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
        ajax.get('problemList',
            {
                pageNum: pageNum + 1,
                pageSize: pageSize,
            }).then(res => {
                this.setState({
                    listDataSource: this.state.listDataSource.concat(res.list),
                    pageNum: pageNum + 1,
                    loadingMore: false
                })
            }).catch(error => {
                this.setState({ loadingMore: false })
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
        // top: 8,

    },
    emptyView: {
        height: height - 64 - 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellContainer: {
        backgroundColor: '#fff',
        // borderRadius: 2,
        marginTop: 10,
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    cellHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    contentTextLabel: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 16,
        color: "#353535",
        lineHeight: 24,
        marginTop: 11,
        marginBottom: 15,
    },
    cellFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        alignItems: 'center',
        marginBottom: 18,
    },
    putQuestionBtn: {
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        borderTopWidth: 0.5,
        borderTopColor: '#E8E8E8',
    },
    putQuestionLabel: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 16,
        color: "#808080"
    }


});