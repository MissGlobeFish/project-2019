import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';

export default class ListInfo extends Component {
  render() {
    return (
      <View style={styles.containerView}>
        <View style={styles.listitem}>
          <Text style={styles.listleft}>{this.props.listKey}</Text>
          <Text style={styles.listRight}>{this.props.listValue}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
  },
  listitem: {
    paddingTop: 13,
    paddingBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  listleft: {
    fontSize: 16,
    color: '#808080'
  },
  listRight: {
    fontSize: 16,
    color: '#000'
  }
});
