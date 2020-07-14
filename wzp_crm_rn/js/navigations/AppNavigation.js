import React from 'react';
import { Image, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
// import WelcomePage from '../page/WelcomePage';
import LoginPage from '../page/LoginPage';
import HomePage from '../page/Home/HomePage';
import MyPage from '../page/My/MyPage';
import DetailsPage from '../page/Home/DetailsPage';
import BookPage from '../page/Comprehensive/BookPage';
import TabNav from '../common/TabNavigator';
import SearchPage from '../page/Home/SearchPage';
import MyInfo from '../page/My/MyInfo';
import EditPwd from '../page/My/EditPwd';
import PayrollLogin from '../page/My/PayrollLogin';
import Payroll from '../page/My/Payroll';
import QRCodeScanPage from '../page/Home/QRCodeScanPage'
import MorePage from '../page/Home/MorePage';
import DeviceInfoPage from '../page/Home/DeviceInfoPage'
import MessageCenter from '../page/Home/MessageCenter'
import Regulations from '../page/Comprehensive/Regulations'
import RegulationsDetail from '../page/Comprehensive/RegulationsDetail'
import Library from '../page/Comprehensive/Library'
import PortraitCollectPage from '../page/My/PortraitCollectPage'
import PortraitCamera from '../page/My/PortraitCamera'
import EstateRankPage from '../page/Home/EstateRankPage' // 地产排行榜
import FoodEstateRankPage from '../page/Home/FoodEstateRankPage' //餐饮排行榜
import Game from '../page/Comprehensive/Game' // 黑马大赛
import WalletPage from '../page/My/WalletPage'
import TransactionListPage from '../page/My/TransactionListPage'
import ChargePage from '../page/My/ChargePage'
import TransactionDetail from '../page/My/TransactionDetail'
import Receipt from '../page/ConsoleStation/Receipt' //我发起的--单据
import Dealt from '../page/ConsoleStation/Dealt' //我发起的--待办列表
import DealtDetail from '../page/ConsoleStation/DealtDetail' //我发起的--待办处理详情
import ReceiptSearch from '../page/ReceiptSearch' //我发起的--待办处理详情

import ClaimingExpensesList from '../page/ConsoleStation/ClaimingExpenses/ClaimingExpensesList' //我发起的--费用报销列表
import ClaimingExpenses from '../page/ConsoleStation/ClaimingExpenses/ClaimingExpenses' //费用报销单详情
import ClaimingExpensesDetail from '../page/ConsoleStation/ClaimingExpenses/ClaimingExpensesDetail' //费用报销单明细页
import ClaimingExpensesDealt from '../page/ConsoleStation/ClaimingExpenses/ClaimingExpensesDealt' //费用报销单详情审批页
import ContactUnitSearchPage from '../page/SearchPages/ContactUnitSearchPage' //费用报销往来单位搜索页面


import CommunityIndex from '../page/Comprehensive/Community/CommunityIndex' //社区
import MyProblemList from '../page/Comprehensive/Community/MyProblemList'   //我的提问
import ProblemDetail from '../page/Comprehensive/Community/ProblemDetail'   //问题详情
import EstateProjectPage from '../page/ConsoleStation/EstateProjecInfo/EstateProjectPage'
import EstateCommissionPage from '../page/ConsoleStation/EstateCommission/EstateCommissionPage'//地产提成
import EstateCommissionDetail from '../page/ConsoleStation/EstateCommission/EstateCommissionDetail'//地产提成

import AafterSaleBackToArticlePage from '../page/ConsoleStation/AafterSaleBackToArticle/AafterSaleBackToArticlePage'//售后提成

import SaleAnalyzPieIndexPage from '../page/ConsoleStation/SaleAnalyze/SaleAnalyzPieIndexPage'
import SaleAnalyzPieSubIndexPage from '../page/ConsoleStation/SaleAnalyze/SaleAnalyzPieSubIndexPage'
import SaleAnalyzePieDetailPage from '../page/ConsoleStation/SaleAnalyze/SaleAnalyzePieDetailPage'

import SaleAnalyzeIndexPage from '../page/ConsoleStation/SaleAnalyze/SaleAnalyzeIndexPage'
import SaleAnalyzeDetailPage from '../page/ConsoleStation/SaleAnalyze/SaleAnalyzeDetailPage'
import SaleAnalyzeProjectPage from '../page/ConsoleStation/SaleAnalyze/SaleAnalyzeProjectPage'
import WebViewPage from '../page/WebViewPage'//通用网页显示
import SalaryPage from '../page/ConsoleStation/Salary/SalaryPage'// 薪酬绩效


import ChartDemoPage from '../page/ConsoleStation/SaleAnalyze/ChartDemoPage'// 图形 Demo

import FiveViewpointIndex from '../page/Comprehensive/FiveViewpoint/FiveViewpointIndex' //小宝集五观
import MyCardsPage from '../page/Comprehensive/FiveViewpoint/MyCardsPage' //我的五观卡
import CardsRankingList from '../page/Comprehensive/FiveViewpoint/CardsRankingList' //集卡榜
import AnswerPrize from '../page/Comprehensive/FiveViewpoint/AnswerPrize' //答题
import DemandCardList from '../page/Comprehensive/FiveViewpoint/DemandCardList' //索要卡片列表
import DemandCardDetail from '../page/Comprehensive/FiveViewpoint/DemandCardDetail' //索要卡片
import Test from '../page/Comprehensive/FiveViewpoint/Test' //索要卡片

import HumanSearchPage from '../page/SearchPages/HumanSearchPage' // 用户搜索页面

class BackImage extends React.Component {
  render() {
    return (
      <View style={{height: 50,paddingLeft: 15,paddingRight: 15}}>
        <Image
          source={require('../res/imgs/leftarrow.png')}
          style={{ width: 8, height: 15,marginTop:16}}
        />
      </View>
    );
  }
}
class HeaderRight extends React.Component {
  render() {
    return (
      <View style={{ marginRight: 23 }}></View>
    );
  }
}
export default AppNavigation = createStackNavigator({
  SearchPage: {
    screen: SearchPage
  },
  MorePage: {
    screen: MorePage
  },
  Main: {
    screen: TabNav,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  LoginPage: {
    screen: LoginPage,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },

  // WelcomePage: {
  //   screen: WelcomePage
  // },
  HomePage: {
    screen: HomePage,
  },
  MyPage: {
    screen: MyPage
  },
  DetailsPage: {
    screen: DetailsPage
  },
  QRCodeScanPage: {
    screen: QRCodeScanPage
  },
  MessageCenter: {
    screen: MessageCenter
  },
  DeviceInfoPage: DeviceInfoPage,
  Payroll: Payroll, // 工资单
  PayrollLogin: PayrollLogin,
  MyInfo: MyInfo,
  EditPwd: EditPwd,
  Regulations: Regulations,
  Library: Library,
  RegulationsDetail:RegulationsDetail,
  EstateRankPage: EstateRankPage,
  PortraitCollectPage: PortraitCollectPage,
  PortraitCamera: PortraitCamera,
  Game: Game,
  WalletPage: WalletPage,
  TransactionListPage: TransactionListPage,
  ChargePage: ChargePage,
  TransactionDetail: TransactionDetail,
  BookPage:BookPage,
  Receipt:Receipt,
  ClaimingExpensesList: ClaimingExpensesList,
  Dealt: Dealt, //待办
  DealtDetail: DealtDetail,
  FoodEstateRankPage:FoodEstateRankPage,
  ClaimingExpenses: ClaimingExpenses,
  ReceiptSearch: ReceiptSearch,
  ClaimingExpensesDetail: ClaimingExpensesDetail,
  ClaimingExpensesDealt: ClaimingExpensesDealt,
  ContactUnitSearchPage: ContactUnitSearchPage,
  CommunityIndex: CommunityIndex,
  MyProblemList: MyProblemList,
  ProblemDetail: ProblemDetail,
  
  SaleAnalyzPieIndexPage: SaleAnalyzPieIndexPage,
  SaleAnalyzPieSubIndexPage: SaleAnalyzPieSubIndexPage,
  SaleAnalyzePieDetailPage: SaleAnalyzePieDetailPage,
  SaleAnalyzeIndexPage: SaleAnalyzeIndexPage,
  SaleAnalyzeDetailPage: SaleAnalyzeDetailPage,
  SaleAnalyzeProjectPage: SaleAnalyzeProjectPage,
  
  EstateProjectPage: EstateProjectPage,
  EstateCommissionPage: EstateCommissionPage,
  EstateCommissionDetail: EstateCommissionDetail,
  AafterSaleBackToArticlePage: AafterSaleBackToArticlePage,
  SalaryPage:SalaryPage,

  FiveViewpointIndex: FiveViewpointIndex, //小宝集五观
  MyCardsPage: MyCardsPage, //我的五观卡
  CardsRankingList: CardsRankingList, //集卡榜
  AnswerPrize: AnswerPrize, //答题
  DemandCardList: DemandCardList, //索要卡片列表
  DemandCardDetail: DemandCardDetail, //索要卡片
  
  HumanSearchPage: HumanSearchPage,
  ChartDemoPage: ChartDemoPage,
  Test: Test
},
  {
    initialRouteName: 'Main',//'Payroll',
    // initialRouteName: 'FiveViewpointIndex',//'Payroll',//MyCardsPage
    // mode: 'card',
    // navigationOptions: {

    //   headerTintColor: '#000',
    //   headerTitleStyle: {
    //     fontSize: 18
    //   }
    // }
    navigationOptions: () => ({
      headerBackImage: <BackImage />,
      headerTintColor: '#000',
      headerTitleStyle: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'normal'
      },
      gestureResponseDistance: {
        horizontal: 50
        // vertical: 180
      },
      headerRight: <HeaderRight />
    }),
  }); 