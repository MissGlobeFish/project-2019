
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SaleAnalyzeIndexPage from './SaleAnalyzeIndexPage'

export default class SaleAnalyzeDetailPage extends SaleAnalyzeIndexPage {


    componentWillMount() {
        const { getParam } = this.props.navigation
        this.startDate = getParam("startDate")
        this.endDate = getParam("endDate")
        this.state.userId = getParam("userId")
        //加载配置数据
        this.state.filtrateChoiceContent = getParam("filtrateChoiceContent")
        this.state.authorityDic = getParam("authorityDic")
    }

    componentDidMount() {
        const { setParams } = this.props.navigation;
        setParams({
            filtrateBtnTapped: this.filtrateBtnTapped.bind(this),
            dateSelectBtnTapped: this.dateSelectBtnTapped.bind(this),
            startDate: this.startDate,
            endDate: this.endDate
        })
       
        this.loadMainData()
    }

    /**
     * 重写 筛选框选择完成的回调方法，不做存储
     *
     * @param {*} selectedItems 选择的项目
     * @memberof SaleAnalyzeDetailPage
     */
    filtrateDidSelected(selectedItems) {
        //二级页面不做存储
        // PersistanceManger.ShareInstance().saleAnalyzeIndexs = this.state.filtrateChoiceContent
        this.loadMainData()
    }

}

//Styles
const styles = StyleSheet.create({

})