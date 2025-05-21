<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    id: {
      type: String,
      default: ''
    },
    option: {
      type: Object
    },
    barData: {
      type: Object
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeHandle)
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        if (this.chart) {
          this.chart.setOption(this.defaultOption())
        } else {
          this.init()
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.defaultOption())
      window.addEventListener('resize', this.resizeHandle)
    },
    resizeHandle () {
      this.chart.resize()
    },
    defaultOption () {
      return {
        grid: {
          top: 20,
          bottom: 25,
          right: 15
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          show: false
        },
        legend: {
          show: false,
          data: ['核心技术人员']
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              textStyle: {
                color: 'rgba(165,220,255,.7)'
              },
              interval: '0'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(165,220,255,.29)'
              }
            },
            data: this.barData.xName // x轴值
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: this.barData.yMax, // y轴最大值
            min: this.barData.yMin, // y轴最小值
            // interval: this.barData.yInterval, // y轴间距
            axisLabel: {
              textStyle: {
                color: 'rgba(165,220,255,.7)'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: 'rgba(165,220,255,.29)'
              }
            }
          }
          // {
          //   type: 'value',
          //   max: 12,
          //   min: 0,
          //   // interval: 10,
          //   axisLabel: {
          //     show: false,
          //     textStyle: {
          //       color: 'rgba(165,220,255,.7)'
          //     }
          //   },
          //   axisLine: {
          //     show: false
          //   },
          //   axisTick: {
          //     show: false
          //   },
          //   splitLine: {
          //     show: false
          //   }
          // }
        ],
        series: [
          {
            name: '核心技术人员',
            type: 'bar',
            barWidth: 12,
            data: this.barData.xData,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(22,113,168,0.5)'},
                    {offset: 1, color: 'rgba(72,206,235,0.5)'}
                  ]
                )
              },
              emphasis: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(22,113,168,0.9)'},
                    {offset: 1, color: 'rgba(72,206,235,0.9)'}
                  ]
                )
              }
            }
          }
          // {
          //   name: '环比',
          //   type: 'line',
          //   symbol: 'circle',
          //   yAxisIndex: 1,
          //   smooth: true,
          //   // data: [1.5, 4.5, 3.8, 6.4, 5.7],
          //   lineStyle: {
          //     color: 'rgba(67,197,228,1)',
          //     normal: {
          //       width: 2,
          //       shadowColor: 'rgba(8,20,39,1)',
          //       shadowBlur: 10,
          //       shadowOffsetY: 3
          //     }
          //   },
          //   itemStyle: {
          //     color: 'rgba(67,198,230,1)',
          //     shadowColor: 'rgba(0,0,0,0.5)',
          //     shadowBlur: 2
          //   },
          //   markPoint: {
          //     symbolSize: 30,
          //     symbol: 'path://M783.136 180.064C771.872 168.832 757.152 160 742.4 160L281.6 160C266.848 160 252.128 168.832 240.864 180.064 229.632 191.328 224 209.248 224 224l0 460.8c0 14.752 5.632 26.272 16.864 37.536C252.128 733.568 266.848 736 281.6 736l115.2 0 115.2 115.2 115.2-115.2 115.2 0c14.752 0 29.472-2.432 40.736-13.664C794.368 711.072 800 699.552 800 684.8L800 224C800 209.248 794.368 191.328 783.136 180.064z',
          //     data: [
          //       {
          //         type: 'max',
          //         name: '最大值',
          //         symbolOffset: [0, -15]
          //       }
          //     ]
          //   }
          // }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
