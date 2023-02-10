<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Radartwo',
  props: {
    id: {
      type: String,
      default: ''
    },
    option: {
      type: Object
    },
    zwfwProportion: {
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
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
        },
         tooltip: {
	        show: true,
	        trigger: "item"
	      },
         legend: {
	        show: true,
	        icon: "circle",
	        right: '20%',
	        top: 'center',
	        orient: "vertical",
	        itemGap: 30,
	    },
        radar: {
	        center: ["35%", "50%"],
          radius: "70%",
          name: {
            textStyle: {
                fontSize: 12,
                color: '#A8E7F6',
            }
          },
          nameGap:5,
	        startAngle: 90,
	        splitNumber: 4,
	        shape: "circle",
	        splitArea: {
	            areaStyle: {
	                color: ["transparent"]
	            }
	        },
	        axisLabel: {
	            show: false,
	            fontSize: 12,
	            color: "#000",
				fontStyle: "normal",
	            fontWeight: "normal"
	        },
	        axisLine: {
	            show: true,
	            lineStyle: {
	               // type:"dashed",
	                color: "rgba(168,231,246,0.51)"
	            }
	        },
	        splitLine: {
	            show: true,
	            lineStyle: {
	               // type:"dashed",
	                color: "rgba(168,231,246,0.51)"
	            }
	        },
	        indicator: this.zwfwProportion.indicator
	    },
       series: [{
	        name: "三次产业结构",
	        type: "radar",
	        symbol: "circle",
			symbolSize: 0,
	        areaStyle: {
	            normal: {
	                color: " rgba(246,253,255,0.13)"
	            }
	        },
	        lineStyle: {
	            normal: {
	                color: "#B8F1FF",
	                width: 1
	            }
	        },
	        data: [
            {
              value: this.zwfwProportion.value,
            }
	        ]
	    }, {
	        name: "",
	        type: "radar",
	        symbol: "circle",
	        symbolSize: 0,
	        areaStyle: {
	            normal: {
	                "color": "rgba(246,87,27, 0.15)"
	            }
	        },
	        lineStyle: {
	            normal: {
	                color: "#fc642e",
	                width: 1,
	            }
	        },
	        data: [
            {
              value: this.zwfwProportion.value2,
            }
	        ]
	    }]
      }
    }
  }
}
</script>

<style scoped>

</style>
