/**
 * BarChart --- 柱状图
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types'
import Echarts from 'native-echarts';

export default class BarChart extends Component {

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
            indexCode: '',
            count: '-----',
            list: [
                // {
                //     name: '成都军团',
                //     value: Math.floor((Math.random()*100)+1),
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
                // show: false,
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var itemName = params[0].name
                    var amount = (params[1].value).toFixed(2)
                    return ` ${itemName} : ${amount} ${"万"} `
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
                    type: 'bar',
                    data: this.getCurrentDataSouce().list.map(item => item.value)
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
                    color: this.colorOfBars()
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
                        <Text style={styles.pieTitleText}>{this.getCurrentDataSouce().indexName}：</Text>
                        <Text style={styles.pieContentText}>{`${(this.getCurrentDataSouce().count / 10000).toFixed(2)} 万`}</Text>
                    </View>
                )}

            </View>
        )
    }


    colorOfBars() {
        switch (this.getCurrentDataSouce().indexCode) {
            case 'myOrder':
                return ['#D7DA8B', '#E15457']
                break;
            case 'receive':
                return ['#e7f9a8', '#59a0d5']
                break;
            default:
                return ['#D7DA8B', '#E15457']
                break;
        }
    }

    /**
     * 多数据时做数据切换
     *
     * @memberof BarChart
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
            max = max < item.value ? item.value : max
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
    // detailBtn: {
    //     position: 'absolute',
    //     height: 40,
    //     bottom: 0,
    //     right: 0,
    //     paddingRight: 10,
    // },
    // detailBtnText: {
    //     width: "100%",
    //     height: "100%",
    //     textAlign: 'center',
    //     fontFamily: "PingFangSC-Regular",
    //     fontSize: 14,
    //     lineHeight: 40,
    //     color: "#808080"
    // }

});
