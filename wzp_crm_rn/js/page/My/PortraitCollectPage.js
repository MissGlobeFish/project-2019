/**
 * PortraitCollectPage  我的 -- 人像采集
 */
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Dimensions, DeviceEventEmitter } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import { Button } from 'react-native-elements';
const { width, height } = Dimensions.get('window');

export default class PortraitCollectPage extends Component {
    static navigationOptions = {
        title: '人像采集',
        headerBackTitle: null,
    };

    constructor(props) {
        super(props)
        this.state = {
            currentPirtaut: null,
        }
    }

    componentDidMount() {
        this.loadPortraitInfo()

        var self = this
        this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.userPortaitDidUpdate, function (value) {
            self.loadPortraitInfo()
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    render() {
        
        const { currentPirtaut } = this.state
        return (
            <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', backgroundColor: '#ffffff' }}>

                {!currentPirtaut &&
                    <View style={styles.picInfoBox}>
                        <Image
                            resizeMode='contain'
                            source={require('../../res/imgs/PortraitHome.png')}
                            style={{ width: '53%', height: width * 0.53, marginTop: 100 }}

                        />
                        <Text style={{ fontFamily: 'PingFangSC-Medium', fontSize: 18, color: '#323232', lineHeight: 21, marginTop: 12}}>
                            还未采集过人脸
                        </Text>
                        <Text style={{ fontFamily: 'PingFangSC-Regular', fontSize: 14, color: '#888888', lineHeight: 18, marginTop: 8 }}>
                            采集时请平视屏幕，并正对光源
                        </Text>
                    </View>
                }
                {currentPirtaut &&
                    <Image
                        style={styles.pirtautImageStyle}
                        source={{ uri: currentPirtaut }}
                    />
                }

                <View
                    style={styles.buttonBoxStyle}
                >
                    <Button
                        titleStyle={{fontSize: 18}}
                        title={currentPirtaut ? '重新采集人脸' : '去采集人脸'}
                        containerStyle={{ width: '80%', borderRadius: 5}}
                        buttonStyle={{height: 51, margin: 0, backgroundColor: '#4D66FD'}}
                        onPress={() => {
                            this.props.navigation.navigate('PortraitCamera', { isNew: (currentPirtaut == null || currentPirtaut == undefined) })
                        }}
                    />
                    <Text style={{width: '80%', fontFamily: 'PingFangSC-Regular', fontSize: 14, color: '#888888', lineHeight: 18, marginTop: 20}}>
                        说明：人脸信息将用于人脸识别相关应用，我们会对人脸信息进行严格保密
                    </Text>
                </View>
            </View>
        );
    }



    /**
     * 网络请求人像信息
     *
     * @memberof PortraitCollectPage
     */
    loadPortraitInfo() {
        ajax.getOther('user/face', PersistanceManger.ShareInstance().empCode).then((res) => {
            this.setState({
                currentPirtaut: res.photo
            })
        }).catch((e) => { })
    }
}

const styles = StyleSheet.create({
    picInfoBox: {
        width: '100%',
        height: '70%',
        alignItems: 'center',
        // backgroundColor: 'green',

    },
    buttonBoxStyle: {
        width: '100%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'orange',
       
    },
    pirtautImageStyle: {
        marginTop: 30,
        width: '80%',
        height: '60%',
        alignItems: 'center',
        // backgroundColor: 'gray'
    },

});
