/**
 * 我发起的--单据--单据列表组件--中间内容部分
 */
import React, { Component } from 'react';
import {StyleSheet, Text, View,ScrollView,TouchableOpacity,Image} from 'react-native';
// import PersistanceManger from '../../util/PersistanceManger';
// import ajax from '../../config/Fetch';
export default class ReceiptContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      type: this.props.type // 单据类型
    }
  };
  renderItem() { // 显示不同的组件类型
    const {type} = this.state;
    const {content} = this.props;
    let component;
    if(type === '订单') {
      component = <View style={[styles.mid]}>
        <Text style={[styles.contentItem]}>{this.state.type}</Text>
      </View>
    } else if (type === '安装') {
      component = <View style={[styles.mid]}>
      <Text style={[styles.contentItem]}>小龙坎火锅</Text>
      <Text style={[styles.contentItem]}>地址: 天府五街地铁口</Text>
    </View>
    } else if (type === '报销') {
      component = <View style={[styles.mid]}>
        <Text style={[styles.contentItem]}>请报销金额合计:{content.expAmount}</Text>
        <Text style={[styles.contentItem]}>申请付款金额合计:{content.reqAmount}</Text>
      </View>
    }
    return component;
  }
  render() {
    const {type} = this.state
    return (
      this.renderItem()
    );
  }
}

const styles = StyleSheet.create({
  mid: {
    marginVertical: 10
  },
  contentItem: {
    marginTop: 10,
    fontSize: 14.,
    color: '#000'
  },
  bottom: {
    paddingHorizontal: 15,
    fontSize: 14,
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor:'#e8e8e8',
    color: '#808080',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
