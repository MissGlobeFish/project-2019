/**
* WebView通用型
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, WebView, ActivityIndicator, Image } from 'react-native';
import { Button } from 'react-native-elements';

export default class WebViewPage extends Component {

  static navigationOptions = ({ navigation }) => {
    let hideNavigateBar = navigation.getParam('hideNavigateBar')
    return {
      title: '',
      headerBackTitle: null,
      header: hideNavigateBar,
    }
  }

  //Interactive Data

  constructor(props) {
    super(props);

    Object.assign({
      url: "http://www.baidu.com"
    }, this.state)

  };

  //Life Cycle
  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  //SubRenders
  renderLoading() {

    return <View style={styles.loadingBoxStyle}>
      <ActivityIndicator size="large" animating />
      <Text style={styles.loadingTitle}>{'加载中...'}</Text>
    </View>
  }

  renderError() {
    return  <View style={styles.errorBoxStyle}>
    <Image style={styles.errorImage} source={require('../res/imgs/EmptyIcon.png')} />
    <Text style={styles.errorText}> 加载失败 </Text>
    <Button
          titleStyle={{fontSize: 18}}
          buttonStyle={styles.errorButton}
          containerStyle={styles.errorButtonContainer}
          title='重新加载'
          color="#353535"
          fontSize={16}
          onPress={() => {
              this.refs.webView.reload()
          }}
        />
</View>
  }


  //Render
  render() {
    const {url} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          useWebKit
          startInLoadingState
          ref="webView"
          source={{ uri: url, method: 'GET', headers: { 'Cache-Control':'no-cache'} }}
          style={styles.webView}
          onMessage={this.webViewDidRecivedMessage.bind(this)}
          renderLoading={this.renderLoading.bind(this)}
          renderError={this.renderError.bind(this)}
          onLoadEnd={this.webViewDidLoadEnd.bind(this)}
          onLoad={this.webViewDidLoad.bind(this)}
          onError={this.webViewLoadError.bind(this)}
        />

      </SafeAreaView>
    );
  }


  //Action && Handeler

  //UserFunction
  /**
   *
   * 收到通知
   * @param {*} event
   * @memberof WebViewPage
   */
  webViewDidRecivedMessage(event) {
    const { goBack, getParam } = this.props.navigation;
    console.log("收到", event.nativeEvent.data)
    let code = event.nativeEvent.data
    switch (code) {
      case "goBack":
        goBack()
        break;
      default:
        break;
    }
  }

  /**
   * 网页成功加载
   *
   * @memberof WebViewPage
   */
  webViewDidLoad() {

  }

  /**
   * 网页加载失败
   *
   * @memberof WebViewPage
   */
  webViewLoadError() {
    console.log("WebView Load Failded")
  }

  /**
   * 加载完成（不论成功失败）
   *
   * @memberof WebViewPage
   */
  webViewDidLoadEnd() {
    console.log("加载结束", this.state.url)
  }

  //NetWorks


}

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  loadingBoxStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f9'
  },
  errorBoxStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f9'
  },
  errorImage: {
    width: '50%',
    resizeMode: 'contain',
  },
  errorText:{
    fontFamily: "PingFangSC-Regular",
    fontSize: 16,
    // color: "#353535",
    color: "#acacac",
    marginTop: -25,
    marginBottom: 25,
  },
  errorButton:{ 
    backgroundColor: '#f5f5f9',
  },
  errorButtonContainer: {
    borderColor: '#B1B1B1',
    borderWidth: 0.2,
    paddingHorizontal: 10,
    borderRadius: 2
  },
  loadingTitle:{
    fontFamily: "PingFangSC-Regular",
    fontSize: 16,
    color: "#353535",
    marginTop: 25,
  }

})