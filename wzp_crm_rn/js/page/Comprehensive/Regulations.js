
/**
 * regulations 综合--制度
 */
import React, { Component } from 'react';
import {  StyleSheet, Text, Dimensions,View,TouchableOpacity,FlatList } from 'react-native';
import ajax from '../../config/Fetch';
import LoadMore from '../../common/LoadMoreFooter';
const { height } = Dimensions.get('window');
export default class Regulations extends Component{
  static navigationOptions = {
    title: '公司制度',
    headerBackTitle: null
  };
  constructor(props) {
    super(props)
    this.state = {
      listData:[],
      total: 0,
      pageNum: 1,
      pageSize: 15,
      refreshing: false,
      isAction: false,
      isLoadingMore: false, // 是否正在上拉加载更多
      isLoadAll: false
    }
  }

  componentDidMount() {
    this.handleInit()
  }
  

  render() {
    const {refreshing} = this.state;
    return (
      <View style={styles.containerView}>
        <FlatList
          extraData={this.state}
          data={this.state.listData}
          onRefresh={() => this._onRefresh()}
          refreshing={this.state.refreshing}
          onEndReachedThreshold={0}
          onEndReached={this._onEndReached}
          ListFooterComponent={this._ListFooterComponent}
          ListEmptyComponent = {refreshing? null:this._ListEmptyComponent}
          renderItem={({item}) => this._createListItem(item)}
          keyExtractor = {(item) => item.id.toString()}
        />
      </View>
    )
  }

  // 获取页面初始化数据
  handleInit() {
    const {pageSize} = this.state;
    this.setState({refreshing: true,isAction: true});
    ajax.get('consult', {pageNum:1,pageSize: pageSize,label:'SYSTEM'})
    .then((res)=>{
      this.setState({
        listData: res.list,
        total: res.total,
        refreshing: false,
        isAction: false,
        isLoadingMore: false
      },()=>{
        console.log(this.state.listData)
      })
    })
    .catch((error)=>{
      this.setState({
        isLoadingMore: false,
        refreshing: false,
        isAction: false
      })
    })
  };

  // 下拉刷新 
  _onRefresh =()=> {
    this.setState({
      listData: [],
      isLoadAll: false,
      pageNum: 1
    },this.handleInit())
  };

  // 上拉加载更多
  _onEndReached = () =>  {
    if (this.state.isLoadingMore) {
      return
    }
    this.setState({isLoadingMore: true,isAction: true});
    const { listData, pageNum, pageSize,total } = this.state;
    if (pageNum >= Math.ceil(total / pageSize)) {
      this.setState({
        isLoadAll: true
      });
      return;
    }

    ajax.get('consult', {pageNum: pageNum+1,pageSize: pageSize,label:'SYSTEM'})
    .then((res)=>{
      this.setState({
        listData: listData.concat(res.list),
        pageNum: pageNum + 1,
        isLoadingMore: false,
        isAction: false
      },()=>{
        console.log(this.state.listData)
      })
    })
    .catch((error)=>{
      this.setState({
        isLoadingMore: false,
        isAction: false
      })
      console.log(error)
    })
  };

  // flatList底部布局
  _ListFooterComponent = () => {
    // if (this.state.isLoadAll) return null;
    return (
      <LoadMore isLoadAll={this.state.isLoadAll} isAction = {this.state.isAction}/>
    );
  };

  // 列表布局
  _createListItem(item){
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={()=>{navigate('RegulationsDetail',{primaryKey:item.id,title:item.title})}}>
        <View style={styles.listwrap}>
          <View style={styles.listIcon}></View>
          <Text style={styles.listItem}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  // 创建空布局
  _ListEmptyComponent() {
    return (
      <View style={styles.emptyContent}>
        {/* <Image style={styles.emptyImage} source={require('../../res/imgs/EmptyIcon.png')} /> */}
        <Text style={styles.emptyText}> 没有查询到任何信息 </Text>
        <View style={styles.emotyPlaceholder} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
  },
  listwrap: {
    paddingTop: 13,
    paddingBottom: 13,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  listIcon: {
    width:4,
    height:4,
    backgroundColor:'#4D66FD',
    marginRight: 5
  },
  listItem: {
    fontSize: 16,
    color: '#353535'
  },
  emptyContent: {
    height: height - 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    flex: 0.25,
    resizeMode: 'contain',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#353535',
  }
});