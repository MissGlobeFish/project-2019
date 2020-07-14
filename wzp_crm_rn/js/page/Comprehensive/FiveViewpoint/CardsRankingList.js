/**
* *  集卡榜
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class  CardsRankingList extends Component {

   static navigationOptions = ({ navigation }) => {
        return {
         title: '五观集卡榜',
         headerBackTitle: null,
         headerRight:
         <View style={styles.headerRightBox}>
             <TouchableOpacity style={styles.rightItem} onPress={() => { navigation.navigate('MyProblemList') }}>
                 <Image style={styles.rightImg} source={require('../../../res/FiveViewpointImgs/share.png')}></Image>
             </TouchableOpacity>
         </View>
       }
   }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            myRrankNumber: 0,
            rankingListData: [],
        }
    }

   //Life Cycle
    componentWillMount() {
        
    }

    componentDidMount() {
        this.getCardsRanking();
    }

    componentWillUnmount() {

    }

   //SubRenders

    //Render
    render() {
        const { myRrankNumber, rankingListData } = this.state;
        return (
            <View style={styles.listPageBox}>
                <Image style={styles.listPageImg} source={require('../../../res/FiveViewpointImgs/list-bg.png')}></Image>
                <View style={styles.scrollBox}>
                    <Image style={styles.scrollImg} source={require('../../../res/FiveViewpointImgs/list-scroll.png')}></Image>
                    <Text style={styles.scrollTitleText}>我的排名：{ myRrankNumber }</Text>
                </View>
                <FlatList
                    style={styles.rankingListBox}
                    data={ rankingListData }
                    renderItem={({item}) => this._rankingList(item)}//列表          
                />
            </View>
        )
    }

    // 排行榜
    _rankingList(item) {
        var rankNumber = "";
        switch (item.queue) {
            case 1:
                rankNumber = this._firstRank();
                break;
            case 2:
                rankNumber = this._secondRank();
                break;
            case 3:
                rankNumber = this._thirdRank();
                break;
            default:
                rankNumber = this._otherRank(item.queue);
                break;
        }
        return (
            <View style={styles.rankingItemBox}>
                <View style={styles.leftBox}>
                    { rankNumber }
                    <View style={styles.headBox}>
                        <Image style={styles.headImg} source={{ uri: item.photo }}></Image>{/* 头像 */}
                    </View>
                    <Text style={styles.NameText}>{ item.empName }</Text>{/* 姓名 */} 
                </View>
                <View style={styles.rightBox}>{/* 卡的数量 */}
                    <View style={styles.fiveViewBox}>
                        <Image style={styles.unifyImg} source={require('../../../res/FiveViewpointImgs/list-fiveView.png')}></Image>
                    </View>
                    <Text style={styles.cardsSumText}>{ item.num }</Text>
                </View>
            </View>
        )
    }

    // 第一名金牌
    _firstRank() {
        return (
            <View style={styles.rankBox}>
                <Image style={styles.rankImg} source={require('../../../res/FiveViewpointImgs/list-first.png')}></Image>
            </View> 
        )
    }
    
    // 第二名金牌
    _secondRank() {
        return (
            <View style={styles.rankBox}>
                <Image style={styles.rankImg} source={require('../../../res/FiveViewpointImgs/list-second.png')}></Image>
            </View> 
        )
    }
    
    // 第三名金牌
    _thirdRank() {
        return (
            <View style={styles.rankBox}>
                <Image style={styles.rankImg} source={require('../../../res/FiveViewpointImgs/list-third.png')}></Image>
            </View> 
        )
    }
    
    // 其他名次
    _otherRank(rank) {
        return (
            <View style={styles.rankBox}>
                <Text style={styles.rankText}>{ rank }</Text>
            </View> 
        )
    }
    

    //NetWorks
    getCardsRanking() {
        ajax.get('cardsRanking').then((res) => {
            console.log(res)
            let myRank = 0
            res.forEach(ele => {
                if (this.state.empCode == ele.empCode) {
                    myRank = ele.queue
                }
            });
            this.setState({
                rankingListData: res,
                myRrankNumber: myRank,
            })
        }).catch((error) => {
            console.log(error)
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

    /* 公共style */
    unifyImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'contain',
    },

    listPageBox: {
        width: '100%',
        height: '100%',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    //背景图
    listPageImg: {
        width: '100%',
        height: '100%',
    },

    //卷轴背景
    scrollBox: {
        width: '89%',
        height: '71%',
        position: 'absolute',
        top: '22%',
    },
    scrollImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'stretch',
    },
    scrollTitleText: {
        width: '100%',
        color: '#C51819',
        fontWeight:'900',
        textAlign: 'center',
        position: 'absolute',
        top: '10%',
    },

    /* 排行榜列表 */
    rankingListBox: {
        width: '72%',
        height: '50%',
        position: 'absolute',
        top: '33%',
    },
    rankingItemBox: {
        width: '100%',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    leftBox: {
        height: '100%',
        flex: 2.5,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
    },
    rightBox: {
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
    },

    //金牌
    rankBox: {
        width: 20,
        height: 30,
        flex: 0,
        alignItems:'center',
        justifyContent: 'center',
    },
    rankImg: {
        width: '100%',
        height: '100%',
    },
    rankText: {
        width: 18,
        height: 18,
        lineHeight: 18,
        borderRadius: 20,
        fontWeight:'900',
        color: '#C51819',
        textAlign: 'center',
        backgroundColor: '#EEBD8E',
    },
    //头像
    headBox: {
        width: 50,
        height: 50,
    },
    headImg: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    //姓名
    NameText: {
        width: '36%',
        fontWeight:'900',
    },
    //卡数量
    fiveViewBox: {
        width: 17,
        height: 17,
        marginLeft: 14,
    },
    cardsSumText: {
        color: '#C51819',
        fontWeight:'900',
        marginRight: 14,
    },
})