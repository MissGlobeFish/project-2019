import { createBottomTabNavigator } from 'react-navigation';
import Home from '../page/Home/HomePage';
import Book from '../page/Comprehensive/BookPage';
import My from '../page/My/MyPage';
import ConsoleIndex from '../page/ConsoleStation/ConsoleIndex';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
export default TabNavigatorTion = createBottomTabNavigator({
  Home: {
    screen: Home,
    // initialRouteName: 'Home',
    title: 'Home',
    navigationOptions: {

      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? require('../res/imgs/home_ative.png') : require('../res/imgs/home.png')}
          resizeMode="contain"
          style={styles.img}
        />
      ),
      headerTitle: '首页',
      gestureResponseDistance: { horizontal: 300 },
      headerBackTitle: null,
      headerStyle: { backgroundColor: '#4D66FD' },//导航栏的样式
      headerTitleStyle: {//导航栏文字的样式
        color: 'white',
        //设置标题的大小
        fontSize: 12,
        //居中显示
        alignSelf: 'center',
      },
      //tab 的属性
      tabBarLabel: '首页',
    },
  },
  ConsoleIndex: {
    screen: ConsoleIndex,
    navigationOptions: {
      tabBarLabel: '工作台',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image 
          source={focused ? require('../res/imgs/work_ative.png') : require('../res/imgs/work.png')}
          resizeMode="contain"
          style={styles.img}
        />
      ),
    }
  },
  Book: {
    screen: Book,
    navigationOptions: {
      tabBarLabel: '综合',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? require('../res/imgs/colligate_ative.png') : require('../res/imgs/colligate.png')}
          resizeMode="contain"
          style={styles.img}
        />
      ),
    }
  },
  My: {
    screen: My,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={focused ? require('../res/imgs/mine_ative.png') : require('../res/imgs/mine.png')}
          resizeMode="contain"
          style={styles.img}
        />
      ),
    }
  }
}, {
    //设置默认显示tab
    initialRouteName: 'Home',
    //设置TabNavigator的位置
    tabBarPosition: 'bottom',
    //是否在更改标签时显示动画
    animationEnabled: true,
    //是否允许在标签之间进行滑动
    swipeEnabled: true,
    //按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    backBehavior: "none",
    //设置Tab标签的属性

    tabBarOptions: {
      //Android属性
      upperCaseLabel: false,//是否使标签大写，默认为true
      //共有属性
      showIcon: true,//是否显示图标，默认关闭
      showLabel: true,//是否显示label，默认开启
      activeTintColor: '#4D66FD',//label和icon的前景色 活跃状态下（选中）
      inactiveTintColor: 'gray',//label和icon的前景色 活跃状态下（未选中）
      style: { //TabNavigator 的背景颜色
        backgroundColor: 'white',
        height: 55,
      },
      indicatorStyle: {//标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
        height: 0,
      },
      labelStyle: {//文字的样式
        fontSize: 10,
        marginTop: -5,
        marginBottom: 5,
      },
      iconStyle: {//图标的样式
        marginBottom: 5,
      }
    }
  }
);

const styles = StyleSheet.create({
  img: {
    width: 24, height: 24
  }
});
