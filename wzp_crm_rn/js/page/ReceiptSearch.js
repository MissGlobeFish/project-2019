/**
 * 单据--搜索
 */
import React, { Component } from 'react';
import {StyleSheet, Text, View,Dimensions,TextInput,TouchableOpacity,FlatList,SafeAreaView} from 'react-native';
import { Icon } from 'react-native-elements'
import ReceiptList from '../common/consoleComponent/ReceiptList'
import LoadMore from '../common/LoadMoreFooter';
import PersistanceManger from '../../js/util/PersistanceManger'
import ajax from '../config/Fetch';
const formIdObj = {
  expenses: 'ER_ExpReimbursement', //费用报销
}
const {height} = Dimensions.get('window');
export default class ReceiptSearch extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props){
    super(props);
    this.state = {
      text: '',
      userId: PersistanceManger.ShareInstance().userId, // userId
      total: '', // 总数
      pageNum: 1,//起页
      pageSize: 15,//每次加载数量
      refreshing: false, // 是否刷新
      isLoadAll: false,//是否已经全部加载
      formId: [formIdObj.expenses],
      list:[],
    }
  };
  componentDidMount() {
  }
  // 未查询到数据方法
  emptyMoudle () {
    return (
      <View style={styles.emptyContent}>
          {/* <Image style={styles.emptyImage} source={require('../../res/imgs/EmptyIcon.png')} /> */}
          <Text style={styles.emptyText}> 没有查询到任何信息 </Text>
          <View style={styles.emotyPlaceholder} />
      </View>
    )
  }
  // 获取初始列表数据
  handleInit(val) {
    const {getParam} = this.props.navigation;
    let preRouter = getParam('preRouter')
    let receiptStatus = getParam('status') // 搜索的为进行中还是已完结
    this.setState({refreshing: true})
    // 001201804230002
    let ajaxUrl;
    if (preRouter == 'Dealt') {
      ajaxUrl = 'process/list'
    } else {
      ajaxUrl = 'workRecord/list'
    } 
    let searchVal = val
    const { formId,total,pageNum, pageSize,userId,status,list} = this.state;
    let obj =  { isPage: true,status:receiptStatus,pageNum:pageNum,pageSize: 15,userId:userId,formId:formId,billNo:searchVal };
    ajax.post(ajaxUrl,obj)
      .then((res)=>{
        console.log(obj,'obj')
        console.log(res.list)
        this.setState({
          list: list.concat(res.list),
          pageNum: 1,
          total: res.total,
          refreshing: false,
          isLoadAll: false
        })
      })
      .catch(error => {
        console.log(error)
    })
  }
  //onEndReached 加载更多
  onLoadMore(){
    const { list, pageNum, pageSize,total,status,userId } = this.state;
    if (pageNum >= Math.ceil(total / pageSize)) {
      this.setState({
        isLoadAll: true
      });
      return;
    }
    this.handleInit()
  }
  ListFooterComponent = () => {
    return (
      <LoadMore isLoadAll={this.state.isLoadAll}/>
    );
  };
  render() {  
    const {text} = this.state;
    const { goBack, getParam} = this.props.navigation;
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.searchBox]} >
          <View style={styles.search}>
              <Icon iconStyle={styles.searchIcon}
                name="search"
                size={20}
                color="#8B8B8B" />
              <TextInput style={styles.searchInput}
                placeholder="输入单据号"
                returnKeyType="search"
                value={text}
                underlineColorAndroid="transparent"
                autoFocus={true}
                onChangeText={(text)=>{
                  console.log(text,'输入单据号')
                  this.setState({
                    text: text
                  })
                }}
                onSubmitEditing={(event)=>{
                  if (!this.state.text) {
                    return;
                  }
                  this.handleInit(event.nativeEvent.text)
                  // if (preRouter == 'Dealt') {
                  //   this.handleInitDealt(event.nativeEvent.text)
                  // } else {
                  //   this.handleInit(event.nativeEvent.text)
                  // }  
                }}
              />
              {
                !!! text || <Icon iconStyle={styles.searchIcon}
                  name="cancel"
                  size={20}
                  onPress={() => this.setState({ text: '' })}
                  color="#8B8B8B" />
              }

          </View>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => goBack()}>
            <Text
              style={{
                fontSize: 16,
                color: '#353535'
              }}>取消</Text>
          </TouchableOpacity>
        </View>
        {this.state.list.length <= 0 && this.emptyMoudle()}
        <FlatList
          data={this.state.list} // 需要渲染的数据
          extraData={this.state}
          keyboardShouldPersistTaps={'always'}
          // onRefresh={() => { this.onRefresh() }}
          refreshing={this.state.refreshing} // 是否显示加载更多
          onEndReached={() => this.onLoadMore()}
          onEndReachedThreshold={0.1}
          keyExtractor = {(item,index) => index.toString()}
          // ListEmptyComponent={this.ListEmptyComponent}
          ListFooterComponent={this.ListFooterComponent}
          renderItem={({item,index}) => <ReceiptList data={item}/>} // 渲染的模版
        /> 
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8E8E8',
    flex: 1,
  },
  searchBox: {
    paddingTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E1E1E1',
    backgroundColor: '#fff'
  },
  searchBoxBorder: {
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    marginLeft: 20,
    marginBottom: 5,
    borderRadius: 5,
    flex: 5
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 5
  },
  searchInput: {
    height: 40,
    flex: 4.5,
    fontSize: 14,
  },
  cancel: {
    flex: .7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5
  },
  emptyContent: {
    height: height,
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
  },
})