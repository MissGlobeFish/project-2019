/**
 * MyInfoListCell 【图标-> 文字 -> 描述 -> 箭头】 的Cell
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class MyInfoListCell extends Component {
    static propTypes = {
        icon: PropTypes.any, // 图标
        title: PropTypes.string, // 标题
        detail: PropTypes.string, // 更多信息
        needArrow: PropTypes.bool,  //是否箭头
        onPress: PropTypes.any, //点击
    }

    static defaultProps = {
        title: '',
        detail: '',
        icon: undefined,
        needArrow: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            detail: this.props.detail,
        }
    }
    render() {
        const { icon, needArrow, contentStyle } = this.props;
        const { title, detail } = this.state;
        if (icon) {
            iconRender = <Image style={styles.icon} source={icon} />
        }
        if (needArrow) {
            arrow = <Image style={styles.arrow} source={require('../res/imgs/RightArrow.png')} />
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.listitem, this.props.style]}
                onPress={this.props.onPress}
            >
                <View style={[styles.contentView, contentStyle]}>
                    <View style={styles.leftLabBox}>
                        {iconRender}
                        <Text style={styles.listleft}>{title}</Text>
                    </View>
                    <View style={styles.rightLabBox}>
                        <Text style={styles.listRight}>{detail}</Text>
                        {arrow}
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    leftLabBox:{
        alignItems: 'center',
        flexDirection: 'row',
    },
    rightLabBox:{
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    listleft: {
        fontSize: 16,
        color: '#353535',
        lineHeight: 24,
    },
    listRight: {
        alignItems: 'center',
        textAlign: 'right',
        fontSize: 16,
    },
    arrow: {
        width: 8,
        height: 15,
        marginLeft: 5,
        right: 0,
    }
})