/**
* 销量分析首页
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import SidebarSelect from '../../../common/FormComponents/SidebarSelect'
import DatePickList from '../../../common/SaleAnalysis/DatePickList'
import SaleIndexPanel from '../../../common/SaleAnalysis/SaleIndexPanel'
import SaleAnalysisChart from '../../../common/SaleAnalysis/SaleAnalysisChart'
import SaleAnalysisTabel from '../../../common/SaleAnalysis/SaleAnalysisTabel'
import DateTool from '../../../util/DateTool'
import ajax from '../../../config/Fetch'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast'

export default class SaleAnalyzeIndexPage extends Component {

    static navigationOptions = ({ navigation }) => {
        let filtrateBtnTapped = navigation.getParam('filtrateBtnTapped')
        let dateSelectBtnTapped = navigation.getParam('dateSelectBtnTapped')
        let startDate = navigation.getParam('startDate')
        let endDate = navigation.getParam('endDate')

        //筛选按钮
        let filtrateBtn = (
            <TouchableOpacity style={{ marginRight: 23 }} onPress={filtrateBtnTapped}>
                <Text style={{ fontSize: 14 }}>筛选</Text>
            </TouchableOpacity>
        )
        //时间选择按钮
        let dateSelectBtn = (
            <TouchableOpacity style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={dateSelectBtnTapped}>
                <Text style={{ fontSize: 14 }}>
                    {startDate + '-' + endDate}
                </Text>
                <Image defaultSource={require('../../../res/imgs/arrow-icon.png')} style={{ marginLeft: 5, width: 10, height: 10, transform: [{ rotate: '180deg' }] }}></Image>
            </TouchableOpacity>
        )
        return {
            headerTitle: dateSelectBtn, //时间
            headerBackTitle: null,      //返回标题
            headerRight: filtrateBtn,   //筛选指数按钮
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
            //参数
            showLineChartPan: true,

            //数据
            saleTitle: " ... ", //范围说明
            indexPanData: [],   //指数列表
            tabelPanData: [],   //详细表格
            chartPanData: [],   //折线图数据
            filtrateChoiceContent: [], //筛选栏数据 
            authorityDic: { code: 'salerProject' }, //权限信息
            onlyGroup: false, //只有项目组权限
            userId: null //查询人物信息
        }
    };

    //Life Cycle
    componentWillMount() {
        let dateTool = new DateTool(".")
        var thisMonth = dateTool.thisMonth()
        this.startDate = thisMonth[0]
        this.endDate = thisMonth[1]
    }

    componentDidMount() {
        const { setParams } = this.props.navigation;
        setParams({
            filtrateBtnTapped: this.filtrateBtnTapped.bind(this),
            dateSelectBtnTapped: this.dateSelectBtnTapped.bind(this),
            startDate: this.startDate,
            endDate: this.endDate
        })

        //加载配置数据
        Toast.showLoading("加载中...")
        this.loadProfiles().then(async (res) => {
            this.configAuthorityData(res[0])
            await this.configIndexListData(res[1])
            this.loadMainData()
        }).catch(e => {
            Toast.showFail('权限获取有误！')
        })
    }

    componentWillUnmount() {

    }

    //SubRenders

    //Render
    render() {
        const { saleTitle, indexPanData, tabelPanData, chartPanData, showLineChartPan, authorityDic } = this.state
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
                <SaleIndexPanel
                    datas={indexPanData}
                    style={styles.indexPanelStyle}
                    ref="saleAnalyIndexPan"
                    didSelectAtIndex={this.indexPanelDidSelectIndex.bind(this)}
                />
                <SaleAnalysisChart
                    isHiden={!showLineChartPan || chartPanData.length < 1}
                    datas={chartPanData}
                    option={{}}
                    height={200}
                />
                <SaleAnalysisTabel
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
     *  点击筛选 筛选抽屉显示
     */
    filtrateBtnTapped() {
        const { filtrateChoiceContent } = this.state
        let filtrate = new SidebarSelect({
            handleSelect: this.filtrateDidSelected.bind(this),
            choiceContent: filtrateChoiceContent
        })
        filtrate.showSibling()
    }

    /**
     *  点击日期选择  时间选择列表显示
     */
    dateSelectBtnTapped() {
        let dateList = new DatePickList({
            handleSelectDates: this.dateListDidSelectDates.bind(this)
        })
        dateList.showSibling()
    }


    /**
     * 筛选框选择完成回调
     *
     * @param {*} selectedItems 选择的项目
     * @memberof SaleAnalyzeIndexPage
     */
    filtrateDidSelected(selectedItems) {
        console.log("选择完成", selectedItems)
        //存储记录筛选结果
        PersistanceManger.ShareInstance().saleAnalyzeIndexs = this.state.filtrateChoiceContent
        this.loadMainData()
    }

    /**
     * 选择时间回调
     *
     * @param {*} dates
     * @memberof SaleAnalyzeIndexPage
     */
    dateListDidSelectDates(dates) {
        console.log("时间选择", dates)
        this.startDate = dates[0]
        this.endDate = dates[1]
        this.loadMainData()
    }

    /**
     * 切换指数
     *
     * @param {*} index
     * @memberof SaleAnalyzeIndexPage
     */
    indexPanelDidSelectIndex(item) {
        console.log("指数切换 ", item)
        this.setState({
            showLineChartPan: item.isLineChart
        })
        if (item.isLineChart) {
            this.loadChartData(item.indexCode)
        }
    }

    /**
     * 点击具体 军团、销售、项目组
     *
     * @param {*} item
     * @memberof SaleAnalyzeIndexPage
     */
    tabelPanDidSelectItemHeader(item) {
        const { filtrateChoiceContent, authorityDic } = this.state
        console.log("点击具体城市/销售/项目组", item)
        var cityList = authorityDic.cityList
        var projectList = authorityDic.projectList
        var userId = null
        var nextCode = null
        var AuthorityCode = global.saleAnalyzeAuthorityCode
        switch (authorityDic.code) {
            case AuthorityCode.sale.all:
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
            this.props.navigation.push("SaleAnalyzeDetailPage", {
                filtrateChoiceContent: JSON.parse(choiceContent),
                authorityDic: { code: nextCode, cityList: cityList, projectList: projectList },
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
        var cityList = []
        var projectList = []
        var userId = []
        switch (authorityDic.code) {
            case AuthorityCode.sale.all:
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
        let isNext = cityList.length + projectList.length + userId.length
        if (isNext == 0) {
            return
        }
        var choiceContent = JSON.stringify(filtrateChoiceContent)
        this.props.navigation.push("SaleAnalyzeProjectPage", {
            filtrateChoiceContent: JSON.parse(choiceContent),
            cityList: cityList,
            projectList: projectList,
            userId: userId[0],
            index: indexInfo.indexCode,
            startDate: this.startDate,
            endDate: this.endDate
        })
    }


    //UserFunction

    /**
     *  加载配置
     *
     * @returns
     * @memberof SaleAnalyzeIndexPage
     */
    loadProfiles() {
        //权限信息
        authorityTask = new Promise((resolve, reject) =>
            this.getAuthority().then((res) => {
                // console.log("网络请求获取权限", res)
                PersistanceManger.ShareInstance().saleAnalyzeAuthority = res
                resolve(res)
            }).catch(() =>
                PersistanceManger.ShareInstance().saleAnalyzeAuthority.then((res) => {
                    // console.log("本地存储获取权限：", res)
                    res ? resolve(res) : reject("authority")
                })
            )
        )
        //指数信息
        indexsTask = new Promise((resolve, reject) =>
            this.loadIndexList().then((res) => {
                resolve(res)
            }).catch(() =>
                resolve(null)
            )
        )
        return new Promise((resolve, reject) =>
            Promise.all([authorityTask, indexsTask]).then(function (res) {
                console.log("最终值:", res)
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        )
    }


    /**
     * 配置指数待选列表
     *
     * @param {*} indexData
     * @memberof SaleAnalyzeIndexPage
     */
    async configIndexListData(indexData) {

        let basicData = [
            {
                name: '查看对象', paramKey: 'saleProjectType', isCheckBox: false, children: [
                    { formId: 0, name: '看销售', childselect: false },
                    { formId: 1, name: '看项目组', childselect: false }]
            },
            {
                name: '选择指数', paramKey: 'indexCodeList', isCheckBox: true, children: []
            },
            {
                name: '出库日期距今天', paramKey: 'outDateType', isCheckBox: true, children: [
                    { formId: -1, name: '不超过90天', childselect: true },
                    { formId: 0, name: '超过90天，不超过180天', childselect: true },
                    { formId: 1, name: '超过180天', childselect: true }]
            },
            {
                name: '开票日期距离今天', paramKey: 'invoiceDateType', isCheckBox: true, children: [
                    { formId: -1, name: '不超过90天', childselect: true },
                    { formId: 0, name: '超过90天，不超过180天', childselect: true },
                    { formId: 1, name: '超过180天', childselect: true }]
            },
        ]
        var localData
        await PersistanceManger.ShareInstance().saleAnalyzeIndexs.then(res => {
            localData = res
        })
        //网络请求失败，自己返回本地值 或 默认值
        if (indexData == null || indexData.length == 0) {
            // console.log("请求失败，直接使用本地数据")
            return localData
        }
        //网络请求有值时, 合并
        localData = (localData ? localData : basicData).map((item) => {
            //指数列表之外的固定值
            if (item.paramKey != 'indexCodeList') {
                // console.log("固定数据",item.paramKey)
                return item
            }
            var currItem = item
            //排序
            indexData.sort((a, b) => {
                return a.weight - b.weight
            })
            currItem.children = indexData.map(index => {
                //财务功能默认不勾选
                var isSelected = index.indexCode != "outStock" && index.indexCode != "invoice"
                let localIndex = item.children.find((value) => { return value.formId == index.indexCode })
                if (localIndex) {
                    isSelected = localIndex.childselect
                }
                // console.log("指数合并",index.indexCode)
                return { formId: index.indexCode, name: index.indexName, childselect: isSelected }
            })
            return currItem
        })
        console.log("完成指数配置：", localData)
        PersistanceManger.ShareInstance().saleAnalyzeIndexs = localData
        this.setState({ filtrateChoiceContent: localData })
    }

    /**
     * 配置权限相关数据
     *
     * @param {*} authority
     * @memberof SaleAnalyzeIndexPage
     */
    configAuthorityData(authority) {
        let AuthorityCode = global.saleAnalyzeAuthorityCode
        var authorityMap = {}
        authority.map((item) => {
            if (!authorityMap[item.relationDesc]) {
                authorityMap[item.relationDesc] = item.relations ? item.relations : []
            } else {
                authorityMap[item.relationDesc] = authorityMap[item.relationDesc].concat(item.relations)
            }
        })

        console.log(authorityMap)

        var dimensionCode = AuthorityCode.project.saler
        var cityList = []
        var projectList = []

        if (authorityMap["COUNTRY"]) {
            dimensionCode = AuthorityCode.sale.all
        } else if (authorityMap["AREA"]) {
            dimensionCode = AuthorityCode.sale.all
            cityList = authorityMap["AREA"]
        } else if (authorityMap["CITY"]) {
            dimensionCode = AuthorityCode.sale.dept
            cityList = authorityMap["CITY"]
        } else if (authorityMap["PROJECT"]) {
            dimensionCode = AuthorityCode.group.all
            this.state.onlyGroup = true
            projectList = authorityMap["PROJECT"]
        }

        //"COUNTRY" "AREA" "CITY" "PROJECT"
        console.log("权限配置", dimensionCode, cityList, projectList)
        this.state.authorityDic = {
            code: dimensionCode,
            cityList: cityList,
            projectList: projectList,
        }
    }



    //NetWorks

    /**
     *  获取销量分析权限信息
     */
    getAuthority() {
        return ajax.getOther('saleAnalyzeAuthority', `${PersistanceManger.ShareInstance().empCode}/authority`, {})
    }

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
        let isProject = indexDic['saleProjectType'] && indexDic['saleProjectType'][0] == 1
        let AuthorityCode = global.saleAnalyzeAuthorityCode
        var dimensionCode = authorityDic.code
        if (isProject && authorityDic.code == AuthorityCode.sale.all) {
            dimensionCode = AuthorityCode.group.all
        } else if (isProject && authorityDic.code == AuthorityCode.sale.dept) {
            dimensionCode = AuthorityCode.group.dept
        } else if (!onlyGroup && !isProject && authorityDic.code == AuthorityCode.group.all) {
            // 非只有项目组权限才能切换
            dimensionCode = AuthorityCode.sale.all
        } else if (!onlyGroup && !isProject && authorityDic.code == AuthorityCode.group.dept) {
            dimensionCode = AuthorityCode.sale.dept
        }

        let param = {
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
        ajax.post('saleAnalyzeMainData', param).then((res) => {
            Toast.hide()
            
            //排序
            res.countList.sort((a, b) => {
                return a.weight - b.weight
            })
            res.list.map((item) => {
                item.indexList.sort((a, b) => {
                    return a.weight - b.weight
                })
            })


            console.log("MainData: ", res)
            this.setState({
                saleTitle: res.contentName,
                indexPanData: res.countList,
                tabelPanData: res.list,
                authorityDic: Object.assign(authorityDic, { code: dimensionCode })
            })
            this.refs.saleAnalyTabel.refresh()
            this.refs.saleAnalyIndexPan.refresh()
        }).catch(e => {
            console.log("加载失败")
            Toast.showFail('数据加载失败！')
        })
    }


    /**
     * 加载折线图数据
     *
     * @memberof SaleAnalyzeIndexPage
     */
    loadChartData(indexCode) {

        const { filtrateChoiceContent, authorityDic, userId } = this.state
        this.setState({ chartPanData: [] })

        var indexDic = {}
        filtrateChoiceContent.forEach((item) => {
            var values = []
            item.children.forEach((child) => {
                if (child.childselect) {
                    values.push(child.formId)
                }
            })
            indexDic[item.paramKey] = values
        })

        let param = {
            cityList: authorityDic.cityList,
            projectList: authorityDic.projectList,
            dimensionCode: authorityDic.code,
            startDate: this.startDate,
            endDate: this.endDate,
            userId: userId ? userId : PersistanceManger.ShareInstance().userId,
            indexCodeList: [indexCode],
            invoiceDateType: indexDic['invoiceDateType'],
            outDateType: indexDic['outDateType'],
        }
        console.log('折线图查询参数：', JSON.stringify(param))
        ajax.post('saleAnalyzelineChart', param).then((res) => {
            Toast.hide()
            console.log("saleAnalyzelineChart: ", res)
            this.setState({
                chartPanData: res
            })
        }).catch(e => {
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