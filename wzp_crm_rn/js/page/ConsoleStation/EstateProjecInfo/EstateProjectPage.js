/**
* 地产项目全景
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebViewPage from "../../WebViewPage"
import URLS from '../../../config/Api';

export default class  EstateProjectPage extends WebViewPage {

   static navigationOptions = ({ navigation }) => {
    let hideNavigateBar = navigation.getParam('hideNavigateBar')
        return {
         title: '项目全景',
         headerBackTitle: null,
         header: hideNavigateBar,
       }
   }

   //Interactive Data

   constructor(props) {
       super(props);
       this.state = {
        url: URLS['EstatProjectInfo']
       }
     };

   //Life Cycle
  componentWillMount() {
    
   }

   componentDidMount() {

   }

   componentWillUnmount() {

   }

   //SubRenders

   //Render
   render() {
       return super.render()
     }


   //Action && Handeler

   //UserFunction
   webViewDidLoad(){
        super.webViewDidLoad()
        const { goBack, setParams } = this.props.navigation;
        setParams({hideNavigateBar: null})
     }

   //NetWorks


}

//Styles
const styles = StyleSheet.create({

})