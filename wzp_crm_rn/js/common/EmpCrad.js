/**
 * SearchCard 新闻列表
 * 
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,Linking,TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import NavigatorUtil from '../util/NavigationUtil';

export default class EmpCrad extends Component {
  static propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    more: PropTypes.string,
    search: PropTypes.string,
    children: PropTypes.any,
    data: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      type: '',
      hide: false
    }
  }
  // require('../res/imgs/defaultAvatar.png')
  render() {
    const { type, title, children, more, data, search } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.box, { height: 95 }]}>
            <View style={styles.left}>

              <Image style={styles.image} source={data.photo ? { uri: data.photo } : require('../res/imgs/defaultAvatar.png')}></Image>
            </View>
            <View style={styles.right}>
              <View>
                <Text style={{ fontSize: 20, color: '#353535', fontWeight: '500', textAlign: 'right' }}>{NavigatorUtil._findTitle(data.empName, search)}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: '#353535', marginTop: 22, textAlign: 'right' }}>{data.jobDesc || "    "}</Text>
              </View>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.left}>
              <Text style={styles.leftText} >邮箱</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.rightText}>{data.mail}</Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.left}>
              <Text style={styles.leftText} >QQ</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.rightText}>{data.qqNum}</Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.left}>
              <Text style={styles.leftText} >联系方式</Text>
            </View>
            <TouchableOpacity style={styles.right}
              onPress={()=> {
                // Linking.openURL(`tel:${data.phoneNum}`)
                Linking.canOpenURL(`tel:${data.phoneNum}`).then(supported => {
                  if (!supported) {
                    console.log('你的设备暂不支持')
                    return
                  } else {
                    return Linking.openURL(`tel:${data.phoneNum}`);
                  }
                }).catch(err => console.error('An error occurred', err));
              }}
            >
              <Text style={styles.rightText}>{data.phoneNum}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 205,
    padding: 15,
    borderBottomWidth: 0.5,
    // paddingBottom: 5,
    borderBottomColor: '#E8E8E8',
  },
  right: {
    textAlign: 'right'
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
    // backgroundColor: 'red',

  },
  box: {
    // flex: 1,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    color: '#808080',
    fontSize: 14
  },
  rightText: {
    color: '#353535',
    fontSize: 14
  }

})