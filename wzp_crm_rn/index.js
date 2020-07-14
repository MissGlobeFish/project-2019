/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AppNavigation from './js/navigations/AppNavigation';
import TabNavigator from './js/common/TabNavigator';
// export default TabNavigator;
// import './js/config/GlobalContants';
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App);
