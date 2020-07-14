/**
* *  索要卡片列表
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground, DeviceEventEmitter } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';

var cardTypeMap = {
    'A': {
        name: '客户观',
        img: require('../../../res/FiveViewpointImgs/wuguan-selectkehu.png')
    },
    'B': {
        name: '工作观',
        img: require('../../../res/FiveViewpointImgs/wuguan-selectwork.png')
    },
    'C': {
        name: '生命观',
        img: require('../../../res/FiveViewpointImgs/wuguan-selectlife.png')
    },
    'D': {
        name: '人生观',
        img: require('../../../res/FiveViewpointImgs/wuguan-selectrensheng.png')
    },
    'E': {
        name: '成功观',
        img: require('../../../res/FiveViewpointImgs/wuguan-selectsucced.png')
    }
}

export default class  DemandCardList extends Component {

   static navigationOptions = ({ navigation }) => {
        return {
            title: '小宝集五观',
            headerBackTitle: null,
            headerRight:
            <View style={styles.headerRightBox}>
            </View>
        }
   }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            messageListData: [],
        }
    }

    getDefaultProps() {
        
    }

   //Life Cycle 在渲染前调用,在客户端也在服务端
    componentWillMount() {
    }

    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
        this.getMessageList()
        let self = this
        this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.fiveViewpointInfoList, function (refresh) {
            self.getMessageList()
        });
    }

    // 在组件从 DOM 中移除之前立刻被调用
    componentWillUnmount() {
        this.listener.remove()
    }

   //SubRenders

    //Render
    render() {
        const { messageListData } = this.state;
        return (
            <ScrollView style={styles.pageBox}>
                { messageListData.length > 0 ? this._messagrListBox() : this._emptyBox() }
            </ScrollView>
        )
    }
    
    //列表为空
    _emptyBox() {
        return (
            <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>你还没有收到消息哦 ~~</Text>
            </View>
        )
    }

    //消息列表盒子
    _messagrListBox() {
        const { messageListData } = this.state;
        return (
            <FlatList
                style={styles.demandListPageBox}
                data={ messageListData }
                renderItem={({item}) => this._messagrList(item)}//列表          
            />
        )
    }

    //消息列表
    _messagrList(item) {
        var isGive = "";
        switch (item.give) {
            case 0:
                isGive = this._checkClick(item);
                break;
            case 1:
                isGive = this._agreeClick(item);
                break;
            default:
                isGive = this._refuseClick(item);
                break;
        }
        let cardName = cardTypeMap[item.cardType] == undefined ? "" : cardTypeMap[item.cardType].name
        let imgUri = cardTypeMap[item.cardType] == undefined ? "" : cardTypeMap[item.cardType].img
        return (
            <View style={styles.messagrItemBox}>
                <View style={styles.leftBox}>
                    <View style={styles.headBox}>
                        <Image style={styles.headImg} source={{ uri: item.askPhoto }}></Image>
                    </View>
                    <View style={{maxWidth: '80%', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.NameText}>{ item.askEmpName }</Text>{/* 姓名 */}
                        <Text>{ ' 请您赐予 ' }</Text>{/* 姓名 */}
                        <Image source={imgUri} resizeMode='contain' style={{height: 30, maxWidth: 17}}></Image>
                        <Text style={styles.NameText}>  { cardName }</Text>{/* 姓名 */}
                    </View>
                </View>
                { isGive }
            </View>
        )
    }
    
    //查看按钮（可点）
    _checkClick(item) {
        return (
            <TouchableOpacity style={styles.agreeBox} onPress={()=>{ this.props.navigation.navigate('DemandCardDetail',{ item: item }) }}>
                <Text style={styles.yesAgreeText}>查看</Text>
            </TouchableOpacity>
        )
    } 
    
    //已同意按钮
    _agreeClick(item) {
        return (
            <View style={styles.agreeBox}>
                <Text style={styles.noAgreeText}>已赠送</Text>
            </View>
        )
    }
    
    //已拒绝按钮
    _refuseClick(item) {
        return (
            <View style={styles.agreeBox}>
                <Text style={styles.noAgreeText}>已拒绝</Text>
            </View>
        )
    }   

    //NetWorks
    getMessageList() {
        ajax.get('myMessageList',{empCode: this.state.empCode}).then((res) => {
            console.log(res)
            this.setState({
                messageListData: res,
            })
        }).catch((error) => {
            //console.log(error)
        })
    }

}

//Styles
const styles = StyleSheet.create({
    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
    },
    rightItem: {
        marginRight: 23,
    },
    rightImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    pageBox: {
        width: width,
        height: height,
        backgroundColor: '#B0072B'//'#DF5542',
    },

    //空消息列表
    emptyBox: {
        width: '100%',
        height: '100%',
        marginTop: '10%',
    },
    emptyText: {
        width: '100%',
        color: '#FCD4AD',
        textAlign: 'center',
    },

    //消息列表
    demandListPageBox: {
        width: width,
        height: '100%',
        backgroundColor: '#B0072B',//'#DF5542',
        paddingVertical: 20,
        paddingHorizontal: '6%',
    },
    messagrItemBox: {
        width: '100%',
        height: 55,
        backgroundColor: '#FCD4AD',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    leftBox: {
        height: '100%',
        flex: 0,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
    },
    //头像
    headBox: {
        width: 60,
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    headImg: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    //姓名
    NameText: {
        // width: '60%',//'36%',
        fontWeight:'900',
    },
    //查看按钮
    yesAgreeText: {
        width: 80,
        height: '50%',
        color: '#FC575A',
        lineHeight: 25,
        textAlign: 'center',
        fontWeight:'900',
    },
    noAgreeText: {
        width: 80,
        height: '50%',
        color: '#999',
        lineHeight: 25,
        textAlign: 'center',
        fontWeight:'900',
    }
})