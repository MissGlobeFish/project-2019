<template>

  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
  },
  data() {
    return {
      chart: null,
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
    initChart() {
      let self = this;
      this.chart = echarts.init(this.$el, 'macarons')
      
      this.chart.setOption({
        title : {
            text: '本周停车统计',
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['部门']
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['11-20', '11-21', '11-22', '11-23', '11-24', '11-25', '11-26'],
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: '停车数 ',
                type: 'bar',
                data: [56, 49, 56, 71, 86, 32, 94],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
        ],
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 0,
            max: 100,
            show: false,
            dimension: 1,
            inRange: {
                color: ['#D7DA8B', '#E15457']
            }
        },
      })
      
      //点击事件
      this.chart.on('click', function(params) {
          self.$emit('chartKPIParams', true, params)
      })
    },
  }
}
</script>
