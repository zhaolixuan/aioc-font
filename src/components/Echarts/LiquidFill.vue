<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
import 'echarts-liquidfill'
export default {
  name: 'LiquidFill',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    option: {
      type: Object,
      default: Object
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
      let _$ = this
      let name = this.name
      let value = this.value
      console.log(_$.option)
      return {
        series: [{
          type: 'liquidFill',
          radius: '95%',
          data: [value],
          name: 'Liquid Fill',
          backgroundStyle: {
            color: _$.option.backgroundStyle.color
          },

          itemStyle: {
            color: _$.option.itemStyle.color,
            opacity: 1,
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          },
          outline: {
            show: true,
            borderDistance: 2,
            itemStyle: {
              color: 'none',
              borderColor: _$.option.outline.borderColor,
              borderWidth: 1
            }
          },
          label: {
            show: true,
            color: '#294D99',
            insideColor: '#fff',
            fontSize: 12,

            align: 'center',
            baseline: 'middle',
            position: 'inside',
            normal: {
              textStyle: {
                fontSize: 12,
                color: '#fff',
                fontFamily: '#Arial'
              },
              formatter: function (value) {
                return name + '\n' + (value.data * 100) + '%'
              }
            }
          }
        }],
        tooltip: {
          show: false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
