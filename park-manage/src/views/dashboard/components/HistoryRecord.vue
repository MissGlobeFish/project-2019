<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { historyRecord } from '@/api/dashboard'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '150px'
    }
  },
  data() {
    return {
      chart: null,
      chartData: {
        date: [],//横坐标
        inCount: [],//入场数
        newInCount: [],//新增数量
        outCount: [],//出场数
      },
      dashboardForm: {//停车统计BI查询初始数据
        startTime: this.getBeforeDate(7),
        endTime: (new Date()).getTime(),
      },
      pickerOptions: {
        disabledDate:(time) => {
          if( this.dashboardForm.startTime != ""){
            return time.getTime() < this.dashboardForm.startTime;
          }else {
            return time.getTime() > Date.now();
          }
        }
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    //开始时间 
    startTimeChange(val){
      this.dashboardForm.startTime = (new Date(val)).getTime();
    },
    //结束时间
    endTimeChange(val){
      this.dashboardForm.endTime = (new Date(val)).getTime();
    },
    //日期时间计算
    getBeforeDate(n) {
      var s;
      var n = n;
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if(day <= n) {
          if(mon > 1) {
              mon = mon - 1;
          } else {
              year = year - 1;
              mon = 12;
          }
      }
      d.setDate(d.getDate() - n);
      return d.getTime();
    },
    initChart() {
      historyRecord({parkId:2,queryCreateDateBegin:'2019-11-01',queryCreateDateEnd:'2019-11-20'}).then(response => {
        this.chartData = response.data;
        console.log(this.chartData)

        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          backgroundColor: '#394056',
          title: {
            top: 20,
            text: '停车统计历史',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '1%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['新增数量', '进场', '出场'],
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            top: 100,
            left: '2%',
            right: '4%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.chartData.date
          }],
          yAxis: [{
            type: 'value',
            name: '停车数( 辆 )',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          series: [{
            name: '新增数量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#d68262'
                }, {
                  offset: 0.8,
                  color: '#ffe'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: '#d68262',
                borderColor: '#d68262',
                borderWidth: 12
              }
            },
            data: this.chartData.newInCount
          },{
            name: '进场',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(88,160,253,0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(88,160,253,0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(88,160,253,1)',
                borderColor: 'rgba(88,160,253,1)',
                borderWidth: 12
              }
            },
            data: this.chartData.inCount
          },{
            name: '出场',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12
              }
            },
            data: this.chartData.outCount
          }]
        })
      })
    },
  }
}
</script>
