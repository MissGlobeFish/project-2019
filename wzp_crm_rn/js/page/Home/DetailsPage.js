/**
 * Details 详情
 */


import React, { Component } from 'react';
import { WebView, StyleSheet, Text, View, Dimensions, Image, ScrollView, Platform, TouchableOpacity, DeviceEventEmitter } from 'react-native';

import ajax from '../../config/Fetch';
const { width, height } = Dimensions.get('window');
import NavigatorUtil from '../../util/NavigationUtil';
import PersistanceManger from '../../util/PersistanceManger';
type Props = {};
const TABSTYPE = {
  NEWS: '新闻',
  RANKING: '小宝人物志',
  EMP: '名片',
  NOTICE: '通知',
  SYSTEM: '制度',
  BOOK: '图书',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const htmlBaseMate = "<meta charset=\"utf-8\">" + 
"<meta id=\"viewport\" name=\"viewport\" content=\"width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=false\" />" + 
"<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />" + 
"<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" />" 


const BaseScript =
  `
(function () {
    var height = null;
    function changeHeight() {
      if (document.body.scrollHeight != height) {
        height = document.body.scrollHeight;
        if (window.postMessage) {
          window.postMessage(JSON.stringify({
            type: 'setHeight',
            height: height,
          }))
        }
      }
    }
   
   setTimeout(changeHeight, 100);
     document.body.setAttribute("style","width: 98%");
   let num =  document.getElementsByTagName("img").length;
   if (num>0) {
      for (let i = 0; i<num;i++) {
        document.getElementsByTagName("img")[i].setAttribute("style","width: ${SCREEN_WIDTH}px");
      }
   }
   // setInterval(changeHeight, 1000);
 
} ())
`
export default class Home extends Component<Props> {

  static navigationOptions = ({ navigation }) => {
    return {
      title: TABSTYPE[navigation.getParam('label')],
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      data: {
        title: '',
        likes: true,
        createdTime: '',
        deptName: '',
        subList: [],
        content: '',
        favorite: false
      },
      isShow: false,
      height: 10
    }
  }
  onMessage(event) {
    console.log(event.nativeEvent.data);
    // if (this.state.isShow) {
    //   return;
    // }
    try {
      const action = JSON.parse(event.nativeEvent.data)
      if (action.type === 'setHeight' && action.height > 0) {
        this.setState({ height: action.height, isShow: true })
        // alert(action.height);
      }
    } catch (error) {

      // pass
      // alert('action.height');
    }
  }
  componentWillMount() {
    // TABSTYPE[this.props.navigation.getParam("label")]
    const { goBack, getParam } = this.props.navigation;
    // ajax.post('login', { userName: 'yanglin', password: '888888' })
    // 
    ajax.getOther('consult', getParam('id')).then(res => {
      this.setState({
        data: res
      })
      console.log("内容页面 HTML ：",res)
    })

  }
  _imgList(lists) {
    return lists && lists.length > 0 && lists.map((list, index) => {
      console.log(list);
      return <Image
        style={{ height: 220 }}
        source={{ uri: list.image }}
        key={index}
      />
    })
  }
  _onLaud(favorite) {
    if (!favorite || this.state.favorite) {
      return;
    }
    const { goBack, getParam } = this.props.navigation;
    ajax.post('favorite', {
      empCode: PersistanceManger.ShareInstance().empCode,
      type: "F",
      module: "NS",
      recordId: getParam('id')
    }).then(res => {
      this.setState({
        favorite: true
      })
      let index = getParam('index')
      if (index >= 0) {
        DeviceEventEmitter.emit(global.NotificationIdentify.homePageNewDidFavorited, index);
      }
    })

  }
  render() {
    const { goBack, getParam, likes } = this.props.navigation;

    const { data, favorite } = this.state;
    return (
      <ScrollView style={[styles.container, { height: height - 80 }]}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.bottomBox}>
          <View style={[styles.leftBox]}>

            <Text style={[styles.text]}>{data.createdTime && NavigatorUtil._formatDate(data.createdTime)}</Text>
            <Text style={[styles.text, { paddingLeft: 20 }]}>{data.deptName}</Text>
          </View>
          {
            getParam('label') !== 'NOTICE' && <TouchableOpacity style={styles.laud} onPress={() => this._onLaud(data.favorite)}>
              <Image
                source={(!data.favorite || favorite) ? require('../../res/imgs/laud_ative.png') : require('../../res/imgs/laud.png')}
                resizeMode="contain"
                style={{ width: 12, height: 12 }}
              />
              <Text style={[styles.text]}>{favorite ? data.favoriteCount + 1 : data.favoriteCount || 0}</Text>
            </TouchableOpacity>

          }
        </View>
        <View>
          {this._imgList(data.subList)}
        </View>
        <View>
          <WebView style={{ width: width, height: this.state.height }}
            // style={{ flex: 1 }}
            // bounces={false}
            // scrollEnabled={false}
            // automaticallyAdjustContentInsets={true}
            // contentInset={{ top: 0, left: 0 }}
            injectedJavaScript={BaseScript}
            scalesPageToFit ={Platform.OS === "ios" ? false : true}
            javaScriptEnabled={true}
            decelerationRate='normal'
            // source={{ html: data.content, baseUrl: '' }}
            bounces={false}
            originWhitelist={['*']}
            scrollEnabled={false}
            automaticallyAdjustContentInsets={true}
            contentInset={{ top: 0, left: 0 }}
            onMessage={this.onMessage.bind(this)}
            useWebKit={true}
            source={Platform.OS === "ios" ? {
              html: htmlBaseMate + data.content
            } : { html: htmlBaseMate + data.content, baseUrl: '' }}// baseUrl: ''中文乱码解决

            onNavigationStateChange={(title) => {
              // console.log(title);
              // if (title.title != undefined) {
              //   this.setState({
              //     height: (parseInt(title.title) + 20) || 1000
              //   })
              // }
            }}

          />
        </View>

      </ScrollView>
    );
  }
}


// <WebView
//   originWhitelist={['*']}
//   source={{ html: data.content }}
// />

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  bottomBox: {
    // flex: 1,
    flexDirection: 'row',
    //  flex: 1,
    // flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 24
  },
  bottomBoxNotice: {
    flex: 1,
    justifyContent: 'space-between'
  },
  leftBox: {
    flexDirection: 'row',
  },
  text: {
    color: '#808080',
    fontSize: 12,
    marginLeft: 5
  },
  laud: {
    flexDirection: 'row',
  },
  title: {
    color: '#353535',
    fontSize: 24,
    paddingTop: 15,
    marginLeft: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 5
    // lineHeight: 30
  }
});
