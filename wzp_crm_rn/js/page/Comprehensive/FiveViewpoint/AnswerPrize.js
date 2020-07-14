/**
* *  答题
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
const { width, height } = Dimensions.get('window');// 取得屏幕的宽高Dimensions
import ajax from '../../../config/Fetch';
import PersistanceManger from '../../../util/PersistanceManger';
import Toast from '../../../common/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import FiveCard from "../FiveViewpoint/Components/FiveCard";
import AnswerWrong  from "../FiveViewpoint/Components/AnswerWrong";
export default class  AnswerPrize extends Component {

   static navigationOptions = ({ navigation }) => {
        return {
            title: '小宝集五观',
            headerBackTitle: null,
            headerRight:
            <View style={styles.headerRightBox}>
            </View>
        }
   }

    //Interactive Data

    constructor(props) {
        super(props);
        this.state = {
            empCode: PersistanceManger.ShareInstance().empCode,
            topicData: '',
            resultListData: [],
            pitchAnswers: '',
            isVisibleWrong: false, // 答错
            visible: false, // 显示五观卡
            fiveCardType: {
              "FIVEVIEW": "D" // A: 客户观 B：工作观 C:生命观 D:人生观 E:成功观
            },
            currentItem: "" // 当前点击选项
        }
    }

   //Life Cycle 在渲染前调用,在客户端也在服务端
    componentWillMount() {
    }

    // 在第一次渲染后调用，只在客户端
    componentDidMount() {
        this.handleQuestions();
    }

    // 在组件从 DOM 中移除之前立刻被调用
    componentWillUnmount() {
        
    }

   //SubRenders

    //Render
    render() {
        const { topicData, isVisibleWrong,resultListData, isSubmit,visible,fiveCardType } = this.state;
        return (
            <ScrollView bounces={false}>
                <View style={styles.answerPageBox}>
                    {visible && <FiveCard  visible={visible} cardType={fiveCardType.FIVEVIEW} fn={this._collectChild.bind(this)}></FiveCard>}
                    {isVisibleWrong && <AnswerWrong visible={isVisibleWrong } fn={this._goBack.bind(this)}></AnswerWrong>}
                    <Image style={styles.pageBackgroundImg} source={require('../../../res/FiveViewpointImgs/answer-bg.png')}></Image>
                    <View style={styles.topicBox}>
                        <Text style={styles.topTitleText}>今日题目</Text>
                        <Text style={styles.topicText}>{ topicData }</Text>
                        <Text style={styles.bottomTitleText}>请在下方选择答案后提交</Text>
                    </View>
                    <FlatList
                        style={styles.resultBox}
                        data={ resultListData }
                        renderItem={({item}) => this._resultList(item)}//列表      
                        // keyExtractor={item => item.id}
                        extraData={this.state}
                    />
                    {this._submitClickButt()}
                    <View style={styles.bottomBox}>
                        <Text style={styles.bottomRuleText}>答题规则：</Text>
                        <Text style={styles.bottomText}>1.每天每人只有一次答题机会，题库将随机分配题目</Text>
                        <Text style={styles.bottomText}>2.回答正确将必得一张「 人生观 」卡片</Text>
                    </View>
                </View>
            </ScrollView>
        )
    }
    
    //答案列表
    _resultList(item) {
        const { isClick,currentItem } = this.state;
        const isCurrent = (item.id == currentItem.id)
        return (
           <TouchableOpacity style={isCurrent ? styles.resultClickItemBox :  styles.resultItemBox } onPress={()=>{ this.resultClick(item) }}>
                { isCurrent ? this._clickButt() : this._noClickButt() }
                <Text style={styles.resultItemText}>{ item.option }</Text>
            </TouchableOpacity> 
        )
    }

    //未选中按钮
    _noClickButt() {
        return (
            <View style={styles.button01ItemText}></View>
        )
    }

    //选中按钮
    _clickButt() {
      console.log("选中按钮")
        return (
            <View style={styles.button02ItemText}>
                <View style={styles.innerButtText}></View>
            </View>
        )
    }
    
    //提交按钮
    _submitClickButt() {
      console.log("_submitClickButt--加载提交按钮样式")
      let sourceUrl;
      if (this.state.currentItem) {
        sourceUrl = require('../../../res/FiveViewpointImgs/answer-button02.png')
      } else {
        sourceUrl = require('../../../res/FiveViewpointImgs/answer-button.png')
      }
        return (
            <TouchableOpacity style={styles.submitBox} onPress={()=>{this.submitAnswers(this.state.currentItem)}}>
                <Image style={styles.unifyImg} source={sourceUrl}></Image>
            </TouchableOpacity>
        )
    }

    // 收下礼品回调
    _collectChild() {
      // this
      ajax.get("questionsSaveCard",{empCode: this.state.empCode})
      .then(res=>{
        console.log(res,"答题收下")
        this._goBack()
      })
      .catch(error=>{
        this._goBack()
        console.log(error,"答题收下失败")
      })
    }

    // 返回上一级页面
    _goBack() {
      setTimeout(()=>{
        this.props.navigation.goBack()
      },500) 
    }
    //NetWorks
    // 获取问题和选项
    handleQuestions() {
        ajax.get('questionsAndAnswers',{empCode: this.state.empCode}).then((res) => {
            console.log(res)
            this.setState({
                topicData: res.title,
                resultListData: res.answers,
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    // 答题收下
    submitAnswers (currentItem) {
        console.log("点击提交答案",this.state.pitchAnswers)
        if (!currentItem) return;
        if (this.state.pitchAnswers) {
          this.setState({
            visible: true
          })
        }else{
          this.setState({
            isVisibleWrong: true
          })
            console.log('答错了哦~')
        }
    }

    //UserFunction
    //resultClick
    resultClick(item){
      console.log(item,"resultClick")
        this.setState({
            // isClick: true,
            // isSubmit: true,
            pitchAnswers: item.correct,
            currentItem: item
        })
    }
    // 接受弹框子组件方法
    _reciveChildFn() {
      console.log("接受弹框子组件方法")
    }
}

//Styles
const styles = StyleSheet.create({
    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
    },
    rightItem: {
        marginRight: 23,
    },
    rightImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    //公共style
    unifyImg: {
        width:null,
        height:null,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        resizeMode: 'contain',
    },

    answerPageBox: {
        width: width,
        height: 900,
        backgroundColor: '#C0151A',
        flex:1,
        alignItems:'center',
    },
    pageBackgroundImg: {
        width: width,
        height: width/750 * 1193,
    },

    //问题
    topicBox: {
        width: '65%',
        height: '10%',
        position: 'absolute',
        top: '22%',
    },
    topTitleText: {
        color: '#900303',
        fontSize: 15,
        textAlign: 'center',
        fontWeight:'900',
    },
    topicText: {
        color: '#F9F9F8',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: '5%',
        fontWeight:'900',
    },
    bottomTitleText: {
        color: '#CF4503',
        fontSize: 12,
        textAlign: 'center',
        fontWeight:'900',
    },

    //答案
    resultBox: {
        width: '90%',
        position: 'absolute',
        top: '48%',
    },
    resultItemBox: {
        width: '100%',
        height: 40,
        backgroundColor: '#AE1014',
        borderRadius: 5,
        marginBottom: 10,
    },
    resultClickItemBox: {
      width: '100%',
      height: 40,
      backgroundColor: '#E3282E',
      borderRadius: 5,
      marginBottom: 10,
  },
    button01ItemText: {
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: '#FFBA7A',
        position: 'absolute',
        top: 7.5,
        left: 10,
    },
    button02ItemText: {
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: '#FFE5CB',
        position: 'absolute',
        top: 7.5,
        left: 10,
    },
    innerButtText: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#AE1014', 
        position: 'absolute',
        top: 7.5,
        left: 7.5,
    },
    resultItemText: {
        color: '#FFAB6A',
        fontSize: 15,
        lineHeight: 40,
        paddingLeft: 45,
        fontWeight:'900',
    },

    //提交
    submitBox: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        bottom: '12%',
    },

    //答题规则
    bottomBox: {
        width: '90%',
        height: '8%',
        position: 'absolute',
        bottom: '2%',
    },
    bottomRuleText: {
        color: '#690609',
        fontSize: 14,
        marginVertical: 8,
    },
    bottomText: {
        color: '#721417',
        fontSize: 12,
        marginBottom: 4,
    },
})