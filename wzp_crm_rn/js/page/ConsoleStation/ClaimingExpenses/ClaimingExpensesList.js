/**
 * 费用报销单列表页
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, DeviceEventEmitter } from 'react-native';
import LoadMore from '../../../common/LoadMoreFooter';
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
const { width, height } = Dimensions.get('window');
import Toast from '../../../common/Toast'

export default class ClaimingExpensesList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '费用报销',
      headerBackTitle: null,
      headerRight:
        <TouchableOpacity style={{ marginRight: 23 }}
          onPress={() => {
            navigation.navigate('ClaimingExpenses')
          }}
        ><Text style={{ fontSize: 16, color: '#306FFE' }}>新增</Text></TouchableOpacity>
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      listDataSource: [],
      refreshing: true,
    }
  }

  //组件成功加载
  componentDidMount() {
    this.loadListData()
    let self = this
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.listPageNeedRefresh, function (refresh) {
      if (refresh) {
        self.loadListData()
      }
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  //列表为空的时候
  _ListEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={{ fontSize: 16 }}>暂无内容</Text>
      </View>
    );
  }


  _cellComponent(item, index) {
    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.cellContainer}
        onPress={() => {
          this.didSelectCellAtIndex(index, item)
        }}>
        <View style={[{ paddingHorizontal: 15 }]}>
          <View style={[{ marginTop: 12 }, styles.top]}>
            <View style={styles.topType}>
              <Text style={[styles.commonText, styles.commonColor]}>{item.billNo}</Text>
            </View>
            <Text style={[styles.commonText, { color: global.statusColor[item.documentStatus] }]}>
              {global.statusMenu[item.documentStatus]}
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.contentItem]}>{"申请报销金额合计：" + item.preamount}</Text>
            <Text style={[styles.contentItem]}>{"申请付款金额合计：" + item.payamount}</Text>
          </View>
        </View>
        <View style={[styles.bottom]}>
          <Text style={[styles.commonText, styles.commonColor]}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    )
  }


  render() {
    const { refreshing, listDataSource } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={this._ListEmptyComponent}
          onEndReachedThreshold={0.1}
          onRefresh={this.loadListData.bind(this)}
          refreshing={refreshing}
          style={styles.flatListStyle}
          data={listDataSource}
          keyExtractor={(item, index) => item.billNo + index}
          renderItem={({ item, index }) =>
            this._cellComponent(item, index)
          }
        />
      </View>
    );
  }

  //加载数据
  loadListData() {
    const { pageSize } = this.state;
    console.log("加载列表")
    this.setState({ refreshing: true })
    ajax.get('expensessList',
      {
        spageNum: 1,
        pageSize: pageSize,
        empCode: PersistanceManger.ShareInstance().empCode,
        userId: PersistanceManger.ShareInstance().userId
      }).then(res => {
        console.log(res)
        this.setState({
          listDataSource: res,
          refreshing: false,
        })
      }).catch(error => {
        this.setState({ refreshing: false })
      })
  }

  didSelectCellAtIndex(index, item) {
    let param = {
      fId: item.fId
    }
    this.props.navigation.navigate('ClaimingExpenses', param)
  }


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flatListStyle: {
    top: 8,
  },
  emptyView: {
    height: height - 64 - 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellContainer: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: 20
  },
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  topType: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commonText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commonColor: {
    color: '#808080'
  },
  contentItem: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 14,
    color: "#353535",
    marginTop: 10,
  },
  bottom: {
    paddingHorizontal: 15,
    fontSize: 14,
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    color: '#808080',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})



/////////////////分页模式

// /**
//  * 我发起的-待办
//  */
// import React, { Component } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
// import LoadMore from '../../common/LoadMoreFooter';
// import ajax from '../../config/Fetch';
// import PersistanceManger from '../../util/PersistanceManger';
// const { width, height } = Dimensions.get('window');
// import Toast from '../../common/Toast'

// export default class ClaimingExpensesList extends Component {
//   static navigationOptions = ({ navigation }) => {
//     return {
//       title: '费用报销',
//       headerBackTitle: null,
//       headerRight:
//         <TouchableOpacity style={{ marginRight: 23 }}
//           onPress={() => {
//             navigation.navigate('ClaimingExpenses')
//           }}
//         ><Text style={{ fontSize: 16, color: '#306FFE' }}>新增</Text></TouchableOpacity>
//     }
//   }
//   constructor(props) {
//     super(props);
//     this.state = {
//       listDataSource: [],
//       pageNum: 0,
//       pageSize: 15,
//       total: 0,
//       refreshing: true,
//       loadingMore: false,
//       isLoadAll: false,
//     }
//   }

