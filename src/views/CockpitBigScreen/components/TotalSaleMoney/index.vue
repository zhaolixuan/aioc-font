<template>
  <div class="TotalSaleMoney_wrap">
    <div class="card_wrap">
      <norm title="终端系统状态" :icon="1" />
    </div>
    <div class="scroll">
      <div ref="canvasChart" style="height:2rem;width:50%"></div>
      <div ref="canvasChart1" style="height:2rem;width:50%"></div>
    </div>
  </div>
</template>
<script>
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
// import echarts from 'echarts'
export default {
  mixins: [initChart],
  name: 'TotalSaleMoney',
  components: { norm },
  props: ['infor', 'flag'],
  data() {
    return {
      timer: null,
      defaultOptions,
      newName: [],
      newValue: []
    }
  },
  mounted() {
    
    this.chart1 = this.$echarts.init(this.$refs.canvasChart1)
    this.chart1.setOption(this.computedOptions)
    // let option = this.defaultOptions
    this.timer = setInterval(() => {
      this.chart.setOption({
        series: [
          {
            data: [
              {
                value: +(Math.random() * 100).toFixed(0)
              }
            ]
          }
        ]
      });
      this.chart1.setOption({
        series: [
          {
            data: [
              {
                value: +(Math.random() * 100).toFixed(0)
              }
            ]
          }
        ]
      });
    }, 5000)
  },
  destroyed() {
    clearInterval(this.timer = null)
  },
  watch: {
    infor: {
      deep: true,
      handler() {
        this.chart.setOption(this.computedOptions)
      }
    },
    flag: {
      handler() {
        this.chart.setOption(this.computedOptions)
      }
    }
  },
  methods: {},
  computed: {
    computedOptions() {
      let option = this.defaultOptions
      return option
      // option.yAxis[0].data = this.infor.newName.slice(0, 5) || []
      // option.yAxis[1].data = this.infor.newValue.slice(0, 5) || []
      // option.xAxis.max = Math.ceil(Math.max(...this.infor.newValue))
      // option.series[0].data = this.infor.newValue.slice(0, 5) || []
      // return option
    }
  }
}
</script>
<style lang="less" scoped>
.TotalSaleMoney_wrap {
  height: 25%;

  .card_wrap {
    margin-bottom: 0.12rem;
  }

  .pmBox {
    margin-top: 0.12rem;
    display: flex;
    font-size: 12px;

    .item {
      flex: 1;
      display: flex;
      color: #fff;
      margin-left: 0.2rem;

      .databox {
        margin-left: 0.08rem;

        .name {
          color: #82bcf1;
        }
      }
    }

    .item:first-child {
      flex: 1.2;
      margin-left: 3%;
    }
  }

  .scroll {
    display: flex;
    
  }
}</style>
