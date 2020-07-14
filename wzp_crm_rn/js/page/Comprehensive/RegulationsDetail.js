/**
 * regulationsDetail 综合--制度详情
 */
import React, { Component } from 'react';
import Pdf from 'react-native-pdf';
import {  StyleSheet, Text, Dimensions,View,TouchableOpacity } from 'react-native';
import ajax from '../../config/Fetch';
export default class Regulations extends Component{ 
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title')
    };
  };
  constructor(props) {
    super(props)
    this.state = {
      data:''
    }
  }
  componentDidMount(){
    this.handelInit()
  }
  render() {
    const source = {uri:this.state.data,cache:true};

    return (
      <View style={styles.containerView}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages,filePath)=>{
              console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page,numberOfPages)=>{
              console.log(`current page: ${page}`);
          }}
          onError={(error)=>{
              console.log(error);
          }}
          fitPolicy={2}
          spacing={0}
          style={styles.pdf}/>
      </View>
    )
  }
  handelInit() {
    const { getParam } = this.props.navigation;
    console.log(getParam('primaryKey'),"getParam('primaryKey')")
    const primaryKey = getParam('primaryKey')
    ajax.getOther('consult',primaryKey)
      .then((res)=>{
        this.setState({
          data: res.content
        })
        console.log(res,'res')
      })
  }
}
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    marginTop:0,
    paddingTop:0
}
});