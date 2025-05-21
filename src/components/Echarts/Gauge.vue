<template>
  <div :id="id" :class="clazz" :style="option && option.style||''"></div>
</template>

<script>
export default {
  name: 'Gauge',
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    clazz: {
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
          left: 0, top: 0, right: 0, bottom: 0
        },
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            radius: '170%',
            center: ['45%', '90%'],
            axisLine: {
              lineStyle: {
                width: 13,
                color: [
                  [this.value / 100, new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0, color: 'rgba(36,189,186,1)'}, {offset: 1, color: 'rgba(69,231,148,1)'}])],
                  [1, '#162841']
                ]
              }
            },
            axisTick: { show: false },
            axisLabel: {
              color: '#666',
              show: true,
              padding: [20, 0, 0, 0],
              fontSize: 12,
              distance: -20,
              formatter (value) {
//                if (value === 0 || value === 100) {
//                  return value
//                }
              }
            },
            splitLine: { show: false },
            pointer: {
              show: true,
              width: '2%',
              length: '115%'
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0, color: 'rgba(36,189,186,1)'}, {offset: 1, color: 'rgba(69,231,148,1)'}])
            },
            title: {
              fontSize: 12,
              color: '#5d9cec',
              offsetCenter: [0, '50%']
            },
            detail: {
              show: true,
              color: '#DDF2FF',
              fontSize: 16,
              offsetCenter: [0, '-25%'],
              formatter: function (value) {
                return value + '%'
              }
            },
            data: [{
              value: this.value,
//              name: 'GDP增速'
            }]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
