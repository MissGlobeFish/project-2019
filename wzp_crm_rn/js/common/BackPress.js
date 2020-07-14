import React, { Component } from 'react'
import {
  BackHandler
} from 'react-native'
import PropTypes from 'prop-types';

export default class BackPress extends Component {
  constructor(props) {
    this._hardwareBackPress = this.onHardwareBackPress.bind(this);
  }
  componentDidMount() {
     BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress', this._hardwareBackPress);
  }

  onHardwareBackPress = (e) => {
    this.props.navigation.goBack(); // works best when the goBack is async
    return this.props.backPress(e);
  }
}

// BackHandler.addEventListener("hardwareBackPress", function () {
//   // this.onMainScreen()和this.goBack()两个方法都只是伪方法，需要你自己去实现！

//   if (!this.onMainScreen()) {
//     this.goBack();
//     return true;
//   }
//   return false;
// });