export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    dataAxis: {
      type: Array,
      default: () => []
    },
    dataYxis: {
      type: Array,
      default: () => []
    },
    options: {
      type: String
    }
  },
  data () {
    return {
      chart: null
    }
  },
  // mounted () {
  //   console.log('initinitinit',this.computedOptions)
  //   this.chart = this.$echarts.init(this.$refs.businessChart)
  //   this.chart.setOption(this.computedOptions)
  //   window.addEventListener('resize', this.handleResizeChart)
  //   console.log(this.$refs.businessChart,'ooooooooooooooooooooo')
  // },
  destroyed () {
    window.removeEventListener('resize', this.handleResizeChart)
  },
  watch: {
    chartData: {
      deep: true,
      handler (oldVal, newVal) {
        this.handleResizeChart()
      }
    }
  },
  computed: {
    computedOptions () {
      return this.defaultOptions || {}
    }
  },
  methods: {
    initChart(){
      this.chart = this.$echarts.init(this.$refs.businessChart)
      this.chart.setOption(this.computedOptions)
      window.addEventListener('resize', this.handleResizeChart)
    },
    handleResizeChart () {
      // if (!this.chart) return
      this.$nextTick(() => {
        this.chart.setOption(this.computedOptions)
        this.chart.resize()
      })
    }
  }
}
