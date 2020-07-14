/**
 * ProblemDetail 小宝社区---问题详情
 * 
 */
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, FlatList, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import ajax from '../../../config/Fetch';
import LoadMore from '../../../common/LoadMoreFooter';
import CommunityAvatar from '../../../common/ComprehensComponent/CommunityAvatar'
import CommunityInput from '../../../common/ComprehensComponent/CommunityInput'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast'
import { FormAlert } from '../../../common/FormComponents/Index'
const { width, height } = Dimensions.get('window');
export default class ProblemDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '小宝社区',
            headerBackTitle: null,
            headerRight: null,
            // <TouchableOpacity style={{ marginRight: 23 }}
            //     onPress={() => {
            //         // navigation.navigate('ClaimingExpenses')
            //     }}
            // >
            //     <Text style={{ fontSize: 16, color: '#353535' }}>我的提问</Text>
            // </TouchableOpacity>
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            questionInfo: {},
            listDataSource: [],
            pageNum: 0,
            pageSize: 15,
            total: 0,
            refreshing: false,
            loadingMore: false,
            isLoadAll: false,
        }
    }

    //组件成功加载
    componentDidMount() {
        const { getParam } = this.props.navigation
        var questionInfo = getParam("questionInfo")
        console.log("获取", questionInfo)
        this.setState({
            questionInfo: questionInfo
        }, () => {
            this.loadListData()
        })
    }

    //问题信息
    _ListHeaderComponent = () => {
        const { questionInfo } = this.state
        return (
            <View >
                <View style={[styles.cellContainer, { marginTop: 10 }]}>
                    <View style={styles.cellHeader}>
                        <CommunityAvatar name={questionInfo.createdName} avatarUrl={questionInfo.photo} department={questionInfo.deptName} creatTime={questionInfo.lastCreateTime} />
                        {questionInfo.creator == PersistanceManger.ShareInstance().empCode &&
                            (
                                <TouchableOpacity onPress={this.deleteBtnTapped.bind(this)}>
                                    <Text style={{ fontSize: 14, color: "#808080" }}>删除</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                    <Text style={styles.contentTextLabel}>{questionInfo.title}</Text>
                    <TouchableOpacity style={styles.cellFooter}
                        onPress={this.answerOnPress.bind(this)}
                    >
                        <Image style={{ width: 15, height: 13.4, marginHorizontal: 5 }} source={require('../../../res/imgs/reply.png')}></Image>
                        <Text style={{ fontFamily: "PingFangSC-Regular", fontSize: 12, color: "#518AFD" }}>回复</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 11, backgroundColor: '#fff', height: 56, justifyContent: 'center', paddingLeft: 15 }}>
                    <Text style={{ fontFamily: "PingFangSC-Medium", fontSize: 16, color: "#353535" }}>全部回复</Text>
                </View>
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
        // console.log(item)
        return (
            <TouchableOpacity style={styles.cellContainer}
                activeOpacity={0.7}
                onPress={() => {
                    this.didSelectCellAtIndex(index, item)
                }}>
                <View style={styles.cellHeader}>
                    <CommunityAvatar name={item.answerName} avatarUrl={item.photo} level={index + 1} creatTime={item.lastCreateTime} />
                </View>
                <View style={styles.contentBox} >
                    <Text style={[styles.contentTextLabel, { marginBottom: 0 }]}>{item.content}</Text>
                </View>

            </TouchableOpacity>
        )
    }


    render() {
        const { refreshing, listDataSource } = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={this._ListHeaderComponent}
                    ListFooterComponent={this._ListFooterComponent}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this.loadListData.bind(this)}
                    refreshing={refreshing}
                    style={styles.flatListStyle}
                    data={listDataSource}
                    keyExtractor={(item, index) => item.lastCreateTime + index}
                    renderItem={({ item, index }) =>
                        this._cellComponent(item, index)
                    }
                />
            </View>
        );
    }

    /**
     * 点击列表项
     *
     * @param {*} index
     * @param {*} item
     * @memberof ProblemDetail
     */
    didSelectCellAtIndex(index, item) {
        console.log("Selected", index, item)
    }

    /**
     * 点击删除按钮
     *
     * @memberof ProblemDetail
     */
    deleteBtnTapped() {
        const { goBack, getParam } = this.props.navigation;
        FormAlert.show("确定删除吗？", 'delete', () => {
            Toast.showLoading("删除中...")
            ajax.delete('deleteProblem', this.state.questionInfo.id,
                {
                    creator: PersistanceManger.ShareInstance().empCode
                }).then((res) => {
                    Toast.showSuccess("删除成功")
                    let index = getParam('index')
                    let entry = getParam('entry')
                    DeviceEventEmitter.emit(global.NotificationIdentify.CommunityQuestionDidDelete, entry, index);
                    goBack()
                }).catch((err) => {
                    Toast.showFail(err.msg)
                })
        })
    }

    /**
     * 点击回复
     *
     * @memberof ProblemDetail
     */
    answerOnPress() {
        CommunityInput.show("A", "", (text) => {
            Toast.showLoading("提交中...")
            ajax.post('newAnswer', {
                content: text,
                problemId: this.state.questionInfo.id,
                creator: PersistanceManger.ShareInstance().empCode
            })
                .then((res) => {
                    console.log("提交成功", res)
                    Toast.showSuccess("提交成功")
                    this.loadListData()
                }).catch((err) => {
                    Toast.showFail(err.msg)
                })
        }, () => {
            //取消

        })
    }


    //加载回复数据
    loadListData() {
        const { pageSize, questionInfo } = this.state;
        console.log("加载列表")
        this.setState({ refreshing: true })
        ajax.get('getAnswer',
            {
                problemId: questionInfo.id,
                spageNum: 1,
                pageSize: pageSize,
            }).then(res => {
                console.log(res)
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

    //上拉加载更多回复
    _onEndReached = () => {
        const { list, pageNum, pageSize, total, questionInfo } = this.state;
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
        ajax.get('getAnswer',
            {
                problemId: questionInfo.id,
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
        top: 0,

    },
    emptyView: {
        height: height - 64 - 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellContainer: {
        backgroundColor: '#fff',
        // borderRadius: 2,
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
    contentBox: {
        marginLeft: 43,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    cellFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        alignItems: 'center',
        marginBottom: 18,
    }

});