/**
 * MyInfo  我的--个人资料
 */
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import { Avatar } from 'react-native-elements';
import Toast from '../../common/Toast'
import  ListCommon  from '../../common/ListCommon'; 
export default class MyInfo extends Component {
  static navigationOptions = {
    title: '个人资料',
  };

  constructor(props) {
    super(props);
    this.state = {
      infoData: '',
      avatarSource: require('../../res/imgs/defaultAvatar.png'),
    }
  }
  fetData() {
    ajax.getOther('user',PersistanceManger.ShareInstance().empCode).then((res)=>{
      this.setState({
        infoData: res,
        avatarSource: (res.photo && res.photo != "") ? {uri: res.photo} : require('../../res/imgs/defaultAvatar.png'),
      })
    })
    .catch((error)=>{
      Toast.showFail("请求超时请重试~。~")
    })
  }
  componentDidMount() {
    //  组件装载之后
    this.fetData()
  }
  render() {
    const {infoData} = this.state
    return (
      <View style={styles.listinfo}>
        <View style={styles.listitem}>
          <Text style={{ color: '#808080', fontSize: 16}}>头像</Text>
          <Avatar
            size='large'
            source={ this.state.avatarSource }
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>
        <ListCommon listKey="姓名" listValue={infoData.empName}/>
        <ListCommon listKey="工号" listValue={infoData.empCode}/>
        <ListCommon listKey="岗位" listValue={infoData.jobDesc}/>
        <ListCommon listKey="所属组织" listValue={infoData.accountName}/>
        <ListCommon listKey="部门路径" listValue={infoData.deptNamePath}/>
        <ListCommon listKey="QQ" listValue={infoData.qqNum}/>
        <ListCommon listKey="电子邮箱" listValue={infoData.mail}/>
        <ListCommon listKey="联系电话" listValue={this.state.infoData.phoneNum}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listinfo:{
    flex: 1,
    backgroundColor: '#fff'
  },
  listitem: {
    paddingTop: 13,
    paddingBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginLeft: 15,
    marginRight: 15
  }
});
