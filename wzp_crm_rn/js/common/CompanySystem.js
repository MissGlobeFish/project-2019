/**
 * SearchCard 新闻列表
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class CompanySystem extends Component {
  static propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.any
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      type: '',
      hide: false
    }
  }
  render() {
    const { type, title, children } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.spot}></View>
          <View ><Text style={styles.text}>国盛天丰员工手册</Text></View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF', // backgroundColor: 'red',
    height: 50,
    padding: 15,
    borderBottomWidth: 0.5,
    // paddingBottom: 5,
    borderBottomColor: '#E8E8E8',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spot: {
    width: 4,
    height: 4,
    backgroundColor: '#4D66FD',
    marginRight: 5,
  },
  text: {
    color: '#353535',
    fontSize: 16
  }

})