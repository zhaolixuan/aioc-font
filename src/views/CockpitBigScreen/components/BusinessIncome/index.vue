<template>
  <div class="BusinessIncome_wrap">
    <div class="card_wrap">
      <norm title="光路质量" :icon="1"/>
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
      option.series[0].data = this.infor.value2 // 零售额
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
