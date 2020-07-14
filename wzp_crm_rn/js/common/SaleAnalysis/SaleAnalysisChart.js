/**
 * SaleAnalysisChart --- 表单输入框
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types'
import Echarts from 'native-echarts';

export default class SaleAnalysisChart extends Component {

  static propTypes = {
    datas: PropTypes.array,
    isHiden: PropTypes.bool
  }
  static defaultProps = {
    datas: [],
    isHiden: false
  };

  constructor(props) {
    super(props)
    this.state = Object.assign({}, this.state)
  }


  chartOptionsFactory() {
    const { datas } = this.props
    return {
      title: { show: false, text: '标题', },
      color: ['#448BFF'],
      //浮窗
      tooltip: {
        trigger: 'axis',
        position: ['40%', 13],
        backgroundColor: '#448BFF',
        // borderColor: '#333',
        // extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        // borderWidth: 1,
        formatter: function (params) {
          var date = new Date(params[0].name / 1);
          var dateString = [(date.getMonth() + 1), date.getDate()].join('-')
          var amount = params[0].value
          return ` ${dateString} : ${amount.toFixed(2)} ${"万"} `
        }

      },
      legend: {
      },
      xAxis: {
        // type: 'time',
        scale: true,
        boundaryGap: false,//两端不留白
        // name: '日期',
        // nameLocation: 'end',
        // show: false,
        // minInterval: 3600,
        data: datas.map((data) => data.timestamp),
        axisLine: {
          lineStyle: {
            opacity: 0, //隐藏线
            color: "#b7b4b7",//线颜色 -- 同步到字体颜色
          }
        },
        axisTick: {
          show: false //隐藏刻度
        },
        axisLabel: {
          color: "#f7f7f7",
          formatter: function (value, index) {
            // 格式化成月/日，只在第一个刻度显示年份
            var date = new Date(value / 1);
            var texts = [(date.getMonth() + 1), date.getDate()];
            if (index === 0) {
              texts.unshift(date.getFullYear());
            }
            return texts.join('/');
          }
        },
        splitLine: {
          //分隔线
          show: false,
        },
      },
      yAxis: {
        // name: "万",
        nameGap: 15,
        // nameTextStyle:{
        //   backgroundColor: 'red',
        //   align: 'lfet',
        //   padding: [0,0,0,100]
        // },
        nameLocation: 'end',
        offset: 0, //y坐标轴偏移量
        axisLine: {
          lineStyle: {
            opacity: 0, //隐藏线
            color: "#b7b4b7",//线颜色 -- 同步到字体颜色
          }
        },
        axisTick: {
          show: false //隐藏刻度
        },
        splitLine: {
          lineStyle: { color: ["#f4f4f4"] }
        }
      },
      series: [{
        // name: '活跃人数',
        type: 'line',
        showSymbol: false,
        symbol: 'circle', //节点标示
        symbolSize: 5,
        smooth: true,
        data: datas.map((data) => data.amount / 10000.00),
        lineStyle: {
          normal: {
            width: 2,
            shadowColor: 'rgba(0,0,0,0.4)',
            shadowBlur: 20,
            shadowOffsetY: 10
          }
        },

      }],
      dataZoom: [
        {   // 这个dataZoom组件，也控制x轴。
          type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
          start: 0,      // 左边在 10% 的位置。
          end: 100         // 右边在 60% 的位置。
        }
      ],
    }
  }


  render() {
    const { isHiden, ...attributes } = this.props
    return (
      <View style={[styles.container, isHiden ? { height: 0, marginBottom: 0 } : null]}>
        <Echarts
          {...attributes}
          option={this.chartOptionsFactory()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    // backgroundColor: 'green',
    marginBottom: 10,
    width: "100%",
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

});