//   //组件成功加载
//   componentDidMount() {
//     this.loadListData()
//   }

//   //列表为空的时候
//   _ListEmptyComponent = () => {
//     return (
//       <View style={styles.emptyView}>
//         <Text style={{ fontSize: 16 }}>暂无内容</Text>
//       </View>
//     );
//   }
//   //上拉加载更多控件
//   _ListFooterComponent = () => {
//     return (
//       <LoadMore isLoadAll={this.state.isLoadAll} isAction={this.state.loadingMore} />
//     );
//   };

//   _cellComponent(item, index) {
//     return (
//       <TouchableOpacity style={styles.cellContainer}
//         onPress={() => {
//           this.didSelectCellAtIndex(index, item)
//         }}>
//         <View style={[{ paddingHorizontal: 15 }]}>
//           <View style={[styles.margin10, styles.top]}>
//             <View style={styles.topType}>
//               <Text style={[styles.commonText, styles.commonColor]}>ADW34234523</Text>
//             </View>
//             <Text style={[styles.topStatus, styles.commonText]}>驳回</Text>
//           </View>
//           <View style={[styles.mid]}>
//             <Text style={[styles.contentItem]}>差旅费：13213</Text>
//           </View>
//         </View>
//         <View style={[styles.bottom]}>
//           <Text style={[styles.commonText, styles.commonColor]}>2018.10.27</Text>
//         </View>
//       </TouchableOpacity>
//     )
//   }


//   render() {
//     const { refreshing, listDataSource } = this.state;
//     return (
//       <View style={styles.container}>
//         <FlatList
//           ListEmptyComponent={this._ListEmptyComponent}
//           ListFooterComponent={this._ListFooterComponent}
//           onEndReachedThreshold={0.1}
//           onEndReached={this._onEndReached.bind(this)}
//           onRefresh={this.loadListData.bind(this)}
//           refreshing={refreshing}
//           style={styles.flatListStyle}
//           data={listDataSource}
//           keyExtractor={(item, index) => item.exp + index}
//           renderItem={({ item, index }) =>
//             this._cellComponent(item, index)
//           }
//         />
//       </View>
//     );
//   }

//   //加载数据
//   loadListData() {
//     const { pageSize } = this.state;
//     console.log("加载列表")
//     this.setState({ refreshing: true })
//     ajax.get('expensessList',
//       {
//         spageNum: 1,
//         pageSize: pageSize,
//         empCode: PersistanceManger.ShareInstance().empCode,
//         userId: PersistanceManger.ShareInstance().userId
//       }).then(res => {
//         console.log(res)
//         this.setState({
//           listDataSource: res.list,
//           total: res.total,
//           pageNum: 1,
//           loadingMore: false,
//           refreshing: false,
//           isLoadAll: false,
//         })
//       }).catch(error => {
//         this.setState({ refreshing: false })
//       })
//   }

//   //上拉加载更多
//   _onEndReached = () => {
//     const { list, pageNum, pageSize, total } = this.state;
//     this.setState({ loadingMore: true });
//     if (pageNum >= Math.ceil(total / pageSize)) {
//       this.setState({
//         isLoadAll: true
//       });
//       setTimeout(() => {
//         this.setState({ loadingMore: false });
//       }, 2000);
//       return;
//     }
//     ajax.get('expensessList',
//       {
//         pageNum: pageNum + 1,
//         pageSize: pageSize,
//         empCode: PersistanceManger.ShareInstance().empCode,
//         userId: PersistanceManger.ShareInstance().userId
//       }).then(res => {
//         this.setState({
//           listDataSource: this.state.listDataSource.concat(res.list),
//           pageNum: pageNum + 1,
//           loadingMore: false
//         })
//       }).catch(error => {
//         this.setState({ loadingMore: false })
//       })
//   }

//   didSelectCellAtIndex(index, item) {
//     console.log("Selected", index, item)
//   }


// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   emptyView: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   flatListStyle: {
//     top: 8,

//   },
//   emptyView: {
//     height: height - 64 - 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cellContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 2,
//     marginHorizontal: 20,
//     marginTop: 20
//   },
//   top: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   topType: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   topStatus: {
//     color: '#ff0000',
//   },
//   margin10: {
//     marginTop: 10
//   },
//   commonText: {
//     fontSize: 14
//   },
//   commonColor: {
//     color: '#808080'
//   },
//   mid: {
//     marginVertical: 10
//   },
//   bottom: {
//     paddingHorizontal: 15,
//     fontSize: 14,
//     marginTop: 10,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#e8e8e8',
//     color: '#808080',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   }
// })