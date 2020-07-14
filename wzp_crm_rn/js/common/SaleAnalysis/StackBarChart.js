/**
 * StackBarChart --- 堆叠柱状图
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types'
import Echarts from 'native-echarts';

export default class StackBarChart extends Component {

    static propTypes = {
        data: PropTypes.any,
        containerStyle: PropTypes.any,
        showNameLabel: PropTypes.bool,
        didSelectDetailBtnAtIndex: PropTypes.func
    }
    static defaultProps = {
        //数据格式为对象 或 数组
        data: [{
            indexName: '下单金额',
            indexCodes: ['',''],
            legendNames: ['',''],
            count: '-----',
            list: [
                // {
                //     name: '成都军团',
                //     value1: Math.floor((Math.random()*100)+1),
                //     value2: Math.floor((Math.random()*100)+1),
                //     id: 'chengdu'
                // }
            ]
        }],
        showNameLabel: true,
        containerStyle: {},
        didSelectDetailBtnAtIndex: (index, item) => { }
    };

    constructor(props) {
        super(props)
        this.state = {
            changeBtnSelect: false,
        }
    }


    chartOptionsFactory() {
        return {
            title: {
                text: `${this.getCurrentDataSouce().indexName}排行榜`,
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var itemName = params[0].name
                    var amount1 = (params[1].value).toFixed(2)*1
                    var amount2 = (params[2].value).toFixed(2)*1
                    return ` ${itemName} : <br/>
                    ${params[1].seriesName}: ${amount1}万  <br/>
                    ${params[2].seriesName}: ${amount2}万  <br/>
                    ${params[1].seriesName}率:${(amount1/(amount1+amount2)*100).toFixed(1)} ${"%"} `
                },
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                //标题
                data: this.getCurrentDataSouce().list.map((item) => {
                    return item.name
                }),
                scale: true,
                axisLabel: {
                    formatter: function (value, index) {
                        return value.replace("地产", "").replace("团队", "")
                    },
                    inside: false,
                    interval: 0,//标签间隔，默认为自动，设置 0 显示所有标签
                    rotate: 40,
                    textStyle: {
                        fontSize: 11
                        // color: 'res'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                // name: "万",
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            legend: {
                show: true,
                // type: 'scroll',
                orient: 'horizontal',
                left: 10,
                top: 30,
                bottom: 20,
                data: this.getCurrentDataSouce().legendNames
            },
            series: [
                { // For shadow
                    type: 'bar',
                    itemStyle: {
                        normal: { color: 'rgba(0,0,0,0.05)' }
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    //柱状图背景阴影
                    data: this.getShowdDataList(),
                    animation: false
                },
                {
                    name: this.getCurrentDataSouce().legendNames[0],
                    type: 'bar',
                    stack: 'one',
                    itemStyle: {
                        normal: { color: this.colorOfBars()[0] }
                    },
                    data: this.getCurrentDataSouce().list.map(item => item.value1)
                },
                {
                    name: this.getCurrentDataSouce().legendNames[1],
                    type: 'bar',
                    stack: 'one',
                    itemStyle: {
                        normal: { color: this.colorOfBars()[1] }
                    },
                    data: this.getCurrentDataSouce().list.map(item => item.value2)
                }
            ],
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: 0,
                max: this.getMaxValue(),
                // text: ['High Score', 'Low Score'],
                show: false,
                seriesIndex: 1,
                inRange: {
                    //柱状图颜色
                    // color: ['#1C7589', '#46A7FD'],
                    // colorSaturation: [1, 0.1]
                    // color: this.colorOfBars()
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    }


    render() {
        const { containerStyle, data, showNameLabel, ...attributes } = this.props
        const { changeBtnSelect } = this.state
        let isArray = Array.isArray(data)
        return (
            <View style={[styles.container, containerStyle]}>
                <Echarts {...attributes} ref={e => this.chart = e} option={this.chartOptionsFactory()} onPress={this.detailBtnDidTapped.bind(this)} />
                {/* 切换按钮 */}
                {isArray && (
                    <TouchableOpacity style={[{ flexDirection: 'row' }, styles.changeBtn]} onPress={() => { this.setState({ changeBtnSelect: !changeBtnSelect })}}>
                        <Image source={require('../../res/imgs/change-icon.png')} style={{ width: 10, height: 10, marginTop: 2, marginRight: 2 }}></Image>
                        <Text>{changeBtnSelect ? "区域" : "城市"}</Text>
                    </TouchableOpacity>
                )}
                {/* 底标题 */}
                {showNameLabel && (
                    <View style={styles.nativeViewBox}>
                        <Text style={styles.pieTitleText}>{this.getCurrentDataSouce().indexName}率：</Text>
                        <Text style={styles.pieContentText}>{`${(this.getCurrentDataSouce().count).toFixed(2)} %`}</Text>
                    </View>
                )}

            </View>
        )
    }


    colorOfBars() {
        switch (this.getCurrentDataSouce().indexCodes[0]) {
            case 'myOrder':
                return ['#59a0d5', '#E15457']
                break;
            case 'receive':
                return ['#59a0d5', '#E15457']
                break;
            default:
                return ['#59a0d5', '#E15457']
                break;
        }
    }

    /**
     * 多数据时做数据切换
     *
     * @memberof StackBarChart
     */
    getCurrentDataSouce() {
        const { data } = this.props
        const { changeBtnSelect } = this.state
        var resulet = {}
        let isArray = Array.isArray(data)
        //单一对象格式
        if (!isArray) {
            resulet = data
        } else if (data.length == 1) {
            //多数据格式
            resulet = data[0]
        } else if (!changeBtnSelect) {
            resulet = data[0]
        } else {
            resulet = data[1]
        }
        
        //校验空数据
        if (resulet == undefined || !resulet.list) {
            resulet = {list: []}
        }
        return resulet
    }

    getMaxValue() {
        var max = 0
        this.getCurrentDataSouce().list.forEach(item => {
            var amount = item.value1 + item.value2
            max = max < amount ? amount : max
        });
        return max;
    }

    getShowdDataList() {
        var max = this.getMaxValue()
        var dataList = []
        this.getCurrentDataSouce().list.forEach(item => {
            dataList.push(max)
        });
        return dataList;
    }

    detailBtnDidTapped(e) {
        const { didSelectDetailBtnAtIndex } = this.props
        console.log("柱状图点击",e.dataIndex, this.getCurrentDataSouce().list[e.dataIndex])
        didSelectDetailBtnAtIndex(this.getCurrentDataSouce().list[e.dataIndex].code, this.getCurrentDataSouce().list[e.dataIndex])
    }

}

const styles = StyleSheet.create({

    container: {
        marginBottom: 10,
        width: "100%",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#E8E8E8',
        paddingBottom: 10,
        paddingTop: 10
    },
    nativeViewBox: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieTitleText: {
        fontFamily: "PingFangSC-Medium",
        fontSize: 24,
        color: "#353535"
    },
    pieContentText: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 20,
        color: "#353535",
    },
    changeBtn: {
        position: 'absolute',
        height: 40,
        top: 20,
        right: 0,
        paddingRight: 20
    }

});
