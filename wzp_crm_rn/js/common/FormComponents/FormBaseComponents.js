/**
 * FormBaseComponents --- 表单基础
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import PropTypes from 'prop-types';

export default class FormBaseComponents extends Component {

    static propTypes = {
        editEnable: PropTypes.bool, // 是否可编辑
        formContainerStyle: PropTypes.style, //表单项样式
        
        error: PropTypes.any,   //报错信息，没有报错传 null
    }
    static defaultProps = {
        editEnable: true,
        error: null,
    };

    constructor(props) {
        super(props)
        this.state = {
            isEdit: false, //编辑状态
        }
    }

    render() {
        const {isEdit} = this.state
        const  {error} = this.props
        return (
            <View style={[styles.formContainer, this.props.formContainerStyle]}>
                {this.subRender()}
                <View style={[
                    styles.borderBottomStyle, 
                    isEdit ? styles.editBorderBottomStyle : null,
                    error ? styles.errorBorderBottomStyle : null
                ]}></View>
                {!error || <Text style={[styles.errorText]}> {error} </Text>}
            </View>
        );
    }

    subRender() {
        return null
    }
}

const styles = StyleSheet.create({
    formContainer: {
        // backgroundColor: 'red',
        width: "100%",
        paddingHorizontal: 15,
        minHeight: 50,
        backgroundColor: '#fff'
    },
    borderBottomStyle: {
        height: 1,
        backgroundColor: '#e8e8e8',
    },
    editBorderBottomStyle: {
        backgroundColor: '#3190E8',
    },
    errorBorderBottomStyle: {
        backgroundColor: '#FF0000',
    },
    errorText: {
        width: "100%",
        textAlign: 'center',
        fontFamily: "PingFangSC-Regular",
        fontSize: 10,
        color: '#FF0000',
    }
});
