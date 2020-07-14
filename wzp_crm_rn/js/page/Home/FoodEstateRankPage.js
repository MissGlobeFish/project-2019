/**
 * FoodEstateRankPage 餐饮排行榜
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import RankAvatar from '../../common/RankAvatar'
import RankSections from '../../common/RankSections'
import ajax from '../../config/Fetch';
import Toast from '../../common/Toast'

var EstateRankType = {
    order: 0,
    repay: 1,
};


export default class FoodEstateRankPage extends Component {


    static defaultProps = {

    };

    static navigationOptions = ({ navigation }) => {
        // let realTime = navigation.getParam('realTime')
        return {
          title:'餐饮排行榜'
            // title: realTime == null ? "地产排行榜" : realTime ? "地产实时排行榜" : "地产上月排行榜",
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            startDate: 'startDate',
            endDate: 'endDate',
            ranktype: EstateRankType.order,
            //冠亚季军榜
            topData: [],
            //其他榜单数据
            detailData: [],
            realTime: true
        }
    }



    componentDidMount() {
      const {realTime} = this.state;
        // const { getParam, setParams } = this.props.navigation;
        // let realTime = getParam('realTime')
        // if (realTime == null) {
        //     setParams({ realTime: true })
        //     realTime = true
        // }
        this.configeDate(realTime, this.loadDatas.bind(this))
    
    }

    // 切换地产实时和上月排行榜按钮 实时排行榜
    rankTimeSwitch() {
      const {realTime} = this.state;
      return(
        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
          <TouchableOpacity
          onPress={()=>{
            this.configeDate(true,this.loadDatas.bind(this))
            this.setState({
              realTime: true,
              ranktype: EstateRankType.order
            })
          }}
          >
            <Text style={{color:'#fff'}}>实时排行榜</Text>
            <View style={[styles.tabBoxBoder,realTime ? {borderBottomColor:'#fff'}:{borderBottomColor:'transparent'}]}></View>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            this.configeDate(false,this.loadDatas.bind(this))
            this.setState({
              realTime: false,
              ranktype: EstateRankType.order
            })
          }}
          >
            <Text style={{color:'#fff'}}>上月排行榜</Text>
            <View style={[styles.tabBoxBoder,realTime ? {borderBottomColor:'transparent'}:{borderBottomColor:'#fff'}]}></View>
          </TouchableOpacity>
        </View>
      )
    }

    //订单 / 回款 按钮
    rankTypeSwitchComponent() {
        const { ranktype } = this.state;
        return (
            <View style={{ top: 8, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ marginRight: 5 }}
                    onPress={() => { this.setState({ ranktype: EstateRankType.order,topData: []}, () => { this.loadDatas() }) }}
                >
                    <Image
                        style={{ width: 110, height: 30 }}
                        source={ranktype == 0 ? require('../../res/imgs/rankDetail_on.png') : require('../../res/imgs/rankDetail_off.png')}
                    >
                    </Image>
                    <Text style={[styles.typeSwitchButtonTtitle, { color: ranktype == 0 ? '#B25E0D' : '#B592FF' }]}>订单</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={1}
                    style={{ marginLeft: 5 }}
                    onPress={() => { this.setState({ ranktype: EstateRankType.repay,topData: []}, () => { this.loadDatas() }) }}
                >
                    <Image
                        style={{ width: 110, height: 30 }}
                        source={ranktype == 1 ? require('../../res/imgs/rankDetail_on.png') : require('../../res/imgs/rankDetail_off.png')}
                    >
                    </Image>
                    <Text style={[styles.typeSwitchButtonTtitle, { color: ranktype == 1 ? '#B25E0D' : '#B592FF' }]}>回款</Text>
                </TouchableOpacity>
            </View>
        )
    }

    //冠亚季军榜单
    rankTopThreeComponent() {
        const { topData } = this.state;
        return (
            <View style={{ top: 60, width: '100%', backgroundColor: '#fffef7', borderRadius: 15 }}>
                <Image
                    resizeMode='contain'
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={{ uri: 'https://img.wangxiaobao.cc/20181013/rankings/rankings05.png' }}
                />
                <View style={{ top: 15, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 21, height: 21 }} source={require('../../res/imgs/rankTopLeft.png')} />
                    <Text style={{
                        color: '#FF7A33',
                        fontFamily: 'PingFangSC-Semibold',
                        fontSize: 23,
                        marginLeft: 10,
                        marginRight: 10,
                    }}>冠亚季军榜</Text>
                    <Image style={{ width: 21, height: 21 }} source={require('../../res/imgs/rankTopRight.png')} />
                </View>
                <View style={{flex: 1, top: 10, height: 230, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                    <RankAvatar
                        style={{flex: 1}}
                        name= { topData[1]?.empName ?? "虚位以待" }
                        avatar= { topData[1]?.photo ?? "" }
                        topRank = {1}
                        
                    />
                    <RankAvatar
                        style={{flex: 1.24}}
                        name = { topData[0]?.empName ?? "虚位以待"}
                        avatar= { topData[0]?.photo ?? "" }
                        topRank = {0}
                    />
                    <RankAvatar
                        style={{flex: 1}}
                        name = { topData[2]?.empName ?? "虚位以待"}
                        avatar= { topData[2]?.photo ?? "" }
                        topRank = {2}
                    />
                </View>
            </View >
        )
    }

    //详情
    rankSectionComponent() {
        const { detailData } = this.state;
        
        let sections = detailData.map((sectionData, index)=>{ 
            console.log(sectionData, index)
            return <RankSections
                    title= {sectionData.label}
                    level= { index }
                    dataList= {sectionData.values}
                    key= {index}
                    />
        })
        return (
            <View style={{marginTop: 60}}>
            { sections }
            </View>
        )
    }

    render() {
        const { getParam, setParams } = this.props.navigation;
        const { startDate, endDate, ranktype,realTime } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView
                    bounces={false}>
                    <View
                        style={styles.scrollContentView}>
                        {/* TopImage */}
                        <Image
                            resizeMode='contain'
                            style={styles.topImage}
                            source={{ uri: 'https://img.wangxiaobao.cc/20181106/rankings/bg.png' }}
                        />
                        <View style={styles.backColoerView}></View>
                        {/* BottomImage */}
                        <Image
                            resizeMode='contain'
                            style={styles.footImage}
                            source={{ uri: 'https://img.wangxiaobao.cc/20181013/rankings/rankings06.png' }}
                        />
                        {/* Content */}
                        {/* 地产上月和实时排行榜切换 */}
                        {this.rankTimeSwitch()}
                        <View
                            style={styles.rankDetaile}>
                            <Text style={styles.titleStyle}>{realTime ? "餐饮实时排行榜" : "餐饮上月排行榜"}</Text>
                            {/* Date */}
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={styles.dateStar} source={require('../../res/imgs/rankStar.png')} />
                                <Text style={styles.dateStyle}>{this.changeDateFomart(startDate) + '-' + this.changeDateFomart(endDate)}</Text>
                                <Image style={styles.dateStar} source={require('../../res/imgs/rankStar.png')} />
                            </View>
                            {/* Switch */}
                            {this.rankTypeSwitchComponent()}
                            {/* TopThree */}
                            {this.rankTopThreeComponent()}
                            {/** RankDetail */}
                            {this.rankSectionComponent()}
                        </View>
                    </View>
                </ScrollView>
            </View >
        );
    }

    configeDate(isThisMonth, finashCallBcak = ()=>{}) {

        function getMonthDays(myMonth) {
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        }
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        }
        var now = new Date(); //当前日期
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getYear(); //当前年 
        let fixNumber = (nowYear < 2000) ? 1900 : 0 
        nowYear += fixNumber
        var lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastMonth = lastMonthDate.getMonth();
        var lastYear = lastMonthDate.getFullYear();//上一个月的年份
        var monthStartDate = formatDate(new Date(nowYear, nowMonth, 1))
        var monthEndDate = formatDate(new Date(nowYear, nowMonth, getMonthDays(nowMonth)));
        var lastMonthStartDate = formatDate(new Date(lastYear, lastMonth, 1));
        var lastMonthEndDate = formatDate(new Date(lastYear, lastMonth, getMonthDays(lastMonth)));

        this.setState({
            startDate: isThisMonth ? monthStartDate : lastMonthStartDate,
            endDate: isThisMonth ? monthEndDate : lastMonthEndDate,
            // startDate: "2018-08-01",
            // endDate: "2018-08-31",
        },() => {
            finashCallBcak()
        })
    }

    loadDatas() {
        // const { getParam, setParams } = this.props.navigation;
        const { startDate, endDate, ranktype } = this.state;
        console.log("加载数据" + startDate + '-' + endDate, "     Type: " + ranktype)

        ajax.get('catering-ranking-details', { startDate: startDate, endDate: endDate, type: ranktype.toString() }).then(res => {
            console.log(res,'res')
            // res = [{"values":[{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0034","empName":"罗清平","photo":"","sum":230000},{"empCode":"GS0030","empName":"李锦冰","photo":"","sum":225800}],"label":"冠亚季军"},{"values":[{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000}],"label":"最强王者(100万≤X)"},{"values":[{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000},{"empCode":"GS0067","empName":"陈柚延","photo":"https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg","sum":245000}],"label":"永恒钻石(70万≤X≤100万)"},{"values":[],"label":"尊贵铂金(30万≤X≤70万)"},{"values":[{"empCode":"GS0067","empName":"陈柚延","photo":"","sum":245000},{"empCode":"GS0034","empName":"罗清平","photo":"","sum":230000},{"empCode":"GS0030","empName":"李锦冰","photo":"","sum":225800},{"empCode":"GS0053","empName":"陈士杰","photo":"","sum":138000},{"empCode":"GS0225","empName":"崔丹丹","photo":"","sum":124000},{"empCode":"GS0326","empName":"梁伟","photo":"","sum":112800}],"label":"荣耀黄金(10万≤X≤30万)"},{"values":[{"empCode":"GS0551","empName":"黄周敏","photo":"","sum":85500},{"empCode":"GS0427","empName":"罗南海","photo":"","sum":65000}],"label":"秩序白银(5万≤X≤10万)"},{"values":[{"empCode":"GS0237","empName":"姚文丽","photo":"","sum":48000},{"empCode":"GS0786","empName":"李锦玉","photo":"","sum":45000},{"empCode":"GS0023","empName":"陈鹏质","photo":"","sum":40000},{"empCode":"GS0147","empName":"李森","photo":"","sum":38000},{"empCode":"GS0153","empName":"张海瑞","photo":"","sum":38000},{"empCode":"GS0771","empName":"贾李亮","photo":"","sum":36000},{"empCode":"GS0310","empName":"杨树朋","photo":"","sum":36000},{"empCode":"GS0787","empName":"艾智勇","photo":"","sum":35000},{"empCode":"GS0693","empName":"徐榕泽","photo":"","sum":35000},{"empCode":"GS0020","empName":"赵县杰","photo":"","sum":34400},{"empCode":"GS0309","empName":"王斌","photo":"","sum":23250},{"empCode":"GS0013","empName":"黄春茹","photo":"","sum":18000},{"empCode":"GS0103","empName":"徐归","photo":"","sum":10000},{"empCode":"GS0004","empName":"孟凡刚","photo":"","sum":10000},{"empCode":"GS0498","empName":"姚军","photo":"","sum":7500},{"empCode":"GS0033","empName":"尹祖鹏","photo":"","sum":2600}],"label":"倔强青铜(0万≤X≤5万)"}]
            resTopData = res[0].values ?? []
            resDetailData = res.slice(1) ?? []
            this.setState({
                topData: resTopData,
                detailData: resDetailData,
            })
        }).catch(error => {
            Toast.showFail("加载失败")
        })
    }

    changeDateFomart(date) {
        if (!date || date == ""){
            return ""
        }
        var reg = new RegExp("-","g") 
        return date.replace(reg,".")
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    scrollContentView: {
        height: '100%'
    },
    topImage: {
        position: 'absolute',
        top: 0,
        width: width,
        height: width / 750 * 668,
    },
    backColoerView: {
        position: 'absolute',
        width: width,
        top: width / 750 * 668,
        bottom: width / 750 * 673,
        backgroundColor: '#2A0B6C',
    },
    footImage: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#2A0B6C',
        width: width,
        height: width / 750 * 673,
    },
    rankDetaile: {
        marginLeft: 20,
        minHeight: 600,
        marginTop: 60,
        marginBottom: 91,
        marginLeft: 12,
        marginRight: 12,
    },
    titleStyle: {
        fontSize: 36,
        fontFamily: 'PingFangSC-Semibold',
        textAlign: "center",
        color: '#FFFFFF',
        width: '100%',
        textShadowOffset: { width: 0, height: 4 },
        textShadowColor: '#1E18BA',
        textShadowRadius: 2,
    },
    dateStyle: {
        color: '#FFFFFF',
        fontFamily: 'PingFangSC-Semibold',
        fontSize: 13,

    },
    typeSwitchButtonTtitle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        lineHeight: 30,
        textAlign: 'center',
    },
    dateStar: {
        width: 7,
        height: 7,
        marginLeft: 7,
        marginRight: 7,
    },
    tabBoxBoder: {
      borderBottomWidth: 2,
      width: 30, 
      alignSelf:'center',
      paddingTop: 10
    },

});
