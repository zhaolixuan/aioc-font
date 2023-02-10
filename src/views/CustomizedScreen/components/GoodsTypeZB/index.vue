<template>
  <div class="GoodsTypeZB_wrap">
    <div class="card_wrap">
      <norm title="实物明星行业零售榜" :icon="1" />
      <div class="tab_wrap">
        <p v-for="item in tabListFirst" :key="item.firstId" @click="handlerTabFirst(item.firstId)" :class="tabsFirstId === item.firstId ? 'left' : ''">
          {{item.title}}
        </p>
      </div>
      <div class="tab_wraps">
        <p v-for="item in tabList" :key="item.id" @click="handlerTab(item.id)" :class="tabsId === item.id ? 'left' : ''">
          {{item.title}}
        </p>
      </div>
    </div>
    <div class="scroll">
      <div ref="canvasChart" style="height:1.8rem;width:100%"></div>
    </div>
  </div>
</template>
<script>
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
import echarts from 'echarts'
import api from '@/api/api'
export default {
  mixins: [initChart],
  name: 'GoodsTypeZB',
  components: { norm },
  props: {},
  data () {
    return {
      defaultOptions,
      title: '',
      tabListFirst: [
        {
          title: '互联网+',
          firstId: 0
        },
        {
          title: 'TOP3',
          firstId: 1
        }
      ],
      tabList: [],
      tabsFirstId: 0,
      tabsId: 0,
      name: [],
      val: []
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.title = this.tabList[0].title
    this.tabsId = 0
  },
  watch: {
    handlerTab: {
      deep: true,
      handler () {
        this.getData()
        this.chart.setOption(this.computedOptions)
      }
    },
    handlerTabFirst: {
      deep: true,
      handler () {
        this.getData()
        this.chart.setOption(this.computedOptions)
      }
    }
  },
  methods: {
    getData () {
      api.getAllViewData({}).then(res => {
        if (res.code === 200) {
          /* tablist----数据处理 */
          if (this.tabsFirstId === 0) {
            res.data.notNetWorkAddTypeMap.map((item, i) => {
              item.id = i
              item.title = item.name
            })
            this.tabList = res.data.notNetWorkAddTypeMap // 互联网+
          } else {
            res.data.notNetWorkTopTypeMap.map((item, i) => {
              item.id = i
              item.title = item.name
            })
            this.tabList = res.data.notNetWorkTopTypeMap // TOP3
          }
          /* tablist-----数据处理结束 */

          // echarts数据--------处理echarts数据
          if (this.tabsFirstId === 0) { // 互联网+
            if (this.tabsId === 0) {
              let arr = res.data.notNetWorkAddMap.slice(0, 5)
              this.name = arr.map((item) => {
                return item.district
              })
              this.val = arr.map((item) => {
                return item.materialNetworkSales
              })
              this.chart.setOption(this.computedOptions)
            } else if (this.tabsId === 1) {
              let arr1 = res.data.notNetWorkAddMap.slice(5, 10)
              this.name = arr1.map((item) => {
                return item.district
              })
              this.val = arr1.map((item) => {
                return item.materialNetworkSales
              })
              this.chart.setOption(this.computedOptions)
            } else if (this.tabsId === 2) {
              let arr2 = res.data.notNetWorkAddMap.slice(10, 15)
              this.name = arr2.map((item) => {
                return item.district
              })
              this.val = arr2.map((item) => {
                return item.materialNetworkSales
              })
              this.chart.setOption(this.computedOptions)
            }
          } else { // TOP3
            if (this.tabsId === 0) {
              let arr = res.data.notNetWorkBusinessUse1Map.slice(0, 5)
              this.name = arr.map((item) => {
                return item.district
              })
              this.val = arr.map((item) => {
                return item.materialNetworkSales
              })
              this.chart.setOption(this.computedOptions)
            } else if (this.tabsId === 1) {
              let arr1 = res.data.notNetWorkBusinessUse1Map.slice(5, 10)
              this.name = arr1.map((item) => {
                return item.district
              })
              this.val = arr1.map((item) => {
                return item.materialNetworkSales
              })
              this.chart.setOption(this.computedOptions)
            } else if (this.tabsId === 2) {
              let arr2 = res.data.notNetWorkBusinessUse1Map.slice(10, 15)
              this.name = arr2.map((item) => {
                return item.district
              })
              this.val = arr2.map((item) => {
                return item.materialNetworkSales
              })
              this.chart.setOption(this.computedOptions)
            }
          }
        }
      })
    },
    // 二级tab切换
    handlerTab (id) {
      this.title = this.tabList[id].title
      this.tabsId = id
      this.getData()
    },
    // 一级标题切换---更新二级tabList
    handlerTabFirst (id) {
      this.title = this.tabListFirst[id].title
      this.tabsFirstId = id
      this.tabsId = 0
      this.getData()
    }
  },
  computed: {
    computedOptions () {
      let option = this.defaultOptions
      option.xAxis[0].data = this.name || []
      option.series[0].data = this.val
      if (this.tabsId === 0) {
        option.series[0].itemStyle = {
          normal: { // 服装
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
              [
                { offset: 0, color: 'rgba(251,124,124,0.25)' },
                { offset: 1, color: 'rgba(221,93,93,1)' }]) // 数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
          }
        }
      } else if (this.tabsId === 1) {
        option.series[0].itemStyle = {
          normal: { // 家电
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
              [
                { offset: 0, color: 'rgba(43,165,188,0.25)' },
                { offset: 1, color: 'rgba(12,212,248,1)' }]) // 数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
          }
        }
      } else if (this.tabsId === 2) {
        option.series[0].itemStyle = {
          normal: { // 家电
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
              [
                { offset: 0, color: 'rgba(0,163,247,0.26)' },
                { offset: 1, color: 'rgba(5,166,253,1)' }]) // 数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
          }
        }
      }
      return option
    }
  }
}
</script>
<style lang="less" scoped>
.GoodsTypeZB_wrap {
  height: 25%;
  margin-top: .1rem;
  .card_wrap {
    position: relative;
    .tab_wrap {
      position: absolute;
      right: 5%;
      top: 0.2rem;
      height: 0.28rem;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        width: 0.8rem;
        height: 0.38rem;
        line-height: 0.38rem;
        display: inline-block;
        font-size: 0.18rem;
        color: rgba(138, 227, 255, 0.6);
        background: url('../../../CockpitBigScreen/assets/tab.png') no-repeat;
        background-size: 100% 100%;
        color: #75bdf4;
        text-align: center;
      }
      .left {
        background: url('../../../CockpitBigScreen/assets/active_tab.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
      .right {
        border: 1px solid rgba(138, 227, 255, 1);
        color: #8ae3ff;
      }
    }
     .tab_wraps {
      margin: 0.1rem 0;
      margin-left: 12.5%;
      margin-right: 12.5%;
      height: 0.24rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      p {
        width: 25%;
        cursor: pointer;
        height: 0.2rem;
        line-height: 0.2rem;
        font-size: 0.16rem;
        color: #2D92E5;
        text-align: center;
      }
      .left {
        width: 25%;
        text-align: center;
        position: relative;
       color: #00D5FF;
      }
      .left::before{
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #00D5FF;
        content: "";
        position: absolute; 
        width: 0;
        top:.28rem;
        left: 48%;
      }
      .right {
        border: 1px solid rgba(138, 227, 255, 1);
        color: #8ae3ff;
      }
    }
  }
}
</style>
