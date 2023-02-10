<template>
  <div class="TrueTooTen_wrap">
    <div class="card_wrap">
      <norm title="实物行业网络零售额分布" :icon="2" />
    </div>
    <div class="echartsBox">
      <div ref="canvasChart" style="height:2rem;width:100%"></div>
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
// import interval from '@/common/interval.js'
// import api from '@/api/api'
export default {
  mixins: [initChart],
  name: 'TrueTooTen',
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
      option.legend[0].data = this.infor.name.slice(0, 5) || []
      option.legend[1].data = this.infor.name.slice(-5) || []
      let newData = []
      this.infor.data.map((item, k) => {
        var obj = {
          value: item.materialNetworkSales,
          name: item.oneLevelName
        }
        newData.push(obj)
      })
      option.series[0].data = newData
      return option
    }
  }
}
</script>
<style lang="less" scoped>
.TrueTooTen_wrap{
  height: 25%;
  .card_wrap {
    margin-bottom: .1rem;
  }
  .echartsBox {
    height: 2rem;
    width: 100%;
    background: url('../../assets/top10.png') no-repeat;
    background-size: 2rem 100%;
    margin-left: 10%;
  }
}
</style>
