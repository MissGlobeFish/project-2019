/**
 * CommunityAvatar 小宝社区头像模块
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import FastImage from 'react-native-fast-image'

export default class CommunityAvatar extends Component {


  static propTypes = {
    name: PropTypes.string,       //姓名
    avatarUrl: PropTypes.string,  //头像地址
    department: PropTypes.string, //部门
    level: PropTypes.number,      //楼层
    creatTime: PropTypes.string,  //创建时间
    onPressed: PropTypes.func,    //点击回调
  }

  static defaultProps = {
    name: "",
    avatarUrl: null,
    department: '',
    level: null,
    creatTime: "",
    onPressed: () => { }
  };

  constructor(props) {
    super(props)
    this.state = Object.assign({
    }, this.state)
  }


  render() {
    const { name, avatarUrl, department, level, creatTime, onPressed } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.75}
        onPressed={onPressed}
      >
        <FastImage
          style={{ width: 35, height: 35 , borderRadius: 17.5}}
          source={avatarUrl != null ?
            {
              uri: avatarUrl,
              priority: FastImage.priority.normal,
            } : require('../../res/imgs/CommunityDefaultAvatar.png')
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.nameBox}>
          <Text style={styles.nameLabel}>{name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.deptLabel}>{level == null ? department : `${level}楼`}</Text>
            <Text style={styles.deptLabel}>{" | "}</Text>
            <Text style={styles.deptLabel}>{creatTime}</Text>
          </View>
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameBox: {
    marginLeft: 8,
  },
  nameLabel: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 16,
    color: "#353535",
  },
  deptLabel: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 12,
    color: "#808080",
  }

});
