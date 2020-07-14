import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;
import PropTypes from 'prop-types';

export default class NavigationBar extends Component {
  static propTypes = {
    style: PropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    hide: PropTypes.bool,
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: falseÎÎ
    }
  }
  render() {
    let titleView = this.props.titleView || <Text>this.props.title</Text>
    let content = <View>{this.props.leftButton}{titleView}{this.props.rightButton}</View>;
    return (
      <View style={styles.container}>{content}</View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray'

  }
})