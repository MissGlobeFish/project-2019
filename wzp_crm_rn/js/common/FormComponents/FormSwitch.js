/**
 * FormSwitch --- 表单Switch
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import FormBaseComponents from './FormBaseComponents'
import PropTypes from 'prop-types'

export default class FormSwitch extends FormBaseComponents {

    static propTypes = {
        title: PropTypes.string,        //项目标题
        leftBtnTitle: PropTypes.string, //左按钮标题，默认为“是”
        rightBtnTitle: PropTypes.string,//右按钮标题，默认为“否”

        onValueChanged: PropTypes.func, //值改变的回调
        value: PropTypes.any,           //绑定值
        keyName: PropTypes.string,      //对应 form 字段名
        editEnable: PropTypes.bool,     //可否编辑
    }
    static defaultProps = {
        title: "",
        leftBtnTitle: "是",
        rightBtnTitle: "否",
        value: null,
        editEnable: true,
        onValueChanged: (value, keyName, sender ) => { }
    };

    constructor(props) {
        super(props)
        this.state = Object.assign({
            // inputvalue: props.value
        }, this.state)
    }

    render() {
        return super.render();
    }

    subRender() {
        const { title, leftBtnTitle, rightBtnTitle, onValueChanged, value, keyName, editEnable, ...attributes } = this.props
        // const { inputvalue } = this.state
        return (
            <View style={styles.container} >
                <Text style={styles.titleLab}>{title}</Text>
                <View style={styles.switchContainer}>
                    {(!editEnable && value != true) ||
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.switchBtnStyle, value ? styles.switchBtnSelectStyle : null]}
                            onPress={() => { this.itemOnClicked(true) }}
                        >
                            <Text style={[styles.switchBtnTextStyle, value ? styles.switchBtnTextSelectStyle : null]}>{leftBtnTitle}</Text>
                        </TouchableOpacity>
                    }
                    {(!editEnable && value != false) ||
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.switchBtnStyle, value == false ? styles.switchBtnSelectStyle : null]}
                            onPress={() => { this.itemOnClicked(false) }}
                        >
                            <Text style={[styles.switchBtnTextStyle, value == false ? styles.switchBtnTextSelectStyle : null]}>{rightBtnTitle}</Text>
                        </TouchableOpacity>
                    }
                </View>

            </View>
        )
    }


    itemOnClicked(value) {
        const { editEnable, keyName, onValueChanged } = this.props
        if (editEnable) {
            onValueChanged(value, keyName, null)
        }
        return editEnable
    }

}

const styles = StyleSheet.create({

    container: {
        // backgroundColor: 'green',
        width: "100%",
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 50,
    },

    titleLab: {
        maxWidth: "30%",
        marginRight: 10,
        fontFamily: "PingFangSC-Medium",
        fontSize: 14,
        color: "#353535",
    },
    switchContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },

    switchBtnStyle: {
        marginHorizontal: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#E8E8E8',
        backgroundColor: "#fff",
        paddingHorizontal: 6,
    },
    switchBtnSelectStyle: {
        borderColor: '#82C2FF',
        backgroundColor: "#F9FCFF",
    },
    switchBtnTextStyle: {
        textAlign: 'center',
        minWidth: 50,
        lineHeight: 28,
        color: '#808080',
    },
    switchBtnTextSelectStyle: {
        color: '#3190E8',
    },

});
