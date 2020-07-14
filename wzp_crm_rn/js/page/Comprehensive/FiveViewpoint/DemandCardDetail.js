/**
* *  索要卡片
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground, DeviceEventEmitter } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class  DemandCardDetail extends Component {

   static navigationOptions = ({ navigation }) => {
        return {
            title: '小宝集五观',
            headerBackTitle: null,
            headerRight:
            <View style={styles.headerRightBox}>
                {/* <TouchableOpacity style={styles.rightItem} onPress={() => { navigation.navigate('MyProblemList') }}>
                    <Image style={styles.rightImg} source={require('../../../res/FiveViewpointImgs/share.png')}></Image>
                </TouchableOpacity> */}
            </View>
        }
   }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            demandDetail: {},
            demandcardType: '',
        }
    }

   //Life Cycle 在渲染前调用,在客户端也在服务端
    componentWillMount() {
        console.log(this.props.navigation.getParam('item'))
        this.setState({
            demandDetail: this.props.navigation.getParam('item'),
        })
    }

    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
        this.judgeCards()
    }

    // 在组件从 DOM 中移除之前立刻被调用
    componentWillUnmount() {
        
    }

   //SubRenders

    //Render
    render() {
        const { demandDetail, demandcardType } = this.state;
        var showCard = "";
        switch (demandcardType) {
            case "客户观":
                showCard = <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-kehubig.png')}></Image>;
                break;
            case "工作观":
                showCard = <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-workbig.png')}></Image>;
                break;
            case "生命观":
                showCard = <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-lifebig.png')}></Image>;
                break;
            case "人生观":
                showCard = <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-renshengbig.png')}></Image>;
                break;
            case "成功观":
                showCard = <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-succeedbig.png')}></Image>;
                break;
            default:
                showCard = <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/wuguan-bigcard.png')}></Image>;
                break;
        }
        return (
            <ScrollView>
                <View style={styles.demandPageBox}>
                    <Image style={styles.pageBackgroundImg} source={require('../../../res/FiveViewpointImgs/ask-bg.png')}></Image>
                    <View style={styles.headImgBox}>
                        <Image style={styles.medalImg} source={require('../../../res/FiveViewpointImgs/ask-medal.png')}></Image>
                    </View>
                    <View style={styles.headImgBox}>
                        <Image style={styles.headImg} source={{ uri: demandDetail.askPhoto }}></Image>
                    </View>
                    <Text style={styles.demandTitleText}>{ demandDetail.askEmpName }向你索要一张{ demandcardType }卡</Text>
                    <View style={styles.demandCardBox}>
                        { showCard }
                    </View>
                    <TouchableOpacity style={styles.demandButtonBox} onPress={()=>{ this.giveCardsClick() }}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/ask-button.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.refuseBox} onPress={()=>{ this.refuseClick() }}>
                        <Text style={styles.refuseText}>我也没有，拒绝他</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    
    //NetWorks
    //赠送
    giveCardsClick() {
        const { demandDetail } = this.state;
        Toast.showLoading("赠送")
        ajax.get('giveCard',{ id: demandDetail.id, give: 1 }).then((res) => {
            Toast.showSuccess("赠送成功")
            DeviceEventEmitter.emit(global.NotificationIdentify.fiveViewpointInfoList, false)
            this.props.navigation.navigate('DemandCardList')
        }).catch((error) => {
            console.log(error)
            Toast.showFail(' 赠送失败 ')
        })
    }
    
    //回绝
    refuseClick() {
        const { demandDetail } = this.state;
        Toast.showLoading("提交")
        ajax.get('giveCard',{ id: demandDetail.id, give: 2 }).then((res) => {
            Toast.hide()
            DeviceEventEmitter.emit(global.NotificationIdentify.fiveViewpointInfoList, false)
            this.props.navigation.navigate('DemandCardList')
        }).catch((error) => {
            //console.log(error)
            Toast.showFail(' 拒绝失败 ')
        })
    }
    
    //判断五观卡
    judgeCards() {
        const { demandDetail } = this.state;
        console.log(demandDetail)
        if (demandDetail.cardType == 'A') {
            this.setState({
                demandcardType: '客户观',
            })
        } else if (demandDetail.cardType == 'B') {
            this.setState({
                demandcardType: '工作观',
            })
        } else if (demandDetail.cardType == 'C') {
            this.setState({
                demandcardType: '生命观',
            }) 
        } else if (demandDetail.cardType == 'D') {
            this.setState({
                demandcardType: '人生观',
            })
        } else if (demandDetail.cardType == 'E') {
            this.setState({
                demandcardType: '成功观',
            })  
        }else{
            this.setState({
                demandcardType: '五观',
            }) 
        }
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

    //公共style
    unifyImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'contain',
    },

    demandPageBox: {
        width: width,
        height: 750,
        backgroundColor: '#B13A38',
        flex:1,
        alignItems:'center',
    },
    pageBackgroundImg: {
        width: width,
        height: width/750 * 1164,
    },
    headImgBox: {
        width: '100%',
        height: 110,
        position: 'absolute',
        top: '5%',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    medalImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    headImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 10,
    },
    demandTitleText: {
        color: '#FFC782',
        fontSize: 16,
        fontWeight:'900',
        position: 'absolute',
        top: '24%',
    },
    demandCardBox: {
        width: '100%',
        height: '30%',
        position: 'absolute',
        top: '28%',
    },
    demandButtonBox: {
        width: '100%',
        height: '11%',
        position: 'absolute',
        bottom: '20%',
    },
    refuseBox: {
        position: 'absolute',
        bottom: '14%',
    },
    refuseText: {
        color: '#FFB455',
        fontSize: 14,
        fontWeight:'900',
    },
})