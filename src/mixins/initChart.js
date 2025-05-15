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
  mounted () {
    this.chart = this.$echarts.init(this.$refs.canvasChart)
    this.chart.setOption(this.computedOptions)
    window.addEventListener('resize', this.handleResizeChart)
  },
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
    handleResizeChart () {
      // if (!this.chart) return
      this.$nextTick(() => {
        this.chart.setOption(this.computedOptions)
        this.chart.resize()
      })
    }
  }
}
