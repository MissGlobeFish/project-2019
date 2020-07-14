/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux';
import configureStore from './js/redux/store/ConfigureStore';
import SplashPage from './js/page/SplashPage';
import './js/config/GlobalContants';
import './js/util/CookieManager';
import './js/config/ToastConfig';

import XGPushManager from './js/util/XGPushManager';

type Props = {};
const store = configureStore();
export default class App extends Component<Props> {


  componentDidMount() {
    XGPushManager.configXG()
  }

  componentWillUnmount() {
    XGPushManager.stopXG();
  }

  render() {
    return (
      <Provider store={store}>
        <SplashPage />
      </Provider>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
