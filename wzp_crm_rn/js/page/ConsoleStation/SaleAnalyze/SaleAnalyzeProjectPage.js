/**
* 销量分析首页
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import SaleIndexPanel from '../../../common/SaleAnalysis/SaleIndexPanel'
import SaleAnalysisChart from '../../../common/SaleAnalysis/SaleAnalysisChart'
import SaleAnalysisTabel from '../../../common/SaleAnalysis/SaleAnalysisTabel'
import ajax from '../../../config/Fetch'
import PersistanceManger from '../../../util/PersistanceManger'
import Toast from '../../../common/Toast'

export default class SaleAnalyzeProjectPage extends Component {

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
            headerRight: null
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
            userId: null, //查询人物信息
            cityList: [],
            projectList: [],
            selectIndex: ''
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
        this.state.cityList = getParam("cityList")
        this.state.projectList = getParam("projectList")
        this.state.selectIndex = getParam("index")
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
        const { saleTitle, indexPanData, tabelPanData, chartPanData, showLineChartPan } = this.state
        return (
            // <SafeAreaView style={}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* <View style={styles.nameLabelBox}>
                    <Image style={{ width: 16, height: 13, marginHorizontal: 5 }} source={require('../../../res/imgs/SaleAnalyzeTitle.png')} />
                    <Text style={styles.nameLabel}>{saleTitle}</Text>
                </View> */}
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
                    dataType={global.saleAnalyzeAuthorityCode.project.saler}
                    didSelectAtCityLabel={this.tabelPanDidSelectItemHeader.bind(this)}
                    didSelectAtIndexItem={this.tabelPanDidSelectIndexItem.bind(this)}
                />
            </ScrollView>
            // </SafeAreaView>
        );
    }


    //Action && Handeler

    /**
     * 切换指数
     *
     * @param {*} index
     * @memberof SaleAnalyzeProjectPage
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
     * @memberof SaleAnalyzeProjectPage
     */
    tabelPanDidSelectItemHeader(item) {
        console.log("点击具体城市/销售/项目组", item)
    }

    /**
     * 点击具体指数值
     *
     * @param {*} item
     * @memberof SaleAnalyzeProjectPage
     */
    tabelPanDidSelectIndexItem(item, indexInfo) {
        console.log("点击具体指数值", item, indexInfo)
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
        const { filtrateChoiceContent, userId, cityList, projectList, selectIndex} = this.state

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
        


        let param = {
            cityList: cityList,
            startDate: this.startDate,
            endDate: this.endDate,
            userId: userId,
            indexCodeList: [selectIndex],
            invoiceDateType: indexDic['invoiceDateType'],
            outDateType: indexDic['outDateType'],
            projectList: projectList,
        }
        console.log('主数据查询参数：', JSON.stringify(param))
        ajax.post('saleAnalyzeIndexDetailData', param).then((res) => {
            Toast.hide()
            console.log("IndexDetailData: ", res)
            this.setState({
                saleTitle: res.contentName,
                indexPanData: res.countList,
                tabelPanData: res.list,
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

        const { filtrateChoiceContent, userId, cityList, projectList } = this.state
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
            cityList: cityList,
            projectList: projectList,
            dimensionCode: 'project',
            startDate: this.startDate,
            endDate: this.endDate,
            userId: userId ,
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
        // marginTop: 5,
    }
})