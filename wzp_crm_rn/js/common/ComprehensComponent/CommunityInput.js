/**
 * CommunityInput--社区输入
 */
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native-elements'
import RootSiblings from 'react-native-root-siblings';
import { FormTextArea } from '../FormComponents/Index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let inputSilbling = null;

export default class CommunityInput extends Component {

    constructor(props) {
        super(props)
    }

    static inputType = 'Q'
    static curreValue = ""
    static _onInputSubmit = (string) => { }   //选择回调
    static _onInputCanceled = () => { }       //取消回调


    static inputCompmon() {
        var maxLength = 300
        var isQustion = this.inputType == 'Q'
        var behavior = null
        if (Platform.OS == "ios") {
            behavior="position"
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.Container}
                onPress={() => {
                    this.close()
                }}
            >
                <KeyboardAvoidingView behavior={behavior} style={styles.textInputContainer}>
                    <TouchableOpacity activeOpacity={1}
                        style={{
                            backgroundColor: '#fff',
                            paddingVertical: 12
                        }}
                        onPress={() => { }}
                    >
                        <FormTextArea
                            placeholder={"和小伙伴一起参与讨论吧"}
                            // maxLength={300}
                            value={this.curreValue}
                            autoFocus={true}
                            onValueChanged={(text) => {
                                this.curreValue = text
                                if (inputSilbling != null) {
                                    inputSilbling.update(this.inputCompmon())
                                }
                            }}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                disabled={this.curreValue.length == 0}
                                titleStyle={{fontSize: 14}}
                                borderRadius={14}
                                backgroundColor='#2692FF'
                                buttonStyle={{ paddingVertical: 0, marginHorizontal: 20, height: 28, borderRadius: 14 }}
                                disabledStyle={{ backgroundColor: '#BEDEFF' }}
                                disabledTitleStyle={{color: '#fff'}}
                                title={isQustion ? "发布问题" : "发表"}
                                onPress={() => {
                                    this.close()
                                    this._onInputSubmit(this.curreValue)
                                }} />
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        )
    }


    static show(inputType, value, onSubmit, onCanceled) {
        if (inputSilbling != null) {
            inputSilbling.destroy()
        }
        this.inputType = inputType
        this.curreValue = value
        this._onInputSubmit = onSubmit ? onSubmit : () => { }
        this._onInputCanceled = onCanceled ? onCanceled : () => { }
        let silbling = new RootSiblings(
            this.inputCompmon()
        );
        inputSilbling = silbling;
    }


    static close() {
        if (inputSilbling != null) {
            inputSilbling.destroy()
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
    textInputContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 99,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#fff'
    },

})