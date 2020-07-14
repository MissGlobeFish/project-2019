
import React from 'react';
import { Text, Platform } from 'react-native';
export default class NavigatorUtil {
  /**
   * 返回上一页
   * @param {*} Navigation
   */
  static goBack(Navigation) {
    Navigation.goBack()
  }

  /**
   * 跳转到仓库详情页
   * @param {*} params 
   */
  static goToRepositoryDetail(params) {
    const { navigation, projectModel, flag, theme, onUpdateFavorite } = params;
    navigation.navigation("")
  }



  static serialize(obj, sp, type) {
    //  将对象转为序列化的字符串,sp为分隔符,默认为&
    let str = '';
    sp = sp || '&';
    for (let i in obj) {
      if (typeof obj[i] != 'undefined' && obj[i] != '') {
        if (type && obj[i] instanceof Array && obj[i].length > 0) {
          for (let k in obj[i]) {
            if (obj[i][k] && obj[i][k] instanceof Object) {
              for (let key in obj[i][k]) {
                str += `${i}[${k}].${key}=${encodeURIComponent(obj[i][k][key])}`;
                str += sp;
              }
            } else {
              str += i + '=' + encodeURIComponent(obj[i][k]);
              str += sp;
            }
          }
        } else {
          str += i + '=' + encodeURIComponent(obj[i]);
          str += sp;
        }
      }
    }
    if (str.length > 0) {
      str = str.substring(0, str.length - 1);
    }
    return str;
  }
  /**
   *
   * _findTitle 匹配字体变色
   * @static
   * @param {*} title
   * @param {*} crux
   * @returns
   * @memberof NavigatorUtil
   */
  static _findTitle(title, crux) {
    return title && crux ? title.split(crux).join(',' + crux + ",").split(',').map((data, index) => {
      return data === crux ? <Text style={{ color: '#4D66FD' }} key={index}>{data}</Text> : data;
    }) : title
  }
  /**
   *  _findTime 
   */

  static _findTime(){

    let now = new Date(); //当前日期 
    // var nowDayOfWeek = now.getDay(); //今天本周的第几天 
    let nowDay = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();; //当前日 
    let nowMonth = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1); //当前月 
    let nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; 
    return `${nowYear}.${nowMonth}.01-${nowYear}.${nowMonth}.${nowDay}`
  }

  static _findFirstDayOfThisMonth() {
    let now = new Date(); //当前日期 
    let nowMonth = (now.getMonth() + 1)> 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1); //当前月 
    let nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; 
    return `${nowYear}-${nowMonth}-01`
  }

  static _findToday() {
    let now = new Date(); //当前日期 
    let nowDay = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();; //当前日 
    let nowMonth = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1); //当前月 
    let nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; 
    return `${nowYear}-${nowMonth}-${nowDay}`
  }

  /**
   *
   *_formatDate 日期格式化
   * @static 
   * @param {*} date
   * @param {*} pattern
   * @returns
   * @memberof NavigatorUtil
   */
  static _formatDate(date, pattern) {
    if (!date || typeof(date) !== 'string'){
      return date;
    }
    if (Platform.OS === "ios") {
      date = date.replace(/-/g, "/");
    }

    if (Platform.OS === "android") {
      // date = new Date(date);
      return date.substr(0,11);
    }

    date = new Date(date);

    pattern = pattern || 'yyyy-MM-dd';
    const padding = (s, len) => {
      len = len - (s + '').length;
      for (let i = 0; i < len; i++) {
        s = '0' + s;
      }
      return s;
    };
    return pattern.replace(/([yMdhsm])(\1*)/g, function ($0) {
      switch ($0.charAt(0)) {
        case 'y':
          return padding(date.getFullYear(), $0.length);
        case 'M':
          return padding(date.getMonth() + 1, $0.length);
        case 'd':
          return padding(date.getDate(), $0.length);
        case 'w':
          return date.getDay() + 1;
        case 'h':
          return padding(date.getHours(), $0.length);
        case 'm':
          return padding(date.getMinutes(), $0.length);
        case 's':
          return padding(date.getSeconds(), $0.length);
      }
    });
  }
}