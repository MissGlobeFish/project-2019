import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
export default class LoadMoreFooter extends Component {
    static propTypes = {
        isLoadAll: PropTypes.bool,
        isAction: PropTypes.bool,
    }
    static defaultProps = {
        isLoadAll: false,
        isAction: true,
    }
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.isAction){
            return (
                <View style={styles.footer}>
                    {!this.props.isLoadAll && <ActivityIndicator animating={!this.props.isLoadAll} />}
                    <Text style={styles.footerTitle}>{this.props.isLoadAll ? '已加载全部' : '正在加载更多…'}</Text>
                </View>
            );
        }else{
            return (
                <View style={styles.footer}>
                </View>
            );
        }
        
    }
}

var styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    footerTitle: {
        marginLeft: 10,
        fontSize: 13,
        color: 'gray'
    }
})

module.exports = LoadMoreFooter;