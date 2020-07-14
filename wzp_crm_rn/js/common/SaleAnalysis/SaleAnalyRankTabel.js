/**
*  销售指数带排名面板
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, ViewPropTypes } from 'react-native';
import propTypes from 'prop-types'

const screenWidth = Dimensions.get('window').width;

const cityNameBoxWith = 150


class SaleAnalysisTabelHeaderView extends Component {
    static defaultProps = {
        headerData: {},
        dataType: 'deptSaler',
        didSelectHeaderAtIndex: (index, item) => { }
    }
    constructor(props) {
        super(props)
        this.state = {
            showShadows: false,
        }
    }
    render() {
        const { headerData, didSelectHeaderAtIndex, dataType } = this.props
        const { showShadows } = this.state
        var title = ""
        let AuthorityCode = global.saleAnalyzeAuthorityCode
        switch (dataType) {
            case AuthorityCode.sale.all:
                title = "区域"
                break;
            case AuthorityCode.sale.area:
                title = "军团"
                break;
            case AuthorityCode.sale.dept:
                title = "销售"
                break;
            case AuthorityCode.project.saler: case AuthorityCode.project.grop: case AuthorityCode.project.deptGroup:
                title = "项目"
                break;
            case AuthorityCode.group.dept: case AuthorityCode.group.all:
                title = "项目组"
                break;
            default:
                break;
        }
        let headers = headerData.map((data, index) => {
            return (
                <TouchableOpacity
                    style={[styles.contentCellStyle, styles.cityNameBoxStyle, styles.borderBaseStyle, { paddingHorizontal: 20 }]}
                    key={data.groupCode + index}
                    onPress={() => {
                        didSelectHeaderAtIndex(index, data)
                    }}
                >
                    <Text style={[styles.contentTextStyle, { textAlign: 'center' }]} numberOfLines={2} >{data.groupName}</Text>
                </TouchableOpacity>
            )
        })
        let rankHeaders = headerData.map((data, index) => {
            return (
                <TouchableOpacity
                    style={[styles.contentCellStyle, styles.cityNameBoxStyle, styles.borderBaseStyle, { paddingHorizontal: 10 }]}
                    key={data.groupCode + index + 'rank'}
                >
                    <Text style={[styles.contentTextStyle, { textAlign: 'center' }]}>{index + 1}</Text>
                </TouchableOpacity>
            )
        })
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={[{ zIndex: 99, backgroundColor: '#fff', width: 60 }]}>
                    <TouchableOpacity
                        style={[styles.titleCellStyle, styles.cityNameBoxStyle, styles.borderBaseStyle]}
                    >
                        <Text
                            style={[styles.indexTitleTextStyle]}
                        >
                            排名
                        </Text>
                    </TouchableOpacity>
                    {rankHeaders}
                </View>
                <View ref="HeaderBackView" style={[{ zIndex: 99, backgroundColor: '#fff', width: cityNameBoxWith }, showShadows ? styles.scrollBoxShadow : null]}>
                    <TouchableOpacity
                        style={[styles.titleCellStyle, styles.cityNameBoxStyle, styles.borderBaseStyle]}
                    >
                        <Text
                            style={[styles.indexTitleTextStyle]}
                        >
                            {title}
                        </Text>
                    </TouchableOpacity>
                    {headers}
                </View>
            </View>
        )
    }
    showShadows() {
        this.setState({ showShadows: true })
    }
    hideShadows() {
        this.setState({ showShadows: false })
    }
}



export default class SaleAnalyRankTabel extends Component {


    static defaultProps = {
        style: {},
        datas: [
            { groupName: "加载中...", groupCode: 'xxx', indexList: [{ indexName: "参数1", indexCode: 'xxx', amount: 1234567890, percent: '1%' },] },
        ],
        dataType: 'deptSaler',
        didSelectAtCityLabel: (item) => { },
        didSelectAtIndexItem: (item, indexInfo) => { }
    }
    static propTypes = {
        style: propTypes.object, //容器样式
        datas: propTypes.array, //基本数据
        dataType: propTypes.string, //数据类型
        didSelectAtCityLabel: propTypes.func, //选中某一行
        didSelectAtIndexItem: propTypes.func, //点击具体某一指数项目
    }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            isScroll: false,//列表是否是滚动状态
            datas: props.datas,//显示数据
            headerDataList: [],//标题列表
            sortIndex: null, // 排序根据字段
            sortType: null,    //升降序
            firstIndexCode: null,
        }

    };

    //Life Cycle
    componentWillMount() {
        this.refresh()
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //SubRenders

    rowContentRender() {
        const { datas, sortType, sortIndex } = this.state
        if (!datas || datas.length == 0) {
            return null
        }
        //因为数据可能有没有 Code 的情况， 所以渲染之前先合并标题
        var headerDataList = []
        for (let i = 0; i < datas[0].indexList.length; i++) {
            for (let j = 0; j < datas.length; j++) {
                const headerData = datas[j].indexList[i];
                if (!headerData || !headerData.indexCode) {
                    //如果到最后都没有找到
                    if (j == datas.length - 1) {
                        headerDataList.push({ indexName: headerData.indexName })
                    }
                    continue;
                } else {
                    headerDataList.push({ indexName: headerData.indexName, indexCode: headerData.indexCode })
                    break;
                }
            }
        }
        this.state.headerDataList = headerDataList[0].indexCode
        // console.log("~~~~~", this.state.headerDataList)
        var isOneScreenShown = headerDataList.length <= 2
        //指数标题
        let headers = headerDataList.map((data, index) => {
            return (
                <TouchableOpacity
                    key={data.indexCode + '-' + index}
                    style={[styles.titleCellStyle, styles.indexTitleBox,
                    { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
                    isOneScreenShown ? { width: (screenWidth - cityNameBoxWith - 20 - 50) / headerDataList.length, justifyContent: 'center' } : null
                    ]}
                    disabled={!data.indexCode} //全为空的情况下不允许点击
                    onPress={() => { this.sortByIndex(data.indexCode, index) }}
                >
                    <Text style={styles.indexTitleTextStyle}>{data.indexName}</Text>
                    {
                        //该列数据不全为空 且 选择到改列情况下才显示
                        data.indexCode && (data.indexCode != sortIndex ||
                            <Image
                                style={{ width: 6, height: 10, marginLeft: 4.5 }}
                                source={
                                    sortType ? require('../../res/imgs/Sale_descending.png') : require('../../res/imgs/Sale_ascending.png')
                                } />)
                    }

                </TouchableOpacity>
            )
        })

        //指数值
        let contentDatas = datas.map((item, cityIndex) => {
            return (
                <View style={[styles.cellBackBoxStyle, styles.borderBaseStyle]} key={cityIndex}>
                    {
                        item.indexList.map((data, index) => {
                            return (
                                <TouchableOpacity
                                    style={
                                        [styles.contentCellStyle,
                                        styles.indexTitleBox,
                                        isOneScreenShown ? { width: (screenWidth - cityNameBoxWith - 20 - 50) / headerDataList.length, alignItems: 'center' } : null
                                        ]}
                                    key={data.indexName + '-' + index}
                                    onPress={() => { this.didSelectIndexItem(item, data) }}
                                >
                                    <Text style={styles.contentTextStyle}>{data.amount ? data.amount : 0}</Text>
                                    <Text style={styles.contentPersentTextStyle}>{data.percent ? data.percent : '0%'}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        })


        return (
            <View>
                <View style={[styles.cellBackBoxStyle, styles.borderBaseStyle, { backgroundColor: '#fafafa' }]}>{headers}</View>
                {contentDatas}
            </View>
        )
    }



    //Render
    render() {
        const { style, dataType } = this.props
        const { datas } = this.state
        return (
            <View style={[styles.backContentBox, style]}>
                <SaleAnalysisTabelHeaderView
                    ref="HeaderBackView"
                    dataType={dataType}
                    headerData={datas}
                    didSelectHeaderAtIndex={(index, item) => {
                        this.didSelectHeader(index)
                    }}
                />
                <ScrollView
                    // style={{ paddingLeft: 20 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onScrollBeginDrag={() => { this.refs.HeaderBackView.showShadows() }}
                    onScrollEndDrag={() => { this.refs.HeaderBackView.hideShadows() }}
                >
                    {this.rowContentRender()}
                </ScrollView>
            </View>
        );
    }


    //Action && Handeler


    //UserFunction

    /**
     * 点击具体 城市/销售/项目
     *
     * @param {*} index
     * @memberof SaleAnalysisTabel
     */
    didSelectHeader(index) {
        const { datas, headerDataList } = this.state
        const { didSelectAtCityLabel } = this.props
        var data = datas[index]
        data.indexList = data.indexList.map((indexItem) => {
            if (indexItem.indexCode) {
                return indexItem
            } else {
                return Object.assign({ amount: 0, percent: '0%' }, headerDataList[index])
            }
        })
        if (didSelectAtCityLabel) {
            didSelectAtCityLabel(data)
        }
    }

    /**
     * 点击具体 指数项
     *
     * @param {*} item
     * @param {*} indexInfo
     * @memberof SaleAnalysisTabel
     */
    didSelectIndexItem(item, indexInfo) {
        const { datas, headerDataList } = this.state
        const { didSelectAtIndexItem } = this.props
        let amount = indexInfo.amount ? indexInfo.amount : 0
        if (!indexInfo.indexCode || amount == 0) {
            return
        }
        if (didSelectAtIndexItem) {
            didSelectAtIndexItem(item, indexInfo)
        }
    }



    /**
     * 根据指数代码，排序列表
     *
     * @param {*} indexCode
     * @param {*} index
     * @memberof SaleAnalysisTabel
     */
    sortByIndex(indexCode, index) {
        const { datas, sortIndex, sortType } = this.state
        let isSameIndex = indexCode == sortIndex
        this.state.sortIndex = indexCode
        console.log(isSameIndex, indexCode, sortIndex)
        this.state.sortType = isSameIndex ? !sortType : true
        // console.log( this.state.sortType  ? "降序" : "升序")
        var newDatas = datas
        newDatas.sort((a, b) => {
            var amountA = a.indexList[index].amount ? a.indexList[index].amount : 0
            var amountB = b.indexList[index].amount ? b.indexList[index].amount : 0
            // console.log(amountA, '-------' ,amountB)
            return this.state.sortType ? (amountB - amountA) : (amountA - amountB)
        })

        this.setState({
            datas: newDatas
        })
    }

    /**
     *  刷新数据
     */
    refresh() {
        this.setState({
            sortIndex: null,
            sortType: null,
            datas: this.props.datas
        }, () => {
            // console.log("~~~~~", this.state.headerDataList)
            this.sortByIndex(this.state.headerDataList, 0)
        })
    }

    //NetWorks


}

//Styles
const styles = StyleSheet.create({
    backContentBox: {
        backgroundColor: "#fff",
        minHeight: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    scrollBoxShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },


    cityNameBoxStyle: {
        alignItems: 'center',
        marginTop: 0.5
    },
    titleCellStyle: {
        alignItems: 'flex-start',
        backgroundColor: '#fafafa',
        height: 32,
        // justifyContent: 'center',
    },
    borderBaseStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#E8E8E8',
        justifyContent: 'center',
    },
    contentCellStyle: {
        alignItems: 'flex-start',
        height: 70
    },
    cellBackBoxStyle: {
        flexDirection: 'row',
        marginHorizontal: -100,
        paddingHorizontal: 100,
        paddingBottom: 0
    },
    indexTitleBox: {
        justifyContent: 'center',
        flex: 1,
        minWidth: 100,
    },





    indexTitleTextStyle: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 12,
        color: "#888888"
    },
    contentTextStyle: {
        fontFamily: "PingFangSC-Medium",
        fontSize: 14,
        color: "#323232"
    },
    contentPersentTextStyle: {
        fontFamily: "PingFangSC-Medium",
        fontSize: 12,
        color: "#808080"
    }
})