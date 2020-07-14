/**
* 销量分析分级页面
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import SidebarSelect from '../../../common/FormComponents/SidebarSelect'
import DatePickList from '../../../common/SaleAnalysis/DatePickList'
import DateTool from '../../../util/DateTool'
import ajax from '../../../config/Fetch'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast'
import PieChart from '../../../common/SaleAnalysis/PieChart'

import pieChartData from './SaleAnalyzeDemoData'
import BarChart from '../../../common/SaleAnalysis/BarChart';


export default class SaleAnalyzPieSubIndexPage extends Component {

    static navigationOptions = ({ navigation }) => {
        let startDate = navigation.getParam('startDate')
        let endDate = navigation.getParam('endDate')
        //时间选择按钮 
        let dateSelectBtn = (
            <TouchableOpacity style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 14 }}>
                    {startDate + '-' + endDate}
                </Text>
            </TouchableOpacity>
        )
        return {
            headerTitle: dateSelectBtn, //时间
            headerBackTitle: null,      //返回标题
        }
    }

    //Interactive Data
    get startDate() {
        return this._startDate
    }
    get endDate() {
        return this._endDate
    }

    set startDate(date) {
        this.props.navigation.setParams({ startDate: date })
        this._startDate = date
    }
    set endDate(date) {
        this.props.navigation.setParams({ endDate: date })
        this._endDate = date
    }

    constructor(props) {
        super(props);
        //用于记录点击，两次点击饼状图同一区域则进入详情
        this.selectedCode = null
        this.state = {
            filtrateChoiceContent: [], //筛选栏数据 
            authorityDic: { code: 'salerProject' }, //权限信息
            onlyGroup: false, //只有项目组权限
            userId: null, //查询人物信息
            pieChartDatas: [], //饼状图数据
            rankDatas: []//柱状图数据
        }
    };

    //Life Cycle
    componentWillMount() {
        const { getParam } = this.props.navigation
        this.startDate = getParam("startDate")
        this.endDate = getParam("endDate")
        this.state.userId = getParam("userId")
        //加载配置数据
        this.state.filtrateChoiceContent = getParam("filtrateChoiceContent")
        this.state.curreIndexs = getParam("curreIndexs")
        this.state.authorityDic = getParam("authorityDic")
    }

    componentDidMount() {
        const { setParams } = this.props.navigation;
        setParams({
            startDate: this.startDate,
            endDate: this.endDate
        })
        Toast.showLoading("加载中...")
        this.loadMainData()
    }

    componentWillUnmount() {

    }

    //SubRenders

    //Render
    render() {
        const { saleTitle, pieChartDatas, rankDatas, authorityDic } = this.state
        var AuthorityCode = global.saleAnalyzeAuthorityCode

        //全国、区域、军团长才能看到柱状图
        var BarChartElement = null
        if (authorityDic.code == AuthorityCode.sale.all ||
            authorityDic.code == AuthorityCode.sale.allDept ||
            authorityDic.code == AuthorityCode.sale.area ||
            authorityDic.code == AuthorityCode.sale.dept) {
            // BarChartElement = (<BarChart data={rankData} height={250} didSelectDetailBtnAtIndex={this.goNextIndexPage.bind(this)}></BarChart>)
            BarChartElement = rankDatas.map((item, index) => {
                return (<BarChart data={item} height={250} key={'bar' + index} didSelectDetailBtnAtIndex={this.goNextIndexPage.bind(this)}></BarChart>)
            })
        }

        let PieCharts = pieChartDatas.map((item, index) => {
            return (<PieChart data={item} height={200} key={index} didSelectDetailBtnAtIndex={this.goDetailPage.bind(this)}></PieChart>)
        })

        return (
            // <SafeAreaView style={}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.nameLabelBox}>
                    <Image style={{ width: 16, height: 13, marginHorizontal: 5 }} source={require('../../../res/imgs/SaleAnalyzeTitle.png')} />
                    <Text style={styles.nameLabel}>{saleTitle}</Text>
                </View>
                {BarChartElement}
                {PieCharts}
            </ScrollView>
            // </SafeAreaView>
        );
    }


    //Action && Handeler

    /**
     * 饼图进入详情
     *
     * @param {*} index 标示
     * @param {*} item 数据
     * @memberof SaleAnalyzPieIndexPage
     */
    goDetailPage(index, item) {
        console.log('goDetailPage', index, item)
        if (!index || index.length <= 1 || this.selectedCode != index) {
            this.selectedCode = index
            return
        }

        const { filtrateChoiceContent, authorityDic } = this.state
        var areaList = authorityDic.areaList
        var cityList = authorityDic.cityList
        var projectList = authorityDic.projectList
        var curreIndexs = [index]
        var userId = this.state.userId
        var nextCode = null
        var AuthorityCode = global.saleAnalyzeAuthorityCode
        switch (authorityDic.code) {
            case AuthorityCode.sale.all:
                //全国
                nextCode = AuthorityCode.sale.all
                break;
            case AuthorityCode.sale.area:
                //区域城市
                nextCode = AuthorityCode.sale.area
                break;
            case AuthorityCode.sale.dept:
                //军团销售
                nextCode = AuthorityCode.sale.dept
                break;
            case AuthorityCode.project.saler:
                //销售项目
                nextCode = AuthorityCode.project.saler
                break;
            case AuthorityCode.group.all:
                //全国项目组
                nextCode = AuthorityCode.group.all
                break;
            case AuthorityCode.group.dept:
                //军团项目组
                nextCode = AuthorityCode.group.dept
                break;
            default:
                break;
        }
        //以上情况才有下一级，不然无交互
        let chartIndex = item.indexCode
        let isProject = chartIndex == "mainOrderProject"
        if (isProject) {
            //项目组改变项目组 list， 且查询指数为下单金额
            curreIndexs = ['myOrder']
            projectList = [index]
        }

        var choiceContent = JSON.stringify(filtrateChoiceContent)
        this.props.navigation.push("SaleAnalyzePieDetailPage", {
            filtrateChoiceContent: JSON.parse(choiceContent),
            curreIndexs: curreIndexs,
            authorityDic: { code: nextCode,areaList: areaList, cityList: cityList, projectList: projectList },
            userId: userId,
            startDate: this.startDate,
            endDate: this.endDate
        })
        this.selectedCode = null
    }


    /**
     * 柱状图进入
     *
     * @param {*} index 标示
     * @param {*} item 数据
     * @memberof SaleAnalyzPieIndexPage
     */
    goNextIndexPage(index, item) {
        console.log('goNextIndexPage', index, item)
        if (!index || index.length <= 1 || this.selectedCode != index) {
            this.selectedCode = index
            return
        }
        const { filtrateChoiceContent, authorityDic } = this.state
        var areaList = []
        var cityList = authorityDic.cityList
        var projectList = authorityDic.projectList
        var userId = null
        var nextCode = null
        var AuthorityCode = global.saleAnalyzeAuthorityCode
        switch (authorityDic.code) {
            case AuthorityCode.sale.all:
                //全国
                nextCode = AuthorityCode.sale.dept
                cityList = [index]
                break;
            case AuthorityCode.sale.area:
                //区域城市
                nextCode = AuthorityCode.sale.dept
                cityList = [index]
                break;
            case AuthorityCode.sale.dept:
                //军团销售
                nextCode = AuthorityCode.project.saler
                userId = index
                break;
            default:
                break;
        }
        //以上情况才有下一级，不然无交互
        var choiceContent = JSON.stringify(filtrateChoiceContent)
        if (nextCode) {
            var param = {
                filtrateChoiceContent: JSON.parse(choiceContent),
                authorityDic: { code: nextCode, cityList: cityList, projectList: projectList, areaList: areaList },
                userId: userId,
                startDate: this.startDate,
                endDate: this.endDate
            }
            console.log(param)
            this.props.navigation.push("SaleAnalyzPieSubIndexPage", param)
        }
        this.selectedCode = null
    }


    //UserFunction

    //NetWorks

    /**
     * 加载指数列表
     *
     * @memberof SaleAnalyzeIndexPage
     */
    loadIndexList() {
        return ajax.get('saleAnalyzeIndexList', {})
    }

    /**
     * 加载主数据
     *
     * @returns
     * @memberof SaleAnalyzeIndexPage
     */
    loadMainData() {
        const { filtrateChoiceContent, authorityDic, userId, onlyGroup } = this.state

        var indexDic = {}
        filtrateChoiceContent.forEach((item) => {
            var values = []
            item.children.forEach((child) => {
                if (child.childselect) {
                    values.push(child.formId)
                }
            })
            console.log(item.paramKey, " ------- ", values)
            indexDic[item.paramKey] = values
        })
        console.log("指数筛选列表", indexDic)

        //是否选择看项目组
        let AuthorityCode = global.saleAnalyzeAuthorityCode
        var dimensionCode = authorityDic.code
        if (!onlyGroup && authorityDic.code == AuthorityCode.group.all) {
            // 非只有项目组权限才能切换
            dimensionCode = AuthorityCode.sale.all
        } else if (!onlyGroup && authorityDic.code == AuthorityCode.group.dept) {
            dimensionCode = AuthorityCode.sale.dept
        }

        let param = {
            areaList: authorityDic.areaList,
            cityList: authorityDic.cityList,
            dimensionCode: dimensionCode,
            startDate: this.startDate,
            endDate: this.endDate,
            userId: userId ? userId : PersistanceManger.ShareInstance().userId,
            indexCodeList: indexDic['indexCodeList'],
            invoiceDateType: indexDic['invoiceDateType'],
            outDateType: indexDic['outDateType'],
            projectList: authorityDic.projectList,
        }
        console.log('主数据查询参数：', JSON.stringify(param))
        //饼图
        ajax.post('saleAnalyzePieIndex', param)
            .then((res) => {
                console.log(res)
                // var res = pieChartData
                Toast.hide()
                this.setState({
                    //主标题
                    saleTitle: res.contentName,
                    //饼状图数据
                    pieChartDatas: res.countList,
                    authorityDic: Object.assign(authorityDic, { code: dimensionCode })
                })
            })
            .catch((e) => {
                console.log(e)
            })

        //柱状图
        param.indexCodeList = ['myOrder','receive']
        if (param.dimensionCode == AuthorityCode.sale.all) {
            param.dimensionCode = AuthorityCode.sale.allDept
        }
        console.log('柱状图据查询参数：', JSON.stringify(param)) 
        ajax.post('saleAnalyzeMainData', param)
            .then((res) => {
                console.log("MainData: ", res)
                var rankDatas = []
                res.countList.forEach((groupItem,index)=> {
                    //拼接数据
                    var barChartList = []
                    res.list.forEach((item) => {
                        var itemData = {
                            name: item.groupName,
                            value: item.indexList[index].amount / 10000,
                            code: item.groupCode
                        }
                        if (itemData.value > 0) {
                            //过滤没数据的城市/销售
                            barChartList.push(itemData)
                        }
                    })
                    //排序
                    barChartList.sort((a,b)=> {
                        return b.value - a.value
                    })

                    //整合格式
                    var barChartData = { 
                        indexName: res.countList[index].indexName, 
                        indexCode: res.countList[index].indexCode,
                        count: res.countList[index].count, 
                        list: barChartList 
                    }
                    rankDatas.push(barChartData)
                })
                this.setState({
                    rankDatas: rankDatas,
                })
            }).catch(e => {
                console.log(e)
            })
    }
}

//Styles
const styles = StyleSheet.create({
    nameLabelBox: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameLabel: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 14,
        color: "#808080",
    },
})