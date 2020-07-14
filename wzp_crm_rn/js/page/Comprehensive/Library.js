// /**
//  * Library 综合--制度
//  */
// import React, { Component } from 'react';
// import {  StyleSheet, Text, Image,View,Dimensions,FlatList } from 'react-native';
// import ajax from '../../config/Fetch';
// import LoadMore from '../../common/LoadMoreFooter';
// const { width, height } = Dimensions.get('window');
// export default class Library extends Component{
//   static navigationOptions = {
//     title: '图书馆'
//   };
//   constructor(props) {
//     super(props)
//     this.state = {
//       data:'',
//       total: '',
//       pageNum: 1,
//       pageSize: 10,
//       refreshing: false,
//       isLoadAll: false
//     }
//   }
//   componentDidMount() {
//     this.handleInit()
//   }
//   render() {
//     const {data} = this.state
//     return (
//       <View style={styles.container}>
//         {/* <Text>综合--图书</Text> */}
//         <FlatList
//             extraData={this.state}
//             data={data}
//             //item显示的布局
//             renderItem={({item}) => this.createListItem(item)}
//             // // 空布局
//             // ListEmptyComponent={this.createEmptyView}
//             // //添加头尾布局
//             // ListHeaderComponent={this._createListHeader}
//             ListFooterComponent={this.ListFooterComponent}
//             // //下拉刷新相关
//             onRefresh={() => this.onRefresh()}
//             refreshing={this.state.refreshing}
//             //加载更多
//             onEndReached={() => this.onLoadMore()}
//             onEndReachedThreshold={0.1}
//             keyExtractor = {(item) => item.id.toString()}
//         />
//       </View>
//     )
//   }
//   // 创建布局
//   createListItem(item) {
//     const textColor = item.bookStatus ? '#25C613' :'#808080'
//     return (
//       <View style={styles.wrap}>
//         <View style={styles.listWrap}>
//           <View style={styles.imageWrap}>
//             <Image style={{width: 90,height:120}} source={{uri: item.frontPage}}/>
//           </View>
//           <View style={styles.infoWrap}>
//             <Text style={styles.title}>{item.bookName}</Text>
//             <Text style={styles.textItem}>作者：{item.author}</Text>
//             <Text style={styles.textItem}>类型：{item.label}</Text>
//             <Text style={styles.textItem}>{item.favorites}人喜欢</Text>
//             <Text style={[styles.textItem,{color:textColor}]}>{item.bookStatus ? '可借' : '不可借'}</Text>
//           </View>
//         </View>
//       </View>
//     )
//   }
//   // 空布局
//   createEmptyView(){
//     return (
//         <View style={styles.emptyView}>
//             <Text style={{fontSize:16}}>
//                 暂无列表数据
//             </Text>
//         </View>
//     );
//   }
//   // 尾布局
//   ListFooterComponent = () => {
//     return (
//       <LoadMore isLoadAll={this.state.isLoadAll} />
//     );
//   };
//   //onRefresh 下拉刷新相关
//   onRefresh=()=>{
//     const { list, pageNum, pageSize,
//       total } = this.state;
//     // 不处于 下拉刷新
//     if(!this.state.refreshing){
//         this.setState({
//           pageNum:pageNum + 1
//     })
//       this.handleInit()
//     }
// };
// //onEndReached 加载更多
//   onLoadMore(){
//     const { data, pageNum, pageSize,total } = this.state;
//     if (pageNum >= Math.ceil(total / pageSize)) {
//       this.setState({
//         isLoadAll: true
//       });
//       return;
//     }
//     ajax.get('book', { pageNum: pageNum + 1, pageSize: 10}).then(res => {
//       this.setState({
//         data: data.concat(res.list),
//         pageNum: pageNum+1,
//       })
//       }).catch(error => {
//         console.log(error)
//     });
//   }
//   // 获取初始数据
//   handleInit() {
//     this.setState({refreshing: true})
//     ajax.get('book', { pageNum:1,pageSize:10}).then(res => {
//       this.setState({
//         data: res.list,
//         total: res.total,
//         pageNum:1,
//         pageSize: 10,
//         refreshing: false,
//         isLoadAll: false
//       })
//       console.log(res.list)
//       }).catch(error => {
//         console.log(error)
//     });
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//   },
//   wrap: {
//     paddingLeft: 23,
//     paddingRight: 23,
//     backgroundColor:'#fff'
//   },
//   listWrap: {
//     paddingTop: 25,
//     paddingBottom: 25,
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor:'#e8e8e8'
//   },
//   imageWrap: {
//     width: 90,
//     height: 120
//   },
//   infoWrap: {
//     marginLeft: 30,
//   },
//   title: {
//     fontSize: 16,
//     color:'#323232',
//     lineHeight: 24
//   },
//   textItem: {
//     color: '#808080',
//     fontSize: 14,
//     lineHeight: 24
//   },
//   emptyView: {
//     height:height-30,
//     // backgroundColor:'#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

