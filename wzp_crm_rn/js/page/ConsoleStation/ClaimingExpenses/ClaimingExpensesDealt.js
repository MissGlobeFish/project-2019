/**
 * 费用报销单审批页
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native';
import ClaimingExpenses from './ClaimingExpenses'

export default class ClaimingExpensesDealt extends ClaimingExpenses {

    static navigationOptions = ({ navigation }) => {
        let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
        return {
            title: '费用报销单',
            headerBackTitle: null,
            headerRight:
                <TouchableOpacity style={{ marginRight: 23 }}
                    onPress={rightNavigateBtnTapped}
                >
                    <Text style={{ fontSize: 16, color: '#306FFE' }}>处理</Text>
                </TouchableOpacity>
        }
    }

    componentWillMount() {
        const { setParams } = this.props.navigation;
        setParams({
            rightNavigateBtnTapped: () => {
                this.props.navigation.navigate('DealtDetail', { 
                    fid: this.state.fId, 
                    formId: global.formId.expeness
                })
            },
            editEnable: false
        })
    }

}
const styles = StyleSheet.create({


})