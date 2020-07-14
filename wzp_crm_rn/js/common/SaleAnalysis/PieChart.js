/**
 * PieChart --- 饼状图
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import Echarts from 'native-echarts';

export default class PieChart extends Component {

    static propTypes = {
        data: PropTypes.object,
        containerStyle: PropTypes.any,
        showNameLabel: PropTypes.bool,
        didSelectDetailBtnAtIndex: PropTypes.func
    }
    static defaultProps = {
        data: {
            indexName: 'XXX',
            count: '-----',
            list: [
                {
                    name: '--',
                    value: 1,
                    id: 'testId'
                }
            ]
        },
        showNameLabel: true,
        containerStyle: {},
        didSelectDetailBtnAtIndex: (index, item) => { }
    };

    constructor(props) {
        super(props)
        this.state = Object.assign({}, this.state)
    }


    chartOptionsFactory() {
        return {
            title: {
                text: '',
                // show: false,
                x: 'right'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} <br/>{d}%"
            },
            legend: {
                show: false,
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: this.dataFilter().map(item => item.name),
                // selected: [{ "1": false }, { "2": false }, { "3": false }]
            },
            series: [
                {
                    selectedMode: 'single',//single、multiple 单选多选
                    name: '',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: this.dataFilter(),
                    // roseType: 'radius',
                    // itemStyle: {
                    //     emphasis: {
                    //         shadowBlur: 10,
                    //         shadowOffsetX: 0,
                    //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //     }
                    // }
                }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    }

    dataFilter() {
        const { data } = this.props
        // console.log("数据检查", data.list)
        var defaultData = []//[{ name: '无数据', value: 0 }]
        if (!Array.isArray(data.list) || data.list.length == 0) {
            return defaultData
        } else {
            var result = data.list.filter((item) => {
                return item.value != 0
            })
            return result.length != 0 ? result : defaultData
        }
    }


    render() {
        const { containerStyle, data, showNameLabel, ...attributes } = this.props
        return (
            <View style={[styles.container, containerStyle]}>
                <Echarts {...attributes} option={this.chartOptionsFactory()} onPress={this.detailBtnDidTapped.bind(this)} />
                {showNameLabel && (
                    <View style={styles.nativeViewBox}>
                        <Text style={styles.pieTitleText}>{data.indexName}：</Text>
                        <Text style={styles.pieContentText}>{`${(data.count / 10000).toFixed(2)} 万`}</Text>
                    </View>
                )}

            </View>
        )
    }

    detailBtnDidTapped(e) {
        const { didSelectDetailBtnAtIndex, data } = this.props
        didSelectDetailBtnAtIndex(e.data.code, data)
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
        paddingBottom: 10
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
    detailBtn: {
        position: 'absolute',
        height: 40,
        bottom: 0,
        right: 0,
        paddingRight: 10,
    },
    detailBtnText: {
        width: "100%",
        height: "100%",
        textAlign: 'center',
        fontFamily: "PingFangSC-Regular",
        fontSize: 14,
        lineHeight: 40,
        color: "#808080"
    }

});
