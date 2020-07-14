/**
 * RankSections 排行榜段位
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import RankAvatar from './RankAvatar'

export default class RankSections extends Component {

    headerImageUrl = [require("../res/imgs/rankRectangle1.png"),
    require("../res/imgs/rankRectangle2.png"),
    require("../res/imgs/rankRectangle3.png"),
    require("../res/imgs/rankRectangle4.png")]

    static propTypes = {
        title: PropTypes.string,
        level: PropTypes.number,
        dataList: PropTypes.arrayOf(PropTypes.object)
    }

    static defaultProps = {
        title: '排行榜段位',
        level: 4,
        dataList: [],
    }

    constructor(props) {
        super(props);
    }

    rankItemsComponents() {
        const { dataList } = this.props;
        // console.log("dataList ------" , dataList)
        let avatar = dataList.map((data,index) => {
            return <RankAvatar
                    style={{ margin: 5  }}
                    avatar= {data.photo}
                    name= {data.empName ?? ""}
                    key={index}

            />
        })
        if (!dataList || dataList.length == 0) {
            return (
                <Text style={styles.emptyTtitileStyle}>还没有人哦，大家加油吧！</Text>
            )
        } else {
            return (
                <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', padding: 15}}>
                    {avatar}
                </View>
            )
        }
    }

    render() {
        const { title, level } = this.props;
        imageIndex = level > this.headerImageUrl.length - 1 ? this.headerImageUrl.length - 1 : level
        return (
            <View style={{ marginTop: 15, width: '100%', backgroundColor: '#ffffff', borderRadius: 15 }}>
                <Image
                    resizeMode='stretch'
                    style={{ width: '100%', height: 42.5 }}
                    source={this.headerImageUrl[imageIndex]}
                />
                <Text
                    style={styles.titleStyle}
                >
                    {title}
                </Text>
                {/* Rank Items */}
                {this.rankItemsComponents()}
            </View>
        )
    }
};

const styles = StyleSheet.create({

    titleStyle: {
        position: 'absolute',
        width: '100%',
        fontFamily: 'PingFangSC-Medium',
        lineHeight: 42.5,
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },

    emptyTtitileStyle: {
        width: '100%',
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        color: '#888888',
        textAlign: 'center',
        lineHeight: 68,
    }
})