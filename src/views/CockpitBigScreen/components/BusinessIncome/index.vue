<template>
  <div class="BusinessIncome_wrap">
    <div class="card_wrap">
      <norm v-if="buttonShow" :title="businessIncometTitle" :icon="1" />
      <el-button
        v-if="buttonShow"
        size="small"
        class="warningBtn"
        @click="handelrCheck"
        >查看大图</el-button
      >
    </div>
    <div class="scroll" v-if="buttonShow">
      <div ref="canvasChart" style="height: 2rem; width: 100%"></div>
    </div>
    <div class="scroll" v-else>
      <div ref="canvasChart" style="height: 4rem; width: 100%"></div>
    </div>
  </div>
</template>
<script>
import norm from "../norm";
import initChart from "@/mixins/initChart.js";
import defaultOptions from "./option.js";
import businessList from "./businessList.vue";
export default {
  mixins: [initChart],
  name: "BusinessIncome",
  components: { norm, businessList },
  props: {
    infor: {
      type: Object,
    },
    buttonShow: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    // this.infor.value2.forEach((item) => {
    //   item.markLine = {
    //     lineStyle: {
    //       type: "solid",
    //       color: "#ccc",
    //       width: 1.5,
    //     },
    //     data: [{ type: "average", name: "Avg" }],
    //   };
    // });
  },
  computed: {
    businessIncometTitle() {
      return this.$store.state.businessIncometTitle || "";
    },
    computedOptions() {
      let option = this.defaultOptions;
      // option.grid = {
      //   left: "0",
      //   right: "3%",
      //   bottom: "20%",
      //   top: "10%",
      //   containLabel: true,
      // };
      option.series = this.infor.value2;
      option.xAxis.data = this.infor.name;
      if (option.xAxis.data.length == 1) {
        option.xAxis.data.push("");
      }
      return option;
    },
  },
  data() {
    return {
      defaultOptions,
      businessVisible: true,
    };
  },
  mounted() {
      // console.log('更改代码查看变化');
  },
  watch: {
    infor: {
      deep: true,
      handler() {
        // this.chart.setOption(this.computedOptions)
        this.chart.setOption({
          xAxis: {
            data: this.infor.name,
          },
          series: this.infor.value2,
        });
      },
    },
  },
  methods: {
    handelrCheck() {
      this.$emit("handelrCheck");
      // this.businessVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.BusinessIncome_wrap {
  height: 25%;
  // display: flex;

  .card_wrap {
    margin-bottom: 0.12rem;
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
.business {
  // width: 100vw;
  // height: 100vh;
  // background-color: red;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1002;
}
.businessDialog {
  // position: relative;
  // z-index: 9999999;
}
</style>
