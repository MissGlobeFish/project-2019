/**
 * FormAlert--提示框
 */
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Button } from 'react-native-elements'
import RootSiblings from 'react-native-root-siblings';

let alertSilbling = null;

export default class FormAlert extends Component {

    constructor(props) {
        super(props)
    }

    static _onSureTapped = () => { }         //确定回调
    static _onCancelTapped = () => { }       //取消回调


    static show(text, type, onSureTapped, onCancelTapped = null) {
        if (alertSilbling != null) {
            alertSilbling.destroy()
        }
        var isDelet = type == 'delete'

        this._onSureTapped = onSureTapped ? onSureTapped : () => { }
        this._onCancelTapped = onCancelTapped ? onCancelTapped : () => { }
        let silbling = new RootSiblings(
            <TouchableOpacity activeOpacity={1} style={styles.Container}
                onPress={() => {
                    this.close()
                }}
            >
                <TouchableOpacity activeOpacity={1} style={styles.alertBackView}
                    onPress={() => { }}
                >
                    <View style={styles.labelBox}>
                        <Text style={styles.alertTextLabel}>{text}</Text>
                    </View>

                    <View style={styles.btnBox}>
                        <Button
                            containerStyle={{ width: '50%', marginLeft: 0, marginRight: 0}}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.cancelText}
                            title={isDelet ? "取消" : "取消"} backgroundColor='#FBFBFB'
                            onPress={() => {
                                this.close()
                                if(this._onCancelTapped){
                                    this._onCancelTapped()
                                }
                            }} />
                        <Button
                            containerStyle={{ width: '50%', marginLeft: 0, marginRight: 0}}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.sureText}
                            title={isDelet ? "刪除" : "確定"} backgroundColor='#FBFBFB' 
                            onPress={() => {
                                this.close()
                                if(this._onSureTapped){
                                    this._onSureTapped()
                                }
                            }} />
                    </View>

                </TouchableOpacity>
            </TouchableOpacity>
        );
        alertSilbling = silbling;
    }


    static close() {
        if (alertSilbling != null) {
            alertSilbling.destroy()
        }
    }


    componentDidMount() {

    }
    componentWillUnmount() { //组件销毁
    }
    render() {
        return null
    }
}

const styles = StyleSheet.create({
    Container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.4)',
        zIndex: 9,
    },
    alertBackView: {
        borderRadius: 2,
        backgroundColor: '#fff',
        position: 'absolute',
        width: '83%',
        left: '8.5%',
        top: "30%",
        zIndex: 99,

    },
    labelBox: {
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertTextLabel: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 18,
        color: "#323232",
        textAlign: "center",
    },
    btnBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
    },
    buttonStyle: {
        borderWidth: 1,
        backgroundColor: '#FBFBFB',
        borderColor: '#eeeeee',
    },
    cancelText: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 16,
        color: "#888888",
        textAlign: "center",
    },
    sureText: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 16,
        color: "#FF0000",
        textAlign: "center",
    }
})