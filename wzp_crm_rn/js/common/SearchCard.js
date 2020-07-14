/**
 * SearchCard 搜索外包围
 * 
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class SearchCard extends Component {
  static propTypes = {
    type: PropTypes.string, // 卡片类型
    title: PropTypes.string, // 卡片标题
    search: PropTypes.string, // 卡片标题
    // more: PropTypes.bool, // 显示更多
    // moreCallback: PropTypes.func,  //点击更多回调 
    children: PropTypes.any
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false
    }
  }
  render() {
    const { search, type, title, children, more, moreCallback } = this.props;
    return (
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardText}>{title}</Text>
        </View>
        <View>
          {children}
        </View>
        {
          moreCallback && (<TouchableOpacity
            onPress={() => moreCallback(type, search)} >
            <View style={styles.more}>
              <Text style={{ color: '#808080' }}>更多结果</Text>
            </View>
          </TouchableOpacity>)
        }

      </View>
    )
  }
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  cardTitle: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  cardText: {
    color: '#353535',
    fontSize: 17,
    fontWeight: '500'
  },
  more: {
    height: 44,
    fontSize: 14,
    color: '#808080',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    // paddingBottom: 5,
    borderTopColor: '#E8E8E8'
  }
})