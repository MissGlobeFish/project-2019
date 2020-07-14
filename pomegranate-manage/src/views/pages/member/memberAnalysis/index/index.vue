<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>会员分析</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    
    <template>
      <div class="">

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;会员分析</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面直观看到相关数据</span>
          </div>
        </div>

        <div style="margin-top:20px;">&nbsp;截止到 2019.05.23</div><hr>

        <div class="echartBox">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div class="charts">
                <div class="chartsTop">行业分布</div>
                <div id="business"></div>
            </div>  
            <div class="charts">
                <div class="chartsTop">年龄分布</div>
                <div id="age"></div>
            </div>
            <div class="charts">
                <div class="chartsTop">区域分布</div>
                <div id="area"></div>
            </div>
            <div class="charts">
                <div class="chartsTop">会员分布</div>
                <div id="member"></div>
            </div>
        </div>
      </div>
    </template>
   
  </d2-container>
</template>
<script>
import https from '../../../../../https.js'
export default {
    components: {
        
    },
    data () {
        return {
            filename: __filename,
            businessOption: {
                title : '',
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['旅游','教育','餐饮','房地产','互联网']
                },
                series : [
                    {
                        name: '行业分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'旅游'},
                            {value:310, name:'教育'},
                            {value:234, name:'餐饮'},
                            {value:456, name:'房地产'},
                            {value:948, name:'互联网'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            ageOption: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['20岁以下','20岁-30岁','30岁-40岁','40岁-50岁','50岁以上']
                },
                series: [
                    {
                        name:'年龄分布',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'20岁以下'},
                            {value:310, name:'20岁-30岁'},
                            {value:976, name:'30岁-40岁'},
                            {value:754, name:'40岁-50岁'},
                            {value:234, name:'50岁以上'},
                        ]
                    }
                ]
            },
            areaOption: {
                    title: '',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年', '2012年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['武汉','成都','深圳','广州','上海','北京']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
            },
            memberOption: {
                legend: {},
                tooltip: {},
                dataset: {
                    source: [
                        ['product', '研习', '研学', '研修'],
                        ['1月', 43.3, 85.8, 93.7],
                        ['2月', 83.1, 73.4, 55.1],
                        ['3月', 86.4, 65.2, 82.5],
                        ['4月', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            },
        }
    },
    mounted(){
        this.businessCharts();
        this.ageCharts();
        this.areaCharts();
        this.memberCharts();
    },
    created() {
        
    },
    methods: {
        /* 行业分布 */
        businessCharts(){
            // 基于准备好的dom，初始化echarts实例
            let businessChart = this.$echarts.init(document.getElementById('business'))
            // 绘制图表
            businessChart.setOption(this.businessOption);
        },
        /* 年龄分布 */
        ageCharts(){
            // 基于准备好的dom，初始化echarts实例
            let ageChart = this.$echarts.init(document.getElementById('age'))
            // 绘制图表
            ageChart.setOption(this.ageOption);
        },
        /* 区域分布 */
        areaCharts(){
            // 基于准备好的dom，初始化echarts实例
            let areaChart = this.$echarts.init(document.getElementById('area'))
            // 绘制图表
            areaChart.setOption(this.areaOption);
        },
        /* 会员分布 */
        memberCharts(){
            // 基于准备好的dom，初始化echarts实例
            let memberChart = this.$echarts.init(document.getElementById('member'))
            // 绘制图表
            memberChart.setOption(this.memberOption);
        },
    }
}
</script>

<style lang="scss">
    .containerBox{
        min-height: 600px;
    }
    .echartBox{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        overflow: hidden;
        .charts{
            width: 45%;
            margin-top: 30px;
        }
        .chartsTop{
            height: 60px;
            line-height: 60px;
            border: 1px solid #666;
            border-radius: 6px;
            padding: 0 20px;
        }
        #business,#age,#area,#member{
            height: 600px;
        }
    }
</style>
