/**
 * MessageListCell 【图-> 类型 】
 *                 【标   详情 】 的Cell
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

var MessageTypeEnum = {
    pay: 0,
};

export default class MessageListCell extends Component {
    static propTypes = {
        type: PropTypes.any, // 类型
        title: PropTypes.string, // 标题
        detail: PropTypes.string, // 更多信息
        onPress: PropTypes.any, //点击
    }

    static defaultProps = {
        title: 'title',
        detail: 'subtitle',
        type: MessageTypeEnum.pay
    };

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            detail: this.props.detail,
            type: this.props.type,
        }
    }
    render() {
        const { title, detail, type } = this.state;
        var iconDic = {
            0: require('../res/imgs/payMessage.png')
        }
        var iconRender = <Image style={styles.icon} source={iconDic[type]} />
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.listitem, this.props.style]}
                onPress={this.props.onPress}
            >
                <View style={[styles.contentView]}>
                    {iconRender}
                    <View style={styles.titleBox}>
                        <Text style={styles.mainTitle}>{title}</Text>
                        <Text style={styles.subTitle}>{detail}</Text>
                    </View>

                </View>
            </TouchableOpacity >
        )
    }
};

const styles = StyleSheet.create({
    listitem: {
        backgroundColor: '#ffffff',
    },
    contentView: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    icon: {
        width: 40,
        height: 40,
    },
    titleBox: {
        paddingLeft: 15,
        justifyContent: 'space-between',
    },
    mainTitle: {
        fontSize: 16,
        color: '#353535'
    },
    subTitle: {

        marginTop: 10,
        fontSize: 14,
        color: '#808080',
    }

})