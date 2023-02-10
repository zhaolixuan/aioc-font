<template>
  <div class="NoPhysicalOnlineSales_wrap">
    <div class="card_wrap">
      <norm title="非实物行业网络零售额分布(万元)" :icon="3"/>
    </div>
    <div class="scroll">
      <div ref="canvasChart" style="height:2rem;width:100%"></div>
    </div>
  </div>
</template>
<script>
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
export default {
  mixins: [initChart],
  name: 'NotGoodNetWork',
  components: { norm },
  props: ['infor'],
  data () {
    return {
      defaultOptions
    }
  },
  mounted () {},
  watch: {
    infor: {
      deep: true,
      handler () {
        this.chart.setOption(this.computedOptions)
      }
    }
  },
  methods: {},
  computed: {
    computedOptions () {
      let option = this.defaultOptions
      option.series[0].data = this.infor.value || []
      option.xAxis.data = this.infor.name || []
      return option
    }
  }
}
</script>
<style lang="less" scoped>
.NoPhysicalOnlineSales_wrap {
  width: 100%;
  margin-left: 0.6rem;
  box-sizing: border-box;
  height: 25%;
}
</style>
