/**
* 销量分析饼状图排行页
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import SaleAnalyRankTabel from '../../../common/SaleAnalysis/SaleAnalyRankTabel'
import ajax from '../../../config/Fetch'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast'
import PieChart from '../../../common/SaleAnalysis/PieChart'

export default class SaleAnalyzePieDetailPage extends Component {

    static navigationOptions = ({ navigation }) => {
        let startDate = navigation.getParam('startDate')
        let endDate = navigation.getParam('endDate')
        let dateSelectBtn = (
            <Text style={{ fontSize: 14 }}>
                {startDate + '-' + endDate}
            </Text>
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
        this.state = {
            //数据
            curreIndexs: [],
            saleTitle: " ... ", //范围说明
            pieChartData: {},   //饼状图数据
            tabelPanData: [],   //详细表格
            filtrateChoiceContent: [], //筛选栏数据 
            authorityDic: { code: 'salerProject' }, //权限信息
            onlyGroup: false, //只有项目组权限
            userId: null //查询人物信息
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
        console.log("详情页收到参数",this.state)
    }

    componentDidMount() {
        const { setParams } = this.props.navigation;
        setParams({
            startDate: this.startDate,
            endDate: this.endDate
        })

        this.loadMainData()
    }

    componentWillUnmount() {

    }

    //SubRenders

    //Render
    render() {
        const { tabelPanData, saleTitle, pieChartData, authorityDic } = this.state
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
                <PieChart data={pieChartData} height={200} didSelectDetailBtnAtIndex={this.goDetailPage.bind(this)}></PieChart>
                <SaleAnalyRankTabel
                    datas={tabelPanData}
                    // style={{ marginTop: 10 }}
                    ref="saleAnalyTabel"
                    dataType={authorityDic.code}
                    didSelectAtCityLabel={this.tabelPanDidSelectItemHeader.bind(this)}
                    didSelectAtIndexItem={this.tabelPanDidSelectIndexItem.bind(this)}
                />
            </ScrollView>
            // </SafeAreaView>
        );
    }


    //Action && Handeler

    /**
     * 进入详情
     *
     * @param {*} index 标示
     * @param {*} item 数据
     * @memberof SaleAnalyzPieIndexPage
     */
    goDetailPage(index, item) {
        console.log('点击饼状图', index)

    }

    /**
     * 点击具体 区域、军团、销售、项目组
     *
     * @param {*} item
     * @memberof SaleAnalyzeIndexPage
     */
    tabelPanDidSelectItemHeader(item) {
        const { filtrateChoiceContent, curreIndexs, authorityDic } = this.state
        console.log("点击具体区域/城市/销售/项目组", item)
        var areaList = []
        var cityList = authorityDic.cityList
        var projectList = authorityDic.projectList
        var userId = null
        var nextCode = null
        var AuthorityCode = global.saleAnalyzeAuthorityCode
        switch (authorityDic.code) {
            case AuthorityCode.sale.all:
                //区域军团
                nextCode = AuthorityCode.sale.area
                areaList = [item.groupCode]
                break;
            case AuthorityCode.sale.area:
                //军团销售
                nextCode = AuthorityCode.sale.dept
                cityList = [item.groupCode]
                break;
            case AuthorityCode.sale.dept:
                //军团销售项目
                nextCode = AuthorityCode.project.saler
                userId = item.groupCode
                break;
            case AuthorityCode.group.all:
                //全国项目组项目
                nextCode = AuthorityCode.project.grop
                projectList = [item.groupCode]
                break;
            case AuthorityCode.group.dept:
                //军团项目组项目
                nextCode = AuthorityCode.project.deptGroup
                projectList = [item.groupCode]
                break;
            default:
                break;
        }
        //以上情况才有下一级，不然无交互
        var choiceContent = JSON.stringify(filtrateChoiceContent)
        if (nextCode) {
            this.props.navigation.push("SaleAnalyzePieDetailPage", {
                filtrateChoiceContent: JSON.parse(choiceContent),
                curreIndexs: curreIndexs,
                authorityDic: { code: nextCode, cityList: cityList, projectList: projectList, areaList: areaList },
                userId: userId,
                startDate: this.startDate,
                endDate: this.endDate
            })
        }
    }

    /**
     * 点击具体指数值
     *
     * @param {*} item
     * @memberof SaleAnalyzeIndexPage
     */
    tabelPanDidSelectIndexItem(item, indexInfo) {
        const { authorityDic, filtrateChoiceContent } = this.state

        console.log("点击具体指数值", item, indexInfo)

        var AuthorityCode = global.saleAnalyzeAuthorityCode
        var areaList = []
        var cityList = []
        var projectList = []
        var userId = []
        switch (authorityDic.code) {
            case AuthorityCode.sale.all:
                //区域
                areaList = [item.groupCode]
                break;
            case AuthorityCode.sale.area:
                //军团
                cityList = [item.groupCode]
                break;
            case AuthorityCode.sale.dept:
                //军团销售
                cityList = authorityDic.cityList
                userId = [item.groupCode]
                break;
            case AuthorityCode.group.all:
                //全国项目组
                projectList = [item.groupCode]
                break;
            case AuthorityCode.group.dept:
                //军团项目组
                cityList = authorityDic.cityList
                projectList = [item.groupCode]
            default:
                //项目页面不可进入下一层级
                break;
        }
        let isNext = cityList.length + projectList.length + userId.length + areaList.length
        if (isNext == 0) {
            return
        }
        var choiceContent = JSON.stringify(filtrateChoiceContent)
        // this.props.navigation.push("SaleAnalyzeProjectPage", {
        //     filtrateChoiceContent: JSON.parse(choiceContent),
        //     areaList: areaList,
        //     cityList: cityList,
        //     projectList: projectList,
        //     userId: userId[0],
        //     index: indexInfo.indexCode,
        //     startDate: this.startDate,
        //     endDate: this.endDate
        // })
    }


    //UserFunction



    //NetWorks


    /**
     * 加载主数据
     *
     * @returns
     * @memberof SaleAnalyzeIndexPage
     */
    loadMainData() {
        const { filtrateChoiceContent, curreIndexs, authorityDic, userId, onlyGroup } = this.state

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

        var dimensionCode = authorityDic.code
        let param = {
            areaList: authorityDic.areaList,
            cityList: authorityDic.cityList,
            dimensionCode: dimensionCode,
            startDate: this.startDate,
            endDate: this.endDate,
            userId: userId ? userId : PersistanceManger.ShareInstance().userId,
            indexCodeList: curreIndexs,
            invoiceDateType: indexDic['invoiceDateType'],
            outDateType: indexDic['outDateType'],
            projectList: authorityDic.projectList,
        }
        console.log('详情数据查询参数：', JSON.stringify(param))
        ajax.post('saleAnalyzeMainData', param).then((res) => {
            Toast.hide()
            console.log("MainData: ", res)

            var pieChartList = res.list.map((item) => {
                return {
                    name: item.groupName,
                    value: item.indexList[0].amount,
                    code: item.groupCode
                }
            })
            var pieChartData = { indexName: res.countList[0].indexName, count: res.countList[0].count, list: pieChartList }
            this.setState({
                saleTitle: res.contentName,
                pieChartData: pieChartData,
                tabelPanData: res.list,
                authorityDic: Object.assign(authorityDic, { code: dimensionCode })
            }, () => {
                this.refs.saleAnalyTabel.refresh()
            })

        }).catch(e => {
            console.log(e)
            console.log("加载失败")
            Toast.showFail('数据加载失败！')
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
    indexPanelStyle: {
        // backgroundColor: 'red',
        marginTop: 5,
    }
})