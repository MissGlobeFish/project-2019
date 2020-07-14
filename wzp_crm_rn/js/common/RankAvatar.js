/**
 * RankAvatar 排行榜头像
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class RankAvatar extends Component {

    defaultAvatar = require("../res/imgs/user01.png")
    topImageUrl = ["https://img.wangxiaobao.cc/20181013/rankings/rankings02.png",
        "https://img.wangxiaobao.cc/20181013/rankings/rankings04.png",
        "https://img.wangxiaobao.cc/20181013/rankings/rankings03.png"]
    static propTypes = {
        name: PropTypes.string,
        avatar: PropTypes.string,
        topRank: PropTypes.number,
    }

    static defaultProps = {
        name: '',
        topRank: -1,
    }

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            avatar: "",
        }
    }
    render() {
        const { name, avatar, topRank } = this.props;
        if (topRank >= 0 && topRank < 3) {
            return (
                <View style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}, this.props.style]}>
                    <Image
                        resizeMode='contain'
                        style={{width: '80%', height: '100%' }}
                        source={{ uri: this.topImageUrl[topRank] }}
                    />
                    <View style={{flexDirection: 'column', position: 'absolute', alignItems: 'center'}}>
                        <Avatar
                            rounded
                            containerStyle={{ marginTop: 20 }}
                            medium
                            source={ avatar == "" ? this.defaultAvatar : {uri: avatar} }
                        />
                        <Text
                            style={[{marginTop: 8 }, styles.nameTitleStyle]}
                        >
                            {this.props.name}
                        </Text>

                    </View>

                </View>
            )
        } else {
            return (
                <View style={[{ flex: 1, minWidth: 50 ,justifyContent: 'center', alignItems: 'center' }, this.props.style]}>
                    <Avatar
                        rounded
                        containerStyle={{}}
                        medium
                        source={ avatar == "" ? this.defaultAvatar : {uri: avatar} }
                    />
                    <Text
                        style={[styles.nameTitleStyle]}
                    >
                        {this.props.name}
                    </Text>
                </View>
            )
        }
    }
};

const styles = StyleSheet.create({
    nameTitleStyle: {
        textAlign: 'center', 
        fontFamily: 'PingFangSC-Regular', 
        fontSize: 14, color: '#323232'
    }

})