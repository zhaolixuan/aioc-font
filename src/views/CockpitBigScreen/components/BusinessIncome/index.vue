<template>
  <div class="BusinessIncome_wrap">
    <div class="card_wrap">
      <norm title="网络零售额发展趋势及增速" :icon="1"/>
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
import interva from '@/views/common/interva.js'
export default {
  mixins: [initChart],
  name: 'BusinessIncome',
  components: { norm },
  props: {
    infor: {
      type: Object
    }
  },
  data () {
    return {
      defaultOptions
    }
  },
  mounted () {
    //   console.log('更改代码查看变化');
  },
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
      option.series[1].data = this.infor.value || []
      let arr = [...this.infor.value]
      let objFirst = interva.intervalFun(arr)
      option.yAxis[1].interval = objFirst.interval
      option.yAxis[1].max = objFirst.max
      option.yAxis[1].min = objFirst.min
      option.series[0].data = arr.fill(NaN, 0, arr.length - 1) || []
      //  零售饿
      option.series[2].data = this.infor.value2 // 零售额
      let obj = interva.intervalFun(this.infor.value2)
      option.yAxis[0].interval = obj.interval
      option.yAxis[0].max = obj.max
      option.xAxis.data = this.infor.name
      if (option.xAxis.data.length == 1) {
           option.xAxis.data.push('')
      }
      return option
    }
  }
}
</script>
<style lang="less" scoped>
.BusinessIncome_wrap {
  height: 25%;
  .card_wrap {
    margin-bottom: .12rem;
  }
}
</style>
