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
      default: '70%'
    },
    height: {
      type: String,
      default: '350px'
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
            text: '员工考核结果',
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['员工']
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['王晶','子豪','彭双','青天','超琼','代阳','黎明']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: '综合得分 ',
                type: 'bar',
                data: [2.0, 9.0, 3.2, 5.6, 6.7, 5.6, 2.2,],
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
            max: 10,
            show: false,
            dimension: 1,
            inRange: {
                color: ['#D7DA8B', '#E15457']
            }
        },
      })
      
      //点击事件
      this.chart.on('click', function(params) {
          self.$emit('innerchartKPIParams', true, params)
      })
    },
  }
}
</script>
