<template>
  <div class="BusinessIncome_wrap">
    <div class="card_wrap">
      <norm title="光路质量" :icon="1" />
      <el-button size="small" class="warningBtn" @click="handelrOpenShi">{{ openShishi ? '关闭实时监控': '开启实时监控' }}</el-button>
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
    }
  },
  data() {
    return {
      defaultOptions,
      openShishi:true
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
          series:  this.infor.value2

        })
      }
    }
  },
  methods: {
    handelrOpenShi(){
      this.openShishi = !this.openShishi
      this.$emit('handelrOpenShi', this.openShishi )
      
    }
  },
  computed: {
    computedOptions() {
      let option = this.defaultOptions
      option.series=this.infor.value2 
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
    position: relative;

.warningBtn {
  position: absolute;
  right: 15%;
  top: 0.1rem;
}
  }
}
</style>
