<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Column',
  props: {
    id: {
      type: String,
      default: ''
    },
    option: {
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
          left:40,
          top: 20,
          bottom:20,
          right:25
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
          data: ['市场规模/亿万', '环比']
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              textStyle: {
                color: 'rgba(165,220,255,.7)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(165,220,255,.29)'
              }
            },
            data: ['2015', '2016', '2017', '2018', '2019', '2020']
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 8000,
            min: 0,
            interval: 2000,
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
          },
          {
            type: 'value',
            max: 80,
            min: 0,
            interval: 20,
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
              show: false
            }

          }
        ],
        series: [
          {
            name: '市场规模/亿万',
            type: 'bar',
            barWidth:15,
            data: [1800, 2000, 2400, 3000, 4200, 6000],
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
          },
          {
            name: '环比',
            type: 'line',
            symbol: 'circle',
            yAxisIndex: 1,
            smooth: true,
            data: [0, 17, 17, 17, 57.8, 57.8],
            lineStyle: {
              color: 'rgba(67,197,228,1)',
              normal: {
                width: 2,
                shadowColor: 'rgba(8,20,39,1)',
                shadowBlur: 10,
                shadowOffsetY: 3
              }
            },
            itemStyle: {
              color: 'rgba(67,198,230,1)',
              shadowColor: 'rgba(0,0,0,0.5)',
              shadowBlur: 2
            },
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
