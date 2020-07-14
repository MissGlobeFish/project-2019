// 待办
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, Dimensions, DeviceEventEmitter } from 'react-native';
import { Icon } from 'react-native-elements'
import { Header } from 'react-navigation';
import Toast from '../../common/Toast'
import ReceiptList from '../../common/consoleComponent/ReceiptList'
import SidebarSelect from '../../common/FormComponents/SidebarSelect'
import PersistanceManger from '../../util/PersistanceManger';
const { height } = Dimensions.get('window');
// import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import LoadMore from '../../common/LoadMoreFooter';

const receiptStatus = { // 单据的状态
  startStatus: 0, // 进行中
  endStatus: 1, // 已完成
};

const formIdArr = ['ER_ExpReimbursement']

export default class Receipt extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '待办',
      headerBackTitle: null,
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      userId: PersistanceManger.ShareInstance().userId, // userId
      total: 0, // 总数
      endtotal: '', // 总数
      pageNum: 1,//起页
      pageSize: 15,//每次加载数量
      refreshing: false, // 是否刷新
      isLoadingMore: false,
      isAction: false,
      isLoadAll: false,//是否已经全部加载
      status: receiptStatus.startStatus,//单据的状态
      formId: formIdArr, // 全部类型
      list: [], // 进行中的数据
      endlist: [], // 已完成的数据
      selectItem: formIdArr, // 选择的类型
      dataStatus: false, //  ajax是否请求完成
      choiceContent: [ //筛选数据条件
        { name: '单据类型', paramKey: "formId", isCheckBox: true, children: [{ formId: formIdArr[0], name: '费用报销',childselect: false}] }
      ]
    }
  };



  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(global.NotificationIdentify.listPageNeedRefresh, (data) => {
      this.setState({
        pageNum: 1,
        list: []
      }, () => {
        this.handleInit();
      })
    })
    this.handleInit();
  }

  componentWillUnmount() {
    this.subscription.remove();
  };


  //onRefresh 下拉刷新相关
  onRefresh = () => {
    const { pageNum } = this.state;
    // 不处于 下拉刷新
    if (!this.state.refreshing) {
      // this.setState({
      //   pageNum:pageNum + 1
      // })
      this.handleInit();
    }
  };

  ListFooterComponent = () => {
    return (
      <LoadMore isLoadAll={this.state.isLoadAll} isAction={this.state.isAction}/>
    );
  };

  emptyMoudle() {
    return (
      <View style={styles.emptyContent}>
        {/* <Image style={styles.emptyImage} source={require('../../res/imgs/EmptyIcon.png')} /> */}
        <Text style={styles.emptyText}> 没有查询到任何信息 </Text>
        <View style={styles.emotyPlaceholder} />
      </View>
    )
  }
  render() {
    const { status, list, choiceContent, total } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <SidebarSelect ref="sidebar" choiceContent={choiceContent} handleSelect={this.handleSelect.bind(this)}  />
        </View>
        {/* <Test/> */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {
            this.setState({
              status: receiptStatus.startStatus,
              list: [],
              pageNum: 1,
              total: 0,
              isLoadAll: false,
              dataStatus: false
            }, () => {
              this.handleInit();
            })
          }}>
            <Text style={[status === receiptStatus.startStatus ? { color: '#000' } : { color: '#808080' }]}>进行中</Text>
            <View style={[styles.curBorder, status === receiptStatus.startStatus ? { opacity: 1 } : { opacity: 0 }]}></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {
            this.setState({
              status: receiptStatus.endStatus,
              list: [],
              pageNum: 1,
              total: 0,
              isLoadAll: false,
              dataStatus: false
            }, () => {
              this.handleInit();
            })
          }}>
            <Text style={[status === receiptStatus.endStatus ? { color: '#000' } : { color: '#808080' }]}>已完结</Text>
            <View style={[styles.curBorder, status === receiptStatus.endStatus ? { opacity: 1 } : { opacity: 0 }]}></View>
          </TouchableOpacity>
        </View>
        <View style={styles.condition}>
          <View style={styles.searchWrap}>
            <Text>{total}条</Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ReceiptSearch', { status: status })
              }}
            >
              <Icon iconStyle={styles.searchIcon}
                name="search"
                size={20}
                color="#8B8B8B" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.screen}
            onPress={() => {
              this.refs.sidebar.showSibling()
              // this.refs.sidebar.showModalByFadeIn() // 打开抽屉
            }}
          >
            <Image source={require('../../res/imgs/choiceIcon.png')} style={{ width: 14, height: 14, marginRight: 4 }}></Image>
            <Text style={styles.screenText}>筛选</Text>
          </TouchableOpacity>
        </View>
        {/* {(this.state.list.length <= 0 && this.state.dataStatus) && this.emptyMoudle()} */}
        <FlatList
          // data={status === 0 ? this.state.list : this.state.endlist} // 需要渲染的数据
          data={this.state.list}
          extraData={this.state}
          keyboardShouldPersistTaps={'always'}
          onRefresh={() => { this.onRefresh() }}
          refreshing={this.state.refreshing} // 是否显示加载更多
          onEndReached={() => this.onLoadMore()}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this.state.refreshing ? null : this.emptyMoudle}
          ListFooterComponent={this.ListFooterComponent}
          renderItem={({ item, index }) =>
            <TouchableOpacity
              onPress={() => {
                this.handleListDidSelectedCellAtIndex(index, item)
                // this.props.navigation.navigate('DealtDetail', { fid: item.fid })
              }}
            >
              <ReceiptList data={item} />
            </TouchableOpacity>} // 渲染的模版          
        />
      </View>
    );
  }


   /**
   * 列表点击某一行
   *
   * @param {number} index
   * @param {object} item
   * @memberof Receipt
   */
  handleListDidSelectedCellAtIndex( index, item ) {
    // console.log(index, item)
    let formId = item.formId
    var formPageNav = global.getDealtPageFromFormId(formId)
    console.log(formPageNav)
    if (formPageNav) {
      let param = {
        fId: item.fid
      }
      this.props.navigation.navigate(formPageNav,param)
    }
  }


  // 筛选的单据类型数据
  handleSelect(val) {
    this.setState({
      selectItem: val[0].value,
      list: [],
      pageNum: 1,
      endlist: [],
      isLoadAll: false
    }, () => {
      console.log(this.state.selectItem, '接受的selectItem')
      this.handleInit();
    })
  }


  // 获取进行中初始列表数据
  handleInit() {
    this.setState({ refreshing: true,isAction: true })
    const {pageNum, pageSize, userId} = this.state;
    let selectItem = [];
    // TODU如果选择的类型selectItem 为空,就将全部的formId类型都传过去 selectItem 为选择的，formIdArr为全部的
    if (this.state.selectItem.length <= 0) {
      selectItem = formIdArr
      console.log(selectItem)
      this.setState({
        selectItem: formIdArr
      })
    } else {
      selectItem = this.state.selectItem
    }
    let obj = { isPage: true, status: this.state.status, pageNum: 1, pageSize: pageSize, userId: userId, formId: selectItem };
    console.log(obj, 'console.log(obj)')
    ajax.post('process/list', obj)
      .then((res) => {
        console.log(res, 'list')
        this.setState({
          list: res.list,
          pageNum: 1,
          total: res.total,
          refreshing: false,
          isLoadingMore: false,
          isAction: false,
          isLoadAll: false,
          dataStatus: true
        })
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadingMore: false,
          isLoadAll: false,
          isAction: false
        })
        if (error.msg) {
          Toast.showFail(error.msg)
        }
      })
  }
  //onEndReached 加载更多
  onLoadMore() {
    console.log(1313,this.state.isLoadingMore)
    if (this.state.isLoadingMore) {
      return
    }
    this.setState({isLoadingMore: true,isAction: true});
    const { list, pageNum, pageSize, total, status, userId } = this.state;
    console.log(pageNum,total,pageSize,total / pageSize, 'pageNum')
    if (pageNum >= Math.ceil(total / pageSize)) {
      console.log('加载完成')
      this.setState({
        isLoadAll: true
      });
      return;
    }

    let selectItem = [];
    // TODU如果选择的类型selectItem 为空,就将全部的formId类型都传过去 selectItem 为选择的，formIdArr为全部的
    if (this.state.selectItem.length <= 0) {
      selectItem = formIdArr
      console.log(selectItem)
      this.setState({
        selectItem: formIdArr
      })
    } else {
      selectItem = this.state.selectItem
    }
    let obj = { isPage: true, status: this.state.status, pageNum: pageNum+1, pageSize: pageSize, userId: userId, formId: selectItem };
    console.log(obj, 'console.log(obj)')
    ajax.post('process/list', obj)
      .then((res) => {
        console.log(res, 'list')
        this.setState({
          list: list.concat(res.list),
          pageNum: pageNum + 1,
          total: res.total,
          isLoadingMore: false,
          isAction: false
        })
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadAll: false,
          isLoadingMore: false,
          isAction: false
        })
        if (error.msg) {
          Toast.showFail(error.msg)
        }
      })
    
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    height: 44,
    backgroundColor: '#fff',
    color: '#808080',
    borderBottomWidth: 1,
    borderColor: '#e8e8e8'
  },
  headerBtn: {
    marginLeft: 20,
    marginRight: 20,
    position: 'relative'
  },
  curBorder: {
    position: 'absolute',
    borderBottomWidth: 3,
    width: 20,
    alignSelf: 'center',
    borderColor: '#4D66FD',
    bottom: -15,
    opacity: 1
  },
  condition: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    shadowColor: '#DCDCDC',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    position: 'relative',
    zIndex: 999
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screen: {
    width: 74,
    borderLeftWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e8e8e8'
  },
  screenText: {
    color: '#888',
    fontSize: 14
  },
  searchIcon: {
    marginRight: 20
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
  },
})