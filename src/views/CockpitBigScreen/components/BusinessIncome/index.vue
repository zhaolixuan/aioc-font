<template>
  <div class="BusinessIncome_wrap">
    <div class="card_wrap">
      <norm :title="businessIncometTitle" :icon="1" />
      <el-button v-if="buttonShow" size="small" class="warningBtn" @click="handelrCheck">查看大图</el-button>
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
  name: 'BusinessIncome',
  components: { norm },
  props: {
    infor: {
      type: Object
    },
    buttonShow: {
      type: Boolean,
      default: true
    }
  },
  computed:{
    businessIncometTitle () {
      return this.$store.state.businessIncometTitle || ''
    },
    computedOptions() {
      let option = this.defaultOptions
      option.series = this.infor.value2
      option.xAxis.data = this.infor.name
      if (option.xAxis.data.length == 1) {
        option.xAxis.data.push('')
      }
      return option
    }
  },
  data() {
    return {
      defaultOptions,
    }
  },
  mounted() {
    //   console.log('更改代码查看变化');
  },
  watch: {
    infor: {
      deep: true,
      handler() {
        // this.chart.setOption(this.computedOptions)
        this.chart.setOption({
          xAxis: {
            data: this.infor.name
          },
          series: this.infor.value2

        })
      }
    }
  },
  methods: {
    handelrCheck() {
      this.$emit('handelrCheck')
    },
  },
}
</script>
<style lang="less" scoped>
.BusinessIncome_wrap {
  height: 25%;

  .card_wrap {
    margin-bottom: .12rem;
    position: relative;

    .warningBtn {
      position: absolute;
      right: 15%;
      top: 0.15rem;
      border: none;
      color: #fff;
      background: transparent;
      cursor: pointer;
    }
  }
}
</style>
