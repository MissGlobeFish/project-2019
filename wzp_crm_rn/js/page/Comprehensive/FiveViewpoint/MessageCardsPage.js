/**
* *  消息列表
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class  MessagePage extends Component {

   static navigationOptions = ({ navigation }) => {
        return {
            title: '小宝集五观',
            headerBackTitle: null,
            headerRight:
            <View style={styles.headerRightBox}>
                <TouchableOpacity style={styles.rightItem} onPress={() => { navigation.navigate('#') }}>
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
        }
    }

   //Life Cycle 在渲染前调用,在客户端也在服务端
    componentWillMount() {
    }

    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
        
    }

    // 在组件从 DOM 中移除之前立刻被调用
    componentWillUnmount() {
        
    }

   //SubRenders

    //Render
    render() {
        const { numberTimes } = this.state;
        return (
            <ScrollView>
                <View style={styles.messagePageBox}>
                    <Text style={styles.refuseText}>我也没有，拒绝他</Text>
                </View>
            </ScrollView>
        )
    }
    
    //游戏入口按钮组
    _entranceButtons() {
        
    }
    
    //规则排行榜按钮组
    _footerButtons() {
        
    }
    

    //NetWorks


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

    messagePageBox: {
        backgroundColor: '#FCD4A3',
    },
})