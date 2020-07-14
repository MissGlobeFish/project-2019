/**
 * TransactionDetail  钱包明细 -- 详情页
 */
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Dimensions, TextInput } from 'react-native';
const { width, height } = Dimensions.get('window');

export default class TransactionDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        let title = navigation.getParam('title')
        return {
            title: title,
        };
    };

    infoDic = () => {
        const { getParam } = this.props.navigation
        let data = getParam('data')
        return [
            {
                title: '类型',
                value: data.flowingWater > 0 ? "收入" : "支出"
            },
            {
                title: '时间',
                value: data.createTime
            },
            {
                title: '交易号',
                value: data.orderNumber
            },
            {
                title: '余额',
                value: data.balance + '元'
            },
        ]
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        console.log(this.props.navigation.getParam('data'))
    }


    componentList() {
        let infoList = this.infoDic().map((data) => {
            return ( 
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 6}}  key={data.title}>
                <Text style={[styles.infoTextStyle, {textAlign: 'left'}]}>{data.title}</Text>
                <Text style={[styles.infoTextStyle, {textAlign: 'right'}]}>{data.value}</Text>
            </View>
            )
        })
        return (
            <View style={{ width: "100%", paddingTop: 10}}>
            {infoList}
            </View>
        )
    }

    render() {
        const { navigate, getParam } = this.props.navigation
        let data = getParam('data')
        return (
            <View style={{ flex: 1, alignItems: 'center', paddingLeft: '7.5%', paddingRight: '7.5%', backgroundColor: '#ffffff', }}>
                <View style={styles.flowingWaterBox}>
                    <Text style={{ fontFamily: 'PingFangSC-Regular', fontSize: 16, color: '#323232' }}> 出账金额 </Text>
                    <Text style={{ fontFamily: 'PingFangSC-Regular', fontSize: 52, color: '#323232' }}>
                        {data.flowingWater > 0 ? '+' + data.flowingWater : data.flowingWater}
                    </Text>
                </View >
                { this.componentList() }
            </View >
        );
    }


}

const styles = StyleSheet.create({
    flowingWaterBox: {
        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3',
        width: '100%',
        alignItems: 'center',
        paddingTop: 44,
        paddingBottom: 32,
    },
    infoTextStyle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        color: '#323232'
    }
});
