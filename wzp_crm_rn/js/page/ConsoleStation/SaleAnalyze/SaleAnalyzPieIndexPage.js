/**
* 销量分析首页
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
import BarChart from '../../../common/SaleAnalysis/BarChart'
import StackBarChart from '../../../common/SaleAnalysis/StackBarChart'


export default class SaleAnalyzPieIndexPage extends Component {

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
        //用于记录点击，两次点击饼状图同一区域则进入详情
        this.selectedCode = null
        this.state = {
            filtrateChoiceContent: [], //筛选栏数据 
            authorityDic: { code: 'salerProject' }, //权限信息
            onlyGroup: false, //只有项目组权限
            userId: null, //查询人物信息
            pieChartDatas: [], //饼状图数据
            rankDatas: [],//柱状图数据
            areaRankDatas: [],//区域柱状图数据（全国权限使用）
            stackRankDatas: [],//堆栈柱状图数据
            areaStackRankDatas: [],//区域堆栈柱状图数据（全国权限使用）
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
            console.log(e)
            Toast.showFail('权限获取有误！')
        })
    }

    componentWillUnmount() {

    }

    //SubRenders

    //Render
    render() {
        const { saleTitle, pieChartDatas, rankDatas, areaRankDatas, stackRankDatas, areaStackRankDatas, authorityDic } = this.state
        var AuthorityCode = global.saleAnalyzeAuthorityCode

        //全国、区域、军团长才能看到柱状图
        var BarChartElement = null
        var stackBarChartElement = null
        if (authorityDic.code == AuthorityCode.sale.all ||
            authorityDic.code == AuthorityCode.sale.allDept ||
            authorityDic.code == AuthorityCode.sale.area ||
            authorityDic.code == AuthorityCode.sale.dept) {
            //是否需要区域数据
            let needArea = authorityDic.code == AuthorityCode.sale.all
            //柱状图
            BarChartElement = rankDatas.map((item, index) => {
                let areaItem = areaRankDatas[index]
                return (

                    <BarChart data={needArea ? [areaItem, item] : item} height={250} key={'bar' + index} didSelectDetailBtnAtIndex={this.goNextIndexPage.bind(this)}></BarChart>

                )
            })
            //堆叠柱状图
            stackBarChartElement = stackRankDatas.map((item, index) => {
                let areaItem = areaStackRankDatas[index]
                return (

                    <StackBarChart data={needArea ? [areaItem, item] : item} height={250} key={'stackBarChart' + index} didSelectDetailBtnAtIndex={this.goNextIndexPage.bind(this)}></StackBarChart>

                )
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
                {stackBarChartElement}
                {PieCharts}
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
        PersistanceManger.ShareInstance().salePieAnalyzeIndexs = this.state.filtrateChoiceContent
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
        var cityList = authorityDic.cityList
        var projectList = authorityDic.projectList
        var curreIndexs = [index]
        var userId = null
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
        console.log("是否是项目组？", isProject)
        var choiceContent = JSON.stringify(filtrateChoiceContent)

        this.props.navigation.push("SaleAnalyzePieDetailPage", {
            filtrateChoiceContent: JSON.parse(choiceContent),
            curreIndexs: curreIndexs,
            authorityDic: { code: nextCode, cityList: cityList, projectList: projectList },
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
                if (item.dimensionCode == AuthorityCode.sale.all) {
                    nextCode = AuthorityCode.sale.area
                    areaList = [index]
                } else {
                    nextCode = AuthorityCode.sale.dept
                    cityList = [index]
                }
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
                console.log("网络获取权限", res)
                PersistanceManger.ShareInstance().saleAnalyzeAuthority = res
                resolve(res)
            }).catch(() =>
                PersistanceManger.ShareInstance().saleAnalyzeAuthority.then((res) => {
                    console.log("本地获取权限：", res)
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
        await PersistanceManger.ShareInstance().salePieAnalyzeIndexs.then(res => {
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
        PersistanceManger.ShareInstance().salePieAnalyzeIndexs = localData
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
            dimensionCode = AuthorityCode.sale.area
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
        let isProject = false//indexDic['saleProjectType'] && indexDic['saleProjectType'][0] == 1
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
        this.state.rankDatas = []
        param.indexCodeList = ['myOrder', 'receive']
        //是否需要加载区域信息
        let needArea = param.dimensionCode == AuthorityCode.sale.all
        //全国区域数据任务
        let areaBarChartTask = new Promise((resolve, reject) => {
            if (needArea) {
                param.dimensionCode = AuthorityCode.sale.all
                console.log('柱状图据查询参数(区域)：', JSON.stringify(param))
                console.log("区域任务", param.dimensionCode)
                ajax.post('saleAnalyzeMainData', param)
                    .then((res) => {
                        console.log("柱状图据(区域): ", res)
                        var barChartData = this.configBarChartData(res, param.dimensionCode)
                        resolve(barChartData)
                    }).catch(e => {
                        reject(e)
                    })
                param.dimensionCode = AuthorityCode.sale.allDept
            } else {
                resolve([])
            }
        })
        //军团、销售数据任务
        let barChartTask = new Promise((resolve, reject) => {
            console.log('柱状图据查询参数：', JSON.stringify(param))
            console.log("军团任务", param.dimensionCode)
            ajax.post('saleAnalyzeMainData', param)
                .then((res) => {
                    console.log("柱状图据: ", res)
                    var barChartData = this.configBarChartData(res, param.dimensionCode)
                    var newArray = this.state.rankDatas.concat(barChartData)
                    resolve(newArray)
                }).catch(e => {
                    reject(e)
                })
        })

        let self = this
        Promise.all([areaBarChartTask, barChartTask]).then(function (res) {
            console.log("任务结束", res)
            self.setState({
                areaRankDatas: res[0],
                rankDatas: res[1]
            }, () => {
                console.log("区域加载完", self.state.areaRankDatas)
                console.log("城市加载完", self.state.rankDatas)
            })
        }).catch(e => {
            console.log(e)
        })


        //堆栈柱状图
        //全国区域数据任务
        param.indexCodeList = ['orderAndOutStock', 'unOutStock']
        let areaStackBarChartTask = new Promise((resolve, reject) => {
            if (needArea) {
                param.dimensionCode = AuthorityCode.sale.all
                console.log('堆叠柱状图据查询参数(区域)：', JSON.stringify(param))
                console.log("区域任务(堆叠)", param.dimensionCode)
                ajax.post('saleAnalyzeMainData', param)
                    .then((res) => {
                        console.log("堆叠柱状图据(区域): ", res)
                        var barChartData = this.configStackBarChartData(res, param.dimensionCode)
                        resolve(barChartData)
                    }).catch(e => {
                        reject(e)
                    })
                param.dimensionCode = AuthorityCode.sale.allDept
            } else {
                resolve([])
            }
        })
        //军团、销售数据任务
        let stackBarChartTask = new Promise((resolve, reject) => {
            console.log('堆叠柱状图据查询参数：', JSON.stringify(param))
            console.log("军团任务(堆叠)", param.dimensionCode)
            ajax.post('saleAnalyzeMainData', param)
                .then((res) => {
                    console.log("堆叠柱状图据: ", res)
                    var barChartData = this.configStackBarChartData(res, param.dimensionCode)
                    // var newArray = this.state.stackRankDatas.concat(barChartData)
                    resolve(barChartData)
                }).catch(e => {
                    reject(e)
                })
        })
        Promise.all([areaStackBarChartTask, stackBarChartTask]).then(function (res) {
            console.log("任务结束(堆叠)", res)
            self.setState({
                areaStackRankDatas: res[0],
                stackRankDatas: res[1]
            }, () => {
                console.log("区域堆叠加载完", self.state.areaStackRankDatas)
                console.log("城市堆叠加载完", self.state.stackRankDatas)
            })
        }).catch(e => {
            console.log(e)
        })


    }


    /**
     * 处理数据，输入 接口返回 及 是否是区域数据
     * 返回柱状图需要的数据格式 list
     * @param {Object} res 
     * @param {String} dimensionCode 
     */
    configBarChartData(res, dimensionCode) {
        var rankDatas = []
        res.countList.forEach((groupItem, index) => {
            //拼接数据
            var barChartList = []
            res.list.forEach((item) => {
                var itemData = {
                    name: item.groupName,
                    value: item.indexList[index].amount / 10000,
                    code: item.groupCode,
                    dimensionCode: res.dimensionCode
                }
                if (itemData.value > 0) {
                    //过滤没数据的城市/销售
                    barChartList.push(itemData)
                }
            })
            //排序
            barChartList.sort((a, b) => {
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
        return rankDatas
    }

    /**
     * 处理数据，输入 接口返回 及 是否是区域数据
     * 返回堆栈柱状图需要的数据格式 list
     * @param {Object} res 
     * @param {String} dimensionCode 
     */
    configStackBarChartData(res, dimensionCode) {
        if (res.countList.length % 2 != 0) {
            console.log("处理数据必须是成对的数组")
            return []
        }
        var stackRankDatas = []
        res.countList.forEach((groupItem, index) => {
            if (index % 2 != 0) { return }
            //拼接数据
            var barChartList = []
            res.list.forEach((item) => {
                var value1 = item.indexList[index].amount ? item.indexList[index].amount * 1   : 0.0
                var value2 = item.indexList[index + 1].amount ? item.indexList[index + 1].amount * 1 : 0.0
                var itemData = {
                    name: item.groupName,
                    value1: value1 / 10000,
                    value2: value2  / 10000,
                    value3: value1  / (value1 + value2),
                    code: item.groupCode,
                    dimensionCode: res.dimensionCode
                }
                if (itemData.value1 > 0 || itemData.value2 > 0) {
                    //过滤没数据的城市/销售
                    barChartList.push(itemData)
                }
            })
            //排序
            barChartList.sort((a, b) => {
                var rateSort = b.value3 - a.value3
                return rateSort != 0 ? rateSort :  b.value1 - a.value1
            })
            //整合格式
            var rate = res.countList[index].count * 100 / (res.countList[index].count + res.countList[index + 1].count)
            var barChartData = {
                indexName: res.countList[index].indexName,
                indexCodes: [res.countList[index].indexCode, res.countList[index + 1].indexCode],
                legendNames: [res.countList[index].indexName, res.countList[index + 1].indexName],
                count: rate,
                list: barChartList
            }
            stackRankDatas.push(barChartData)
        })
        return stackRankDatas
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