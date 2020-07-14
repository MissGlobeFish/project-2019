/**
 * 控制台主页
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import PersistanceManger from '../../util/PersistanceManger';
import ajax from '../../config/Fetch';
import Toast from '../../common/Toast';
export default class ConsoleIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgObj: {}, // 未读信息
      headerList: [
        { itemName: '我发起的', itemIcon: require('../../res/imgs/wfq-icon.png'), msgNum: 0, pageIdentify: 'Receipt' },
        { itemName: '待办', itemIcon: require('../../res/imgs/db-icon.png'), msgNum: 0, pageIdentify: 'Dealt' },
        { itemName: '抄送', itemIcon: require('../../res/imgs/cs-icon.png'), msgNum: 0, pageIdentify: 'Receipt3' },
      ],

      itemList: [{
        sectionName: "日常",
        listItems: [
          { itemName: '费用报销', itemIcon: require('../../res/imgs/ClaimingExpenses.png'), pageIdentify: 'ClaimingExpensesList' },
          // { itemName: '薪酬绩效', itemIcon: require('../../res/imgs/Console-Salary.png'), pageIdentify: 'SalaryPage' },
          
          // { itemName: '费用申请', itemIcon: require('../../res/imgs/FeeExpenses.png') },
          // { itemName: '出差申请', itemIcon: require('../../res/imgs/TripApply.png') },
          // { itemName: '差旅报销', itemIcon: require('../../res/imgs/TripExpenses.png') },
          // { itemName: '需求提交', itemIcon: require('../../res/imgs/DemandSubmit.png') },
        ]
      },
      {
        sectionName: "数据",
        listItems: [
          // { itemName: '销量分析', itemIcon: require('../../res/imgs/SaleAnalyze.png'), pageIdentify: 'SaleAnalyzeIndexPage' },
          { itemName: '销量分析', itemIcon: require('../../res/imgs/SaleAnalyze.png'), pageIdentify: 'SaleAnalyzPieIndexPage' },
          { itemName: '项目全景', itemIcon: require('../../res/imgs/MerchantDistribution.png'), pageIdentify: 'EstateProjectPage' },
          { itemName: '地产提成', itemIcon: require('../../res/imgs/icon_commission.png'), pageIdentify: 'EstateCommissionPage' },
          { itemName: '售后回款', itemIcon: require('../../res/imgs/icon_commission.png'), pageIdentify: 'AafterSaleBackToArticlePage' },
          // { itemName: '桌牌情况', itemIcon: require('../../res/imgs/TabelSituation.png') },
          // { itemName: '桌牌运营', itemIcon: require('../../res/imgs/TabelOperat.png') },
          // { itemName: '心跳监控', itemIcon: require('../../res/imgs/HeartMonitor.png') },
        ]
      },
        // {
        //   sectionName: "业务",
        //   listItems: [
        //     { itemName: '订单', itemIcon: require('../../res/imgs/SaleOrder.png')},
        //     { itemName: '开发票', itemIcon: require('../../res/imgs/Invoice.png') },
        //     { itemName: '安装申请', itemIcon: require('../../res/imgs/InstallApply.png') },
        //     { itemName: '退货申请', itemIcon: require('../../res/imgs/RetuenApply.png') },
        //     { itemName: '换货', itemIcon: require('../../res/imgs/ChangeApply.png') },
        //     { itemName: '项目管理', itemIcon: require('../../res/imgs/ProjectManager.png') },
        //   ]
        // }
      ]
    }
  };


  componentDidMount() {
    this.handleUnread()
    let self = this
    this.listener = DeviceEventEmitter.addListener(global.NotificationIdentify.consolePageNeedRefresh, function (refresh) {
      if (refresh) {
        self.handleUnread()
      }
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }


  /**
   * 头部 我发起的 --- 待办 --- 抄送
   *
   * @returns
   * @memberof ConsoleIndex
   */
  _headerItems() {
    const { headerList } = this.state;
    const { navigate } = this.props.navigation;
    let itemsView = [];
    var i;
    headerList.map((item, index) => {
      itemsView.push(
        <TouchableOpacity style={styles.item} key={index}
          onPress={() => {
            navigate(item.pageIdentify, {
              itemName: item.itemName,
            })
          }}
        >
          <Image style={styles.itemIcon} source={item.itemIcon}></Image>
          <Text style={styles.itemName}>{item.itemName}</Text>
          {item.msgNum > 0 && <View style={styles.msgNum}>
            <Text style={{ fontSize: 10, color: '#fff' }}>{item.msgNum}</Text>
          </View>}
        </TouchableOpacity>
      )
    })
    return itemsView;
  }



  /**
   * 内容列表
   *
   * @memberof ConsoleIndex
   */
  _listItemsComon() {
    const { itemList } = this.state
    var sectionView = []
    itemList.map((item, index) => {
      var listItem = []
      item.listItems.map((cellItem, index) => {
        listItem.push(
          <TouchableOpacity style={styles.cellItemBox} key={index}
            onPress={() => {
              this.handleItemTapped(cellItem)
            }}
          >
            <Image style={styles.cellItemIcon} source={cellItem.itemIcon}></Image>
            <Text style={styles.cellItemName}>{cellItem.itemName}</Text>
          </TouchableOpacity>
        )
      })
      sectionView.push(
        <View style={styles.sectionWrap} key={index}>
          <Text style={styles.title}>{item.sectionName}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {listItem}
          </View>
        </View>
      )
    })

    return sectionView
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.sectionItem1}>
            {this._headerItems()}
          </View>
          {this._listItemsComon()}
        </ScrollView>
      </View>
    );
  }


  /**
   * 点击进入模块
   *
   * @memberof ConsoleIndex
   */
  handleItemTapped(item) {
    var page = item.pageIdentify
    if (page != null) {
      this.props.navigation.navigate(page)
    } else {
      Toast.showInfo("内容即将上线，敬请期待")
    }
  }


  /**
   * 获取数字
   *
   * @memberof ConsoleIndex
   */
  handleUnread() {
    let userId = PersistanceManger.ShareInstance().userId;
    let empCode = PersistanceManger.ShareInstance().empCode
    console.log(PersistanceManger.ShareInstance().empCode, PersistanceManger.ShareInstance().userId)
    ajax.get('base/unread-notice-count', { empCode: empCode, userId: userId })
      .then((res) => {
        this.state.headerList[0].msgNum = res.unreadWorkRecord;// 我发送的
        this.state.headerList[1].msgNum = res.unreadProcess;//待办
        this.setState({
          headerList: this.state.headerList
        })
      })
      .catch(() => {

      })
  }



}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    paddingTop: 40
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 15,
    height: 41,
    lineHeight: 41,
  },
  sectionItem1: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  sectionWrap: {
    marginTop: 20
  },
  item: {
    width: '33.33%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20
  },
  itemIcon: {
    width: 26,
    height: 24
  },
  itemName: {
    width: '100%',
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  msgNum: {
    position: 'absolute',
    // paddingTop: 1,
    // paddingLeft: 4,
    // paddingRight: 4,
    // paddingBottom: 2,
    paddingVertical: 1.4,// 上下内边距
    paddingHorizontal: 4,// 左右内边距
    backgroundColor: '#ff0000',
    borderRadius: 50,
    right: 36,
    top: -10
  },



  cellItemBox: {
    width: '25%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 9,
  },
  cellItemIcon: {
    width: 40,
    height: 40
  },
  cellItemName: {
    paddingTop: 16,
    marginBottom: 5,
  }

})