/**
 * Library 综合--制度
 */
import React, { Component } from 'react';
import {  StyleSheet, Text, Image,View,Dimensions,FlatList } from 'react-native';
import ajax from '../../config/Fetch';
import LoadMore from '../../common/LoadMoreFooter';
const { height } = Dimensions.get('window');
export default class Library extends Component{
  static navigationOptions = {
    title: '图书馆'
  };
  constructor(props) {
    super(props)
    this.state = {
      listData:[],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      refreshing: false,
      isLoadingMore: false,// 是否正在加载数据
      isAction: false, // 是否加载完成数据
      isLoadAll: false
    }
  }
  componentDidMount() {
    this.handleInit()
  }
  render() {
    const {refreshing} = this.state
    return (
      <View style={styles.container}>
        <FlatList
          extraData={this.state}
          data={this.state.listData}
          onRefresh={() => this._onRefresh()}
          refreshing={this.state.refreshing}
          onEndReachedThreshold={0.1}
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
    this.setState({refreshing: true,isAction: true,isLoadingMore: true});
    ajax.get('book', {pageNum:1,pageSize: pageSize})
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
      this.setState({refreshing: false,isAction: false, isLoadingMore: false})
      console.log(error)
    })
  };

  // 下拉刷新 
  _onRefresh =()=> {
    this.setState({
      data: [],
      isLoadAll: false,
      pageNum: 1
    },this.handleInit())
  };

   // 上拉加载更多
   _onEndReached = () =>  {
    if (this.state.isLoadingMore) {
      return
    }
    this.setState({isAction: true, isLoadingMore: true})
    const { listData, pageNum, pageSize,total } = this.state;
    if (pageNum >= Math.ceil(total / pageSize)) {
      this.setState({
        isLoadAll: true
      });
      return;
    }
    ajax.get('book', {pageNum: pageNum+1,pageSize: pageSize})
    .then((res)=>{
      this.setState({
        listData: listData.concat(res.list),
        pageNum: pageNum + 1,
        isAction: false,
        isLoadingMore: false
      },()=>{
        console.log(999)
        console.log(this.state.listData)
      })
    })
    .catch((error)=>{
      this.setState({
        isAction: false,
        isLoadingMore: false
      })
    })
  };


  // flatList底部布局
  _ListFooterComponent = () => {
    // if (this.state.isLoadAll) return null;
    return (
      <LoadMore isLoadAll={this.state.isLoadAll} isAction={this.state.isAction}/>
    );
  };

  // 列表布局
  _createListItem(item) {
    const textColor = item.bookStatus ? '#25C613' :'#808080'
    return (
      <View style={styles.wrap}>
        <View style={styles.listWrap}>
          <View style={styles.imageWrap}>
            <Image style={{width: 90,height:120}} source={{uri: item.frontPage}}/>
          </View>
          <View style={styles.infoWrap}>
            <Text style={styles.title}>{item.bookName}</Text>
            <Text style={styles.textItem}>作者：{item.author}</Text>
            <Text style={styles.textItem}>类型：{item.label}</Text>
            <Text style={styles.textItem}>{item.favorites}人喜欢</Text>
            <Text style={[styles.textItem,{color:textColor}]}>{item.bookStatus ? '可借' : '不可借'}</Text>
          </View>
        </View>
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  wrap: {
    paddingLeft: 23,
    paddingRight: 23,
    backgroundColor:'#fff'
  },
  listWrap: {
    paddingTop: 25,
    paddingBottom: 25,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor:'#e8e8e8'
  },
  imageWrap: {
    width: 90,
    height: 120
  },
  infoWrap: {
    marginLeft: 30,
  },
  title: {
    fontSize: 16,
    color:'#323232',
    lineHeight: 24
  },
  textItem: {
    color: '#808080',
    fontSize: 14,
    lineHeight: 24
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