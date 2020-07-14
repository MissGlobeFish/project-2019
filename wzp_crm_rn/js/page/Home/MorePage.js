/**
 * MorePage.js 更多详情
 */


import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import SearchCard from '../../common/SearchCard';
import New from '../../common/New';
import CompanySystem from '../../common/CompanySystem';
import EmpCrad from '../../common/EmpCrad';
import ajax from '../../config/Fetch';

import LoadMore from '../../common/LoadMoreFooter';
type Props = {};
export default class More extends Component<Props> {

  static navigationOptions = {
    headerTitle: '更多结果',
  };
  constructor(props) {
    super(props);
    this.state = {
      TABSTYPE: {
        NEWS: '新闻',
        RANKING: '小宝人物志',
        EMP: '名片',
        NOTICE: '通知',
        SYSTEM: '制度',
        BOOK: '图书',
      },
      list: [],
      searchKey: '',
      label: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isLoadAll: false
    }

  }
  componentWillMount() {

    const { goBack, getParam } = this.props.navigation;

    let url = 'consult';
    if (getParam('label') === 'EMP') {
      url = 'user';
    }
    ajax.get(url, { searchKey: getParam('searchKey'), label: getParam('label'), pageNum: 1, pageSize: 15 }).then(res => {
      console.log(res);
      this.setState({
        list: res.list,
        label: getParam('label'),
        total: res.total,
        searchKey: getParam('searchKey')
      })
    })
  }
  // _renderItem = (item) => {
  //   const { searchKey, label } = this.state;
  //   if (label === 'NEWS' || label === 'RANKING') {
  //     return <New data={item} likes={true} search={searchKey} />
  //   } else if (label === 'EMP') {
  //     return <EmpCrad data={item} />
  //   } else if (label === 'SYSTEM') {
  //     return <CompanySystem />
  //   } else if (label === 'NOTICE') {
  //     return <New data={item} search={searchKey} />
  //   }
  // }

  _onPressItem(label, id) {
    if (label === 'EMP') {
      return;
    }
    const { navigate } = this.props.navigation;
    navigate('DetailsPage', { label: label, id: id })
  }

  _renderItem = (item) => {
    const label = this.state.label;
    let component;
    if (label === 'NEWS' || label === 'RANKING') {
      component = <New data={item} likes={true} search={this.state.searchKey} />
    } else if (label === 'EMP') {
      component = <EmpCrad data={item} search={this.state.searchKey} />
    } else if (label === 'SYSTEM') {
      component = <CompanySystem />
    } else if (label === 'NOTICE') {
      component = <New data={item} search={this.state.searchKey} />
    }
    return <TouchableOpacity onPress={() => this._onPressItem(label, item.id)}>
      {component}
    </TouchableOpacity>

  }
  _ListFooterComponent = () => {
    // if (this.state.isLoadAll) return null;
    return (
      <LoadMore isLoadAll={this.state.isLoadAll} />
    );
  };
  _onEndReached = () => {

    const { searchKey, label, list, pageNum, pageSize,
      total } = this.state;
    if (pageNum >= Math.ceil(total / pageSize)) {
      this.setState({
        isLoadAll: true
      });
      return;
    }
    let url = 'consult';
    if (label==='EMP'){
      url = 'user';
    }
    ajax.get(url, { searchKey: searchKey, label: label, pageNum: pageNum + 1, pageSize: 15 }).then(res => {
      this.setState({
        list: list.concat(res.list),
        pageNum: pageNum + 1
      })
    })
  }
  render() {
    const { getParam } = this.props.navigation;
    const { list } = this.state;
    return (
      <View style={styles.container}>

        <FlatList
          ListHeaderComponent={<SearchCard title={this.state.TABSTYPE[getParam('label')]}></SearchCard>}
          data={list}
          onEndReachedThreshold={0.1}
          ListFooterComponent={this._ListFooterComponent}
          onEndReached={this._onEndReached}
          refreshing={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (this._renderItem(item))}>
        </FlatList>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {

  }
});
