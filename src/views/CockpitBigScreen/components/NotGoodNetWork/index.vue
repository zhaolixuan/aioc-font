<template>
  <div class="NoPhysicalOnlineSales_wrap">
    <div class="card_wrap" @click="handelrClick">
      <norm title="历史报警数量" :icon="1" />
    </div>
    <div class="scroll">
      <div ref="canvasChart" style="height:2rem;width:100%"></div>
    </div>
    <el-dialog title="报警数据" :append-to-body="true" :visible.sync="DialogShow" width="75%">
      <alarm />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DialogShow = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
import alarm from '../alarm'

export default {
  mixins: [initChart],
  name: 'NotGoodNetWork',
  components: { norm, alarm },
  props: ['infor'],
  data() {
    return {
      defaultOptions,
      DialogShow: false
    }
  },
  mounted() { },
  watch: {
    infor: {
      deep: true,
      handler() {
        this.chart.setOption(this.computedOptions)
      }
    }
  },
  methods: {
    handelrClick() {
      this.DialogShow = true
      console.log(1);
    },
  },
  computed: {
    computedOptions() {
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
  box-sizing: border-box;
  height: 25%;
}
</style>
